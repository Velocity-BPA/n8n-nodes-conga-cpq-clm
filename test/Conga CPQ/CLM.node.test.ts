/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { CongaCPQCLM } from '../nodes/Conga CPQ/CLM/Conga CPQ/CLM.node';

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

describe('CongaCPQCLM Node', () => {
  let node: CongaCPQCLM;

  beforeAll(() => {
    node = new CongaCPQCLM();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('Conga CPQ/CLM');
      expect(node.description.name).toBe('congacpqclm');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 7 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(7);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(7);
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
describe('Quote Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				accessToken: 'test-token',
				baseUrl: 'https://api.congacloud.com/cpq/v1',
				tenantId: 'test-tenant-id'
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	describe('createQuote operation', () => {
		it('should create a quote successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createQuote')
				.mockReturnValueOnce('Test Quote')
				.mockReturnValueOnce('account123')
				.mockReturnValueOnce('opp123')
				.mockReturnValueOnce('2024-12-31');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				id: 'quote123',
				name: 'Test Quote',
				accountId: 'account123'
			});

			const result = await executeQuoteOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://api.congacloud.com/cpq/v1/quotes',
				headers: {
					'Authorization': 'Bearer test-token',
					'X-Tenant-Id': 'test-tenant-id',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					name: 'Test Quote',
					accountId: 'account123',
					opportunityId: 'opp123',
					validUntil: '2024-12-31'
				}),
				json: false,
			});

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual({
				id: 'quote123',
				name: 'Test Quote',
				accountId: 'account123'
			});
		});

		it('should handle createQuote errors', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createQuote')
				.mockReturnValueOnce('Test Quote')
				.mockReturnValueOnce('account123')
				.mockReturnValueOnce('')
				.mockReturnValueOnce('');

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeQuoteOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual({ error: 'API Error' });
		});
	});

	describe('getQuote operation', () => {
		it('should get a quote successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getQuote')
				.mockReturnValueOnce('quote123');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				id: 'quote123',
				name: 'Test Quote'
			});

			const result = await executeQuoteOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.congacloud.com/cpq/v1/quotes/quote123',
				headers: {
					'Authorization': 'Bearer test-token',
					'X-Tenant-Id': 'test-tenant-id',
				},
				json: true,
			});

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual({
				id: 'quote123',
				name: 'Test Quote'
			});
		});
	});

	describe('getAllQuotes operation', () => {
		it('should get all quotes with filters successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getAllQuotes')
				.mockReturnValueOnce('account123')
				.mockReturnValueOnce('draft')
				.mockReturnValueOnce('2024-01-01')
				.mockReturnValueOnce(50)
				.mockReturnValueOnce(10);

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				quotes: [{ id: 'quote1' }, { id: 'quote2' }]
			});

			const result = await executeQuoteOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.congacloud.com/cpq/v1/quotes?accountId=account123&status=draft&createdAfter=2024-01-01&limit=50&offset=10',
				headers: {
					'Authorization': 'Bearer test-token',
					'X-Tenant-Id': 'test-tenant-id',
				},
				json: true,
			});

			expect(result).toHaveLength(1);
		});
	});

	describe('updateQuote operation', () => {
		it('should update a quote successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('updateQuote')
				.mockReturnValueOnce('quote123')
				.mockReturnValueOnce('Updated Quote')
				.mockReturnValueOnce('2024-12-31')
				.mockReturnValueOnce('approved');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				id: 'quote123',
				name: 'Updated Quote'
			});

			const result = await executeQuoteOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'PUT',
				url: 'https://api.congacloud.com/cpq/v1/quotes/quote123',
				headers: {
					'Authorization': 'Bearer test-token',
					'X-Tenant-Id': 'test-tenant-id',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					name: 'Updated Quote',
					validUntil: '2024-12-31',
					status: 'approved'
				}),
				json: false,
			});

			expect(result).toHaveLength(1);
		});
	});

	describe('calculateQuote operation', () => {
		it('should calculate a quote successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('calculateQuote')
				.mockReturnValueOnce('quote123');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				id: 'quote123',
				totalAmount: 1000.00
			});

			const result = await executeQuoteOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://api.congacloud.com/cpq/v1/quotes/quote123/calculate',
				headers: {
					'Authorization': 'Bearer test-token',
					'X-Tenant-Id': 'test-tenant-id',
				},
				json: true,
			});

			expect(result).toHaveLength(1);
		});
	});

	describe('approveQuote operation', () => {
		it('should approve a quote successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('approveQuote')
				.mockReturnValueOnce('quote123')
				.mockReturnValueOnce('user1, user2, user3');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				id: 'quote123',
				status: 'pending_approval'
			});

			const result = await executeQuoteOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://api.congacloud.com/cpq/v1/quotes/quote123/approve',
				headers: {
					'Authorization': 'Bearer test-token',
					'X-Tenant-Id': 'test-tenant-id',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					approverIds: ['user1', 'user2', 'user3']
				}),
				json: false,
			});

			expect(result).toHaveLength(1);
		});
	});

	describe('deleteQuote operation', () => {
		it('should delete a quote successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('deleteQuote')
				.mockReturnValueOnce('quote123');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ success: true });

			const result = await executeQuoteOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'DELETE',
				url: 'https://api.congacloud.com/cpq/v1/quotes/quote123',
				headers: {
					'Authorization': 'Bearer test-token',
					'X-Tenant-Id': 'test-tenant-id',
				},
				json: true,
			});

			expect(result).toHaveLength(1);
		});
	});
});

