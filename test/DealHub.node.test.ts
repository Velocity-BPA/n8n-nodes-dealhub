/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { DealHub } from '../nodes/DealHub/DealHub.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('DealHub Node', () => {
  let node: DealHub;

  beforeAll(() => {
    node = new DealHub();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('DealHub');
      expect(node.description.name).toBe('dealhub');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 6 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(6);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(6);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('Quotes Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://api.dealhub.io/v1',
        tenantId: 'test-tenant',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  it('should create a quote successfully', async () => {
    const mockQuoteData = { id: '123', name: 'Test Quote', status: 'draft' };
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'create';
        case 'name': return 'Test Quote';
        case 'templateId': return 'template-123';
        case 'contactId': return 'contact-123';
        case 'products': return '[{"id": "prod-1", "quantity": 2}]';
        default: return undefined;
      }
    });
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockQuoteData);

    const result = await executeQuotesOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockQuoteData, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.dealhub.io/v1/quotes',
      headers: {
        'Authorization': 'Bearer test-api-key',
        'Content-Type': 'application/json',
        'X-Tenant-ID': 'test-tenant',
      },
      body: {
        name: 'Test Quote',
        templateId: 'template-123',
        contactId: 'contact-123',
        products: [{ id: 'prod-1', quantity: 2 }],
      },
      json: true,
    });
  });

  it('should get a quote successfully', async () => {
    const mockQuoteData = { id: '123', name: 'Test Quote', status: 'draft' };
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'get';
        case 'id': return '123';
        default: return undefined;
      }
    });
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockQuoteData);

    const result = await executeQuotesOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockQuoteData, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.dealhub.io/v1/quotes/123',
      headers: {
        'Authorization': 'Bearer test-api-key',
        'X-Tenant-ID': 'test-tenant',
      },
      json: true,
    });
  });

  it('should get all quotes with filters', async () => {
    const mockQuotesData = { quotes: [{ id: '123', name: 'Test Quote' }], total: 1 };
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getAll';
        case 'status': return 'draft';
        case 'limit': return 10;
        case 'offset': return 0;
        default: return undefined;
      }
    });
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockQuotesData);

    const result = await executeQuotesOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockQuotesData, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.dealhub.io/v1/quotes?status=draft&limit=10&offset=0',
      headers: {
        'Authorization': 'Bearer test-api-key',
        'X-Tenant-ID': 'test-tenant',
      },
      json: true,
    });
  });

  it('should send a quote successfully', async () => {
    const mockResponse = { success: true, message: 'Quote sent successfully' };
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'send';
        case 'id': return '123';
        case 'email': return 'customer@example.com';
        case 'message': return 'Please review this quote';
        default: return undefined;
      }
    });
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeQuotesOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.dealhub.io/v1/quotes/123/send',
      headers: {
        'Authorization': 'Bearer test-api-key',
        'Content-Type': 'application/json',
        'X-Tenant-ID': 'test-tenant',
      },
      body: {
        email: 'customer@example.com',
        message: 'Please review this quote',
      },
      json: true,
    });
  });

  it('should handle errors gracefully when continueOnFail is true', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'get';
        case 'id': return 'invalid-id';
        default: return undefined;
      }
    });
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Quote not found'));

    const result = await executeQuotesOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: { error: 'Quote not found' }, pairedItem: { item: 0 } }]);
  });

  it('should throw error when operation is unknown', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'unknownOperation';
        default: return undefined;
      }
    });

    await expect(executeQuotesOperations.call(mockExecuteFunctions, [{ json: {} }]))
      .rejects
      .toThrow('Unknown operation: unknownOperation');
  });
});

