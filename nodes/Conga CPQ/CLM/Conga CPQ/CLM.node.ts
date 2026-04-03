/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-congacpqclm/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

export class CongaCPQCLM implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Conga CPQ/CLM',
    name: 'congacpqclm',
    icon: 'file:congacpqclm.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the Conga CPQ/CLM API',
    defaults: {
      name: 'Conga CPQ/CLM',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'congacpqclmApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Quote',
            value: 'quote',
          },
          {
            name: 'QuoteLine',
            value: 'quoteLine',
          },
          {
            name: 'Product',
            value: 'product',
          },
          {
            name: 'Contract',
            value: 'contract',
          },
          {
            name: 'Document',
            value: 'document',
          },
          {
            name: 'Template',
            value: 'template',
          },
          {
            name: 'Approval',
            value: 'approval',
          }
        ],
        default: 'quote',
      },
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['quote'] } },
	options: [
		{ name: 'Create Quote', value: 'createQuote', description: 'Create a new quote', action: 'Create a quote' },
		{ name: 'Get Quote', value: 'getQuote', description: 'Retrieve a specific quote', action: 'Get a quote' },
		{ name: 'Get All Quotes', value: 'getAllQuotes', description: 'List all quotes with filtering', action: 'Get all quotes' },
		{ name: 'Update Quote', value: 'updateQuote', description: 'Update quote details', action: 'Update a quote' },
		{ name: 'Delete Quote', value: 'deleteQuote', description: 'Delete a quote', action: 'Delete a quote' },
		{ name: 'Calculate Quote', value: 'calculateQuote', description: 'Recalculate quote pricing', action: 'Calculate quote pricing' },
		{ name: 'Approve Quote', value: 'approveQuote', description: 'Submit quote for approval', action: 'Approve a quote' },
	],
	default: 'createQuote',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['quoteLine'] } },
  options: [
    { name: 'Add Quote Line', value: 'addQuoteLine', description: 'Add product line to quote', action: 'Add product line to quote' },
    { name: 'Get Quote Lines', value: 'getQuoteLines', description: 'Get all lines for a quote', action: 'Get all lines for a quote' },
    { name: 'Get Quote Line', value: 'getQuoteLine', description: 'Get specific quote line', action: 'Get specific quote line' },
    { name: 'Update Quote Line', value: 'updateQuoteLine', description: 'Update quote line details', action: 'Update quote line details' },
    { name: 'Delete Quote Line', value: 'deleteQuoteLine', description: 'Remove line from quote', action: 'Remove line from quote' },
  ],
  default: 'getQuoteLines',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['product'],
    },
  },
  options: [
    {
      name: 'Create Product',
      value: 'createProduct',
      description: 'Create a new product',
      action: 'Create a product',
    },
    {
      name: 'Get Product',
      value: 'getProduct',
      description: 'Retrieve product details',
      action: 'Get a product',
    },
    {
      name: 'Get All Products',
      value: 'getAllProducts',
      description: 'List products with filtering',
      action: 'Get all products',
    },
    {
      name: 'Update Product',
      value: 'updateProduct',
      description: 'Update product information',
      action: 'Update a product',
    },
    {
      name: 'Delete Product',
      value: 'deleteProduct',
      description: 'Deactivate a product',
      action: 'Delete a product',
    },
    {
      name: 'Get Product Configurations',
      value: 'getProductConfigurations',
      description: 'Get product configuration options',
      action: 'Get product configurations',
    },
    {
      name: 'Calculate Product Pricing',
      value: 'calculateProductPricing',
      description: 'Calculate dynamic pricing',
      action: 'Calculate product pricing',
    },
  ],
  default: 'createProduct',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['contract'],
		},
	},
	options: [
		{
			name: 'Create Contract',
			value: 'createContract',
			description: 'Create a new contract',
			action: 'Create a contract',
		},
		{
			name: 'Get Contract',
			value: 'getContract',
			description: 'Retrieve contract details',
			action: 'Get a contract',
		},
		{
			name: 'Get All Contracts',
			value: 'getAllContracts',
			description: 'List contracts with filtering',
			action: 'Get all contracts',
		},
		{
			name: 'Update Contract',
			value: 'updateContract',
			description: 'Update contract details',
			action: 'Update a contract',
		},
		{
			name: 'Delete Contract',
			value: 'deleteContract',
			description: 'Archive a contract',
			action: 'Delete a contract',
		},
		{
			name: 'Approve Contract',
			value: 'approveContract',
			description: 'Submit for approval workflow',
			action: 'Approve a contract',
		},
		{
			name: 'Renew Contract',
			value: 'renewContract',
			description: 'Initiate contract renewal',
			action: 'Renew a contract',
		},
	],
	default: 'createContract',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['document'] } },
	options: [
		{ name: 'Create Document', value: 'createDocument', description: 'Generate document from template', action: 'Create document' },
		{ name: 'Get Document', value: 'getDocument', description: 'Retrieve document metadata', action: 'Get document' },
		{ name: 'Get All Documents', value: 'getAllDocuments', description: 'List generated documents', action: 'Get all documents' },
		{ name: 'Update Document', value: 'updateDocument', description: 'Update document properties', action: 'Update document' },
		{ name: 'Delete Document', value: 'deleteDocument', description: 'Delete generated document', action: 'Delete document' },
		{ name: 'Download Document', value: 'downloadDocument', description: 'Download document file', action: 'Download document' },
		{ name: 'Send Document', value: 'sendDocument', description: 'Email document to recipients', action: 'Send document' },
	],
	default: 'createDocument',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['template'] } },
	options: [
		{ name: 'Create Template', value: 'createTemplate', description: 'Create a new document template', action: 'Create template' },
		{ name: 'Get Template', value: 'getTemplate', description: 'Retrieve template details', action: 'Get template' },
		{ name: 'Get All Templates', value: 'getAllTemplates', description: 'List available templates', action: 'Get all templates' },
		{ name: 'Update Template', value: 'updateTemplate', description: 'Update template content or settings', action: 'Update template' },
		{ name: 'Delete Template', value: 'deleteTemplate', description: 'Remove template', action: 'Delete template' },
		{ name: 'Preview Template', value: 'previewTemplate', description: 'Generate template preview', action: 'Preview template' },
	],
	default: 'createTemplate',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['approval'] } },
  options: [
    { name: 'Create Approval', value: 'createApproval', description: 'Create approval request', action: 'Create approval request' },
    { name: 'Get Approval', value: 'getApproval', description: 'Get approval details', action: 'Get approval details' },
    { name: 'Get All Approvals', value: 'getAllApprovals', description: 'List approval requests', action: 'List approval requests' },
    { name: 'Update Approval', value: 'updateApproval', description: 'Update approval status', action: 'Update approval status' },
    { name: 'Delete Approval', value: 'deleteApproval', description: 'Cancel approval request', action: 'Cancel approval request' },
    { name: 'Respond to Approval', value: 'respondToApproval', description: 'Approve or reject request', action: 'Approve or reject request' }
  ],
  default: 'createApproval',
},
{
	displayName: 'Quote Name',
	name: 'name',
	type: 'string',
	required: true,
	displayOptions: { show: { resource: ['quote'], operation: ['createQuote', 'updateQuote'] } },
	default: '',
	description: 'Name of the quote',
},
{
	displayName: 'Account ID',
	name: 'accountId',
	type: 'string',
	required: true,
	displayOptions: { show: { resource: ['quote'], operation: ['createQuote'] } },
	default: '',
	description: 'ID of the account associated with the quote',
},
{
	displayName: 'Opportunity ID',
	name: 'opportunityId',
	type: 'string',
	required: false,
	displayOptions: { show: { resource: ['quote'], operation: ['createQuote'] } },
	default: '',
	description: 'ID of the opportunity associated with the quote',
},
{
	displayName: 'Valid Until',
	name: 'validUntil',
	type: 'dateTime',
	required: false,
	displayOptions: { show: { resource: ['quote'], operation: ['createQuote', 'updateQuote'] } },
	default: '',
	description: 'Date until which the quote is valid',
},
{
	displayName: 'Quote ID',
	name: 'quoteId',
	type: 'string',
	required: true,
	displayOptions: { show: { resource: ['quote'], operation: ['getQuote', 'updateQuote', 'deleteQuote', 'calculateQuote', 'approveQuote'] } },
	default: '',
	description: 'ID of the quote',
},
{
	displayName: 'Account ID',
	name: 'accountId',
	type: 'string',
	required: false,
	displayOptions: { show: { resource: ['quote'], operation: ['getAllQuotes'] } },
	default: '',
	description: 'Filter quotes by account ID',
},
{
	displayName: 'Status',
	name: 'status',
	type: 'options',
	options: [
		{ name: 'Draft', value: 'draft' },
		{ name: 'Pending', value: 'pending' },
		{ name: 'Approved', value: 'approved' },
		{ name: 'Rejected', value: 'rejected' },
		{ name: 'Expired', value: 'expired' },
	],
	required: false,
	displayOptions: { show: { resource: ['quote'], operation: ['getAllQuotes', 'updateQuote'] } },
	default: '',
	description: 'Filter quotes by status or set quote status',
},
{
	displayName: 'Created After',
	name: 'createdAfter',
	type: 'dateTime',
	required: false,
	displayOptions: { show: { resource: ['quote'], operation: ['getAllQuotes'] } },
	default: '',
	description: 'Filter quotes created after this date',
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	required: false,
	displayOptions: { show: { resource: ['quote'], operation: ['getAllQuotes'] } },
	default: 100,
	description: 'Maximum number of quotes to return',
},
{
	displayName: 'Offset',
	name: 'offset',
	type: 'number',
	required: false,
	displayOptions: { show: { resource: ['quote'], operation: ['getAllQuotes'] } },
	default: 0,
	description: 'Number of quotes to skip',
},
{
	displayName: 'Approver IDs',
	name: 'approverIds',
	type: 'string',
	required: true,
	displayOptions: { show: { resource: ['quote'], operation: ['approveQuote'] } },
	default: '',
	description: 'Comma-separated list of approver user IDs',
},
{
  displayName: 'Quote ID',
  name: 'quoteId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['quoteLine'], operation: ['addQuoteLine', 'getQuoteLines', 'getQuoteLine', 'updateQuoteLine', 'deleteQuoteLine'] } },
  default: '',
  description: 'The ID of the quote',
},
{
  displayName: 'Line ID',
  name: 'lineId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['quoteLine'], operation: ['getQuoteLine', 'updateQuoteLine', 'deleteQuoteLine'] } },
  default: '',
  description: 'The ID of the quote line',
},
{
  displayName: 'Product ID',
  name: 'productId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['quoteLine'], operation: ['addQuoteLine'] } },
  default: '',
  description: 'The ID of the product to add to the quote',
},
{
  displayName: 'Quantity',
  name: 'quantity',
  type: 'number',
  required: true,
  displayOptions: { show: { resource: ['quoteLine'], operation: ['addQuoteLine', 'updateQuoteLine'] } },
  default: 1,
  description: 'The quantity of the product',
},
{
  displayName: 'Unit Price',
  name: 'unitPrice',
  type: 'number',
  required: true,
  displayOptions: { show: { resource: ['quoteLine'], operation: ['addQuoteLine', 'updateQuoteLine'] } },
  default: 0,
  description: 'The unit price of the product',
},
{
  displayName: 'Discount',
  name: 'discount',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['quoteLine'], operation: ['updateQuoteLine'] } },
  default: 0,
  description: 'The discount amount to apply to the line',
},
{
  displayName: 'Tenant ID',
  name: 'tenantId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['quoteLine'], operation: ['addQuoteLine', 'getQuoteLines', 'getQuoteLine', 'updateQuoteLine', 'deleteQuoteLine'] } },
  default: '',
  description: 'The tenant ID for the request',
},
{
  displayName: 'Product ID',
  name: 'productId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['product'],
      operation: ['getProduct', 'updateProduct', 'deleteProduct', 'getProductConfigurations', 'calculateProductPricing'],
    },
  },
  default: '',
  description: 'The ID of the product',
},
{
  displayName: 'Name',
  name: 'name',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['product'],
      operation: ['createProduct'],
    },
  },
  default: '',
  description: 'The name of the product',
},
{
  displayName: 'Name',
  name: 'name',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['product'],
      operation: ['updateProduct'],
    },
  },
  default: '',
  description: 'The name of the product',
},
{
  displayName: 'Code',
  name: 'code',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['product'],
      operation: ['createProduct'],
    },
  },
  default: '',
  description: 'The product code',
},
{
  displayName: 'Price',
  name: 'price',
  type: 'number',
  required: true,
  displayOptions: {
    show: {
      resource: ['product'],
      operation: ['createProduct'],
    },
  },
  default: 0,
  description: 'The price of the product',
},
{
  displayName: 'Price',
  name: 'price',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['product'],
      operation: ['updateProduct'],
    },
  },
  default: 0,
  description: 'The price of the product',
},
{
  displayName: 'Family',
  name: 'family',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['product'],
      operation: ['createProduct'],
    },
  },
  default: '',
  description: 'The product family',
},
{
  displayName: 'Family',
  name: 'family',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['product'],
      operation: ['getAllProducts'],
    },
  },
  default: '',
  description: 'Filter by product family',
},
{
  displayName: 'Type',
  name: 'type',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['product'],
      operation: ['createProduct'],
    },
  },
  default: '',
  description: 'The product type',
},
{
  displayName: 'Status',
  name: 'status',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['product'],
      operation: ['getAllProducts', 'updateProduct'],
    },
  },
  default: '',
  description: 'Filter by product status or set product status',
},
{
  displayName: 'Search Term',
  name: 'searchTerm',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['product'],
      operation: ['getAllProducts'],
    },
  },
  default: '',
  description: 'Search term to filter products',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['product'],
      operation: ['getAllProducts'],
    },
  },
  default: 50,
  description: 'Maximum number of results to return',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['product'],
      operation: ['getAllProducts'],
    },
  },
  default: 0,
  description: 'Number of results to skip',
},
{
  displayName: 'Description',
  name: 'description',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['product'],
      operation: ['updateProduct'],
    },
  },
  default: '',
  description: 'The product description',
},
{
  displayName: 'Quantity',
  name: 'quantity',
  type: 'number',
  required: true,
  displayOptions: {
    show: {
      resource: ['product'],
      operation: ['calculateProductPricing'],
    },
  },
  default: 1,
  description: 'Quantity for pricing calculation',
},
{
  displayName: 'Customer Tier',
  name: 'customerTier',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['product'],
      operation: ['calculateProductPricing'],
    },
  },
  default: '',
  description: 'Customer tier for pricing calculation',
},
{
	displayName: 'Contract Name',
	name: 'name',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['contract'],
			operation: ['createContract'],
		},
	},
	default: '',
	description: 'Name of the contract',
},
{
	displayName: 'Contract Type',
	name: 'type',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['contract'],
			operation: ['createContract'],
		},
	},
	default: '',
	description: 'Type of the contract',
},
{
	displayName: 'Account ID',
	name: 'accountId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['contract'],
			operation: ['createContract'],
		},
	},
	default: '',
	description: 'ID of the associated account',
},
{
	displayName: 'Start Date',
	name: 'startDate',
	type: 'dateTime',
	required: true,
	displayOptions: {
		show: {
			resource: ['contract'],
			operation: ['createContract'],
		},
	},
	default: '',
	description: 'Contract start date',
},
{
	displayName: 'End Date',
	name: 'endDate',
	type: 'dateTime',
	required: true,
	displayOptions: {
		show: {
			resource: ['contract'],
			operation: ['createContract'],
		},
	},
	default: '',
	description: 'Contract end date',
},
{
	displayName: 'Contract ID',
	name: 'contractId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['contract'],
			operation: ['getContract', 'updateContract', 'deleteContract', 'approveContract', 'renewContract'],
		},
	},
	default: '',
	description: 'ID of the contract',
},
{
	displayName: 'Account ID',
	name: 'accountId',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['contract'],
			operation: ['getAllContracts'],
		},
	},
	default: '',
	description: 'Filter by account ID',
},
{
	displayName: 'Status',
	name: 'status',
	type: 'options',
	options: [
		{
			name: 'Draft',
			value: 'draft',
		},
		{
			name: 'Active',
			value: 'active',
		},
		{
			name: 'Expired',
			value: 'expired',
		},
		{
			name: 'Terminated',
			value: 'terminated',
		},
	],
	displayOptions: {
		show: {
			resource: ['contract'],
			operation: ['getAllContracts', 'updateContract'],
		},
	},
	default: '',
	description: 'Contract status',
},
{
	displayName: 'Type',
	name: 'type',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['contract'],
			operation: ['getAllContracts'],
		},
	},
	default: '',
	description: 'Filter by contract type',
},
{
	displayName: 'Expiration Before',
	name: 'expirationBefore',
	type: 'dateTime',
	displayOptions: {
		show: {
			resource: ['contract'],
			operation: ['getAllContracts'],
		},
	},
	default: '',
	description: 'Filter contracts expiring before this date',
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['contract'],
			operation: ['getAllContracts'],
		},
	},
	default: 50,
	description: 'Maximum number of results to return',
},
{
	displayName: 'Offset',
	name: 'offset',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['contract'],
			operation: ['getAllContracts'],
		},
	},
	default: 0,
	description: 'Number of results to skip',
},
{
	displayName: 'Contract Name',
	name: 'name',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['contract'],
			operation: ['updateContract'],
		},
	},
	default: '',
	description: 'Updated contract name',
},
{
	displayName: 'End Date',
	name: 'endDate',
	type: 'dateTime',
	displayOptions: {
		show: {
			resource: ['contract'],
			operation: ['updateContract'],
		},
	},
	default: '',
	description: 'Updated contract end date',
},
{
	displayName: 'Terms',
	name: 'terms',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['contract'],
			operation: ['updateContract', 'renewContract'],
		},
	},
	default: '',
	description: 'Contract terms and conditions',
},
{
	displayName: 'Approver IDs',
	name: 'approverIds',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['contract'],
			operation: ['approveContract'],
		},
	},
	default: '',
	description: 'Comma-separated list of approver IDs',
},
{
	displayName: 'Comments',
	name: 'comments',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['contract'],
			operation: ['approveContract'],
		},
	},
	default: '',
	description: 'Comments for the approval request',
},
{
	displayName: 'New End Date',
	name: 'newEndDate',
	type: 'dateTime',
	required: true,
	displayOptions: {
		show: {
			resource: ['contract'],
			operation: ['renewContract'],
		},
	},
	default: '',
	description: 'New end date for the renewed contract',
},
{
	displayName: 'Template ID',
	name: 'templateId',
	type: 'string',
	required: true,
	displayOptions: { show: { resource: ['document'], operation: ['createDocument'] } },
	default: '',
	description: 'ID of the template to use for document generation',
},
{
	displayName: 'Data Source ID',
	name: 'dataSourceId',
	type: 'string',
	required: true,
	displayOptions: { show: { resource: ['document'], operation: ['createDocument'] } },
	default: '',
	description: 'ID of the data source to merge with template',
},
{
	displayName: 'Format',
	name: 'format',
	type: 'options',
	options: [
		{ name: 'PDF', value: 'pdf' },
		{ name: 'Word', value: 'docx' },
		{ name: 'HTML', value: 'html' },
	],
	required: true,
	displayOptions: { show: { resource: ['document'], operation: ['createDocument'] } },
	default: 'pdf',
	description: 'Output format for the generated document',
},
{
	displayName: 'Document Name',
	name: 'name',
	type: 'string',
	required: true,
	displayOptions: { show: { resource: ['document'], operation: ['createDocument'] } },
	default: '',
	description: 'Name for the generated document',
},
{
	displayName: 'Document ID',
	name: 'documentId',
	type: 'string',
	required: true,
	displayOptions: { show: { resource: ['document'], operation: ['getDocument', 'updateDocument', 'deleteDocument', 'downloadDocument', 'sendDocument'] } },
	default: '',
	description: 'ID of the document',
},
{
	displayName: 'Template ID',
	name: 'templateId',
	type: 'string',
	required: false,
	displayOptions: { show: { resource: ['document'], operation: ['getAllDocuments'] } },
	default: '',
	description: 'Filter by template ID',
},
{
	displayName: 'Status',
	name: 'status',
	type: 'options',
	options: [
		{ name: 'Draft', value: 'draft' },
		{ name: 'Generated', value: 'generated' },
		{ name: 'Sent', value: 'sent' },
		{ name: 'Error', value: 'error' },
	],
	required: false,
	displayOptions: { show: { resource: ['document'], operation: ['getAllDocuments'] } },
	default: '',
	description: 'Filter by document status',
},
{
	displayName: 'Created After',
	name: 'createdAfter',
	type: 'dateTime',
	required: false,
	displayOptions: { show: { resource: ['document'], operation: ['getAllDocuments'] } },
	default: '',
	description: 'Filter documents created after this date',
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	required: false,
	displayOptions: { show: { resource: ['document'], operation: ['getAllDocuments'] } },
	default: 100,
	description: 'Maximum number of results to return',
},
{
	displayName: 'Offset',
	name: 'offset',
	type: 'number',
	required: false,
	displayOptions: { show: { resource: ['document'], operation: ['getAllDocuments'] } },
	default: 0,
	description: 'Number of results to skip',
},
{
	displayName: 'Document Name',
	name: 'name',
	type: 'string',
	required: false,
	displayOptions: { show: { resource: ['document'], operation: ['updateDocument'] } },
	default: '',
	description: 'New name for the document',
},
{
	displayName: 'Status',
	name: 'status',
	type: 'options',
	options: [
		{ name: 'Draft', value: 'draft' },
		{ name: 'Generated', value: 'generated' },
		{ name: 'Sent', value: 'sent' },
		{ name: 'Error', value: 'error' },
	],
	required: false,
	displayOptions: { show: { resource: ['document'], operation: ['updateDocument'] } },
	default: '',
	description: 'New status for the document',
},
{
	displayName: 'Tags',
	name: 'tags',
	type: 'string',
	required: false,
	displayOptions: { show: { resource: ['document'], operation: ['updateDocument'] } },
	default: '',
	description: 'Comma-separated tags for the document',
},
{
	displayName: 'Format',
	name: 'format',
	type: 'options',
	options: [
		{ name: 'PDF', value: 'pdf' },
		{ name: 'Word', value: 'docx' },
		{ name: 'HTML', value: 'html' },
	],
	required: false,
	displayOptions: { show: { resource: ['document'], operation: ['downloadDocument'] } },
	default: 'pdf',
	description: 'Format for document download',
},
{
	displayName: 'Recipients',
	name: 'recipients',
	type: 'string',
	required: true,
	displayOptions: { show: { resource: ['document'], operation: ['sendDocument'] } },
	default: '',
	description: 'Comma-separated email addresses of recipients',
},
{
	displayName: 'Subject',
	name: 'subject',
	type: 'string',
	required: true,
	displayOptions: { show: { resource: ['document'], operation: ['sendDocument'] } },
	default: '',
	description: 'Email subject line',
},
{
	displayName: 'Message',
	name: 'message',
	type: 'string',
	required: false,
	displayOptions: { show: { resource: ['document'], operation: ['sendDocument'] } },
	default: '',
	description: 'Email message body',
},
{
	displayName: 'Template Name',
	name: 'templateName',
	type: 'string',
	required: true,
	default: '',
	displayOptions: { show: { resource: ['template'], operation: ['createTemplate'] } },
	description: 'Name of the template',
},
{
	displayName: 'Template Type',
	name: 'templateType',
	type: 'options',
	required: true,
	default: 'document',
	options: [
		{ name: 'Document', value: 'document' },
		{ name: 'Email', value: 'email' },
		{ name: 'Presentation', value: 'presentation' },
		{ name: 'Spreadsheet', value: 'spreadsheet' },
	],
	displayOptions: { show: { resource: ['template'], operation: ['createTemplate'] } },
	description: 'Type of the template',
},
{
	displayName: 'Template Content',
	name: 'templateContent',
	type: 'string',
	typeOptions: { editor: 'htmlEditor', rows: 10 },
	required: true,
	default: '',
	displayOptions: { show: { resource: ['template'], operation: ['createTemplate'] } },
	description: 'Content of the template (HTML or text format)',
},
{
	displayName: 'Data Mapping',
	name: 'dataMapping',
	type: 'json',
	default: '{}',
	displayOptions: { show: { resource: ['template'], operation: ['createTemplate'] } },
	description: 'JSON object defining how data maps to template variables',
},
{
	displayName: 'Template ID',
	name: 'templateId',
	type: 'string',
	required: true,
	default: '',
	displayOptions: { show: { resource: ['template'], operation: ['getTemplate', 'updateTemplate', 'deleteTemplate', 'previewTemplate'] } },
	description: 'ID of the template',
},
{
	displayName: 'Template Type',
	name: 'templateType',
	type: 'options',
	default: '',
	options: [
		{ name: 'All', value: '' },
		{ name: 'Document', value: 'document' },
		{ name: 'Email', value: 'email' },
		{ name: 'Presentation', value: 'presentation' },
		{ name: 'Spreadsheet', value: 'spreadsheet' },
	],
	displayOptions: { show: { resource: ['template'], operation: ['getAllTemplates'] } },
	description: 'Filter templates by type',
},
{
	displayName: 'Status',
	name: 'templateStatus',
	type: 'options',
	default: '',
	options: [
		{ name: 'All', value: '' },
		{ name: 'Active', value: 'active' },
		{ name: 'Draft', value: 'draft' },
		{ name: 'Archived', value: 'archived' },
	],
	displayOptions: { show: { resource: ['template'], operation: ['getAllTemplates'] } },
	description: 'Filter templates by status',
},
{
	displayName: 'Search Term',
	name: 'searchTerm',
	type: 'string',
	default: '',
	displayOptions: { show: { resource: ['template'], operation: ['getAllTemplates'] } },
	description: 'Search templates by name or description',
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	default: 100,
	typeOptions: { minValue: 1, maxValue: 500 },
	displayOptions: { show: { resource: ['template'], operation: ['getAllTemplates'] } },
	description: 'Maximum number of templates to return',
},
{
	displayName: 'Offset',
	name: 'offset',
	type: 'number',
	default: 0,
	typeOptions: { minValue: 0 },
	displayOptions: { show: { resource: ['template'], operation: ['getAllTemplates'] } },
	description: 'Number of templates to skip',
},
{
	displayName: 'Template Name',
	name: 'templateName',
	type: 'string',
	default: '',
	displayOptions: { show: { resource: ['template'], operation: ['updateTemplate'] } },
	description: 'Name of the template',
},
{
	displayName: 'Template Content',
	name: 'templateContent',
	type: 'string',
	typeOptions: { editor: 'htmlEditor', rows: 10 },
	default: '',
	displayOptions: { show: { resource: ['template'], operation: ['updateTemplate'] } },
	description: 'Content of the template (HTML or text format)',
},
{
	displayName: 'Data Mapping',
	name: 'dataMapping',
	type: 'json',
	default: '{}',
	displayOptions: { show: { resource: ['template'], operation: ['updateTemplate'] } },
	description: 'JSON object defining how data maps to template variables',
},
{
	displayName: 'Status',
	name: 'templateStatus',
	type: 'options',
	default: 'active',
	options: [
		{ name: 'Active', value: 'active' },
		{ name: 'Draft', value: 'draft' },
		{ name: 'Archived', value: 'archived' },
	],
	displayOptions: { show: { resource: ['template'], operation: ['updateTemplate'] } },
	description: 'Status of the template',
},
{
	displayName: 'Sample Data',
	name: 'sampleData',
	type: 'json',
	required: true,
	default: '{}',
	displayOptions: { show: { resource: ['template'], operation: ['previewTemplate'] } },
	description: 'Sample data to use for template preview',
},
{
  displayName: 'Object Type',
  name: 'objectType',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['approval'], operation: ['createApproval'] } },
  default: '',
  description: 'Type of object requiring approval (quote, contract, etc.)',
},
{
  displayName: 'Object ID',
  name: 'objectId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['approval'], operation: ['createApproval'] } },
  default: '',
  description: 'ID of the object requiring approval',
},
{
  displayName: 'Approver IDs',
  name: 'approverIds',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['approval'], operation: ['createApproval'] } },
  default: '',
  description: 'Comma-separated list of approver user IDs',
},
{
  displayName: 'Due Date',
  name: 'dueDate',
  type: 'dateTime',
  displayOptions: { show: { resource: ['approval'], operation: ['createApproval'] } },
  default: '',
  description: 'Due date for approval response',
},
{
  displayName: 'Approval ID',
  name: 'approvalId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['approval'], operation: ['getApproval', 'updateApproval', 'deleteApproval', 'respondToApproval'] } },
  default: '',
  description: 'Unique identifier of the approval',
},
{
  displayName: 'Status',
  name: 'status',
  type: 'options',
  displayOptions: { show: { resource: ['approval'], operation: ['getAllApprovals', 'updateApproval'] } },
  options: [
    { name: 'Pending', value: 'pending' },
    { name: 'Approved', value: 'approved' },
    { name: 'Rejected', value: 'rejected' },
    { name: 'Cancelled', value: 'cancelled' }
  ],
  default: 'pending',
  description: 'Filter by approval status or new status to set',
},
{
  displayName: 'Assigned To',
  name: 'assignedTo',
  type: 'string',
  displayOptions: { show: { resource: ['approval'], operation: ['getAllApprovals'] } },
  default: '',
  description: 'Filter by user ID assigned to approve',
},
{
  displayName: 'Object Type Filter',
  name: 'objectTypeFilter',
  type: 'string',
  displayOptions: { show: { resource: ['approval'], operation: ['getAllApprovals'] } },
  default: '',
  description: 'Filter by object type',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: { show: { resource: ['approval'], operation: ['getAllApprovals'] } },
  default: 50,
  description: 'Number of records to return',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  displayOptions: { show: { resource: ['approval'], operation: ['getAllApprovals'] } },
  default: 0,
  description: 'Number of records to skip',
},
{
  displayName: 'Comments',
  name: 'comments',
  type: 'string',
  displayOptions: { show: { resource: ['approval'], operation: ['updateApproval', 'respondToApproval'] } },
  default: '',
  description: 'Additional comments for the approval update',
},
{
  displayName: 'Decision',
  name: 'decision',
  type: 'options',
  required: true,
  displayOptions: { show: { resource: ['approval'], operation: ['updateApproval', 'respondToApproval'] } },
  options: [
    { name: 'Approve', value: 'approve' },
    { name: 'Reject', value: 'reject' }
  ],
  default: 'approve',
  description: 'Approval decision',
},
{
  displayName: 'Signature',
  name: 'signature',
  type: 'string',
  displayOptions: { show: { resource: ['approval'], operation: ['respondToApproval'] } },
  default: '',
  description: 'Digital signature for approval (base64 encoded)',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'quote':
        return [await executeQuoteOperations.call(this, items)];
      case 'quoteLine':
        return [await executeQuoteLineOperations.call(this, items)];
      case 'product':
        return [await executeProductOperations.call(this, items)];
      case 'contract':
        return [await executeContractOperations.call(this, items)];
      case 'document':
        return [await executeDocumentOperations.call(this, items)];
      case 'template':
        return [await executeTemplateOperations.call(this, items)];
      case 'approval':
        return [await executeApprovalOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeQuoteOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('congacpqclmApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'createQuote': {
					const name = this.getNodeParameter('name', i) as string;
					const accountId = this.getNodeParameter('accountId', i) as string;
					const opportunityId = this.getNodeParameter('opportunityId', i) as string;
					const validUntil = this.getNodeParameter('validUntil', i) as string;

					const body: any = {
						name,
						accountId,
					};

					if (opportunityId) body.opportunityId = opportunityId;
					if (validUntil) body.validUntil = validUntil;

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/quotes`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'X-Tenant-Id': credentials.tenantId,
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(body),
						json: false,
					};

					result = await this.helpers.httpRequest(options) as any;
					if (typeof result === 'string') {
						result = JSON.parse(result);
					}
					break;
				}

				case 'getQuote': {
					const quoteId = this.getNodeParameter('quoteId', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/quotes/${quoteId}`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'X-Tenant-Id': credentials.tenantId,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getAllQuotes': {
					const accountId = this.getNodeParameter('accountId', i) as string;
					const status = this.getNodeParameter('status', i) as string;
					const createdAfter = this.getNodeParameter('createdAfter', i) as string;
					const limit = this.getNodeParameter('limit', i) as number;
					const offset = this.getNodeParameter('offset', i) as number;

					const queryParams: string[] = [];
					if (accountId) queryParams.push(`accountId=${encodeURIComponent(accountId)}`);
					if (status) queryParams.push(`status=${encodeURIComponent(status)}`);
					if (createdAfter) queryParams.push(`createdAfter=${encodeURIComponent(createdAfter)}`);
					if (limit) queryParams.push(`limit=${limit}`);
					if (offset) queryParams.push(`offset=${offset}`);

					const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/quotes${queryString}`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'X-Tenant-Id': credentials.tenantId,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'updateQuote': {
					const quoteId = this.getNodeParameter('quoteId', i) as string;
					const name = this.getNodeParameter('name', i) as string;
					const validUntil = this.getNodeParameter('validUntil', i) as string;
					const status = this.getNodeParameter('status', i) as string;

					const body: any = {};
					if (name) body.name = name;
					if (validUntil) body.validUntil = validUntil;
					if (status) body.status = status;

					const options: any = {
						method: 'PUT',
						url: `${credentials.baseUrl}/quotes/${quoteId}`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'X-Tenant-Id': credentials.tenantId,
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(body),
						json: false,
					};

					result = await this.helpers.httpRequest(options) as any;
					if (typeof result === 'string') {
						result = JSON.parse(result);
					}
					break;
				}

				case 'deleteQuote': {
					const quoteId = this.getNodeParameter('quoteId', i) as string;

					const options: any = {
						method: 'DELETE',
						url: `${credentials.baseUrl}/quotes/${quoteId}`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'X-Tenant-Id': credentials.tenantId,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'calculateQuote': {
					const quoteId = this.getNodeParameter('quoteId', i) as string;

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/quotes/${quoteId}/calculate`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'X-Tenant-Id': credentials.tenantId,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'approveQuote': {
					const quoteId = this.getNodeParameter('quoteId', i) as string;
					const approverIds = this.getNodeParameter('approverIds', i) as string;

					const body = {
						approverIds: approverIds.split(',').map((id: string) => id.trim()),
					};

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/quotes/${quoteId}/approve`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'X-Tenant-Id': credentials.tenantId,
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(body),
						json: false,
					};

					result = await this.helpers.httpRequest(options) as any;
					if (typeof result === 'string') {
						result = JSON.parse(result);
					}
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});

		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeQuoteLineOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('congacpqclmApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      const quoteId = this.getNodeParameter('quoteId', i) as string;
      const tenantId = this.getNodeParameter('tenantId', i) as string;

      const baseOptions: any = {
        headers: {
          'Authorization': `Bearer ${credentials.accessToken}`,
          'Content-Type': 'application/json',
          'X-Tenant-Id': tenantId,
        },
        json: true,
      };

      switch (operation) {
        case 'addQuoteLine': {
          const productId = this.getNodeParameter('productId', i) as string;
          const quantity = this.getNodeParameter('quantity', i) as number;
          const unitPrice = this.getNodeParameter('unitPrice', i) as number;

          const options: any = {
            ...baseOptions,
            method: 'POST',
            url: `${credentials.baseUrl || 'https://api.congacloud.com/cpq/v1'}/quotes/${quoteId}/lines`,
            body: {
              productId,
              quantity,
              unitPrice,
            },
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getQuoteLines': {
          const options: any = {
            ...baseOptions,
            method: 'GET',
            url: `${credentials.baseUrl || 'https://api.congacloud.com/cpq/v1'}/quotes/${quoteId}/lines`,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getQuoteLine': {
          const lineId = this.getNodeParameter('lineId', i) as string;

          const options: any = {
            ...baseOptions,
            method: 'GET',
            url: `${credentials.baseUrl || 'https://api.congacloud.com/cpq/v1'}/quotes/${quoteId}/lines/${lineId}`,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateQuoteLine': {
          const lineId = this.getNodeParameter('lineId', i) as string;
          const quantity = this.getNodeParameter('quantity', i) as number;
          const unitPrice = this.getNodeParameter('unitPrice', i) as number;
          const discount = this.getNodeParameter('discount', i) as number;

          const options: any = {
            ...baseOptions,
            method: 'PUT',
            url: `${credentials.baseUrl || 'https://api.congacloud.com/cpq/v1'}/quotes/${quoteId}/lines/${lineId}`,
            body: {
              quantity,
              unitPrice,
              discount,
            },
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'deleteQuoteLine': {
          const lineId = this.getNodeParameter('lineId', i) as string;

          const options: any = {
            ...baseOptions,
            method: 'DELETE',
            url: `${credentials.baseUrl || 'https://api.congacloud.com/cpq/v1'}/quotes/${quoteId}/lines/${lineId}`,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeProductOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('congacpqclmApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'createProduct': {
          const name = this.getNodeParameter('name', i) as string;
          const code = this.getNodeParameter('code', i) as string;
          const price = this.getNodeParameter('price', i) as number;
          const family = this.getNodeParameter('family', i) as string;
          const type = this.getNodeParameter('type', i) as string;

          const body = {
            name,
            code,
            price,
            family,
            type,
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/products`,
            headers: {
              Authorization: `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
              'X-Tenant-Id': credentials.tenantId,
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getProduct': {
          const productId = this.getNodeParameter('productId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/products/${productId}`,
            headers: {
              Authorization: `Bearer ${credentials.accessToken}`,
              'X-Tenant-Id': credentials.tenantId,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAllProducts': {
          const family = this.getNodeParameter('family', i) as string;
          const status = this.getNodeParameter('status', i) as string;
          const searchTerm = this.getNodeParameter('searchTerm', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;

          const queryParams = new URLSearchParams();
          if (family) queryParams.append('family', family);
          if (status) queryParams.append('status', status);
          if (searchTerm) queryParams.append('search', searchTerm);
          if (limit) queryParams.append('limit', limit.toString());
          if (offset) queryParams.append('offset', offset.toString());

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/products?${queryParams.toString()}`,
            headers: {
              Authorization: `Bearer ${credentials.accessToken}`,
              'X-Tenant-Id': credentials.tenantId,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateProduct': {
          const productId = this.getNodeParameter('productId', i) as string;
          const name = this.getNodeParameter('name', i) as string;
          const price = this.getNodeParameter('price', i) as number;
          const status = this.getNodeParameter('status', i) as string;
          const description = this.getNodeParameter('description', i) as string;

          const body: any = {};
          if (name) body.name = name;
          if (price) body.price = price;
          if (status) body.status = status;
          if (description) body.description = description;

          const options: any = {
            method: 'PUT',
            url: `${credentials.baseUrl}/products/${productId}`,
            headers: {
              Authorization: `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
              'X-Tenant-Id': credentials.tenantId,
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'deleteProduct': {
          const productId = this.getNodeParameter('productId', i) as string;

          const options: any = {
            method: 'DELETE',
            url: `${credentials.baseUrl}/products/${productId}`,
            headers: {
              Authorization: `Bearer ${credentials.accessToken}`,
              'X-Tenant-Id': credentials.tenantId,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getProductConfigurations': {
          const productId = this.getNodeParameter('productId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/products/${productId}/configurations`,
            headers: {
              Authorization: `Bearer ${credentials.accessToken}`,
              'X-Tenant-Id': credentials.tenantId,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'calculateProductPricing': {
          const productId = this.getNodeParameter('productId', i) as string;
          const quantity = this.getNodeParameter('quantity', i) as number;
          const customerTier = this.getNodeParameter('customerTier', i) as string;

          const body = {
            quantity,
            customerTier,
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/products/${productId}/pricing`,
            headers: {
              Authorization: `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
              'X-Tenant-Id': credentials.tenantId,
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeContractOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('congacpqclmApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'createContract': {
					const name = this.getNodeParameter('name', i) as string;
					const type = this.getNodeParameter('type', i) as string;
					const accountId = this.getNodeParameter('accountId', i) as string;
					const startDate = this.getNodeParameter('startDate', i) as string;
					const endDate = this.getNodeParameter('endDate', i) as string;

					const body = {
						name,
						type,
						accountId,
						startDate,
						endDate,
					};

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/contracts`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'X-Tenant-Id': credentials.tenantId,
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getContract': {
					const contractId = this.getNodeParameter('contractId', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/contracts/${contractId}`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'X-Tenant-Id': credentials.tenantId,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getAllContracts': {
					const accountId = this.getNodeParameter('accountId', i) as string;
					const status = this.getNodeParameter('status', i) as string;
					const type = this.getNodeParameter('type', i) as string;
					const expirationBefore = this.getNodeParameter('expirationBefore', i) as string;
					const limit = this.getNodeParameter('limit', i) as number;
					const offset = this.getNodeParameter('offset', i) as number;

					const qs: any = {
						limit,
						offset,
					};

					if (accountId) qs.accountId = accountId;
					if (status) qs.status = status;
					if (type) qs.type = type;
					if (expirationBefore) qs.expirationBefore = expirationBefore;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/contracts`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'X-Tenant-Id': credentials.tenantId,
						},
						qs,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'updateContract': {
					const contractId = this.getNodeParameter('contractId', i) as string;
					const name = this.getNodeParameter('name', i) as string;
					const status = this.getNodeParameter('status', i) as string;
					const endDate = this.getNodeParameter('endDate', i) as string;
					const terms = this.getNodeParameter('terms', i) as string;

					const body: any = {};
					if (name) body.name = name;
					if (status) body.status = status;
					if (endDate) body.endDate = endDate;
					if (terms) body.terms = terms;

					const options: any = {
						method: 'PUT',
						url: `${credentials.baseUrl}/contracts/${contractId}`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'X-Tenant-Id': credentials.tenantId,
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'deleteContract': {
					const contractId = this.getNodeParameter('contractId', i) as string;

					const options: any = {
						method: 'DELETE',
						url: `${credentials.baseUrl}/contracts/${contractId}`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'X-Tenant-Id': credentials.tenantId,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'approveContract': {
					const contractId = this.getNodeParameter('contractId', i) as string;
					const approverIds = this.getNodeParameter('approverIds', i) as string;
					const comments = this.getNodeParameter('comments', i) as string;

					const body: any = {
						approverIds: approverIds.split(',').map((id: string) => id.trim()),
					};

					if (comments) body.comments = comments;

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/contracts/${contractId}/approve`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'X-Tenant-Id': credentials.tenantId,
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'renewContract': {
					const contractId = this.getNodeParameter('contractId', i) as string;
					const newEndDate = this.getNodeParameter('newEndDate', i) as string;
					const terms = this.getNodeParameter('terms', i) as string;

					const body: any = {
						newEndDate,
					};

					if (terms) body.terms = terms;

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/contracts/${contractId}/renew`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'X-Tenant-Id': credentials.tenantId,
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeDocumentOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('congacpqclmApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'createDocument': {
					const templateId = this.getNodeParameter('templateId', i) as string;
					const dataSourceId = this.getNodeParameter('dataSourceId', i) as string;
					const format = this.getNodeParameter('format', i) as string;
					const name = this.getNodeParameter('name', i) as string;

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/documents`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'X-Tenant-Id': credentials.tenantId,
							'Content-Type': 'application/json',
						},
						body: {
							templateId,
							dataSourceId,
							format,
							name,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getDocument': {
					const documentId = this.getNodeParameter('documentId', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/documents/${documentId}`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'X-Tenant-Id': credentials.tenantId,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getAllDocuments': {
					const templateId = this.getNodeParameter('templateId', i) as string;
					const status = this.getNodeParameter('status', i) as string;
					const createdAfter = this.getNodeParameter('createdAfter', i) as string;
					const limit = this.getNodeParameter('limit', i) as number;
					const offset = this.getNodeParameter('offset', i) as number;

					const queryParams: any = {};
					if (templateId) queryParams.templateId = templateId;
					if (status) queryParams.status = status;
					if (createdAfter) queryParams.createdAfter = createdAfter;
					if (limit) queryParams.limit = limit;
					if (offset) queryParams.offset = offset;

					const queryString = Object.keys(queryParams).length > 0 ? '?' + new URLSearchParams(queryParams).toString() : '';

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/documents${queryString}`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'X-Tenant-Id': credentials.tenantId,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'updateDocument': {
					const documentId = this.getNodeParameter('documentId', i) as string;
					const name = this.getNodeParameter('name', i) as string;
					const status = this.getNodeParameter('status', i) as string;
					const tags = this.getNodeParameter('tags', i) as string;

					const body: any = {};
					if (name) body.name = name;
					if (status) body.status = status;
					if (tags) body.tags = tags.split(',').map((tag: string) => tag.trim());

					const options: any = {
						method: 'PUT',
						url: `${credentials.baseUrl}/documents/${documentId}`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'X-Tenant-Id': credentials.tenantId,
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'deleteDocument': {
					const documentId = this.getNodeParameter('documentId', i) as string;

					const options: any = {
						method: 'DELETE',
						url: `${credentials.baseUrl}/documents/${documentId}`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'X-Tenant-Id': credentials.tenantId,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'downloadDocument': {
					const documentId = this.getNodeParameter('documentId', i) as string;
					const format = this.getNodeParameter('format', i) as string;

					const queryString = format ? `?format=${format}` : '';

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/documents/${documentId}/download${queryString}`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'X-Tenant-Id': credentials.tenantId,
						},
						encoding: null,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'sendDocument': {
					const documentId = this.getNodeParameter('documentId', i) as string;
					const recipients = this.getNodeParameter('recipients', i) as string;
					const subject = this.getNodeParameter('subject', i) as string;
					const message = this.getNodeParameter('message', i) as string;

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/documents/${documentId}/send`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'X-Tenant-Id': credentials.tenantId,
							'Content-Type': 'application/json',
						},
						body: {
							recipients: recipients.split(',').map((email: string) => email.trim()),
							subject,
							message,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});

		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeTemplateOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('congacpqclmApi') as any;
	
	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;
			
			const baseHeaders = {
				'Authorization': `Bearer ${credentials.accessToken}`,
				'X-Tenant-Id': credentials.tenantId,
				'Content-Type': 'application/json',
			};
			
			switch (operation) {
				case 'createTemplate': {
					const templateName = this.getNodeParameter('templateName', i) as string;
					const templateType = this.getNodeParameter('templateType', i) as string;
					const templateContent = this.getNodeParameter('templateContent', i) as string;
					const dataMapping = this.getNodeParameter('dataMapping', i, '{}') as string;
					
					const body = {
						name: templateName,
						type: templateType,
						content: templateContent,
						dataMapping: typeof dataMapping === 'string' ? JSON.parse(dataMapping) : dataMapping,
					};
					
					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/templates`,
						headers: baseHeaders,
						body: JSON.stringify(body),
					};
					
					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				
				case 'getTemplate': {
					const templateId = this.getNodeParameter('templateId', i) as string;
					
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/templates/${templateId}`,
						headers: baseHeaders,
					};
					
					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				
				case 'getAllTemplates': {
					const templateType = this.getNodeParameter('templateType', i, '') as string;
					const templateStatus = this.getNodeParameter('templateStatus', i, '') as string;
					const searchTerm = this.getNodeParameter('searchTerm', i, '') as string;
					const limit = this.getNodeParameter('limit', i, 100) as number;
					const offset = this.getNodeParameter('offset', i, 0) as number;
					
					const queryParams = new URLSearchParams();
					if (templateType) queryParams.append('type', templateType);
					if (templateStatus) queryParams.append('status', templateStatus);
					if (searchTerm) queryParams.append('searchTerm', searchTerm);
					queryParams.append('limit', limit.toString());
					queryParams.append('offset', offset.toString());
					
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/templates?${queryParams.toString()}`,
						headers: baseHeaders,
					};
					
					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				
				case 'updateTemplate': {
					const templateId = this.getNodeParameter('templateId', i) as string;
					const templateName = this.getNodeParameter('templateName', i, '') as string;
					const templateContent = this.getNodeParameter('templateContent', i, '') as string;
					const dataMapping = this.getNodeParameter('dataMapping', i, '{}') as string;
					const templateStatus = this.getNodeParameter('templateStatus', i) as string;
					
					const body: any = {};
					if (templateName) body.name = templateName;
					if (templateContent) body.content = templateContent;
					if (dataMapping !== '{}') {
						body.dataMapping = typeof dataMapping === 'string' ? JSON.parse(dataMapping) : dataMapping;
					}
					body.status = templateStatus;
					
					const options: any = {
						method: 'PUT',
						url: `${credentials.baseUrl}/templates/${templateId}`,
						headers: baseHeaders,
						body: JSON.stringify(body),
					};
					
					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				
				case 'deleteTemplate': {
					const templateId = this.getNodeParameter('templateId', i) as string;
					
					const options: any = {
						method: 'DELETE',
						url: `${credentials.baseUrl}/templates/${templateId}`,
						headers: baseHeaders,
					};
					
					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				
				case 'previewTemplate': {
					const templateId = this.getNodeParameter('templateId', i) as string;
					const sampleData = this.getNodeParameter('sampleData', i) as string;
					
					const body = {
						sampleData: typeof sampleData === 'string' ? JSON.parse(sampleData) : sampleData,
					};
					
					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/templates/${templateId}/preview`,
						headers: baseHeaders,
						body: JSON.stringify(body),
					};
					
					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				
				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}
			
			returnData.push({ json: result, pairedItem: { item: i } });
			
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
			} else {
				throw error;
			}
		}
	}
	
	return returnData;
}

async function executeApprovalOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('congacpqclmApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      const baseUrl = credentials.baseUrl || 'https://api.congacloud.com/cpq/v1';

      switch (operation) {
        case 'createApproval': {
          const objectType = this.getNodeParameter('objectType', i) as string;
          const objectId = this.getNodeParameter('objectId', i) as string;
          const approverIds = this.getNodeParameter('approverIds', i) as string;
          const dueDate = this.getNodeParameter('dueDate', i) as string;

          const body: any = {
            objectType,
            objectId,
            approverIds: approverIds.split(',').map((id: string) => id.trim()),
          };

          if (dueDate) {
            body.dueDate = dueDate;
          }

          const options: any = {
            method: 'POST',
            url: `${baseUrl}/approvals`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
              'X-Tenant-Id': credentials.tenantId,
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getApproval': {
          const approvalId = this.getNodeParameter('approvalId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${baseUrl}/approvals/${approvalId}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'X-Tenant-Id': credentials.tenantId,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAllApprovals': {
          const status = this.getNodeParameter('status', i) as string;
          const assignedTo = this.getNodeParameter('assignedTo', i) as string;
          const objectTypeFilter = this.getNodeParameter('objectTypeFilter', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;

          const queryParams: string[] = [];
          if (status) queryParams.push(`status=${encodeURIComponent(status)}`);
          if (assignedTo) queryParams.push(`assignedTo=${encodeURIComponent(assignedTo)}`);
          if (objectTypeFilter) queryParams.push(`objectType=${encodeURIComponent(objectTypeFilter)}`);
          queryParams.push(`limit=${limit}`);
          queryParams.push(`offset=${offset}`);

          const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

          const options: any = {
            method: 'GET',
            url: `${baseUrl}/approvals${queryString}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'X-Tenant-Id': credentials.tenantId,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateApproval': {
          const approvalId = this.getNodeParameter('approvalId', i) as string;
          const status = this.getNodeParameter('status', i) as string;
          const comments = this.getNodeParameter('comments', i) as string;
          const decision = this.getNodeParameter('decision', i) as string;

          const body: any = {
            status,
            decision,
          };

          if (comments) {
            body.comments = comments;
          }

          const options: any = {
            method: 'PUT',
            url: `${baseUrl}/approvals/${approvalId}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
              'X-Tenant-Id': credentials.tenantId,
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'deleteApproval': {
          const approvalId = this.getNodeParameter('approvalId', i) as string;

          const options: any = {
            method: 'DELETE',
            url: `${baseUrl}/approvals/${approvalId}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'X-Tenant-Id': credentials.tenantId,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'respondToApproval': {
          const approvalId = this.getNodeParameter('approvalId', i) as string;
          const decision = this.getNodeParameter('decision', i) as string;
          const comments = this.getNodeParameter('comments', i) as string;
          const signature = this.getNodeParameter('signature', i) as string;

          const body: any = {
            decision,
          };

          if (comments) {
            body.comments = comments;
          }

          if (signature) {
            body.signature = signature;
          }

          const options: any = {
            method: 'POST',
            url: `${baseUrl}/approvals/${approvalId}/respond`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
              'X-Tenant-Id': credentials.tenantId,
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}
