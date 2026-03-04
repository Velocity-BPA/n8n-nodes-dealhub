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
        default: 'quotes',
      },
      // Operation dropdowns per resource
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
      // Parameter definitions
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
  default: 'active',
  description: 'The updated status of the product',
},
{
  displayName: 'Configuration Name',
  name: 'configurationName',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['products'],
      operation: ['createConfiguration'],
    },
  },
  default: '',
  description: 'The name of the configuration',
},
{
  displayName: 'Configuration Options',
  name: 'options',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['products'],
      operation: ['createConfiguration'],
    },
  },
  default: '{}',
  description: 'Configuration options as JSON',
},
{
  displayName: 'Configuration Pricing',
  name: 'pricing',
  type: 'json',
  required: false,
  displayOptions: {
    show: {
      resource: ['products'],
      operation: ['createConfiguration'],
    },
  },
  default: '{}',
  description: 'Configuration pricing details as JSON',
},
{
  displayName: 'Products Data',
  name: 'products',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['products'],
      operation: ['bulkUpdate'],
    },
  },
  default: '[]',
  description: 'Array of products to update as JSON',
},
{
  displayName: 'Bulk Operation',
  name: 'bulkOperation',
  type: 'options',
  required: true,
  displayOptions: {
    show: {
      resource: ['products'],
      operation: ['bulkUpdate'],
    },
  },
  options: [
    {
      name: 'Update',
      value: 'update',
    },
    {
      name: 'Activate',
      value: 'activate',
    },
    {
      name: 'Deactivate',
      value: 'deactivate',
    },
  ],
  default: 'update',
  description: 'The bulk operation to perform',
},
{
  displayName: 'Contact ID',
  name: 'contactId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['contacts'],
      operation: ['get', 'update', 'delete', 'addNote', 'getQuotes'],
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
      resource: ['contacts'],
      operation: ['create'],
    },
  },
  default: '',
  description: 'The first name of the contact',
},
{
  displayName: 'First Name',
  name: 'firstName',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['contacts'],
      operation: ['update'],
    },
  },
  default: '',
  description: 'The first name of the contact',
},
{
  displayName: 'Last Name',
  name: 'lastName',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['contacts'],
      operation: ['create'],
    },
  },
  default: '',
  description: 'The last name of the contact',
},
{
  displayName: 'Last Name',
  name: 'lastName',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['contacts'],
      operation: ['update'],
    },
  },
  default: '',
  description: 'The last name of the contact',
},
{
  displayName: 'Email',
  name: 'email',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['contacts'],
      operation: ['create'],
    },
  },
  default: '',
  description: 'The email address of the contact',
},
{
  displayName: 'Email',
  name: 'email',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['contacts'],
      operation: ['update'],
    },
  },
  default: '',
  description: 'The email address of the contact',
},
{
  displayName: 'Company',
  name: 'company',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['contacts'],
      operation: ['create'],
    },
  },
  default: '',
  description: 'The company name of the contact',
},
{
  displayName: 'Company',
  name: 'company',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['contacts'],
      operation: ['update', 'getAll'],
    },
  },
  default: '',
  description: 'The company name to filter by',
},
{
  displayName: 'Phone',
  name: 'phone',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['contacts'],
      operation: ['create'],
    },
  },
  default: '',
  description: 'The phone number of the contact',
},
{
  displayName: 'Status',
  name: 'status',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['contacts'],
      operation: ['getAll', 'getQuotes'],
    },
  },
  default: '',
  description: 'Filter by contact or quote status',
},
{
  displayName: 'Tag',
  name: 'tag',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['contacts'],
      operation: ['getAll'],
    },
  },
  default: '',
  description: 'Filter contacts by tag',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['contacts'],
      operation: ['getAll', 'getQuotes'],
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
      resource: ['contacts'],
      operation: ['getAll', 'getQuotes'],
    },
  },
  default: 0,
  description: 'Number of results to skip',
},
{
  displayName: 'Note',
  name: 'note',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['contacts'],
      operation: ['addNote'],
    },
  },
  default: '',
  description: 'The note content to add',
},
{
  displayName: 'Note Type',
  name: 'type',
  type: 'options',
  required: true,
  displayOptions: {
    show: {
      resource: ['contacts'],
      operation: ['addNote'],
    },
  },
  options: [
    {
      name: 'General',
      value: 'general',
    },
    {
      name: 'Follow Up',
      value: 'follow_up',
    },
    {
      name: 'Meeting',
      value: 'meeting',
    },
    {
      name: 'Call',
      value: 'call',
    },
  ],
  default: 'general',
  description: 'The type of note',
},
{
  displayName: 'CRM Type',
  name: 'crmType',
  type: 'options',
  required: true,
  displayOptions: {
    show: {
      resource: ['contacts'],
      operation: ['syncCRM'],
    },
  },
  options: [
    {
      name: 'Salesforce',
      value: 'salesforce',
    },
    {
      name: 'HubSpot',
      value: 'hubspot',
    },
    {
      name: 'Pipedrive',
      value: 'pipedrive',
    },
  ],
  default: 'salesforce',
  description: 'The type of CRM to sync with',
},
{
  displayName: 'Field Mapping',
  name: 'mapping',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['contacts'],
      operation: ['syncCRM'],
    },
  },
  default: '{}',
  description: 'JSON object mapping CRM fields to DealHub fields',
},
{
  displayName: 'Type',
  name: 'type',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['integrations'],
      operation: ['getAll'],
    },
  },
  options: [
    {
      name: 'All',
      value: '',
    },
    {
      name: 'Salesforce',
      value: 'salesforce',
    },
    {
      name: 'HubSpot',
      value: 'hubspot',
    },
    {
      name: 'Pipedrive',
      value: 'pipedrive',
    },
    {
      name: 'Zendesk',
      value: 'zendesk',
    },
  ],
  default: '',
  description: 'Filter integrations by type',
},
{
  displayName: 'Status',
  name: 'status',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['integrations'],
      operation: ['getAll'],
    },
  },
  options: [
    {
      name: 'All',
      value: '',
    },
    {
      name: 'Active',
      value: 'active',
    },
    {
      name: 'Inactive',
      value: 'inactive',
    },
    {
      name: 'Error',
      value: 'error',
    },
  ],
  default: '',
  description: 'Filter integrations by status',
},
{
  displayName: 'Integration Type',
  name: 'integrationType',
  type: 'options',
  required: true,
  displayOptions: {
    show: {
      resource: ['integrations'],
      operation: ['connect', 'updateConfig', 'disconnect', 'triggerSync', 'getStatus', 'getLogs'],
    },
  },
  options: [
    {
      name: 'Salesforce',
      value: 'salesforce',
    },
    {
      name: 'HubSpot',
      value: 'hubspot',
    },
    {
      name: 'Pipedrive',
      value: 'pipedrive',
    },
    {
      name: 'Zendesk',
      value: 'zendesk',
    },
  ],
  default: 'salesforce',
  description: 'The type of integration to work with',
},
{
  displayName: 'Credentials',
  name: 'credentials',
  type: 'fixedCollection',
  required: true,
  displayOptions: {
    show: {
      resource: ['integrations'],
      operation: ['connect'],
    },
  },
  typeOptions: {
    multipleValues: false,
  },
  options: [
    {
      displayName: 'Salesforce',
      name: 'salesforce',
      values: [
        {
          displayName: 'Username',
          name: 'username',
          type: 'string',
          default: '',
        },
        {
          displayName: 'Password',
          name: 'password',
          type: 'string',
          typeOptions: {
            password: true,
          },
          default: '',
        },
        {
          displayName: 'Security Token',
          name: 'securityToken',
          type: 'string',
          typeOptions: {
            password: true,
          },
          default: '',
        },
      ],
    },
    {
      displayName: 'HubSpot',
      name: 'hubspot',
      values: [
        {
          displayName: 'API Key',
          name: 'apiKey',
          type: 'string',
          typeOptions: {
            password: true,
          },
          default: '',
        },
      ],
    },
    {
      displayName: 'Pipedrive',
      name: 'pipedrive',
      values: [
        {
          displayName: 'API Token',
          name: 'apiToken',
          type: 'string',
          typeOptions: {
            password: true,
          },
          default: '',
        },
        {
          displayName: 'Company Domain',
          name: 'companyDomain',
          type: 'string',
          default: '',
        },
      ],
    },
  ],
  default: {},
  description: 'Credentials for the external system',
},
{
  displayName: 'Connection Settings',
  name: 'connectionSettings',
  type: 'collection',
  displayOptions: {
    show: {
      resource: ['integrations'],
      operation: ['connect'],
    },
  },
  placeholder: 'Add Setting',
  options: [
    {
      displayName: 'Sync Frequency',
      name: 'syncFrequency',
      type: 'options',
      options: [
        {
          name: 'Real-time',
          value: 'realtime',
        },
        {
          name: 'Every 15 minutes',
          value: '15min',
        },
        {
          name: 'Hourly',
          value: 'hourly',
        },
        {
          name: 'Daily',
          value: 'daily',
        },
      ],
      default: 'hourly',
    },
    {
      displayName: 'Auto Sync',
      name: 'autoSync',
      type: 'boolean',
      default: true,
    },
    {
      displayName: 'Sync Direction',
      name: 'syncDirection',
      type: 'options',
      options: [
        {
          name: 'Bidirectional',
          value: 'bidirectional',
        },
        {
          name: 'To DealHub',
          value: 'to_dealhub',
        },
        {
          name: 'From DealHub',
          value: 'from_dealhub',
        },
      ],
      default: 'bidirectional',
    },
  ],
  default: {},
},
{
  displayName: 'Configuration Settings',
  name: 'configSettings',
  type: 'collection',
  required: true,
  displayOptions: {
    show: {
      resource: ['integrations'],
      operation: ['updateConfig'],
    },
  },
  placeholder: 'Add Setting',
  options: [
    {
      displayName: 'Sync Frequency',
      name: 'syncFrequency',
      type: 'options',
      options: [
        {
          name: 'Real-time',
          value: 'realtime',
        },
        {
          name: 'Every 15 minutes',
          value: '15min',
        },
        {
          name: 'Hourly',
          value: 'hourly',
        },
        {
          name: 'Daily',
          value: 'daily',
        },
      ],
      default: 'hourly',
    },
    {
      displayName: 'Auto Sync',
      name: 'autoSync',
      type: 'boolean',
      default: true,
    },
    {
      displayName: 'Sync Direction',
      name: 'syncDirection',
      type: 'options',
      options: [
        {
          name: 'Bidirectional',
          value: 'bidirectional',
        },
        {
          name: 'To DealHub',
          value: 'to_dealhub',
        },
        {
          name: 'From DealHub',
          value: 'from_dealhub',
        },
      ],
      default: 'bidirectional',
    },
    {
      displayName: 'Webhook URL',
      name: 'webhookUrl',
      type: 'string',
      default: '',
    },
  ],
  default: {},
},
{
  displayName: 'Field Mapping',
  name: 'fieldMapping',
  type: 'fixedCollection',
  displayOptions: {
    show: {
      resource: ['integrations'],
      operation: ['updateConfig'],
    },
  },
  typeOptions: {
    multipleValues: true,
  },
  options: [
    {
      displayName: 'Mapping',
      name: 'mapping',
      values: [
        {
          displayName: 'DealHub Field',
          name: 'dealhubField',
          type: 'string',
          default: '',
        },
        {
          displayName: 'External Field',
          name: 'externalField',
          type: 'string',
          default: '',
        },
        {
          displayName: 'Sync Direction',
          name: 'direction',
          type: 'options',
          options: [
            {
              name: 'Bidirectional',
              value: 'bidirectional',
            },
            {
              name: 'To DealHub',
              value: 'to_dealhub',
            },
            {
              name: 'From DealHub',
              value: 'from_dealhub',
            },
          ],
          default: 'bidirectional',
        },
      ],
    },
  ],
  default: {},
},
{
  displayName: 'Sync Direction',
  name: 'syncDirection',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['integrations'],
      operation: ['triggerSync'],
    },
  },
  options: [
    {
      name: 'Bidirectional',
      value: 'bidirectional',
    },
    {
      name: 'To DealHub',
      value: 'to_dealhub',
    },
    {
      name: 'From DealHub',
      value: 'from_dealhub',
    },
  ],
  default: 'bidirectional',
  description: 'Direction of the synchronization',
},
{
  displayName: 'Entities',
  name: 'entities',
  type: 'multiOptions',
  displayOptions: {
    show: {
      resource: ['integrations'],
      operation: ['triggerSync'],
    },
  },
  options: [
    {
      name: 'Contacts',
      value: 'contacts',
    },
    {
      name: 'Companies',
      value: 'companies',
    },
    {
      name: 'Deals',
      value: 'deals',
    },
    {
      name: 'Products',
      value: 'products',
    },
    {
      name: 'Quotes',
      value: 'quotes',
    },
  ],
  default: ['contacts'],
  description: 'Types of entities to synchronize',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['integrations'],
      operation: ['getLogs'],
    },
  },
  typeOptions: {
    minValue: 1,
    maxValue: 1000,
  },
  default: 50,
  description: 'Maximum number of log entries to return',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['integrations'],
      operation: ['getLogs'],
    },
  },
  typeOptions: {
    minValue: 0,
  },
  default: 0,
  description: 'Number of log entries to skip',
},
{
  displayName: 'Date From',
  name: 'dateFrom',
  type: 'dateTime',
  required: true,
  displayOptions: {
    show: {
      resource: ['analytics'],
      operation: ['getQuoteAnalytics', 'getDealRoomAnalytics', 'getProductAnalytics', 'getPipelineAnalytics', 'getConversionAnalytics', 'getRevenueAnalytics'],
    },
  },
  default: '',
  description: 'Start date for analytics data',
},
{
  displayName: 'Date To',
  name: 'dateTo',
  type: 'dateTime',
  required: true,
  displayOptions: {
    show: {
      resource: ['analytics'],
      operation: ['getQuoteAnalytics', 'getDealRoomAnalytics', 'getProductAnalytics', 'getPipelineAnalytics', 'getConversionAnalytics', 'getRevenueAnalytics'],
    },
  },
  default: '',
  description: 'End date for analytics data',
},
{
  displayName: 'Group By',
  name: 'groupBy',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['analytics'],
      operation: ['getQuoteAnalytics'],
    },
  },
  options: [
    { name: 'Day', value: 'day' },
    { name: 'Week', value: 'week' },
    { name: 'Month', value: 'month' },
    { name: 'Quarter', value: 'quarter' },
  ],
  default: 'month',
  description: 'Time period to group analytics data by',
},
{
  displayName: 'Filters',
  name: 'filters',
  type: 'json',
  displayOptions: {
    show: {
      resource: ['analytics'],
      operation: ['getQuoteAnalytics'],
    },
  },
  default: '{}',
  description: 'Additional filters for quote analytics',
},
{
  displayName: 'DealRoom ID',
  name: 'dealRoomId',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['analytics'],
      operation: ['getDealRoomAnalytics'],
    },
  },
  default: '',
  description: 'ID of the specific DealRoom to analyze (optional)',
},
{
  displayName: 'Product ID',
  name: 'productId',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['analytics'],
      operation: ['getProductAnalytics'],
    },
  },
  default: '',
  description: 'ID of the specific product to analyze (optional)',
},
{
  displayName: 'Stage',
  name: 'stage',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['analytics'],
      operation: ['getPipelineAnalytics'],
    },
  },
  default: '',
  description: 'Specific pipeline stage to analyze (optional)',
},
{
  displayName: 'Funnel',
  name: 'funnel',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['analytics'],
      operation: ['getConversionAnalytics'],
    },
  },
  default: '',
  description: 'Specific funnel to analyze (optional)',
},
{
  displayName: 'Period',
  name: 'period',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['analytics'],
      operation: ['getRevenueAnalytics'],
    },
  },
  options: [
    { name: 'Daily', value: 'daily' },
    { name: 'Weekly', value: 'weekly' },
    { name: 'Monthly', value: 'monthly' },
    { name: 'Quarterly', value: 'quarterly' },
    { name: 'Yearly', value: 'yearly' },
  ],
  default: 'monthly',
  description: 'Time period for revenue analytics',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'quotes':
        return [await executeQuotesOperations.call(this, items)];
      case 'dealRooms':
        return [await executeDealRoomsOperations.call(this, items)];
      case 'products':
        return [await executeProductsOperations.call(this, items)];
      case 'contacts':
        return [await executeContactsOperations.call(this, items)];
      case 'integrations':
        return [await executeIntegrationsOperations.call(this, items)];
      case 'analytics':
        return [await executeAnalyticsOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeQuotesOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('dealhubApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'create': {
          const name = this.getNodeParameter('name', i) as string;
          const templateId = this.getNodeParameter('templateId', i) as string;
          const contactId = this.getNodeParameter('contactId', i) as string;
          const products = this.getNodeParameter('products', i) as any;

          const body: any = {
            name,
            templateId,
            contactId,
            products: typeof products === 'string' ? JSON.parse(products) : products,
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/quotes`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
              'X-Tenant-ID': credentials.tenantId || '',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'get': {
          const id = this.getNodeParameter('id', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/quotes/${id}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'X-Tenant-ID': credentials.tenantId || '',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAll': {
          const status = this.getNodeParameter('status', i) as string;
          const contactId = this.getNodeParameter('contactId', i) as string;
          const dateFrom = this.getNodeParameter('dateFrom', i) as string;
          const dateTo = this.getNodeParameter('dateTo', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;

          const params: any = {};
          if (status) params.status = status;
          if (contactId) params.contactId = contactId;
          if (dateFrom) params.dateFrom = dateFrom;
          if (dateTo) params.dateTo = dateTo;
          if (limit) params.limit = limit;
          if (offset) params.offset = offset;

          const queryString = new URLSearchParams(params).toString();
          const url = `${credentials.baseUrl}/quotes${queryString ? `?${queryString}` : ''}`;

          const options: any = {
            method: 'GET',
            url,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'X-Tenant-ID': credentials.tenantId || '',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'update': {
          const id = this.getNodeParameter('id', i) as string;
          const name = this.getNodeParameter('name', i) as string;
          const status = this.getNodeParameter('status', i) as string;
          const products = this.getNodeParameter('products', i) as any;

          const body: any = {};
          if (name) body.name = name;
          if (status) body.status = status;
          if (products) {
            body.products = typeof products === 'string' ? JSON.parse(products) : products;
          }

          const options: any = {
            method: 'PUT',
            url: `${credentials.baseUrl}/quotes/${id}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
              'X-Tenant-ID': credentials.tenantId || '',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'delete': {
          const id = this.getNodeParameter('id', i) as string;

          const options: any = {
            method: 'DELETE',
            url: `${credentials.baseUrl}/quotes/${id}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'X-Tenant-ID': credentials.tenantId || '',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'send': {
          const id = this.getNodeParameter('id', i) as string;
          const email = this.getNodeParameter('email', i) as string;
          const message = this.getNodeParameter('message', i) as string;

          const body: any = {
            email,
          };
          if (message) body.message = message;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/quotes/${id}/send`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
              'X-Tenant-ID': credentials.tenantId || '',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'approve': {
          const id = this.getNodeParameter('id', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/quotes/${id}/approve`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
              'X-Tenant-ID': credentials.tenantId || '',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAnalytics': {
          const id = this.getNodeParameter('id', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/quotes/${id}/analytics`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'X-Tenant-ID': credentials.tenantId || '',
            },
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
          pairedItem: { item: i } 
        });
      } else {
        if (error.response?.body) {
          throw new NodeApiError(this.getNode(), error.response.body, { 
            httpCode: error.statusCode 
          });
        }
        throw new NodeOperationError(this.getNode(), error.message);
      }
    }
  }

  return returnData;
}