describe('DealRooms Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://api.dealhub.io/v1',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('create operation', () => {
    it('should create a new DealRoom successfully', async () => {
      const mockResponse = {
        id: 'dealroom-123',
        name: 'Test DealRoom',
        quoteId: 'quote-456',
        status: 'active',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'create';
          case 'name': return 'Test DealRoom';
          case 'quoteId': return 'quote-456';
          case 'template': return '';
          case 'members': return '';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeDealRoomsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.dealhub.io/v1/dealrooms',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
        body: {
          name: 'Test DealRoom',
          quoteId: 'quote-456',
        },
      });
    });
  });

  describe('get operation', () => {
    it('should retrieve DealRoom details successfully', async () => {
      const mockResponse = {
        id: 'dealroom-123',
        name: 'Test DealRoom',
        status: 'active',
        members: [],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'get';
          case 'dealRoomId': return 'dealroom-123';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeDealRoomsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.dealhub.io/v1/dealrooms/dealroom-123',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });
  });

  describe('getAll operation', () => {
    it('should list all DealRooms with filters', async () => {
      const mockResponse = {
        data: [
          { id: 'dealroom-123', name: 'DealRoom 1' },
          { id: 'dealroom-456', name: 'DealRoom 2' },
        ],
        total: 2,
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getAll';
          case 'status': return 'active';
          case 'ownerId': return 'user-123';
          case 'limit': return 10;
          case 'offset': return 0;
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeDealRoomsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.dealhub.io/v1/dealrooms?status=active&ownerId=user-123&limit=10&offset=0',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });
  });

  describe('addMember operation', () => {
    it('should add member to DealRoom successfully', async () => {
      const mockResponse = {
        id: 'member-789',
        email: 'test@example.com',
        role: 'viewer',
        dealRoomId: 'dealroom-123',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'addMember';
          case 'dealRoomId': return 'dealroom-123';
          case 'email': return 'test@example.com';
          case 'role': return 'viewer';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeDealRoomsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.dealhub.io/v1/dealrooms/dealroom-123/members',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
        body: {
          email: 'test@example.com',
          role: 'viewer',
        },
      });
    });
  });

  describe('error handling', () => {
    it('should handle API errors properly', async () => {
      const mockError = new Error('API Error');
      mockError.httpCode = 404;

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'get';
          case 'dealRoomId': return 'invalid-id';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(mockError);

      await expect(
        executeDealRoomsOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow('API Error');
    });

    it('should continue on fail when enabled', async () => {
      const mockError = new Error('API Error');
      
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'get';
          case 'dealRoomId': return 'invalid-id';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(mockError);

      const result = await executeDealRoomsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ 
        json: { error: 'API Error' }, 
        pairedItem: { item: 0 } 
      }]);
    });
  });
});

describe('Products Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://api.dealhub.io/v1',
        tenantId: 'test-tenant',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('create operation', () => {
    it('should create a product successfully', async () => {
      const mockResponse = { id: '123', name: 'Test Product', price: 99.99 };
      
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'create';
          case 'name': return 'Test Product';
          case 'description': return 'Test Description';
          case 'price': return 99.99;
          case 'category': return 'Electronics';
          default: return null;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeProductsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.dealhub.io/v1/products',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
          'X-Tenant-ID': 'test-tenant',
        },
        body: {
          name: 'Test Product',
          description: 'Test Description',
          price: 99.99,
          category: 'Electronics',
        },
        json: true,
      });
    });
  });

  describe('get operation', () => {
    it('should retrieve a product successfully', async () => {
      const mockResponse = { id: '123', name: 'Test Product', price: 99.99 };
      
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'get';
          case 'id': return '123';
          default: return null;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeProductsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.dealhub.io/v1/products/123',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
          'X-Tenant-ID': 'test-tenant',
        },
        json: true,
      });
    });
  });

  describe('getAll operation', () => {
    it('should retrieve all products with filters', async () => {
      const mockResponse = { products: [{ id: '123', name: 'Test Product' }], total: 1 };
      
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getAll';
          case 'category': return 'Electronics';
          case 'status': return 'active';
          case 'priceMin': return 10;
          case 'priceMax': return 100;
          case 'limit': return 50;
          case 'offset': return 0;
          default: return null;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeProductsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.dealhub.io/v1/products?category=Electronics&status=active&priceMin=10&priceMax=100&limit=50',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
          'X-Tenant-ID': 'test-tenant',
        },
        json: true,
      });
    });
  });

  describe('update operation', () => {
    it('should update a product successfully', async () => {
      const mockResponse = { id: '123', name: 'Updated Product', price: 149.99 };
      
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'update';
          case 'id': return '123';
          case 'name': return 'Updated Product';
          case 'description': return 'Updated Description';
          case 'price': return 149.99;
          case 'status': return 'active';
          default: return null;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeProductsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'PUT',
        url: 'https://api.dealhub.io/v1/products/123',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
          'X-Tenant-ID': 'test-tenant',
        },
        body: {
          name: 'Updated Product',
          description: 'Updated Description',
          price: 149.99,
          status: 'active',
        },
        json: true,
      });
    });
  });

  describe('delete operation', () => {
    it('should delete a product successfully', async () => {
      const mockResponse = { success: true };
      
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'delete';
          case 'id': return '123';
          default: return null;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeProductsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'DELETE',
        url: 'https://api.dealhub.io/v1/products/123',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
          'X-Tenant-ID': 'test-tenant',
        },
        json: true,
      });
    });
  });

  describe('createConfiguration operation', () => {
    it('should create a product configuration successfully', async () => {
      const mockResponse = { id: 'config123', name: 'Test Config' };
      
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'createConfiguration';
          case 'id': return '123';
          case 'configurationName': return 'Test Config';
          case 'options': return '{"size": ["S", "M", "L"]}';
          case 'pricing': return '{"size": {"S": 0, "M": 5, "L": 10}}';
          default: return null;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeProductsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.dealhub.io/v1/products/123/configurations',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
          'X-Tenant-ID': 'test-tenant',
        },
        body: {
          name: 'Test Config',
          options: { size: ['S', 'M', 'L'] },
          pricing: { size: { S: 0, M: 5, L: 10 } },
        },
        json: true,
      });
    });
  });

  describe('error handling', () => {
    it('should handle API errors correctly', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'get';
          case 'id': return '123';
          default: return null;
        }
      });

      const error = new Error('Product not found');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);

      await expect(
        executeProductsOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow('Product not found');
    });

    it('should continue on fail when configured', async () => {
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'get';
          case 'id': return '123';
          default: return null;
        }
      });

      const error = new Error('Product not found');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);

      const result = await executeProductsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ 
        json: { error: 'Product not found' }, 
        pairedItem: { item: 0 } 
      }]);
    });
  });
});

