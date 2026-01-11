/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const quoteOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['quote'],
      },
    },
    options: [
      {
        name: 'Approve',
        value: 'approve',
        description: 'Approve a pending quote',
        action: 'Approve a quote',
      },
      {
        name: 'Clone',
        value: 'clone',
        description: 'Clone an existing quote',
        action: 'Clone a quote',
      },
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new quote via headless API',
        action: 'Create a quote',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete a draft quote',
        action: 'Delete a quote',
      },
      {
        name: 'Export to Excel',
        value: 'exportExcel',
        description: 'Export quote as Excel spreadsheet',
        action: 'Export quote to Excel',
      },
      {
        name: 'Export to PDF',
        value: 'exportPdf',
        description: 'Export quote as PDF document',
        action: 'Export quote to PDF',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Retrieve a specific quote by ID',
        action: 'Get a quote',
      },
      {
        name: 'Get Many',
        value: 'getAll',
        description: 'List all quotes with filtering options',
        action: 'Get many quotes',
      },
      {
        name: 'Get Versions',
        value: 'getVersions',
        description: 'Get all versions of a quote',
        action: 'Get quote versions',
      },
      {
        name: 'Publish',
        value: 'publish',
        description: 'Publish quote to DealRoom',
        action: 'Publish a quote',
      },
      {
        name: 'Reject',
        value: 'reject',
        description: 'Reject a quote with reason',
        action: 'Reject a quote',
      },
      {
        name: 'Set Active Version',
        value: 'setActiveVersion',
        description: 'Set a specific version as active',
        action: 'Set active version',
      },
      {
        name: 'Submit',
        value: 'submit',
        description: 'Submit quote for approval',
        action: 'Submit a quote',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update quote details and metadata',
        action: 'Update a quote',
      },
    ],
    default: 'get',
  },
];