async function executeDealRoomsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('dealhubApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      const baseUrl = credentials.baseUrl || 'https://api.dealhub.io/v1';
      const headers: any = {
        'Authorization': `Bearer ${credentials.apiKey}`,
        'Content-Type': 'application/json',
      };

      // Add tenant ID header if available
      if (credentials.tenantId) {
        headers['X-Tenant-ID'] = credentials.tenantId;
      }

      switch (operation) {
        case 'create': {
          const name = this.getNodeParameter('name', i) as string;
          const quoteId = this.getNodeParameter('quoteId', i) as string;
          const template = this.getNodeParameter('template', i) as string;
          const membersInput = this.getNodeParameter('members', i) as string;

          const body: any = {
            name,
            quoteId,
          };

          if (template) {
            body.template = template;
          }

          if (membersInput) {
            body.members = membersInput.split(',').map((email: string) => email.trim());
          }

          const options: any = {
            method: 'POST',
            url: `${baseUrl}/dealrooms`,
            headers,
            json: true,
            body,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'get': {
          const dealRoomId = this.getNodeParameter('dealRoomId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${baseUrl}/dealrooms/${dealRoomId}`,
            headers,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAll': {
          const status = this.getNodeParameter('status', i) as string;
          const ownerId = this.getNodeParameter('ownerId', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;

          const queryParams: any = {};
          if (status) queryParams.status = status;
          if (ownerId) queryParams.ownerId = ownerId;
          if (limit) queryParams.limit = limit;
          if (offset) queryParams.offset = offset;

          const queryString = Object.keys(queryParams).length > 0 
            ? '?' + new URLSearchParams(queryParams).toString() 
            : '';

          const options: any = {
            method: 'GET',
            url: `${baseUrl}/dealrooms${queryString}`,
            headers,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'update': {
          const dealRoomId = this.getNodeParameter('dealRoomId', i) as string;
          const name = this.getNodeParameter('name', i) as string;
          const status = this.getNodeParameter('status', i) as string;
          const membersInput = this.getNodeParameter('members', i) as string;

          const body: any = {};
          if (name) body.name = name;
          if (status) body.status = status;
          if (membersInput) {
            body.members = membersInput.split(',').map((email: string) => email.trim());
          }

          const options: any = {
            method: 'PUT',
            url: `${baseUrl}/dealrooms/${dealRoomId}`,
            headers,
            json: true,
            body,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'delete': {
          const dealRoomId = this.getNodeParameter('dealRoomId', i) as string;

          const options: any = {
            method: 'DELETE',
            url: `${baseUrl}/dealrooms/${dealRoomId}`,
            headers,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'addMember': {
          const dealRoomId = this.getNodeParameter('dealRoomId', i) as string;
          const email = this.getNodeParameter('email', i) as string;
          const role = this.getNodeParameter('role', i) as string;

          const body: any = {
            email,
            role,
          };

          const options: any = {
            method: 'POST',
            url: `${baseUrl}/dealrooms/${dealRoomId}/members`,
            headers,
            json: true,
            body,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'removeMember': {
          const dealRoomId = this.getNodeParameter('dealRoomId', i) as string;
          const memberId = this.getNodeParameter('memberId', i) as string;

          const options: any = {
            method: 'DELETE',
            url: `${baseUrl}/dealrooms/${dealRoomId}/members/${memberId}`,
            headers,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getActivity': {
          const dealRoomId = this.getNodeParameter('dealRoomId', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;

          const queryParams: any = {};
          if (limit) queryParams.limit = limit;
          if (offset) queryParams.offset = offset;

          const queryString = Object.keys(queryParams).length > 0 
            ? '?' + new URLSearchParams(queryParams).toString() 
            : '';

          const options: any = {
            method: 'GET',
            url: `${baseUrl}/dealrooms/${dealRoomId}/activity${queryString}`,
            headers,
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
          pairedItem: { item: i } 
        });
      } else {
        if (error.httpCode) {
          throw new NodeApiError(this.getNode(), error);
        } else {
          throw new NodeOperationError(this.getNode(), error.message);
        }
      }
    }
  }

  return returnData;
}

async function executeProductsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('dealhubApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      const baseHeaders: any = {
        'Authorization': `Bearer ${credentials.apiKey}`,
        'Content-Type': 'application/json',
        'X-Tenant-ID': credentials.tenantId || '',
      };

      switch (operation) {
        case 'create': {
          const name = this.getNodeParameter('name', i) as string;
          const description = this.getNodeParameter('description', i) as string;
          const price = this.getNodeParameter('price', i) as number;
          const category = this.getNodeParameter('category', i) as string;

          const body: any = {
            name,
            description,
            price,
            category,
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl || 'https://api.dealhub.io/v1'}/products`,
            headers: baseHeaders,
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'get': {
          const id = this.getNodeParameter('id', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl || 'https://api.dealhub.io/v1'}/products/${id}`,
            headers: baseHeaders,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAll': {
          const category = this.getNodeParameter('category', i) as string;
          const status = this.getNodeParameter('status', i) as string;
          const priceMin = this.getNodeParameter('priceMin', i) as number;
          const priceMax = this.getNodeParameter('priceMax', i) as number;
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;

          const queryParams: string[] = [];
          if (category) queryParams.push(`category=${encodeURIComponent(category)}`);
          if (status) queryParams.push(`status=${encodeURIComponent(status)}`);
          if (priceMin > 0) queryParams.push(`priceMin=${priceMin}`);
          if (priceMax > 0) queryParams.push(`priceMax=${priceMax}`);
          if (limit > 0) queryParams.push(`limit=${limit}`);
          if (offset > 0) queryParams.push(`offset=${offset}`);

          const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl || 'https://api.dealhub.io/v1'}/products${queryString}`,
            headers: baseHeaders,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'update': {
          const id = this.getNodeParameter('id', i) as string;
          const name = this.getNodeParameter('name', i) as string;
          const description = this.getNodeParameter('description', i) as string;
          const price = this.getNodeParameter('price', i) as number;
          const status = this.getNodeParameter('status', i) as string;

          const body: any = {};
          if (name) body.name = name;
          if (description) body.description = description;
          if (price > 0) body.price = price;
          if (status) body.status = status;

          const options: any = {
            method: 'PUT',
            url: `${credentials.baseUrl || 'https://api.dealhub.io/v1'}/products/${id}`,
            headers: baseHeaders,
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'delete': {
          const id = this.getNodeParameter('id', i) as string;

          const options: any = {
            method: 'DELETE',
            url: `${credentials.baseUrl || 'https://api.dealhub.io/v1'}/products/${id}`,
            headers: baseHeaders,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createConfiguration': {
          const id = this.getNodeParameter('id', i) as string;
          const configurationName = this.getNodeParameter('configurationName', i) as string;
          const options = this.getNodeParameter('options', i) as string;
          const pricing = this.getNodeParameter('pricing', i) as string;

          const body: any = {
            name: configurationName,
            options: JSON.parse(options),
            pricing: pricing ? JSON.parse(pricing) : {},
          };

          const requestOptions: any = {
            method: 'POST',
            url: `${credentials.baseUrl || 'https://api.dealhub.io/v1'}/products/${id}/configurations`,
            headers: baseHeaders,
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(requestOptions) as any;
          break;
        }

        case 'getConfigurations': {
          const id = this.getNodeParameter('id', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl || 'https://api.dealhub.io/v1'}/products/${id}/configurations`,
            headers: baseHeaders,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'bulkUpdate': {
          const products = this.getNodeParameter('products', i) as string;
          const bulkOperation = this.getNodeParameter('bulkOperation', i) as string;

          const body: any = {
            products: JSON.parse(products),
            operation: bulkOperation,
          };

          const options: any = {
            method: 'PUT',
            url: `${credentials.baseUrl || 'https://api.dealhub.io/v1'}/products/bulk`,
            headers: baseHeaders,
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
          pairedItem: { item: i } 
        });
      } else {
        if (error.httpCode) {
          throw new NodeApiError(this.getNode(), error);
        }
        throw new NodeOperationError(this.getNode(), error.message);
      }
    }
  }

  return returnData;
}

async function executeContactsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('dealhubApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'create': {
          const firstName = this.getNodeParameter('firstName', i) as string;
          const lastName = this.getNodeParameter('lastName', i) as string;
          const email = this.getNodeParameter('email', i) as string;
          const company = this.getNodeParameter('company', i) as string;
          const phone = this.getNodeParameter('phone', i) as string;

          const body: any = {
            firstName,
            lastName,
            email,
            company,
            phone,
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl || 'https://api.dealhub.io/v1'}/contacts`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
              'X-Tenant-ID': credentials.tenantId || '',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'get': {
          const contactId = this.getNodeParameter('contactId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl || 'https://api.dealhub.io/v1'}/contacts/${contactId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'X-Tenant-ID': credentials.tenantId || '',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAll': {
          const company = this.getNodeParameter('company', i) as string;
          const status = this.getNodeParameter('status', i) as string;
          const tag = this.getNodeParameter('tag', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;

          const queryParams: string[] = [];
          if (company) queryParams.push(`company=${encodeURIComponent(company)}`);
          if (status) queryParams.push(`status=${encodeURIComponent(status)}`);
          if (tag) queryParams.push(`tag=${encodeURIComponent(tag)}`);
          if (limit) queryParams.push(`limit=${limit}`);
          if (offset) queryParams.push(`offset=${offset}`);

          const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl || 'https://api.dealhub.io/v1'}/contacts${queryString}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'X-Tenant-ID': credentials.tenantId || '',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'update': {
          const contactId = this.getNodeParameter('contactId', i) as string;
          const firstName = this.getNodeParameter('firstName', i) as string;
          const lastName = this.getNodeParameter('lastName', i) as string;
          const email = this.getNodeParameter('email', i) as string;
          const company = this.getNodeParameter('company', i) as string;

          const body: any = {};
          if (firstName) body.firstName = firstName;
          if (lastName) body.lastName = lastName;
          if (email) body.email = email;
          if (company) body.company = company;

          const options: any = {
            method: 'PUT',
            url: `${credentials.baseUrl || 'https://api.dealhub.io/v1'}/contacts/${contactId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
              'X-Tenant-ID': credentials.tenantId || '',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'delete': {
          const contactId = this.getNodeParameter('contactId', i) as string;

          const options: any = {
            method: 'DELETE',
            url: `${credentials.baseUrl || 'https://api.dealhub.io/v1'}/contacts/${contactId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'X-Tenant-ID': credentials.tenantId || '',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'addNote': {
          const contactId = this.getNodeParameter('contactId', i) as string;
          const note = this.getNodeParameter('note', i) as string;
          const type = this.getNodeParameter('type', i) as string;

          const body: any = {
            note,
            type,
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl || 'https://api.dealhub.io/v1'}/contacts/${contactId}/notes`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
              'X-Tenant-ID': credentials.tenantId || '',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getQuotes': {
          const contactId = this.getNodeParameter('contactId', i) as string;
          const status = this.getNodeParameter('status', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;

          const queryParams: string[] = [];
          if (status) queryParams.push(`status=${encodeURIComponent(status)}`);
          if (limit) queryParams.push(`limit=${limit}`);
          if (offset) queryParams.push(`offset=${offset}`);

          const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl || 'https://api.dealhub.io/v1'}/contacts/${contactId}/quotes${queryString}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'X-Tenant-ID': credentials.tenantId || '',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'syncCRM': {
          const crmType = this.getNodeParameter('crmType', i) as string;
          const mapping = this.getNodeParameter('mapping', i) as string;

          let mappingObject: any;
          try {
            mappingObject = JSON.parse(mapping);
          } catch (error: any) {
            throw new NodeOperationError(this.getNode(), `Invalid JSON in mapping parameter: ${error.message}`, { itemIndex: i });
          }

          const body: any = {
            crmType,
            mapping: mappingObject,
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl || 'https://api.dealhub.io/v1'}/contacts/sync`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
              'X-Tenant-ID': credentials.tenantId || '',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, { itemIndex: i });
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ 
          json: { error: error.message }, 
          pairedItem: { item: i } 
        });
      } else {
        if (error.httpCode) {
          throw new NodeApiError(this.getNode(), error, { itemIndex: i });
        }
        throw new NodeOperationError(this.getNode(), error.message, { itemIndex: i });
      }
    }
  }

  return returnData;
}

async function executeIntegrationsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('dealhubApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      const baseHeaders: any = {
        'Authorization': `Bearer ${credentials.apiKey}`,
        'Content-Type': 'application/json',
        'X-Tenant-ID': credentials.tenantId || 'default',
      };

      switch (operation) {
        case 'getAll': {
          const type = this.getNodeParameter('type', i) as string;
          const status = this.getNodeParameter('status', i) as string;

          const queryParams: string[] = [];
          if (type) queryParams.push(`type=${encodeURIComponent(type)}`);
          if (status) queryParams.push(`status=${encodeURIComponent(status)}`);

          const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl || 'https://api.dealhub.io/v1'}/integrations${queryString}`,
            headers: baseHeaders,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'connect': {
          const integrationType = this.getNodeParameter('integrationType', i) as string;
          const credentials_param = this.getNodeParameter('credentials', i) as any;
          const connectionSettings = this.getNodeParameter('connectionSettings', i, {}) as any;

          const requestBody: any = {
            credentials: credentials_param,
            settings: connectionSettings,
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl || 'https://api.dealhub.io/v1'}/integrations/${integrationType}/connect`,
            headers: baseHeaders,
            body: requestBody,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateConfig': {
          const integrationType = this.getNodeParameter('integrationType', i) as string;
          const configSettings = this.getNodeParameter('configSettings', i) as any;
          const fieldMapping = this.getNodeParameter('fieldMapping', i, {}) as any;

          const requestBody: any = {
            settings: configSettings,
            mapping: fieldMapping.mapping || [],
          };

          const options: any = {
            method: 'PUT',
            url: `${credentials.baseUrl || 'https://api.dealhub.io/v1'}/integrations/${integrationType}/config`,
            headers: baseHeaders,
            body: requestBody,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'disconnect': {
          const integrationType = this.getNodeParameter('integrationType', i) as string;

          const options: any = {
            method: 'DELETE',
            url: `${credentials.baseUrl || 'https://api.dealhub.io/v1'}/integrations/${integrationType}`,
            headers: baseHeaders,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'triggerSync': {
          const integrationType = this.getNodeParameter('integrationType', i) as string;
          const syncDirection = this.getNodeParameter('syncDirection', i) as string;
          const entities = this.getNodeParameter('entities', i) as string[];

          const requestBody: any = {
            direction: syncDirection,
            entities: entities,
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl || 'https://api.dealhub.io/v1'}/integrations/${integrationType}/sync`,
            headers: baseHeaders,
            body: requestBody,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getStatus': {
          const integrationType = this.getNodeParameter('integrationType', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl || 'https://api.dealhub.io/v1'}/integrations/${integrationType}/status`,
            headers: baseHeaders,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getLogs': {
          const integrationType = this.getNodeParameter('integrationType', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;

          const queryParams: string[] = [];
          if (limit) queryParams.push(`limit=${limit}`);
          if (offset) queryParams.push(`offset=${offset}`);

          const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl || 'https://api.dealhub.io/v1'}/integrations/${integrationType}/logs${queryString}`,
            headers: baseHeaders,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, { itemIndex: i });
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
        if (error.statusCode) {
          throw new NodeApiError(this.getNode(), error, { itemIndex: i });
        } else {
          throw new NodeOperationError(this.getNode(), error.message, { itemIndex: i });
        }
      }
    }
  }

  return returnData;
}

async function executeAnalyticsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('dealhubApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      const baseHeaders: any = {
        'Authorization': `Bearer ${credentials.apiKey}`,
        'Content-Type': 'application/json',
      };

      if (credentials.tenantId) {
        baseHeaders['X-Tenant-ID'] = credentials.tenantId;
      }

      switch (operation) {
        case 'getQuoteAnalytics': {
          const dateFrom = this.getNodeParameter('dateFrom', i) as string;
          const dateTo = this.getNodeParameter('dateTo', i) as string;
          const groupBy = this.getNodeParameter('groupBy', i) as string;
          const filters = this.getNodeParameter('filters', i) as string;

          let filtersObj: any = {};
          if (filters) {
            try {
              filtersObj = JSON.parse(filters);
            } catch (error: any) {
              throw new NodeOperationError(this.getNode(), 'Invalid JSON in filters parameter');
            }
          }

          const queryParams: any = {
            dateFrom,
            dateTo,
            groupBy,
            ...filtersObj,
          };

          const queryString = new URLSearchParams(queryParams).toString();
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/analytics/quotes?${queryString}`,
            headers: baseHeaders,
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getDealRoomAnalytics': {
          const dateFrom = this.getNodeParameter('dateFrom', i) as string;
          const dateTo = this.getNodeParameter('dateTo', i) as string;
          const dealRoomId = this.getNodeParameter('dealRoomId', i) as string;

          const queryParams: any = {
            dateFrom,
            dateTo,
          };

          if (dealRoomId) {
            queryParams.dealRoomId = dealRoomId;
          }

          const queryString = new URLSearchParams(queryParams).toString();
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/analytics/dealrooms?${queryString}`,
            headers: baseHeaders,
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getProductAnalytics': {
          const dateFrom = this.getNodeParameter('dateFrom', i) as string;
          const dateTo = this.getNodeParameter('dateTo', i) as string;
          const productId = this.getNodeParameter('productId', i) as string;

          const queryParams: any = {
            dateFrom,
            dateTo,
          };

          if (productId) {
            queryParams.productId = productId;
          }

          const queryString = new URLSearchParams(queryParams).toString();
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/analytics/products?${queryString}`,
            headers: baseHeaders,
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getPipelineAnalytics': {
          const dateFrom = this.getNodeParameter('dateFrom', i) as string;
          const dateTo = this.getNodeParameter('dateTo', i) as string;
          const stage = this.getNodeParameter('stage', i) as string;

          const queryParams: any = {
            dateFrom,
            dateTo,
          };

          if (stage) {
            queryParams.stage = stage;
          }

          const queryString = new URLSearchParams(queryParams).toString();
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/analytics/pipeline?${queryString}`,
            headers: baseHeaders,
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getConversionAnalytics': {
          const dateFrom = this.getNodeParameter('dateFrom', i) as string;
          const dateTo = this.getNodeParameter('dateTo', i) as string;
          const funnel = this.getNodeParameter('funnel', i) as string;

          const queryParams: any = {
            dateFrom,
            dateTo,
          };

          if (funnel) {
            queryParams.funnel = funnel;
          }

          const queryString = new URLSearchParams(queryParams).toString();
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/analytics/conversion?${queryString}`,
            headers: baseHeaders,
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getRevenueAnalytics': {
          const dateFrom = this.getNodeParameter('dateFrom', i) as string;
          const dateTo = this.getNodeParameter('dateTo', i) as string;
          const period = this.getNodeParameter('period', i) as string;

          const queryParams: any = {
            dateFrom,
            dateTo,
            period,
          };

          const queryString = new URLSearchParams(queryParams).toString();
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/analytics/revenue?${queryString}`,
            headers: baseHeaders,
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
        if (error.httpCode) {
          throw new NodeApiError(this.getNode(), error);
        } else {
          throw new NodeOperationError(this.getNode(), error.message);
        }
      }
    }
  }

  return returnData;
}