describe('QuoteLine Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        accessToken: 'test-token',
        baseUrl: 'https://api.congacloud.com/cpq/v1'
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

  it('should add quote line successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'addQuoteLine';
        case 'quoteId': return 'quote-123';
        case 'productId': return 'product-456';
        case 'quantity': return 2;
        case 'unitPrice': return 100;
        case 'tenantId': return 'tenant-789';
        default: return undefined;
      }
    });

    const mockResponse = { id: 'line-123', productId: 'product-456', quantity: 2, unitPrice: 100 };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeQuoteLineOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
        url: 'https://api.congacloud.com/cpq/v1/quotes/quote-123/lines',
        headers: expect.objectContaining({ 'X-Tenant-Id': 'tenant-789' })
      })
    );
    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  it('should get quote lines successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getQuoteLines';
        case 'quoteId': return 'quote-123';
        case 'tenantId': return 'tenant-789';
        default: return undefined;
      }
    });

    const mockResponse = [{ id: 'line-123' }, { id: 'line-456' }];
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeQuoteLineOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: 'https://api.congacloud.com/cpq/v1/quotes/quote-123/lines'
      })
    );
    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  it('should handle errors correctly', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getQuoteLine';
        case 'quoteId': return 'quote-123';
        case 'lineId': return 'line-456';
        case 'tenantId': return 'tenant-789';
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeQuoteLineOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
  });
});

