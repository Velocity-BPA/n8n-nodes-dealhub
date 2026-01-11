/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const webhookOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['webhook'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new webhook endpoint',
        action: 'Create a webhook',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete a webhook',
        action: 'Delete a webhook',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get webhook configuration',
        action: 'Get a webhook',
      },
      {
        name: 'Get Events',
        value: 'getEvents',
        description: 'List available webhook events',
        action: 'Get webhook events',
      },
      {
        name: 'Get Many',
        value: 'getAll',
        description: 'Get many webhooks',
        action: 'Get many webhooks',
      },
      {
        name: 'Test',
        value: 'test',
        description: 'Send a test webhook event',
        action: 'Test a webhook',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update webhook settings',
        action: 'Update a webhook',
      },
    ],
    default: 'get',
  },
];

export const webhookFields: INodeProperties[] = [
  // ----------------------------------
  //         webhook: get
  // ----------------------------------
  {
    displayName: 'Webhook ID',
    name: 'webhookId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['webhook'],
        operation: ['get', 'update', 'delete', 'test'],
      },
    },
    description: 'The ID of the webhook',
  },

  // ----------------------------------
  //         webhook: getAll
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['webhook'],
        operation: ['getAll'],
      },
    },
    description: 'Whether to return all results or only up to a given limit',
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    default: 50,
    typeOptions: {
      minValue: 1,
      maxValue: 100,
    },
    displayOptions: {
      show: {
        resource: ['webhook'],
        operation: ['getAll'],
        returnAll: [false],
      },
    },
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
        resource: ['webhook'],
        operation: ['getAll'],
      },
    },
    options: [
      {
        displayName: 'Is Active',
        name: 'isActive',
        type: 'boolean',
        default: true,
        description: 'Filter by active status',
      },
    ],
  },

  // ----------------------------------
  //         webhook: create
  // ----------------------------------
  {
    displayName: 'URL',
    name: 'url',
    type: 'string',
    required: true,
    default: '',
    placeholder: 'https://example.com/webhook',
    displayOptions: {
      show: {
        resource: ['webhook'],
        operation: ['create'],
      },
    },
    description: 'The URL that will receive webhook events',
  },
  {
    displayName: 'Events',
    name: 'events',
    type: 'multiOptions',
    required: true,
    default: [],
    displayOptions: {
      show: {
        resource: ['webhook'],
        operation: ['create'],
      },
    },
    options: [
      { name: 'Approval Completed', value: 'approval.completed' },
      { name: 'Approval Requested', value: 'approval.requested' },
      { name: 'DealRoom Signed', value: 'dealroom.signed' },
      { name: 'DealRoom Viewed', value: 'dealroom.viewed' },
      { name: 'Document Generated', value: 'document.generated' },
      { name: 'Opportunity Synced', value: 'opportunity.synced' },
      { name: 'Quote Approved', value: 'quote.approved' },
      { name: 'Quote Created', value: 'quote.created' },
      { name: 'Quote Lost', value: 'quote.lost' },
      { name: 'Quote Published', value: 'quote.published' },
      { name: 'Quote Rejected', value: 'quote.rejected' },
      { name: 'Quote Submitted', value: 'quote.submitted' },
      { name: 'Quote Updated', value: 'quote.updated' },
      { name: 'Quote Won', value: 'quote.won' },
    ],
    description: 'Events to subscribe to',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['webhook'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        default: '',
        description: 'Description of the webhook',
      },
      {
        displayName: 'Is Active',
        name: 'isActive',
        type: 'boolean',
        default: true,
        description: 'Whether the webhook should be active',
      },
      {
        displayName: 'Secret',
        name: 'secret',
        type: 'string',
        typeOptions: {
          password: true,
        },
        default: '',
        description: 'Secret for signing webhook payloads (HMAC-SHA256)',
      },
    ],
  },

  // ----------------------------------
  //         webhook: update
  // ----------------------------------
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['webhook'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        default: '',
        description: 'Description of the webhook',
      },
      {
        displayName: 'Events',
        name: 'events',
        type: 'multiOptions',
        default: [],
        options: [
          { name: 'Approval Completed', value: 'approval.completed' },
          { name: 'Approval Requested', value: 'approval.requested' },
          { name: 'DealRoom Signed', value: 'dealroom.signed' },
          { name: 'DealRoom Viewed', value: 'dealroom.viewed' },
          { name: 'Document Generated', value: 'document.generated' },
          { name: 'Opportunity Synced', value: 'opportunity.synced' },
          { name: 'Quote Approved', value: 'quote.approved' },
          { name: 'Quote Created', value: 'quote.created' },
          { name: 'Quote Lost', value: 'quote.lost' },
          { name: 'Quote Published', value: 'quote.published' },
          { name: 'Quote Rejected', value: 'quote.rejected' },
          { name: 'Quote Submitted', value: 'quote.submitted' },
          { name: 'Quote Updated', value: 'quote.updated' },
          { name: 'Quote Won', value: 'quote.won' },
        ],
        description: 'Events to subscribe to',
      },
      {
        displayName: 'Is Active',
        name: 'isActive',
        type: 'boolean',
        default: true,
        description: 'Whether the webhook should be active',
      },
      {
        displayName: 'Secret',
        name: 'secret',
        type: 'string',
        typeOptions: {
          password: true,
        },
        default: '',
        description: 'Secret for signing webhook payloads',
      },
      {
        displayName: 'URL',
        name: 'url',
        type: 'string',
        default: '',
        description: 'The URL that will receive webhook events',
      },
    ],
  },

  // ----------------------------------
  //         webhook: test
  // ----------------------------------
  {
    displayName: 'Event Type',
    name: 'eventType',
    type: 'options',
    required: true,
    default: 'quote.created',
    displayOptions: {
      show: {
        resource: ['webhook'],
        operation: ['test'],
      },
    },
    options: [
      { name: 'Approval Completed', value: 'approval.completed' },
      { name: 'Approval Requested', value: 'approval.requested' },
      { name: 'DealRoom Signed', value: 'dealroom.signed' },
      { name: 'DealRoom Viewed', value: 'dealroom.viewed' },
      { name: 'Document Generated', value: 'document.generated' },
      { name: 'Opportunity Synced', value: 'opportunity.synced' },
      { name: 'Quote Approved', value: 'quote.approved' },
      { name: 'Quote Created', value: 'quote.created' },
      { name: 'Quote Lost', value: 'quote.lost' },
      { name: 'Quote Published', value: 'quote.published' },
      { name: 'Quote Rejected', value: 'quote.rejected' },
      { name: 'Quote Submitted', value: 'quote.submitted' },
      { name: 'Quote Updated', value: 'quote.updated' },
      { name: 'Quote Won', value: 'quote.won' },
    ],
    description: 'The type of test event to send',
  },
];