export const quoteFields: INodeProperties[] = [
  // ----------------------------------
  //         quote: get
  // ----------------------------------
  {
    displayName: 'Quote ID',
    name: 'quoteId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['quote'],
        operation: ['get', 'update', 'delete', 'submit', 'approve', 'reject', 'publish', 'clone', 'getVersions', 'setActiveVersion', 'exportPdf', 'exportExcel'],
      },
    },
    description: 'Unique quote identifier (format: qt_xxxxx)',
    placeholder: 'qt_abc123',
  },

  // ----------------------------------
  //         quote: create
  // ----------------------------------
  {
    displayName: 'Name',
    name: 'name',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['quote'],
        operation: ['create'],
      },
    },
    description: 'Name for the new quote',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['quote'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'Currency',
        name: 'currency',
        type: 'string',
        default: 'USD',
        description: 'Quote currency code (ISO 4217)',
      },
      {
        displayName: 'Expiration Date',
        name: 'expirationDate',
        type: 'dateTime',
        default: '',
        description: 'Quote expiration date in ISO 8601 format',
      },
      {
        displayName: 'Metadata',
        name: 'metadata',
        type: 'json',
        default: '{}',
        description: 'Custom metadata for the quote',
      },
      {
        displayName: 'Opportunity ID',
        name: 'opportunityId',
        type: 'string',
        default: '',
        description: 'Associated CRM opportunity ID',
      },
      {
        displayName: 'Playbook ID',
        name: 'playbookId',
        type: 'string',
        default: '',
        description: 'ID of the playbook to use for the quote',
      },
    ],
  },

  // ----------------------------------
  //         quote: update
  // ----------------------------------
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['quote'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'Currency',
        name: 'currency',
        type: 'string',
        default: '',
        description: 'Quote currency code (ISO 4217)',
      },
      {
        displayName: 'Expiration Date',
        name: 'expirationDate',
        type: 'dateTime',
        default: '',
        description: 'Quote expiration date in ISO 8601 format',
      },
      {
        displayName: 'Metadata',
        name: 'metadata',
        type: 'json',
        default: '{}',
        description: 'Custom metadata for the quote',
      },
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        description: 'Updated name for the quote',
      },
    ],
  },

  // ----------------------------------
  //         quote: getAll
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['quote'],
        operation: ['getAll'],
      },
    },
    default: false,
    description: 'Whether to return all results or only up to a given limit',
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    displayOptions: {
      show: {
        resource: ['quote'],
        operation: ['getAll'],
        returnAll: [false],
      },
    },
    typeOptions: {
      minValue: 1,
      maxValue: 100,
    },
    default: 50,
    description: 'Max number of results to return',
  },
  {
    displayName: 'Filters',
    name: 'filters',
    type: 'collection',
    placeholder: 'Add Filter',
    default: {},
    displayOptions: {
      show: {
        resource: ['quote'],
        operation: ['getAll'],
      },
    },
    options: [
      {
        displayName: 'Created After',
        name: 'createdAfter',
        type: 'dateTime',
        default: '',
        description: 'Filter quotes created after this date',
      },
      {
        displayName: 'Created Before',
        name: 'createdBefore',
        type: 'dateTime',
        default: '',
        description: 'Filter quotes created before this date',
      },
      {
        displayName: 'Opportunity ID',
        name: 'opportunityId',
        type: 'string',
        default: '',
        description: 'Filter by associated opportunity ID',
      },
      {
        displayName: 'Owner ID',
        name: 'ownerId',
        type: 'string',
        default: '',
        description: 'Filter by quote owner user ID',
      },
      {
        displayName: 'Playbook ID',
        name: 'playbookId',
        type: 'string',
        default: '',
        description: 'Filter by playbook ID',
      },
      {
        displayName: 'Search',
        name: 'search',
        type: 'string',
        default: '',
        description: 'Search quotes by name or ID',
      },
      {
        displayName: 'Status',
        name: 'status',
        type: 'options',
        options: [
          { name: 'Approved', value: 'approved' },
          { name: 'Draft', value: 'draft' },
          { name: 'Expired', value: 'expired' },
          { name: 'Lost', value: 'lost' },
          { name: 'Pending Approval', value: 'pending_approval' },
          { name: 'Published', value: 'published' },
          { name: 'Won', value: 'won' },
        ],
        default: '',
        description: 'Filter by quote status',
      },
    ],
  },

  // ----------------------------------
  //         quote: reject
  // ----------------------------------
  {
    displayName: 'Rejection Reason',
    name: 'rejectionReason',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['quote'],
        operation: ['reject'],
      },
    },
    description: 'Reason for rejecting the quote',
  },

  // ----------------------------------
  //         quote: approve
  // ----------------------------------
  {
    displayName: 'Comments',
    name: 'approvalComments',
    type: 'string',
    default: '',
    displayOptions: {
      show: {
        resource: ['quote'],
        operation: ['approve'],
      },
    },
    description: 'Optional comments for the approval',
  },

  // ----------------------------------
  //         quote: publish
  // ----------------------------------
  {
    displayName: 'Publish Options',
    name: 'publishOptions',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['quote'],
        operation: ['publish'],
      },
    },
    options: [
      {
        displayName: 'Create DealRoom',
        name: 'createDealRoom',
        type: 'boolean',
        default: true,
        description: 'Whether to automatically create a DealRoom',
      },
      {
        displayName: 'Notify Recipients',
        name: 'notifyRecipients',
        type: 'boolean',
        default: false,
        description: 'Whether to send notification to recipients',
      },
      {
        displayName: 'Recipient Emails',
        name: 'recipientEmails',
        type: 'string',
        default: '',
        description: 'Comma-separated list of recipient email addresses',
      },
    ],
  },

  // ----------------------------------
  //         quote: clone
  // ----------------------------------
  {
    displayName: 'Clone Options',
    name: 'cloneOptions',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['quote'],
        operation: ['clone'],
      },
    },
    options: [
      {
        displayName: 'Include Line Items',
        name: 'includeLineItems',
        type: 'boolean',
        default: true,
        description: 'Whether to include line items in the cloned quote',
      },
      {
        displayName: 'New Name',
        name: 'newName',
        type: 'string',
        default: '',
        description: 'Name for the cloned quote (defaults to original name with "Copy" suffix)',
      },
    ],
  },

  // ----------------------------------
  //         quote: setActiveVersion
  // ----------------------------------
  {
    displayName: 'Version Number',
    name: 'versionNumber',
    type: 'number',
    required: true,
    default: 1,
    displayOptions: {
      show: {
        resource: ['quote'],
        operation: ['setActiveVersion'],
      },
    },
    description: 'Version number to set as active',
  },
];