describe('Product Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        accessToken: 'test-token',
        baseUrl: 'https://api.congacloud.com/cpq/v1',
        tenantId: 'test-tenant-id',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
      },
    };
  });

  describe('createProduct', () => {
    it('should create a product successfully', async () => {
      const mockResponse = { id: 'prod123', name: 'Test Product', code: 'TEST001' };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('createProduct')
        .mockReturnValueOnce('Test Product')
        .mockReturnValueOnce('TEST001')
        .mockReturnValueOnce(100)
        .mockReturnValueOnce('Software')
        .mockReturnValueOnce('License');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeProductOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.congacloud.com/cpq/v1/products',
        headers: {
          Authorization: 'Bearer test-token',
          'Content-Type': 'application/json',
          'X-Tenant-Id': 'test-tenant-id',
        },
        body: {
          name: 'Test Product',
          code: 'TEST001',
          price: 100,
          family: 'Software',
          type: 'License',
        },
        json: true,
      });
      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });

    it('should handle errors when creating a product', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('createProduct');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeProductOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
    });
  });

  describe('getProduct', () => {
    it('should retrieve a product successfully', async () => {
      const mockResponse = { id: 'prod123', name: 'Test Product' };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getProduct')
        .mockReturnValueOnce('prod123');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeProductOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.congacloud.com/cpq/v1/products/prod123',
        headers: {
          Authorization: 'Bearer test-token',
          'X-Tenant-Id': 'test-tenant-id',
        },
        json: true,
      });
      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('getAllProducts', () => {
    it('should retrieve all products with filters successfully', async () => {
      const mockResponse = { products: [{ id: 'prod123' }], total: 1 };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAllProducts')
        .mockReturnValueOnce('Software')
        .mockReturnValueOnce('Active')
        .mockReturnValueOnce('test')
        .mockReturnValueOnce(10)
        .mockReturnValueOnce(0);
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeProductOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.congacloud.com/cpq/v1/products?family=Software&status=Active&search=test&limit=10&offset=0',
        headers: {
          Authorization: 'Bearer test-token',
          'X-Tenant-Id': 'test-tenant-id',
        },
        json: true,
      });
      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('updateProduct', () => {
    it('should update a product successfully', async () => {
      const mockResponse = { id: 'prod123', name: 'Updated Product' };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('updateProduct')
        .mockReturnValueOnce('prod123')
        .mockReturnValueOnce('Updated Product')
        .mockReturnValueOnce(150)
        .mockReturnValueOnce('Active')
        .mockReturnValueOnce('Updated description');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeProductOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'PUT',
        url: 'https://api.congacloud.com/cpq/v1/products/prod123',
        headers: {
          Authorization: 'Bearer test-token',
          'Content-Type': 'application/json',
          'X-Tenant-Id': 'test-tenant-id',
        },
        body: {
          name: 'Updated Product',
          price: 150,
          status: 'Active',
          description: 'Updated description',
        },
        json: true,
      });
      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product successfully', async () => {
      const mockResponse = { success: true };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('deleteProduct')
        .mockReturnValueOnce('prod123');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeProductOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'DELETE',
        url: 'https://api.congacloud.com/cpq/v1/products/prod123',
        headers: {
          Authorization: 'Bearer test-token',
          'X-Tenant-Id': 'test-tenant-id',
        },
        json: true,
      });
      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('getProductConfigurations', () => {
    it('should retrieve product configurations successfully', async () => {
      const mockResponse = { configurations: [{ id: 'config123' }] };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getProductConfigurations')
        .mockReturnValueOnce('prod123');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeProductOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.congacloud.com/cpq/v1/products/prod123/configurations',
        headers: {
          Authorization: 'Bearer test-token',
          'X-Tenant-Id': 'test-tenant-id',
        },
        json: true,
      });
      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('calculateProductPricing', () => {
    it('should calculate product pricing successfully', async () => {
      const mockResponse = { totalPrice: 250, discountApplied: 50 };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('calculateProductPricing')
        .mockReturnValueOnce('prod123')
        .mockReturnValueOnce(5)
        .mockReturnValueOnce('Premium');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeProductOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.congacloud.com/cpq/v1/products/prod123/pricing',
        headers: {
          Authorization: 'Bearer test-token',
          'Content-Type': 'application/json',
          'X-Tenant-Id': 'test-tenant-id',
        },
        body: {
          quantity: 5,
          customerTier: 'Premium',
        },
        json: true,
      });
      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });
});

describe('Contract Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				accessToken: 'test-token',
				baseUrl: 'https://api.congacloud.com/cpq/v1',
				tenantId: 'test-tenant',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	describe('createContract operation', () => {
		it('should create a contract successfully', async () => {
			const mockResponse = { id: '123', name: 'Test Contract' };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createContract')
				.mockReturnValueOnce('Test Contract')
				.mockReturnValueOnce('Service')
				.mockReturnValueOnce('acc123')
				.mockReturnValueOnce('2023-01-01')
				.mockReturnValueOnce('2023-12-31');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeContractOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://api.congacloud.com/cpq/v1/contracts',
				headers: {
					'Authorization': 'Bearer test-token',
					'X-Tenant-Id': 'test-tenant',
					'Content-Type': 'application/json',
				},
				body: {
					name: 'Test Contract',
					type: 'Service',
					accountId: 'acc123',
					startDate: '2023-01-01',
					endDate: '2023-12-31',
				},
				json: true,
			});
		});

		it('should handle create contract error', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createContract')
				.mockReturnValueOnce('Test Contract')
				.mockReturnValueOnce('Service')
				.mockReturnValueOnce('acc123')
				.mockReturnValueOnce('2023-01-01')
				.mockReturnValueOnce('2023-12-31');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

			await expect(executeContractOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('API Error');
		});
	});

	describe('getContract operation', () => {
		it('should get a contract successfully', async () => {
			const mockResponse = { id: '123', name: 'Test Contract' };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getContract')
				.mockReturnValueOnce('123');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeContractOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.congacloud.com/cpq/v1/contracts/123',
				headers: {
					'Authorization': 'Bearer test-token',
					'X-Tenant-Id': 'test-tenant',
				},
				json: true,
			});
		});
	});

	describe('getAllContracts operation', () => {
		it('should get all contracts successfully', async () => {
			const mockResponse = { contracts: [{ id: '123' }], total: 1 };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getAllContracts')
				.mockReturnValueOnce('acc123')
				.mockReturnValueOnce('active')
				.mockReturnValueOnce('Service')
				.mockReturnValueOnce('2023-12-31')
				.mockReturnValueOnce(50)
				.mockReturnValueOnce(0);
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeContractOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('updateContract operation', () => {
		it('should update a contract successfully', async () => {
			const mockResponse = { id: '123', name: 'Updated Contract' };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('updateContract')
				.mockReturnValueOnce('123')
				.mockReturnValueOnce('Updated Contract')
				.mockReturnValueOnce('active')
				.mockReturnValueOnce('2023-12-31')
				.mockReturnValueOnce('New terms');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeContractOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('deleteContract operation', () => {
		it('should delete a contract successfully', async () => {
			const mockResponse = { success: true };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('deleteContract')
				.mockReturnValueOnce('123');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeContractOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('approveContract operation', () => {
		it('should approve a contract successfully', async () => {
			const mockResponse = { id: '123', status: 'pending_approval' };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('approveContract')
				.mockReturnValueOnce('123')
				.mockReturnValueOnce('approver1,approver2')
				.mockReturnValueOnce('Please review');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeContractOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('renewContract operation', () => {
		it('should renew a contract successfully', async () => {
			const mockResponse = { id: '123', newEndDate: '2024-12-31' };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('renewContract')
				.mockReturnValueOnce('123')
				.mockReturnValueOnce('2024-12-31')
				.mockReturnValueOnce('Renewed terms');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeContractOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});
});

describe('Document Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				accessToken: 'test-token',
				baseUrl: 'https://api.congacloud.com/cpq/v1',
				tenantId: 'test-tenant-id',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	it('should create document successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('createDocument')
			.mockReturnValueOnce('template-123')
			.mockReturnValueOnce('datasource-456')
			.mockReturnValueOnce('pdf')
			.mockReturnValueOnce('Test Document');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			id: 'doc-123',
			name: 'Test Document',
			status: 'generated',
		});

		const result = await executeDocumentOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(1);
		expect(result[0].json).toEqual({
			id: 'doc-123',
			name: 'Test Document',
			status: 'generated',
		});
	});

	it('should handle create document error', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('createDocument')
			.mockReturnValueOnce('template-123')
			.mockReturnValueOnce('datasource-456')
			.mockReturnValueOnce('pdf')
			.mockReturnValueOnce('Test Document');

		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Template not found'));
		mockExecuteFunctions.continueOnFail.mockReturnValue(true);

		const result = await executeDocumentOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(1);
		expect(result[0].json).toEqual({ error: 'Template not found' });
	});

	it('should get document successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getDocument')
			.mockReturnValueOnce('doc-123');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			id: 'doc-123',
			name: 'Test Document',
			status: 'generated',
		});

		const result = await executeDocumentOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(1);
		expect(result[0].json).toEqual({
			id: 'doc-123',
			name: 'Test Document',
			status: 'generated',
		});
	});

	it('should get all documents successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getAllDocuments')
			.mockReturnValueOnce('template-123')
			.mockReturnValueOnce('generated')
			.mockReturnValueOnce('2023-01-01')
			.mockReturnValueOnce(50)
			.mockReturnValueOnce(0);

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			documents: [
				{ id: 'doc-123', name: 'Document 1' },
				{ id: 'doc-456', name: 'Document 2' },
			],
		});

		const result = await executeDocumentOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(1);
		expect(result[0].json.documents).toHaveLength(2);
	});

	it('should send document successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('sendDocument')
			.mockReturnValueOnce('doc-123')
			.mockReturnValueOnce('test@example.com, user@test.com')
			.mockReturnValueOnce('Document Subject')
			.mockReturnValueOnce('Please find the document attached.');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			success: true,
			messageId: 'msg-123',
		});

		const result = await executeDocumentOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(1);
		expect(result[0].json).toEqual({
			success: true,
			messageId: 'msg-123',
		});
	});
});

describe('Template Resource', () => {
	let mockExecuteFunctions: any;
	
	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				accessToken: 'test-token',
				baseUrl: 'https://api.congacloud.com/cpq/v1',
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

	describe('createTemplate', () => {
		it('should create a template successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createTemplate')
				.mockReturnValueOnce('Test Template')
				.mockReturnValueOnce('document')
				.mockReturnValueOnce('<h1>Test Content</h1>')
				.mockReturnValueOnce('{"field1": "value1"}');
			
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ id: '123', name: 'Test Template' });

			const result = await executeTemplateOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: { id: '123', name: 'Test Template' }, pairedItem: { item: 0 } }]);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://api.congacloud.com/cpq/v1/templates',
				headers: {
					'Authorization': 'Bearer test-token',
					'X-Tenant-Id': 'test-tenant',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					name: 'Test Template',
					type: 'document',
					content: '<h1>Test Content</h1>',
					dataMapping: { field1: 'value1' },
				}),
			});
		});

		it('should handle errors when creating template', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValue('createTemplate');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeTemplateOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
		});
	});

	describe('getTemplate', () => {
		it('should get template successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getTemplate')
				.mockReturnValueOnce('template-123');
			
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				id: 'template-123',
				name: 'Test Template',
				type: 'document',
			});

			const result = await executeTemplateOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{
				json: { id: 'template-123', name: 'Test Template', type: 'document' },
				pairedItem: { item: 0 },
			}]);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.congacloud.com/cpq/v1/templates/template-123',
				headers: {
					'Authorization': 'Bearer test-token',
					'X-Tenant-Id': 'test-tenant',
					'Content-Type': 'application/json',
				},
			});
		});
	});

	describe('getAllTemplates', () => {
		it('should get all templates successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getAllTemplates')
				.mockReturnValueOnce('document')
				.mockReturnValueOnce('active')
				.mockReturnValueOnce('test')
				.mockReturnValueOnce(50)
				.mockReturnValueOnce(10);
			
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				templates: [{ id: '1', name: 'Template 1' }],
				total: 1,
			});

			const result = await executeTemplateOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result[0].json.templates).toHaveLength(1);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.congacloud.com/cpq/v1/templates?type=document&status=active&searchTerm=test&limit=50&offset=10',
				headers: {
					'Authorization': 'Bearer test-token',
					'X-Tenant-Id': 'test-tenant',
					'Content-Type': 'application/json',
				},
			});
		});
	});

	describe('updateTemplate', () => {
		it('should update template successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('updateTemplate')
				.mockReturnValueOnce('template-123')
				.mockReturnValueOnce('Updated Template')
				.mockReturnValueOnce('<h1>Updated Content</h1>')
				.mockReturnValueOnce('{"updated": "true"}')
				.mockReturnValueOnce('active');
			
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				id: 'template-123',
				name: 'Updated Template',
			});

			const result = await executeTemplateOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{
				json: { id: 'template-123', name: 'Updated Template' },
				pairedItem: { item: 0 },
			}]);
		});
	});

	describe('deleteTemplate', () => {
		it('should delete template successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('deleteTemplate')
				.mockReturnValueOnce('template-123');
			
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ success: true });

			const result = await executeTemplateOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: { success: true }, pairedItem: { item: 0 } }]);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'DELETE',
				url: 'https://api.congacloud.com/cpq/v1/templates/template-123',
				headers: {
					'Authorization': 'Bearer test-token',
					'X-Tenant-Id': 'test-tenant',
					'Content-Type': 'application/json',
				},
			});
		});
	});

	describe('previewTemplate', () => {
		it('should preview template successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('previewTemplate')
				.mockReturnValueOnce('template-123')
				.mockReturnValueOnce('{"name": "John Doe"}');
			
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				previewUrl: 'https://preview.example.com/preview-123',
				content: '<h1>Hello John Doe</h1>',
			});

			const result = await executeTemplateOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result[0].json.previewUrl).toBeDefined();
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://api.congacloud.com/cpq/v1/templates/template-123/preview',
				headers: {
					'Authorization': 'Bearer test-token',
					'X-Tenant-Id': 'test-tenant',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					sampleData: { name: 'John Doe' },
				}),
			});
		});
	});
});

