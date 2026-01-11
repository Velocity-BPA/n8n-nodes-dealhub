/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
  verifyWebhookSignature,
  toISODate,
  toSnakeCase,
  toCamelCase,
  transformKeysToSnakeCase,
  generateUniqueId,
  isValidEmail,
  isValidUrl,
  formatCurrency,
  safeJsonParse,
  chunkArray,
} from '../../nodes/DealHub/utils/helpers';

describe('DealHub Helpers', () => {
  describe('verifyWebhookSignature', () => {
    it('should verify a valid webhook signature', () => {
      const payload = '{"event":"quote.created","data":{}}';
      const secret = 'test-secret-key';
      
      // Generate expected signature using the same method
      const crypto = require('crypto');
      const expectedHash = crypto.createHmac('sha256', secret).update(payload, 'utf8').digest('hex');
      const signature = `sha256=${expectedHash}`;
      
      expect(verifyWebhookSignature(payload, signature, secret)).toBe(true);
    });

    it('should reject an invalid webhook signature', () => {
      const payload = '{"event":"quote.created","data":{}}';
      const secret = 'test-secret-key';
      const invalidSignature = 'sha256=invalid_signature_here';
      
      expect(verifyWebhookSignature(payload, invalidSignature, secret)).toBe(false);
    });

    it('should handle missing sha256= prefix', () => {
      const payload = '{"event":"quote.created"}';
      const secret = 'test-secret';
      
      expect(verifyWebhookSignature(payload, 'invalid', secret)).toBe(false);
    });
  });

  describe('toISODate', () => {
    it('should convert a Date object to ISO string', () => {
      const date = new Date('2024-01-15T12:00:00Z');
      expect(toISODate(date)).toBe('2024-01-15T12:00:00.000Z');
    });

    it('should parse and convert a date string', () => {
      const result = toISODate('2024-01-15');
      expect(result).toContain('2024-01-15');
    });

    it('should return undefined for undefined input', () => {
      expect(toISODate(undefined)).toBeUndefined();
    });
  });

  describe('toSnakeCase', () => {
    it('should convert camelCase to snake_case', () => {
      expect(toSnakeCase('quoteId')).toBe('quote_id');
      expect(toSnakeCase('opportunityId')).toBe('opportunity_id');
      expect(toSnakeCase('dealRoomName')).toBe('deal_room_name');
    });

    it('should handle already snake_case strings', () => {
      expect(toSnakeCase('quote_id')).toBe('quote_id');
    });

    it('should handle single word', () => {
      expect(toSnakeCase('quote')).toBe('quote');
    });
  });

  describe('toCamelCase', () => {
    it('should convert snake_case to camelCase', () => {
      expect(toCamelCase('quote_id')).toBe('quoteId');
      expect(toCamelCase('opportunity_id')).toBe('opportunityId');
      expect(toCamelCase('deal_room_name')).toBe('dealRoomName');
    });

    it('should handle already camelCase strings', () => {
      expect(toCamelCase('quoteId')).toBe('quoteId');
    });
  });

  describe('transformKeysToSnakeCase', () => {
    it('should transform all keys to snake_case', () => {
      const input = {
        quoteId: '123',
        opportunityId: '456',
        dealRoomName: 'Test Room',
      };
      
      const expected = {
        quote_id: '123',
        opportunity_id: '456',
        deal_room_name: 'Test Room',
      };
      
      expect(transformKeysToSnakeCase(input)).toEqual(expected);
    });

    it('should handle empty objects', () => {
      expect(transformKeysToSnakeCase({})).toEqual({});
    });
  });

  describe('generateUniqueId', () => {
    it('should generate a unique ID with prefix', () => {
      const id = generateUniqueId('qt');
      expect(id).toMatch(/^qt_[a-z0-9]+$/);
    });

    it('should generate unique IDs each time', () => {
      const id1 = generateUniqueId('test');
      const id2 = generateUniqueId('test');
      expect(id1).not.toBe(id2);
    });
  });

  describe('isValidEmail', () => {
    it('should validate correct email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('invalid@')).toBe(false);
      expect(isValidEmail('@domain.com')).toBe(false);
    });
  });

  describe('isValidUrl', () => {
    it('should validate correct URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://example.com/path')).toBe(true);
      expect(isValidUrl('https://api.dealhub.io/v1/quotes')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(isValidUrl('not-a-url')).toBe(false);
      expect(isValidUrl('')).toBe(false);
    });
  });

  describe('formatCurrency', () => {
    it('should format currency with USD', () => {
      expect(formatCurrency(1234.56, 'USD')).toBe('$1,234.56');
    });

    it('should format currency with EUR', () => {
      const result = formatCurrency(1234.56, 'EUR');
      expect(result).toContain('1,234.56');
    });

    it('should handle zero', () => {
      expect(formatCurrency(0, 'USD')).toBe('$0.00');
    });
  });

  describe('safeJsonParse', () => {
    it('should parse valid JSON', () => {
      expect(safeJsonParse('{"key":"value"}')).toEqual({ key: 'value' });
    });

    it('should return default value for invalid JSON', () => {
      expect(safeJsonParse('invalid', {})).toEqual({});
    });

    it('should return null for invalid JSON without default', () => {
      expect(safeJsonParse('invalid')).toBeNull();
    });
  });

  describe('chunkArray', () => {
    it('should split array into chunks', () => {
      const arr = [1, 2, 3, 4, 5];
      expect(chunkArray(arr, 2)).toEqual([[1, 2], [3, 4], [5]]);
    });

    it('should handle array smaller than chunk size', () => {
      const arr = [1, 2];
      expect(chunkArray(arr, 5)).toEqual([[1, 2]]);
    });

    it('should handle empty array', () => {
      expect(chunkArray([], 3)).toEqual([]);
    });
  });
});
