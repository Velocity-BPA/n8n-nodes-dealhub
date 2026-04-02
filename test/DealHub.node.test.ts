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
describe('Deal Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({ 
				apiKey: 'test-key', 
				baseUrl: 'https://api.dealhub.io/v1' 
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: { 
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn() 
			},
		};
	});

	it('should get all deals successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getAll')
			.mockReturnValueOnce('active')
			.mockReturnValueOnce('owner123')
			.mockReturnValueOnce('')
			.mockReturnValueOnce(50)
			.mockReturnValueOnce(0);

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ deals: [] });

		const result = await executeDealOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(1);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://api.dealhub.io/v1/deals?status=active&owner_id=owner123&limit=50&offset=0',
			headers: {
				'Authorization': 'Bearer test-key',
				'Content-Type': 'application/json',
			},
			json: true,
		});
	});

	it('should get a specific deal successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('get')
			.mockReturnValueOnce('deal123');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ id: 'deal123', name: 'Test Deal' });

		const result = await executeDealOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(1);
		expect(result[0].json).toEqual({ id: 'deal123', name: 'Test Deal' });
	});

	it('should create a deal successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('create')
			.mockReturnValueOnce('New Deal')
			.mockReturnValueOnce('Deal description')
			.mockReturnValueOnce('owner123')
			.mockReturnValueOnce('account456')
			.mockReturnValueOnce(10000)
			.mockReturnValueOnce('prospecting');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ id: 'deal123', name: 'New Deal' });

		const result = await executeDealOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(1);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'POST',
			url: 'https://api.dealhub.io/v1/deals',
			headers: {
				'Authorization': 'Bearer test-key',
				'Content-Type': 'application/json',
			},
			body: {
				name: 'New Deal',
				description: 'Deal description',
				owner_id: 'owner123',
				account_id: 'account456',
				amount: 10000,
				stage: 'prospecting',
			},
			json: true,
		});
	});

	it('should handle errors gracefully', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('get').mockReturnValueOnce('deal123');
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
		mockExecuteFunctions.continueOnFail.mockReturnValue(true);

		const result = await executeDealOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(1);
		expect(result[0].json.error).toBe('API Error');
	});

	it('should send a deal successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('send')
			.mockReturnValueOnce('deal123')
			.mockReturnValueOnce('user1@example.com, user2@example.com')
			.mockReturnValueOnce('Please review this deal');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ sent: true });

		const result = await executeDealOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(1);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'POST',
			url: 'https://api.dealhub.io/v1/deals/deal123/send',
			headers: {
				'Authorization': 'Bearer test-key',
				'Content-Type': 'application/json',
			},
			body: {
				recipients: ['user1@example.com', 'user2@example.com'],
				message: 'Please review this deal',
			},
			json: true,
		});
	});

	it('should delete a deal successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('delete')
			.mockReturnValueOnce('deal123');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ deleted: true });

		const result = await executeDealOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(1);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'DELETE',
			url: 'https://api.dealhub.io/v1/deals/deal123',
			headers: {
				'Authorization': 'Bearer test-key',
				'Content-Type': 'application/json',
			},
			json: true,
		});
	});

	it('should get deal status successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getStatus')
			.mockReturnValueOnce('deal123');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ 
			status: 'sent', 
			views: 5, 
			engagement: 'high' 
		});

		const result = await executeDealOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(1);
		expect(result[0].json).toEqual({ 
			status: 'sent', 
			views: 5, 
			engagement: 'high' 
		});
	});
});