describe('Approval Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        accessToken: 'test-token',
        baseUrl: 'https://api.congacloud.com/cpq/v1',
        tenantId: 'test-tenant'
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

  describe('createApproval', () => {
    it('should create approval successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('createApproval')
        .mockReturnValueOnce('quote')
        .mockReturnValueOnce('quote-123')
        .mockReturnValueOnce('user1,user2')
        .mockReturnValueOnce('2024-12-31T23:59:59Z');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
        id: 'approval-123',
        status: 'pending'
      });

      const result = await executeApprovalOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.congacloud.com/cpq/v1/approvals',
        headers: {
          'Authorization': 'Bearer test-token',
          'Content-Type': 'application/json',
          'X-Tenant-Id': 'test-tenant',
        },
        body: {
          objectType: 'quote',
          objectId: 'quote-123',
          approverIds: ['user1', 'user2'],
          dueDate: '2024-12-31T23:59:59Z'
        },
        json: true,
      });

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual({ id: 'approval-123', status: 'pending' });
    });

    it('should handle createApproval error', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('createApproval');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeApprovalOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result[0].json.error).toBe('API Error');
    });
  });

  describe('getApproval', () => {
    it('should get approval successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getApproval')
        .mockReturnValueOnce('approval-123');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
        id: 'approval-123',
        status: 'pending'
      });

      const result = await executeApprovalOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.congacloud.com/cpq/v1/approvals/approval-123',
        headers: {
          'Authorization': 'Bearer test-token',
          'X-Tenant-Id': 'test-tenant',
        },
        json: true,
      });

      expect(result[0].json).toEqual({ id: 'approval-123', status: 'pending' });
    });
  });

  describe('getAllApprovals', () => {
    it('should get all approvals with filters', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAllApprovals')
        .mockReturnValueOnce('pending')
        .mockReturnValueOnce('user1')
        .mockReturnValueOnce('quote')
        .mockReturnValueOnce(25)
        .mockReturnValueOnce(10);

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
        approvals: [],
        total: 0
      });

      const result = await executeApprovalOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.congacloud.com/cpq/v1/approvals?status=pending&assignedTo=user1&objectType=quote&limit=25&offset=10',
        headers: {
          'Authorization': 'Bearer test-token',
          'X-Tenant-Id': 'test-tenant',
        },
        json: true,
      });
    });
  });

  describe('updateApproval', () => {
    it('should update approval successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('updateApproval')
        .mockReturnValueOnce('approval-123')
        .mockReturnValueOnce('approved')
        .mockReturnValueOnce('Looks good')
        .mockReturnValueOnce('approve');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
        id: 'approval-123',
        status: 'approved'
      });

      const result = await executeApprovalOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'PUT',
        url: 'https://api.congacloud.com/cpq/v1/approvals/approval-123',
        headers: {
          'Authorization': 'Bearer test-token',
          'Content-Type': 'application/json',
          'X-Tenant-Id': 'test-tenant',
        },
        body: {
          status: 'approved',
          decision: 'approve',
          comments: 'Looks good'
        },
        json: true,
      });
    });
  });

  describe('deleteApproval', () => {
    it('should delete approval successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('deleteApproval')
        .mockReturnValueOnce('approval-123');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ success: true });

      const result = await executeApprovalOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'DELETE',
        url: 'https://api.congacloud.com/cpq/v1/approvals/approval-123',
        headers: {
          'Authorization': 'Bearer test-token',
          'X-Tenant-Id': 'test-tenant',
        },
        json: true,
      });
    });
  });

  describe('respondToApproval', () => {
    it('should respond to approval with signature', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('respondToApproval')
        .mockReturnValueOnce('approval-123')
        .mockReturnValueOnce('approve')
        .mockReturnValueOnce('Approved with signature')
        .mockReturnValueOnce('base64signature==');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
        id: 'approval-123',
        status: 'approved'
      });

      const result = await executeApprovalOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.congacloud.com/cpq/v1/approvals/approval-123/respond',
        headers: {
          'Authorization': 'Bearer test-token',
          'Content-Type': 'application/json',
          'X-Tenant-Id': 'test-tenant',
        },
        body: {
          decision: 'approve',
          comments: 'Approved with signature',
          signature: 'base64signature=='
        },
        json: true,
      });
    });
  });
});
});