describe('Contacts Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://api.dealhub.io/v1',
        tenantId: 'test-tenant',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('create operation', () => {
    it('should create a new contact successfully', async () => {
      const mockResponse = { id: '123', firstName: 'John', lastName: 'Doe' };
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        const params: any = {
          operation: 'create',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          company: 'Test Corp',
          phone: '555-0123',
        };
        return params[paramName];
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeContactsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.dealhub.io/v1/contacts',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
          'X-Tenant-ID': 'test-tenant',
        },
        body: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          company: 'Test Corp',
          phone: '555-0123',
        },
        json: true,
      });
    });

    it('should handle API errors', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        const params: any = {
          operation: 'create',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          company: 'Test Corp',
          phone: '555-0123',
        };
        return params[paramName];
      });
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      await expect(executeContactsOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('API Error');
    });
  });

  describe('get operation', () => {
    it('should retrieve contact details successfully', async () => {
      const mockResponse = { id: '123', firstName: 'John', lastName: 'Doe' };
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        const params: any = {
          operation: 'get',
          contactId: '123',
        };
        return params[paramName];
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeContactsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.dealhub.io/v1/contacts/123',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'X-Tenant-ID': 'test-tenant',
        },
        json: true,
      });
    });
  });

  describe('getAll operation', () => {
    it('should list all contacts with filters', async () => {
      const mockResponse = { contacts: [{ id: '123' }, { id: '456' }] };
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        const params: any = {
          operation: 'getAll',
          company: 'Test Corp',
          status: 'active',
          tag: 'vip',
          limit: 10,
          offset: 0,
        };
        return params[paramName];
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeContactsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.dealhub.io/v1/contacts?company=Test%20Corp&status=active&tag=vip&limit=10&offset=0',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'X-Tenant-ID': 'test-tenant',
        },
        json: true,
      });
    });
  });

  describe('addNote operation', () => {
    it('should add note to contact successfully', async () => {
      const mockResponse = { id: 'note-123', note: 'Test note', type: 'general' };
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        const params: any = {
          operation: 'addNote',
          contactId: '123',
          note: 'Test note',
          type: 'general',
        };
        return params[paramName];
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeContactsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.dealhub.io/v1/contacts/123/notes',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
          'X-Tenant-ID': 'test-tenant',
        },
        body: {
          note: 'Test note',
          type: 'general',
        },
        json: true,
      });
    });
  });

  describe('syncCRM operation', () => {
    it('should sync contacts with CRM successfully', async () => {
      const mockResponse = { syncId: 'sync-123', status: 'completed' };
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        const params: any = {
          operation: 'syncCRM',
          crmType: 'salesforce',
          mapping: '{"firstName": "First_Name__c", "lastName": "Last_Name__c"}',
        };
        return params[paramName];
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeContactsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.dealhub.io/v1/contacts/sync',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
          'X-Tenant-ID': 'test-tenant',
        },
        body: {
          crmType: 'salesforce',
          mapping: { firstName: 'First_Name__c', lastName: 'Last_Name__c' },
        },
        json: true,
      });
    });

    it('should handle invalid JSON mapping', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        const params: any = {
          operation: 'syncCRM',
          crmType: 'salesforce',
          mapping: 'invalid json',
        };
        return params[paramName];
      });

      await expect(executeContactsOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow();
    });
  });

  describe('error handling', () => {
    it('should continue on fail when enabled', async () => {
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        const params: any = {
          operation: 'get',
          contactId: '123',
        };
        return params[paramName];
      });
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      const result = await executeContactsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('API Error');
    });
  });
});