describe('DealRoom Resource', () => {
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
			},
		};
	});

	describe('getAll operation', () => {
		it('should retrieve all deal rooms successfully', async () => {
			const mockResponse = { dealrooms: [{ id: '1', name: 'Test Room' }] };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getAll')
				.mockReturnValueOnce('deal123')
				.mockReturnValueOnce('active')
				.mockReturnValueOnce(50)
				.mockReturnValueOnce(0);
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeDealRoomOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});

		it('should handle errors in getAll operation', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValue('getAll');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeDealRoomOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
		});
	});

	describe('get operation', () => {
		it('should retrieve a specific deal room successfully', async () => {
			const mockResponse = { id: '1', name: 'Test Room' };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('get')
				.mockReturnValueOnce('dealroom123');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeDealRoomOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('create operation', () => {
		it('should create a new deal room successfully', async () => {
			const mockResponse = { id: '1', name: 'New Room' };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('create')
				.mockReturnValueOnce('deal123')
				.mockReturnValueOnce('New Room')
				.mockReturnValueOnce('Room description')
				.mockReturnValueOnce('user1@test.com,user2@test.com');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeDealRoomOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('update operation', () => {
		it('should update a deal room successfully', async () => {
			const mockResponse = { id: '1', name: 'Updated Room' };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('update')
				.mockReturnValueOnce('dealroom123')
				.mockReturnValueOnce('Updated Room')
				.mockReturnValueOnce('Updated description');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeDealRoomOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('delete operation', () => {
		it('should delete a deal room successfully', async () => {
			const mockResponse = { success: true };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('delete')
				.mockReturnValueOnce('dealroom123');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeDealRoomOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('getActivity operation', () => {
		it('should retrieve deal room activity successfully', async () => {
			const mockResponse = { activities: [{ type: 'view', timestamp: '2023-01-01' }] };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getActivity')
				.mockReturnValueOnce('dealroom123')
				.mockReturnValueOnce('2023-01-01')
				.mockReturnValueOnce('2023-01-31');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeDealRoomOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('invite operation', () => {
		it('should invite participants successfully', async () => {
			const mockResponse = { success: true, invited: 2 };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('invite')
				.mockReturnValueOnce('dealroom123')
				.mockReturnValueOnce('user1@test.com,user2@test.com');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeDealRoomOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});
});

describe('Product Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://api.dealhub.io/v1' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  it('should get all products successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getAll')
      .mockReturnValueOnce('')
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(50)
      .mockReturnValueOnce(0);

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ products: [] });

    const result = await executeProductOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.dealhub.io/v1/products?active=true&limit=50&offset=0',
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  it('should get a specific product successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('get')
      .mockReturnValueOnce('prod123');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ id: 'prod123', name: 'Test Product' });

    const result = await executeProductOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.dealhub.io/v1/products/prod123',
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  it('should create a product successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('create')
      .mockReturnValueOnce('New Product')
      .mockReturnValueOnce('Product description')
      .mockReturnValueOnce(99.99)
      .mockReturnValueOnce('Electronics')
      .mockReturnValueOnce('SKU123');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ id: 'prod124', name: 'New Product' });

    const result = await executeProductOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.dealhub.io/v1/products',
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json',
      },
      body: {
        name: 'New Product',
        description: 'Product description',
        price: 99.99,
        category: 'Electronics',
        sku: 'SKU123',
      },
      json: true,
    });
  });

  it('should handle errors gracefully when continueOnFail is true', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('get');
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    const result = await executeProductOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('API Error');
  });

  it('should throw error when continueOnFail is false', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('get');
    mockExecuteFunctions.continueOnFail.mockReturnValue(false);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    await expect(executeProductOperations.call(mockExecuteFunctions, [{ json: {} }]))
      .rejects.toThrow('API Error');
  });
});

describe('Account Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({ 
				apiKey: 'test-key', 
				baseUrl: 'https://api.dealhub.io/v1' 
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: { 
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn() 
			},
		};
	});

	it('should get all accounts successfully', async () => {
		mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
			if (param === 'operation') return 'getAll';
			if (param === 'limit') return 50;
			if (param === 'offset') return 0;
			return '';
		});

		const mockResponse = { accounts: [{ id: '123', name: 'Test Account' }] };
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(1);
		expect(result[0].json).toEqual(mockResponse);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://api.dealhub.io/v1/accounts?limit=50&offset=0',
			headers: {
				'Authorization': 'Bearer test-key',
				'Content-Type': 'application/json',
			},
			json: true,
		});
	});

	it('should handle getAll error', async () => {
		mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
			if (param === 'operation') return 'getAll';
			return '';
		});

		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

		await expect(executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('API Error');
	});

	it('should get a specific account successfully', async () => {
		mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
			if (param === 'operation') return 'get';
			if (param === 'accountId') return '123';
			return '';
		});

		const mockResponse = { id: '123', name: 'Test Account' };
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(1);
		expect(result[0].json).toEqual(mockResponse);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://api.dealhub.io/v1/accounts/123',
			headers: {
				'Authorization': 'Bearer test-key',
				'Content-Type': 'application/json',
			},
			json: true,
		});
	});

	it('should create an account successfully', async () => {
		mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
			if (param === 'operation') return 'create';
			if (param === 'name') return 'New Account';
			if (param === 'domain') return 'example.com';
			if (param === 'industry') return 'Technology';
			return '';
		});

		const mockResponse = { id: '456', name: 'New Account' };
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(1);
		expect(result[0].json).toEqual(mockResponse);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'POST',
			url: 'https://api.dealhub.io/v1/accounts',
			headers: {
				'Authorization': 'Bearer test-key',
				'Content-Type': 'application/json',
			},
			body: {
				name: 'New Account',
				domain: 'example.com',
				industry: 'Technology',
			},
			json: true,
		});
	});

	it('should delete an account successfully', async () => {
		mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
			if (param === 'operation') return 'delete';
			if (param === 'accountId') return '123';
			return '';
		});

		const mockResponse = { success: true };
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(1);
		expect(result[0].json).toEqual(mockResponse);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'DELETE',
			url: 'https://api.dealhub.io/v1/accounts/123',
			headers: {
				'Authorization': 'Bearer test-key',
				'Content-Type': 'application/json',
			},
			json: true,
		});
	});

	it('should handle continue on fail', async () => {
		mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
			if (param === 'operation') return 'get';
			if (param === 'accountId') return '123';
			return '';
		});

		mockExecuteFunctions.continueOnFail.mockReturnValue(true);
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

		const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(1);
		expect(result[0].json).toEqual({ error: 'API Error' });
	});
});

