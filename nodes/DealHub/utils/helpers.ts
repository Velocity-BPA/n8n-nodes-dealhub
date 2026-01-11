/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import * as crypto from 'crypto';
import type { IDataObject } from 'n8n-workflow';

/**
 * Verifies the HMAC-SHA256 signature of a webhook payload
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string,
): boolean {
  const expectedSignature = crypto.createHmac('sha256', secret).update(payload, 'utf8').digest('hex');

  const providedSig = signature.startsWith('sha256=') ? signature.slice(7) : signature;

  try {
    return crypto.timingSafeEqual(Buffer.from(providedSig), Buffer.from(expectedSignature));
  } catch {
    return false;
  }
}

/**
 * Converts a date string to ISO 8601 format
 */
export function toISODate(date: string | Date | undefined): string | undefined {
  if (date === undefined || date === null) {
    return undefined;
  }

  if (date instanceof Date) {
    return date.toISOString();
  }

  const parsed = new Date(date);
  if (isNaN(parsed.getTime())) {
    throw new Error(`Invalid date: ${date}`);
  }

  return parsed.toISOString();
}

/**
 * Parses additional fields from n8n node parameters
 */
export function parseAdditionalFields(additionalFields: IDataObject): IDataObject {
  const result: IDataObject = {};

  for (const [key, value] of Object.entries(additionalFields)) {
    if (value !== undefined && value !== null && value !== '') {
      // Handle nested objects (like metadata)
      if (typeof value === 'object' && !Array.isArray(value)) {
        result[key] = value;
      }
      // Handle arrays (like line_items)
      else if (Array.isArray(value)) {
        result[key] = value;
      }
      // Handle primitive values
      else {
        result[key] = value;
      }
    }
  }

  return result;
}

/**
 * Converts camelCase to snake_case
 */
export function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

/**
 * Converts snake_case to camelCase
 */
export function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Transforms object keys from camelCase to snake_case
 */
export function transformKeysToSnakeCase(obj: IDataObject): IDataObject {
  const result: IDataObject = {};

  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = toSnakeCase(key);

    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      result[snakeKey] = transformKeysToSnakeCase(value as IDataObject);
    } else if (Array.isArray(value)) {
      result[snakeKey] = value.map((item) => {
        if (typeof item === 'object' && item !== null) {
          return transformKeysToSnakeCase(item as IDataObject);
        }
        return item;
      });
    } else {
      result[snakeKey] = value;
    }
  }

  return result;
}

/**
 * Generates a unique identifier
 */
export function generateUniqueId(prefix: string = ''): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return prefix ? `${prefix}_${timestamp}${random}` : `${timestamp}${random}`;
}

/**
 * Validates an email address format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates a URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Formats a number as currency
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Safely parses JSON string
 */
export function safeJsonParse(str: string, fallback: any = null): any {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

/**
 * Chunks an array into smaller arrays of specified size
 */
export function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * Retries a function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000,
  maxDelay: number = 60000,
): Promise<T> {
  let lastError: Error | undefined;
  let delay = initialDelay;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay = Math.min(delay * 2, maxDelay);
      }
    }
  }

  throw lastError;
}
