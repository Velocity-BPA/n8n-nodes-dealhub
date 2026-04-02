/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-dealhub/blob/main/LICENSE
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

export class DealHub implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'DealHub',
    name: 'dealhub',
    icon: 'file:dealhub.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the DealHub API',
    defaults: {
      name: 'DealHub',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'dealhubApi',
        required: true,
      },
    ],
    properties: [
      // Resource selector
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Deal',
            value: 'deal',
          },
          {
            name: 'DealRoom',
            value: 'dealRoom',
          },
          {
            name: 'Product',
            value: 'product',
          },
          {
            name: 'Account',
            value: 'account',
          },
          {
            name: 'Contact',
            value: 'contact',
          },
          {
            name: 'Template',
            value: 'template',
          },
          {
            name: 'Quotes',
            value: 'quotes',
          },
          {
            name: 'DealRooms',
            value: 'dealRooms',
          },
          {
            name: 'Products',
            value: 'products',
          },
          {
            name: 'Contacts',
            value: 'contacts',
          },
          {
            name: 'Integrations',
            value: 'integrations',
          },
          {
            name: 'Analytics',
            value: 'analytics',
          }
        ],
        default: 'deal',
      },
      // Operation dropdowns per resource
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['deal'] } },
	options: [
		{ name: 'Get All', value: 'getAll', description: 'Retrieve all deals', action: 'Get all deals' },
		{ name: 'Get', value: 'get', description: 'Retrieve a specific deal', action: 'Get a deal' },
		{ name: 'Create', value: 'create', description: 'Create a new deal', action: 'Create a deal' },
		{ name: 'Update', value: 'update', description: 'Update an existing deal', action: 'Update a deal' },
		{ name: 'Delete', value: 'delete', description: 'Delete a deal', action: 'Delete a deal' },
		{ name: 'Send', value: 'send', description: 'Send a deal to recipients', action: 'Send a deal' },
		{ name: 'Get Status', value: 'getStatus', description: 'Get deal status and engagement metrics', action: 'Get deal status' },
	],
	default: 'getAll',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['dealRoom'],
		},
	},
	options: [
		{
			name: 'Get All Deal Rooms',
			value: 'getAll',
			description: 'Retrieve all deal rooms',
			action: 'Get all deal rooms',
		},
		{
			name: 'Get Deal Room',
			value: 'get',
			description: 'Retrieve a specific deal room',
			action: 'Get a deal room',
		},
		{
			name: 'Create Deal Room',
			value: 'create',
			description: 'Create a new deal room',
			action: 'Create a deal room',
		},
		{
			name: 'Update Deal Room',
			value: 'update',
			description: 'Update deal room settings',
			action: 'Update a deal room',
		},
		{
			name: 'Delete Deal Room',
			value: 'delete',
			description: 'Delete a deal room',
			action: 'Delete a deal room',
		},
		{
			name: 'Get Activity',
			value: 'getActivity',
			description: 'Get deal room activity and engagement',
			action: 'Get deal room activity',
		},
		{
			name: 'Invite Participants',
			value: 'invite',
			description: 'Invite participants to deal room',
			action: 'Invite participants to deal room',
		},
	],
	default: 'getAll',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['product'] } },
  options: [
    { name: 'Get All', value: 'getAll', description: 'Retrieve all products', action: 'Get all products' },
    { name: 'Get', value: 'get', description: 'Retrieve a specific product', action: 'Get a product' },
    { name: 'Create', value: 'create', description: 'Create a new product', action: 'Create a product' },
    { name: 'Update', value: 'update', description: 'Update product information', action: 'Update a product' },
    { name: 'Delete', value: 'delete', description: 'Delete a product', action: 'Delete a product' },
    { name: 'Get Pricing', value: 'getPricing', description: 'Get product pricing tiers', action: 'Get product pricing' },
    { name: 'Update Pricing', value: 'updatePricing', description: 'Update product pricing', action: 'Update product pricing' },
  ],
  default: 'getAll',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['account'] } },
	options: [
		{ name: 'Get All', value: 'getAll', description: 'Retrieve all accounts', action: 'Get all accounts' },
		{ name: 'Get', value: 'get', description: 'Retrieve a specific account', action: 'Get an account' },
		{ name: 'Create', value: 'create', description: 'Create a new account', action: 'Create an account' },
		{ name: 'Update', value: 'update', description: 'Update account information', action: 'Update an account' },
		{ name: 'Delete', value: 'delete', description: 'Delete an account', action: 'Delete an account' },
		{ name: 'Get Contacts', value: 'getContacts', description: 'Get contacts for an account', action: 'Get account contacts' },
		{ name: 'Get Deals', value: 'getDeals', description: 'Get deals associated with account', action: 'Get account deals' },
	],
	default: 'getAll',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['contact'],
		},
	},
	options: [
		{
			name: 'Create',
			value: 'create',
			description: 'Create a new contact',
			action: 'Create a contact',
		},
		{
			name: 'Delete',
			value: 'delete',
			description: 'Delete a contact',
			action: 'Delete a contact',
		},
		{
			name: 'Get',
			value: 'get',
			description: 'Retrieve a specific contact',
			action: 'Get a contact',
		},
		{
			name: 'Get Activity',
			value: 'getActivity',
			description: 'Get contact engagement activity',
			action: 'Get contact activity',
		},
		{
			name: 'Get All',
			value: 'getAll',
			description: 'Retrieve all contacts',
			action: 'Get all contacts',
		},
		{
			name: 'Update',
			value: 'update',
			description: 'Update contact information',
			action: 'Update a contact',
		},
	],
	default: 'getAll',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['template'] } },
  options: [
    { name: 'Get All Templates', value: 'getAll', description: 'Retrieve all templates', action: 'Get all templates' },
    { name: 'Get Template', value: 'get', description: 'Retrieve a specific template', action: 'Get a template' },
    { name: 'Create Template', value: 'create', description: 'Create a new template', action: 'Create a template' },
    { name: 'Update Template', value: 'update', description: 'Update template content', action: 'Update a template' },
    { name: 'Delete Template', value: 'delete', description: 'Delete a template', action: 'Delete a template' },
    { name: 'Clone Template', value: 'clone', description: 'Clone an existing template', action: 'Clone a template' },
  ],
  default: 'getAll',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['quotes'],
    },
  },
  options: [
    {
      name: 'Create',
      value: 'create',
      description: 'Create a new quote',
      action: 'Create a quote',
    },
    {
      name: 'Get',
      value: 'get',
      description: 'Retrieve a specific quote',
      action: 'Get a quote',
    },
    {
      name: 'Get All',
      value: 'getAll',
      description: 'List all quotes with filtering',
      action: 'Get all quotes',
    },
    {
      name: 'Update',
      value: 'update',
      description: 'Update quote details',
      action: 'Update a quote',
    },
    {
      name: 'Delete',
      value: 'delete',
      description: 'Delete a quote',
      action: 'Delete a quote',
    },
    {
      name: 'Send',
      value: 'send',
      description: 'Send quote to customer',
      action: 'Send a quote',
    },
    {
      name: 'Approve',
      value: 'approve',
      description: 'Approve quote for customer acceptance',
      action: 'Approve a quote',
    },
    {
      name: 'Get Analytics',
      value: 'getAnalytics',
      description: 'Get quote performance metrics',
      action: 'Get quote analytics',
    },
  ],
  default: 'create',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['dealRooms'],
    },
  },
  options: [
    {
      name: 'Create',
      value: 'create',
      description: 'Create a new DealRoom',
      action: 'Create a DealRoom',
    },
    {
      name: 'Get',
      value: 'get',
      description: 'Retrieve DealRoom details',
      action: 'Get a DealRoom',
    },
    {
      name: 'Get All',
      value: 'getAll',
      description: 'List all DealRooms',
      action: 'Get all DealRooms',
    },
    {
      name: 'Update',
      value: 'update',
      description: 'Update DealRoom settings',
      action: 'Update a DealRoom',
    },
    {
      name: 'Delete',
      value: 'delete',
      description: 'Delete a DealRoom',
      action: 'Delete a DealRoom',
    },
    {
      name: 'Add Member',
      value: 'addMember',
      description: 'Add member to DealRoom',
      action: 'Add member to DealRoom',
    },
    {
      name: 'Remove Member',
      value: 'removeMember',
      description: 'Remove member from DealRoom',
      action: 'Remove member from DealRoom',
    },
    {
      name: 'Get Activity',
      value: 'getActivity',
      description: 'Get DealRoom activity feed',
      action: 'Get DealRoom activity',
    },
  ],
  default: 'create',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['products'],
    },
  },
  options: [
    {
      name: 'Create Product',
      value: 'create',
      description: 'Create a new product',
      action: 'Create a product',
    },
    {
      name: 'Get Product',
      value: 'get',
      description: 'Retrieve product details',
      action: 'Get a product',
    },
    {
      name: 'Get All Products',
      value: 'getAll',
      description: 'List all products with filtering',
      action: 'Get all products',
    },
    {
      name: 'Update Product',
      value: 'update',
      description: 'Update product information',
      action: 'Update a product',
    },
    {
      name: 'Delete Product',
      value: 'delete',
      description: 'Delete a product',
      action: 'Delete a product',
    },
    {
      name: 'Create Configuration',
      value: 'createConfiguration',
      description: 'Add product configuration',
      action: 'Create a product configuration',
    },
    {
      name: 'Get Configurations',
      value: 'getConfigurations',
      description: 'List product configurations',
      action: 'Get product configurations',
    },
    {
      name: 'Bulk Update',
      value: 'bulkUpdate',
      description: 'Bulk update multiple products',
      action: 'Bulk update products',
    },
  ],
  default: 'create',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['contacts'],
    },
  },
  options: [
    {
      name: 'Create',
      value: 'create',
      description: 'Create a new contact',
      action: 'Create contact',
    },
    {
      name: 'Get',
      value: 'get',
      description: 'Retrieve contact details',
      action: 'Get contact',
    },
    {
      name: 'Get All',
      value: 'getAll',
      description: 'List all contacts with filtering',
      action: 'Get all contacts',
    },
    {
      name: 'Update',
      value: 'update',
      description: 'Update contact information',
      action: 'Update contact',
    },
    {
      name: 'Delete',
      value: 'delete',
      description: 'Delete a contact',
      action: 'Delete contact',
    },
    {
      name: 'Add Note',
      value: 'addNote',
      description: 'Add note to contact',
      action: 'Add note to contact',
    },
    {
      name: 'Get Quotes',
      value: 'getQuotes',
      description: 'Get quotes for contact',
      action: 'Get quotes for contact',
    },
    {
      name: 'Sync CRM',
      value: 'syncCRM',
      description: 'Sync contacts with external CRM',
      action: 'Sync contacts with CRM',
    },
  ],
  default: 'create',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['integrations'],
    },
  },
  options: [
    {
      name: 'Get All',
      value: 'getAll',
      description: 'List all available integrations',
      action: 'Get all integrations',
    },
    {
      name: 'Connect',
      value: 'connect',
      description: 'Connect to external CRM system',
      action: 'Connect integration',
    },
    {
      name: 'Update Configuration',
      value: 'updateConfig',
      description: 'Update integration configuration',
      action: 'Update integration configuration',
    },
    {
      name: 'Disconnect',
      value: 'disconnect',
      description: 'Disconnect from external system',
      action: 'Disconnect integration',
    },
    {
      name: 'Trigger Sync',
      value: 'triggerSync',
      description: 'Manually trigger data synchronization',
      action: 'Trigger integration sync',
    },
    {
      name: 'Get Status',
      value: 'getStatus',
      description: 'Get integration sync status',
      action: 'Get integration status',
    },
    {
      name: 'Get Logs',
      value: 'getLogs',
      description: 'Get integration sync logs',
      action: 'Get integration logs',
    },
  ],
  default: 'getAll',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['analytics'],
    },
  },
  options: [
    {
      name: 'Get Quote Analytics',
      value: 'getQuoteAnalytics',
      description: 'Get quote performance metrics',
      action: 'Get quote analytics',
    },
    {
      name: 'Get DealRoom Analytics',
      value: 'getDealRoomAnalytics',
      description: 'Get DealRoom engagement metrics',
      action: 'Get dealroom analytics',
    },
    {
      name: 'Get Product Analytics',
      value: 'getProductAnalytics',
      description: 'Get product performance data',
      action: 'Get product analytics',
    },
    {
      name: 'Get Pipeline Analytics',
      value: 'getPipelineAnalytics',
      description: 'Get sales pipeline metrics',
      action: 'Get pipeline analytics',
    },
    {
      name: 'Get Conversion Analytics',
      value: 'getConversionAnalytics',
      description: 'Get conversion rate analytics',
      action: 'Get conversion analytics',
    },
    {
      name: 'Get Revenue Analytics',
      value: 'getRevenueAnalytics',
      description: 'Get revenue and forecasting data',
      action: 'Get revenue analytics',
    },
  ],
  default: 'getQuoteAnalytics',
},
{
	displayName: 'Status',
	name: 'status',
	type: 'string',
	default: '',
	description: 'Filter deals by status',
	displayOptions: { show: { resource: ['deal'], operation: ['getAll'] } },
},
{
	displayName: 'Owner ID',
	name: 'owner_id',
	type: 'string',
	default: '',
	description: 'Filter deals by owner ID',
	displayOptions: { show: { resource: ['deal'], operation: ['getAll'] } },
},
{
	displayName: 'Created After',
	name: 'created_after',
	type: 'dateTime',
	default: '',
	description: 'Filter deals created after this date',
	displayOptions: { show: { resource: ['deal'], operation: ['getAll'] } },
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	default: 50,
	description: 'Number of deals to return',
	displayOptions: { show: { resource: ['deal'], operation: ['getAll'] } },
},
{
	displayName: 'Offset',
	name: 'offset',
	type: 'number',
	default: 0,
	description: 'Number of deals to skip',
	displayOptions: { show: { resource: ['deal'], operation: ['getAll'] } },
},
{
	displayName: 'Deal ID',
	name: 'deal_id',
	type: 'string',
	required: true,
	default: '',
	description: 'The ID of the deal',
	displayOptions: { show: { resource: ['deal'], operation: ['get', 'update', 'delete', 'send', 'getStatus'] } },
},
{
	displayName: 'Name',
	name: 'name',
	type: 'string',
	required: true,
	default: '',
	description: 'The name of the deal',
	displayOptions: { show: { resource: ['deal'], operation: ['create'] } },
},
{
	displayName: 'Name',
	name: 'name',
	type: 'string',
	default: '',
	description: 'The name of the deal',
	displayOptions: { show: { resource: ['deal'], operation: ['update'] } },
},
{
	displayName: 'Description',
	name: 'description',
	type: 'string',
	default: '',
	description: 'The description of the deal',
	displayOptions: { show: { resource: ['deal'], operation: ['create', 'update'] } },
},
{
	displayName: 'Owner ID',
	name: 'owner_id',
	type: 'string',
	required: true,
	default: '',
	description: 'The ID of the deal owner',
	displayOptions: { show: { resource: ['deal'], operation: ['create'] } },
},
{
	displayName: 'Account ID',
	name: 'account_id',
	type: 'string',
	required: true,
	default: '',
	description: 'The ID of the associated account',
	displayOptions: { show: { resource: ['deal'], operation: ['create'] } },
},
{
	displayName: 'Amount',
	name: 'amount',
	type: 'number',
	default: 0,
	description: 'The deal amount',
	displayOptions: { show: { resource: ['deal'], operation: ['create', 'update'] } },
},
{
	displayName: 'Stage',
	name: 'stage',
	type: 'string',
	default: '',
	description: 'The deal stage',
	displayOptions: { show: { resource: ['deal'], operation: ['create', 'update'] } },
},
{
	displayName: 'Recipients',
	name: 'recipients',
	type: 'string',
	required: true,
	default: '',
	description: 'Comma-separated list of recipient email addresses',
	displayOptions: { show: { resource: ['deal'], operation: ['send'] } },
},
{
	displayName: 'Message',
	name: 'message',
	type: 'string',
	default: '',
	description: 'Optional message to include when sending the deal',
	displayOptions: { show: { resource: ['deal'], operation: ['send'] } },
},
{
	displayName: 'Deal ID',
	name: 'dealId',
	type: 'string',
	required: false,
	displayOptions: {
		show: {
			resource: ['dealRoom'],
			operation: ['getAll'],
		},
	},
	default: '',
	description: 'Filter deal rooms by deal ID',
},
{
	displayName: 'Status',
	name: 'status',
	type: 'options',
	options: [
		{ name: 'Active', value: 'active' },
		{ name: 'Inactive', value: 'inactive' },
		{ name: 'Pending', value: 'pending' },
	],
	required: false,
	displayOptions: {
		show: {
			resource: ['dealRoom'],
			operation: ['getAll'],
		},
	},
	default: '',
	description: 'Filter deal rooms by status',
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	required: false,
	displayOptions: {
		show: {
			resource: ['dealRoom'],
			operation: ['getAll'],
		},
	},
	default: 50,
	description: 'Number of results to return',
},
{
	displayName: 'Offset',
	name: 'offset',
	type: 'number',
	required: false,
	displayOptions: {
		show: {
			resource: ['dealRoom'],
			operation: ['getAll'],
		},
	},
	default: 0,
	description: 'Number of results to skip',
},
{
	displayName: 'Deal Room ID',
	name: 'dealroomId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['dealRoom'],
			operation: ['get', 'update', 'delete', 'getActivity', 'invite'],
		},
	},
	default: '',
	description: 'The ID of the deal room',
},
{
	displayName: 'Deal ID',
	name: 'dealId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['dealRoom'],
			operation: ['create'],
		},
	},
	default: '',
	description: 'The ID of the deal this room belongs to',
},
{
	displayName: 'Name',
	name: 'name',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['dealRoom'],
			operation: ['create', 'update'],
		},
	},
	default: '',
	description: 'Name of the deal room',
},
{
	displayName: 'Description',
	name: 'description',
	type: 'string',
	required: false,
	displayOptions: {
		show: {
			resource: ['dealRoom'],
			operation: ['create', 'update'],
		},
	},
	default: '',
	description: 'Description of the deal room',
},
{
	displayName: 'Participants',
	name: 'participants',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['dealRoom'],
			operation: ['create', 'invite'],
		},
	},
	default: '',
	description: 'Comma-separated list of participant email addresses',
},
{
	displayName: 'Date From',
	name: 'dateFrom',
	type: 'dateTime',
	required: false,
	displayOptions: {
		show: {
			resource: ['dealRoom'],
			operation: ['getActivity'],
		},
	},
	default: '',
	description: 'Start date for activity filter',
},
{
	displayName: 'Date To',
	name: 'dateTo',
	type: 'dateTime',
	required: false,
	displayOptions: {
		show: {
			resource: ['dealRoom'],
			operation: ['getActivity'],
		},
	},
	default: '',
	description: 'End date for activity filter',
},
{
  displayName: 'Category',
  name: 'category',
  type: 'string',
  default: '',
  description: 'Filter products by category',
  displayOptions: { show: { resource: ['product'], operation: ['getAll'] } },
},
{
  displayName: 'Active',
  name: 'active',
  type: 'boolean',
  default: true,
  description: 'Filter by active status',
  displayOptions: { show: { resource: ['product'], operation: ['getAll'] } },
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  default: 50,
  description: 'Maximum number of products to return',
  displayOptions: { show: { resource: ['product'], operation: ['getAll'] } },
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  default: 0,
  description: 'Number of products to skip',
  displayOptions: { show: { resource: ['product'], operation: ['getAll'] } },
},
{
  displayName: 'Product ID',
  name: 'productId',
  type: 'string',
  required: true,
  default: '',
  description: 'The ID of the product',
  displayOptions: { show: { resource: ['product'], operation: ['get', 'update', 'delete', 'getPricing', 'updatePricing'] } },
},
{
  displayName: 'Name',
  name: 'name',
  type: 'string',
  required: true,
  default: '',
  description: 'Product name',
  displayOptions: { show: { resource: ['product'], operation: ['create'] } },
},
{
  displayName: 'Name',
  name: 'name',
  type: 'string',
  default: '',
  description: 'Product name',
  displayOptions: { show: { resource: ['product'], operation: ['update'] } },
},
{
  displayName: 'Description',
  name: 'description',
  type: 'string',
  default: '',
  description: 'Product description',
  displayOptions: { show: { resource: ['product'], operation: ['create', 'update'] } },
},
{
  displayName: 'Price',
  name: 'price',
  type: 'number',
  default: 0,
  description: 'Product price',
  displayOptions: { show: { resource: ['product'], operation: ['create', 'update'] } },
},
{
  displayName: 'Category',
  name: 'category',
  type: 'string',
  default: '',
  description: 'Product category',
  displayOptions: { show: { resource: ['product'], operation: ['create', 'update'] } },
},
{
  displayName: 'SKU',
  name: 'sku',
  type: 'string',
  required: true,
  default: '',
  description: 'Product SKU',
  displayOptions: { show: { resource: ['product'], operation: ['create'] } },
},
{
  displayName: 'Tier',
  name: 'tier',
  type: 'string',
  default: '',
  description: 'Pricing tier to filter by',
  displayOptions: { show: { resource: ['product'], operation: ['getPricing'] } },
},
{
  displayName: 'Pricing Data',
  name: 'pricingData',
  type: 'json',
  required: true,
  default: '{}',
  description: 'Pricing information as JSON object',
  displayOptions: { show: { resource: ['product'], operation: ['updatePricing'] } },
},
{
	displayName: 'Owner ID',
	name: 'ownerId',
	type: 'string',
	default: '',
	description: 'Filter accounts by owner ID',
	displayOptions: { show: { resource: ['account'], operation: ['getAll'] } },
},
{
	displayName: 'Type',
	name: 'type',
	type: 'string',
	default: '',
	description: 'Filter accounts by type',
	displayOptions: { show: { resource: ['account'], operation: ['getAll'] } },
},
{
	displayName: 'Created After',
	name: 'createdAfter',
	type: 'dateTime',
	default: '',
	description: 'Filter accounts created after this date',
	displayOptions: { show: { resource: ['account'], operation: ['getAll'] } },
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	default: 50,
	description: 'Number of results to return',
	displayOptions: { show: { resource: ['account'], operation: ['getAll'] } },
},
{
	displayName: 'Offset',
	name: 'offset',
	type: 'number',
	default: 0,
	description: 'Number of results to skip',
	displayOptions: { show: { resource: ['account'], operation: ['getAll'] } },
},
{
	displayName: 'Account ID',
	name: 'accountId',
	type: 'string',
	required: true,
	default: '',
	description: 'The ID of the account',
	displayOptions: { show: { resource: ['account'], operation: ['get', 'update', 'delete', 'getContacts', 'getDeals'] } },
},
{
	displayName: 'Name',
	name: 'name',
	type: 'string',
	required: true,
	default: '',
	description: 'The name of the account',
	displayOptions: { show: { resource: ['account'], operation: ['create'] } },
},
{
	displayName: 'Name',
	name: 'name',
	type: 'string',
	default: '',
	description: 'The name of the account',
	displayOptions: { show: { resource: ['account'], operation: ['update'] } },
},
{
	displayName: 'Domain',
	name: 'domain',
	type: 'string',
	default: '',
	description: 'The domain of the account',
	displayOptions: { show: { resource: ['account'], operation: ['create'] } },
},
{
	displayName: 'Industry',
	name: 'industry',
	type: 'string',
	default: '',
	description: 'The industry of the account',
	displayOptions: { show: { resource: ['account'], operation: ['create', 'update'] } },
},
{
	displayName: 'Owner ID',
	name: 'ownerId',
	type: 'string',
	default: '',
	description: 'The owner ID of the account',
	displayOptions: { show: { resource: ['account'], operation: ['create'] } },
},
{
	displayName: 'Billing Address',
	name: 'billingAddress',
	type: 'string',
	default: '',
	description: 'The billing address of the account',
	displayOptions: { show: { resource: ['account'], operation: ['create', 'update'] } },
},
{
	displayName: 'Status',
	name: 'status',
	type: 'string',
	default: '',
	description: 'Filter deals by status',
	displayOptions: { show: { resource: ['account'], operation: ['getDeals'] } },
},
{
	displayName: 'Contact ID',
	name: 'contactId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['contact'],
			operation: ['get', 'update', 'delete', 'getActivity'],
		},
	},
	default: '',
	description: 'The ID of the contact',
},
{
	displayName: 'First Name',
	name: 'firstName',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['contact'],
			operation: ['create'],
		},
	},
	default: '',
	description: 'First name of the contact',
},
{
	displayName: 'Last Name',
	name: 'lastName',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['contact'],
			operation: ['create'],
		},
	},
	default: '',
	description: 'Last name of the contact',
},
{
	displayName: 'Email',
	name: 'email',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['contact'],
			operation: ['create'],
		},
	},
	default: '',
	description: 'Email address of the contact',
},
{
	displayName: 'Account ID',
	name: 'accountId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['contact'],
			operation: ['create'],
		},
	},
	default: '',
	description: 'The account ID to associate with the contact',
},
{
	displayName: 'Phone',
	name: 'phone',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['contact'],
			operation: ['create', 'update'],
		},
	},
	default: '',
	description: 'Phone number of the contact',
},
{
	displayName: 'Title',
	name: 'title',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['contact'],
			operation: ['create', 'update'],
		},
	},
	default: '',
	description: 'Job title of the contact',
},
{
	displayName: 'First Name',
	name: 'firstName',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['contact'],
			operation: ['update'],
		},
	},
	default: '',
	description: 'First name of the contact',
},
{
	displayName: 'Last Name',
	name: 'lastName',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['contact'],
			operation: ['update'],
		},
	},
	default: '',
	description: 'Last name of the contact',
},
{
	displayName: 'Email',
	name: 'email',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['contact'],
			operation: ['update', 'getAll'],
		},
	},
	default: '',
	description: 'Email address of the contact',
},
{
	displayName: 'Account ID',
	name: 'accountId',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['contact'],
			operation: ['getAll'],
		},
	},
	default: '',
	description: 'Filter contacts by account ID',
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['contact'],
			operation: ['getAll'],
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
			resource: ['contact'],
			operation: ['getAll'],
		},
	},
	default: 0,
	description: 'Number of results to skip',
},
{
	displayName: 'Date From',
	name: 'dateFrom',
	type: 'dateTime',
	displayOptions: {
		show: {
			resource: ['contact'],
			operation: ['getActivity'],
		},
	},
	default: '',
	description: 'Start date for activity filter',
},
{
	displayName: 'Date To',
	name: 'dateTo',
	type: 'dateTime',
	displayOptions: {
		show: {
			resource: ['contact'],
			operation: ['getActivity'],
		},
	},
	default: '',
	description: 'End date for activity filter',
},
{
  displayName: 'Template Type',
  name: 'type',
  type: 'string',
  default: '',
  description: 'Filter templates by type',
  displayOptions: {
    show: {
      resource: ['template'],
      operation: ['getAll'],
    },
  },
},
{
  displayName: 'Category',
  name: 'category',
  type: 'string',
  default: '',
  description: 'Filter templates by category',
  displayOptions: {
    show: {
      resource: ['template'],
      operation: ['getAll'],
    },
  },
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  typeOptions: {
    minValue: 1,
  },
  default: 50,
  description: 'Maximum number of results to return',
  displayOptions: {
    show: {
      resource: ['template'],
      operation: ['getAll'],
    },
  },
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  typeOptions: {
    minValue: 0,
  },
  default: 0,
  description: 'Number of results to skip',
  displayOptions: {
    show: {
      resource: ['template'],
      operation: ['getAll'],
    },
  },
},
{
  displayName: 'Template ID',
  name: 'templateId',
  type: 'string',
  required: true,
  default: '',
  description: 'The ID of the template',
  displayOptions: {
    show: {
      resource: ['template'],
      operation: ['get', 'update', 'delete', 'clone'],
    },
  },
},
{
  displayName: 'Name',
  name: 'name',
  type: 'string',
  required: true,
  default: '',
  description: 'The name of the template',
  displayOptions: {
    show: {
      resource: ['template'],
      operation: ['create'],
    },
  },
},
{
  displayName: 'Name',
  name: 'name',
  type: 'string',
  default: '',
  description: 'The name of the template',
  displayOptions: {
    show: {
      resource: ['template'],
      operation: ['update'],
    },
  },
},
{
  displayName: 'Type',
  name: 'type',
  type: 'string',
  required: true,
  default: '',
  description: 'The type of the template',
  displayOptions: {
    show: {
      resource: ['template'],
      operation: ['create'],
    },
  },
},
{
  displayName: 'Content',
  name: 'content',
  type: 'string',
  typeOptions: {
    alwaysOpenEditWindow: true,
  },
  required: true,
  default: '',
  description: 'The content of the template',
  displayOptions: {
    show: {
      resource: ['template'],
      operation: ['create'],
    },
  },
},
{
  displayName: 'Content',
  name: 'content',
  type: 'string',
  typeOptions: {
    alwaysOpenEditWindow: true,
  },
  default: '',
  description: 'The content of the template',
  displayOptions: {
    show: {
      resource: ['template'],
      operation: ['update'],
    },
  },
},
{
  displayName: 'Category',
  name: 'category',
  type: 'string',
  required: true,
  default: '',
  description: 'The category of the template',
  displayOptions: {
    show: {
      resource: ['template'],
      operation: ['create'],
    },
  },
},
{
  displayName: 'Category',
  name: 'category',
  type: 'string',
  default: '',
  description: 'The category of the template',
  displayOptions: {
    show: {
      resource: ['template'],
      operation: ['update'],
    },
  },
},
{
  displayName: 'New Name',
  name: 'newName',
  type: 'string',
  required: true,
  default: '',
  description: 'The name for the cloned template',
  displayOptions: {
    show: {
      resource: ['template'],
      operation: ['clone'],
    },
  },
},
{
  displayName: 'Name',
  name: 'name',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['quotes'],
      operation: ['create'],
    },
  },
  default: '',
  description: 'Name of the quote',
},
{
  displayName: 'Template ID',
  name: 'templateId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['quotes'],
      operation: ['create'],
    },
  },
  default: '',
  description: 'ID of the template to use for the quote',
},
{
  displayName: 'Contact ID',
  name: 'contactId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['quotes'],
      operation: ['create'],
    },
  },
  default: '',
  description: 'ID of the contact for the quote',
},
{
  displayName: 'Products',
  name: 'products',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['quotes'],
      operation: ['create'],
    },
  },
  default: '[]',
  description: 'Array of products to include in the quote',
},
{
  displayName: 'Quote ID',
  name: 'id',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['quotes'],
      operation: ['get', 'update', 'delete', 'send', 'approve', 'getAnalytics'],
    },
  },
  default: '',
  description: 'The ID of the quote',
},
{
  displayName: 'Status',
  name: 'status',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['quotes'],
      operation: ['getAll'],
    },
  },
  options: [
    {
      name: 'Draft',
      value: 'draft',
    },
    {
      name: 'Sent',
      value: 'sent',
    },
    {
      name: 'Approved',
      value: 'approved',
    },
    {
      name: 'Rejected',
      value: 'rejected',
    },
    {
      name: 'Expired',
      value: 'expired',
    },
  ],
  default: '',
  description: 'Filter quotes by status',
},
{
  displayName: 'Contact ID',
  name: 'contactId',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['quotes'],
      operation: ['getAll'],
    },
  },
  default: '',
  description: 'Filter quotes by contact ID',
},
{
  displayName: 'Date From',
  name: 'dateFrom',
  type: 'dateTime',
  displayOptions: {
    show: {
      resource: ['quotes'],
      operation: ['getAll'],
    },
  },
  default: '',
  description: 'Filter quotes from this date',
},
{
  displayName: 'Date To',
  name: 'dateTo',
  type: 'dateTime',
  displayOptions: {
    show: {
      resource: ['quotes'],
      operation: ['getAll'],
    },
  },
  default: '',
  description: 'Filter quotes until this date',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['quotes'],
      operation: ['getAll'],
    },
  },
  default: 50,
  description: 'Number of quotes to return',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['quotes'],
      operation: ['getAll'],
    },
  },
  default: 0,
  description: 'Number of quotes to skip',
},
{
  displayName: 'Name',
  name: 'name',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['quotes'],
      operation: ['update'],
    },
  },
  default: '',
  description: 'Updated name for the quote',
},
{
  displayName: 'Status',
  name: 'status',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['quotes'],
      operation: ['update'],
    },
  },
  options: [
    {
      name: 'Draft',
      value: 'draft',
    },
    {
      name: 'Sent',
      value: 'sent',
    },
    {
      name: 'Approved',
      value: 'approved',
    },
    {
      name: 'Rejected',
      value: 'rejected',
    },
    {
      name: 'Expired',
      value: 'expired',
    },
  ],
  default: '',
  description: 'Updated status for the quote',
},
{
  displayName: 'Products',
  name: 'products',
  type: 'json',
  displayOptions: {
    show: {
      resource: ['quotes'],
      operation: ['update'],
    },
  },
  default: '[]',
  description: 'Updated array of products for the quote',
},
{
  displayName: 'Email',
  name: 'email',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['quotes'],
      operation: ['send'],
    },
  },
  default: '',
  description: 'Email address to send the quote to',
},
{
  displayName: 'Message',
  name: 'message',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['quotes'],
      operation: ['send'],
    },
  },
  default: '',
  description: 'Custom message to include with the quote',
},
{
  displayName: 'DealRoom Name',
  name: 'name',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['dealRooms'],
      operation: ['create'],
    },
  },
  default: '',
  description: 'The name of the DealRoom',
},
{
  displayName: 'Quote ID',
  name: 'quoteId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['dealRooms'],
      operation: ['create'],
    },
  },
  default: '',
  description: 'The ID of the quote to associate with this DealRoom',
},
{
  displayName: 'Template',
  name: 'template',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['dealRooms'],
      operation: ['create'],
    },
  },
  default: '',
  description: 'Template to use for creating the DealRoom',
},
{
  displayName: 'Members',
  name: 'members',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['dealRooms'],
      operation: ['create', 'update'],
    },
  },
  default: '',
  description: 'Comma-separated list of member emails to add to the DealRoom',
},
{
  displayName: 'DealRoom ID',
  name: 'dealRoomId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['dealRooms'],
      operation: ['get', 'update', 'delete', 'addMember', 'removeMember', 'getActivity'],
    },
  },
  default: '',
  description: 'The ID of the DealRoom',
},
{
  displayName: 'Status',
  name: 'status',
  type: 'options',
  options: [
    {
      name: 'Active',
      value: 'active',
    },
    {
      name: 'Inactive',
      value: 'inactive',
    },
    {
      name: 'Archived',
      value: 'archived',
    },
  ],
  required: false,
  displayOptions: {
    show: {
      resource: ['dealRooms'],
      operation: ['getAll', 'update'],
    },
  },
  default: '',
  description: 'Filter by DealRoom status or set new status',
},
{
  displayName: 'Owner ID',
  name: 'ownerId',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['dealRooms'],
      operation: ['getAll'],
    },
  },
  default: '',
  description: 'Filter DealRooms by owner ID',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['dealRooms'],
      operation: ['getAll', 'getActivity'],
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
      resource: ['dealRooms'],
      operation: ['getAll', 'getActivity'],
    },
  },
  default: 0,
  description: 'Number of results to skip',
},
{
  displayName: 'DealRoom Name',
  name: 'name',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['dealRooms'],
      operation: ['update'],
    },
  },
  default: '',
  description: 'New name for the DealRoom',
},
{
  displayName: 'Member Email',
  name: 'email',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['dealRooms'],
      operation: ['addMember'],
    },
  },
  default: '',
  description: 'Email address of the member to add',
},
{
  displayName: 'Member Role',
  name: 'role',
  type: 'options',
  options: [
    {
      name: 'Admin',
      value: 'admin',
    },
    {
      name: 'Editor',
      value: 'editor',
    },
    {
      name: 'Viewer',
      value: 'viewer',
    },
  ],
  required: true,
  displayOptions: {
    show: {
      resource: ['dealRooms'],
      operation: ['addMember'],
    },
  },
  default: 'viewer',
  description: 'Role to assign to the new member',
},
{
  displayName: 'Member ID',
  name: 'memberId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['dealRooms'],
      operation: ['removeMember'],
    },
  },
  default: '',
  description: 'ID of the member to remove',
},
{
  displayName: 'Product Name',
  name: 'name',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['products'],
      operation: ['create'],
    },
  },
  default: '',
  description: 'The name of the product',
},
{
  displayName: 'Description',
  name: 'description',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['products'],
      operation: ['create'],
    },
  },
  default: '',
  description: 'The description of the product',
},
{
  displayName: 'Price',
  name: 'price',
  type: 'number',
  required: true,
  displayOptions: {
    show: {
      resource: ['products'],
      operation: ['create'],
    },
  },
  default: 0,
  description: 'The price of the product',
},
{
  displayName: 'Category',
  name: 'category',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['products'],
      operation: ['create'],
    },
  },
  default: '',
  description: 'The category of the product',
},
{
  displayName: 'Product ID',
  name: 'id',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['products'],
      operation: ['get', 'update', 'delete', 'createConfiguration', 'getConfigurations'],
    },
  },
  default: '',
  description: 'The ID of the product',
},
{
  displayName: 'Category Filter',
  name: 'category',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['products'],
      operation: ['getAll'],
    },
  },
  default: '',
  description: 'Filter products by category',
},
{
  displayName: 'Status Filter',
  name: 'status',
  type: 'options',
  required: false,
  displayOptions: {
    show: {
      resource: ['products'],
      operation: ['getAll'],
    },
  },
  options: [
    {
      name: 'Active',
      value: 'active',
    },
    {
      name: 'Inactive',
      value: 'inactive',
    },
    {
      name: 'Draft',
      value: 'draft',
    },
  ],
  default: '',
  description: 'Filter products by status',
},
{
  displayName: 'Minimum Price',
  name: 'priceMin',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['products'],
      operation: ['getAll'],
    },
  },
  default: 0,
  description: 'Filter products by minimum price',
},
{
  displayName: 'Maximum Price',
  name: 'priceMax',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['products'],
      operation: ['getAll'],
    },
  },
  default: 0,
  description: 'Filter products by maximum price',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['products'],
      operation: ['getAll'],
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
      resource: ['products'],
      operation: ['getAll'],
    },
  },
  default: 0,
  description: 'Number of results to skip',
},
{
  displayName: 'Product Name',
  name: 'name',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['products'],
      operation: ['update'],
    },
  },
  default: '',
  description: 'The updated name of the product',
},
{
  displayName: 'Description',
  name: 'description',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['products'],
      operation: ['update'],
    },
  },
  default: '',
  description: 'The updated description of the product',
},
{
  displayName: 'Price',
  name: 'price',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['products'],
      operation: ['update'],
    },
  },
  default: 0,
  description: 'The updated price of the product',
},
{
  displayName: 'Status',
  name: 'status',
  type: 'options',
  required: false,
  displayOptions: {
    show: {
      resource: ['products'],
      operation: ['update'],
    },