describe('Contact Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
				baseUrl: 'https://api.dealhub.io/v1',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	describe('getAll operation', () => {
		it('should retrieve all contacts', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getAll')
				.mockReturnValueOnce('')
				.mockReturnValueOnce('')
				.mockReturnValueOnce(50)
				.mockReturnValueOnce(0);

			const mockResponse = { contacts: [{ id: '1', name: 'Test Contact' }] };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeContactOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.dealhub.io/v1/contacts?limit=50&offset=0',
				headers: {
					Authorization: 'Bearer test-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});
			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});

		it('should handle errors', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValue('getAll');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeContactOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
		});
	});

	describe('get operation', () => {
		it('should retrieve a specific contact', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('get')
				.mockReturnValueOnce('contact123');

			const mockResponse = { id: 'contact123', name: 'Test Contact' };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeContactOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.dealhub.io/v1/contacts/contact123',
				headers: {
					Authorization: 'Bearer test-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});
			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('create operation', () => {
		it('should create a new contact', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('create')
				.mockReturnValueOnce('John')
				.mockReturnValueOnce('Doe')
				.mockReturnValueOnce('john@example.com')
				.mockReturnValueOnce('account123')
				.mockReturnValueOnce('+1234567890')
				.mockReturnValueOnce('Developer');

			const mockResponse = { id: 'contact123', first_name: 'John', last_name: 'Doe' };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeContactOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://api.dealhub.io/v1/contacts',
				headers: {
					Authorization: 'Bearer test-key',
					'Content-Type': 'application/json',
				},
				body: {
					first_name: 'John',
					last_name: 'Doe',
					email: 'john@example.com',
					account_id: 'account123',
					phone: '+1234567890',
					title: 'Developer',
				},
				json: true,
			});
			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('update operation', () => {
		it('should update contact information', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('update')
				.mockReturnValueOnce('contact123')
				.mockReturnValueOnce('Jane')
				.mockReturnValueOnce('Smith')
				.mockReturnValueOnce('jane@example.com')
				.mockReturnValueOnce('+1987654321')
				.mockReturnValueOnce('Manager');

			const mockResponse = { id: 'contact123', first_name: 'Jane', last_name: 'Smith' };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeContactOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'PUT',
				url: 'https://api.dealhub.io/v1/contacts/contact123',
				headers: {
					Authorization: 'Bearer test-key',
					'Content-Type': 'application/json',
				},
				body: {
					first_name: 'Jane',
					last_name: 'Smith',
					email: 'jane@example.com',
					phone: '+1987654321',
					title: 'Manager',
				},
				json: true,
			});
			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('delete operation', () => {
		it('should delete a contact', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('delete')
				.mockReturnValueOnce('contact123');

			const mockResponse = { success: true };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeContactOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'DELETE',
				url: 'https://api.dealhub.io/v1/contacts/contact123',
				headers: {
					Authorization: 'Bearer test-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});
			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('getActivity operation', () => {
		it('should get contact engagement activity', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getActivity')
				.mockReturnValueOnce('contact123')
				.mockReturnValueOnce('2023-01-01')
				.mockReturnValueOnce('2023-12-31');

			const mockResponse = { activities: [{ id: '1', type: 'email_open' }] };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeContactOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.dealhub.io/v1/contacts/contact123/activity?date_from=2023-01-01&date_to=2023-12-31',
				headers: {
					Authorization: 'Bearer test-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});
			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});
});

describe('Template Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://api.dealhub.io/v1' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  describe('getAll operation', () => {
    it('should get all templates successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAll')
        .mockReturnValueOnce('quote')
        .mockReturnValueOnce('standard')
        .mockReturnValueOnce(50)
        .mockReturnValueOnce(0);

      const mockResponse = { templates: [], total: 0 };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTemplateOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.dealhub.io/v1/templates',
        headers: {
          'Authorization': 'Bearer test-key',
          'Content-Type': 'application/json',
        },
        qs: { type: 'quote', category: 'standard', limit: 50, offset: 0 },
        json: true,
      });
    });

    it('should handle getAll error', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getAll');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      await expect(executeTemplateOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      )).rejects.toThrow('API Error');
    });
  });

  describe('get operation', () => {
    it('should get template successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('get')
        .mockReturnValueOnce('template-123');

      const mockResponse = { id: 'template-123', name: 'Test Template' };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTemplateOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('create operation', () => {
    it('should create template successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('create')
        .mockReturnValueOnce('New Template')
        .mockReturnValueOnce('quote')
        .mockReturnValueOnce('<html>Content</html>')
        .mockReturnValueOnce('standard');

      const mockResponse = { id: 'template-456', name: 'New Template' };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTemplateOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('update operation', () => {
    it('should update template successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('update')
        .mockReturnValueOnce('template-123')
        .mockReturnValueOnce('Updated Template')
        .mockReturnValueOnce('<html>Updated Content</html>')
        .mockReturnValueOnce('premium');

      const mockResponse = { id: 'template-123', name: 'Updated Template' };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTemplateOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('delete operation', () => {
    it('should delete template successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('delete')
        .mockReturnValueOnce('template-123');

      const mockResponse = { success: true };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTemplateOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('clone operation', () => {
    it('should clone template successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('clone')
        .mockReturnValueOnce('template-123')
        .mockReturnValueOnce('Cloned Template');

      const mockResponse = { id: 'template-789', name: 'Cloned Template' };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTemplateOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });
});
});