describe('Integrations Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://api.dealhub.io/v1',
        tenantId: 'test-tenant',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('getAll operation', () => {
    it('should list all integrations successfully', async () => {
      const mockResponse = {
        data: [
          {
            id: 'int-1',
            type: 'salesforce',
            status: 'active',
            name: 'Salesforce Integration',
          },
        ],
        total: 1,
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getAll';
          case 'type': return 'salesforce';
          case 'status': return 'active';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeIntegrationsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.dealhub.io/v1/integrations?type=salesforce&status=active',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
          'X-Tenant-ID': 'test-tenant',
        },
        json: true,
      });
    });
  });

  describe('connect operation', () => {
    it('should connect integration successfully', async () => {
      const mockResponse = {
        id: 'int-1',
        type: 'salesforce',
        status: 'connected',
        message: 'Integration connected successfully',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'connect';
          case 'integrationType': return 'salesforce';
          case 'credentials': return {
            salesforce: {
              username: 'test@example.com',
              password: 'password',
              securityToken: 'token',
            },
          };
          case 'connectionSettings': return {
            syncFrequency: 'hourly',
            autoSync: true,
          };
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeIntegrationsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('updateConfig operation', () => {
    it('should update integration configuration successfully', async () => {
      const mockResponse = {
        id: 'int-1',
        type: 'salesforce',
        status: 'active',
        message: 'Configuration updated successfully',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'updateConfig';
          case 'integrationType': return 'salesforce';
          case 'configSettings': return {
            syncFrequency: 'daily',
            autoSync: false,
          };
          case 'fieldMapping': return {
            mapping: [
              {
                dealhubField: 'company_name',
                externalField: 'Account.Name',
                direction: 'bidirectional',
              },
            ],
          };
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeIntegrationsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('triggerSync operation', () => {
    it('should trigger sync successfully', async () => {
      const mockResponse = {
        syncId: 'sync-123',
        status: 'running',
        message: 'Synchronization started',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'triggerSync';
          case 'integrationType': return 'salesforce';
          case 'syncDirection': return 'bidirectional';
          case 'entities': return ['contacts', 'deals'];
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeIntegrationsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('error handling', () => {
    it('should handle API errors correctly', async () => {
      const mockError = {
        statusCode: 404,
        message: 'Integration not found',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getStatus';
          case 'integrationType': return 'nonexistent';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(mockError);

      await expect(
        executeIntegrationsOperations.call(mockExecuteFunctions, [{ json: {} }]),
      ).rejects.toThrow();
    });

    it('should continue on fail when configured', async () => {
      const mockError = new Error('Connection failed');

      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getAll';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(mockError);

      const result = await executeIntegrationsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('Connection failed');
    });
  });
});

describe('Analytics Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://api.dealhub.io/v1',
        tenantId: 'test-tenant',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('getQuoteAnalytics', () => {
    it('should get quote analytics successfully', async () => {
      const mockResponse = {
        total_quotes: 150,
        quotes_sent: 120,
        quotes_viewed: 80,
        quotes_accepted: 45,
        conversion_rate: 0.3,
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getQuoteAnalytics';
          case 'dateFrom': return '2024-01-01T00:00:00.000Z';
          case 'dateTo': return '2024-01-31T23:59:59.999Z';
          case 'groupBy': return 'month';
          case 'filters': return '{"status": "active"}';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAnalyticsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.dealhub.io/v1/analytics/quotes?dateFrom=2024-01-01T00%3A00%3A00.000Z&dateTo=2024-01-31T23%3A59%3A59.999Z&groupBy=month&status=active',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
          'X-Tenant-ID': 'test-tenant',
        },
        json: true,
      });

      expect(result).toEqual([
        {
          json: mockResponse,
          pairedItem: { item: 0 },
        },
      ]);
    });

    it('should handle invalid JSON in filters', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getQuoteAnalytics';
          case 'dateFrom': return '2024-01-01T00:00:00.000Z';
          case 'dateTo': return '2024-01-31T23:59:59.999Z';
          case 'groupBy': return 'month';
          case 'filters': return 'invalid json';
          default: return '';
        }
      });

      await expect(
        executeAnalyticsOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow('Invalid JSON in filters parameter');
    });
  });

  describe('getDealRoomAnalytics', () => {
    it('should get DealRoom analytics successfully', async () => {
      const mockResponse = {
        total_views: 250,
        unique_visitors: 45,
        avg_time_spent: 320,
        documents_viewed: 180,
        engagement_score: 85,
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getDealRoomAnalytics';
          case 'dateFrom': return '2024-01-01T00:00:00.000Z';
          case 'dateTo': return '2024-01-31T23:59:59.999Z';
          case 'dealRoomId': return 'dr-123';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAnalyticsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('getProductAnalytics', () => {
    it('should get product analytics successfully', async () => {
      const mockResponse = {
        product_views: 500,
        quotes_generated: 75,
        revenue_attributed: 125000,
        top_configurations: ['config1', 'config2'],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getProductAnalytics';
          case 'dateFrom': return '2024-01-01T00:00:00.000Z';
          case 'dateTo': return '2024-01-31T23:59:59.999Z';
          case 'productId': return 'prod-456';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAnalyticsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('getPipelineAnalytics', () => {
    it('should get pipeline analytics successfully', async () => {
      const mockResponse = {
        total_deals: 200,
        stage_conversion_rates: {
          prospect: 0.8,
          qualified: 0.6,
          proposal: 0.4,
          negotiation: 0.7,
        },
        avg_deal_size: 25000,
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getPipelineAnalytics';
          case 'dateFrom': return '2024-01-01T00:00:00.000Z';
          case 'dateTo': return '2024-01-31T23:59:59.999Z';
          case 'stage': return 'proposal';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAnalyticsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('getConversionAnalytics', () => {
    it('should get conversion analytics successfully', async () => {
      const mockResponse = {
        total_conversions: 85,
        conversion_rate: 0.28,
        funnel_metrics: {
          leads: 300,
          qualified: 180,
          proposals: 120,
          closed: 85,
        },
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getConversionAnalytics';
          case 'dateFrom': return '2024-01-01T00:00:00.000Z';
          case 'dateTo': return '2024-01-31T23:59:59.999Z';
          case 'funnel': return 'sales-funnel-1';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAnalyticsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('getRevenueAnalytics', () => {
    it('should get revenue analytics successfully', async () => {
      const mockResponse = {
        total_revenue: 2500000,
        forecast_revenue: 3200000,
        monthly_breakdown: [
          { month: '2024-01', revenue: 850000 },
          { month: '2024-02', revenue: 920000 },
        ],
        growth_rate: 0.15,
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getRevenueAnalytics';
          case 'dateFrom': return '2024-01-01T00:00:00.000Z';
          case 'dateTo': return '2024-02-29T23:59:59.999Z';
          case 'period': return 'monthly';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAnalyticsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('error handling', () => {
    it('should handle API errors', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getQuoteAnalytics');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue({
        httpCode: 404,
        message: 'Analytics data not found',
      });

      await expect(
        executeAnalyticsOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow();
    });

    it('should continue on fail when configured', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getQuoteAnalytics');
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      const result = await executeAnalyticsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result[0].json.error).toEqual('API Error');
    });

    it('should throw error for unknown operation', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('unknownOperation');

      await expect(
        executeAnalyticsOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow('Unknown operation: unknownOperation');
    });
  });
});
});
