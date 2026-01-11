/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const approvalOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['approval'],
      },
    },
    options: [
      {
        name: 'Approve',
        value: 'approve',
        description: 'Approve a pending approval request',
        action: 'Approve an approval request',
      },
      {
        name: 'Delegate',
        value: 'delegate',
        description: 'Delegate approval to another user',
        action: 'Delegate an approval',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get approval request details',
        action: 'Get an approval',
      },
      {
        name: 'Get Many',
        value: 'getAll',
        description: 'Get many pending approvals',
        action: 'Get many approvals',
      },
      {
        name: 'Get History',
        value: 'getHistory',
        description: 'Get approval history for a quote',
        action: 'Get approval history',
      },
      {
        name: 'Reject',
        value: 'reject',
        description: 'Reject an approval request',
        action: 'Reject an approval',
      },
    ],
    default: 'get',
  },
];

export const approvalFields: INodeProperties[] = [
  // ----------------------------------
  //         approval: get
  // ----------------------------------
  {
    displayName: 'Approval ID',
    name: 'approvalId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['approval'],
        operation: ['get', 'approve', 'reject', 'delegate'],
      },
    },
    description: 'The ID of the approval request',
  },

  // ----------------------------------
  //         approval: getAll
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['approval'],
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
        resource: ['approval'],
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
        resource: ['approval'],
        operation: ['getAll'],
      },
    },
    options: [
      {
        displayName: 'Approver ID',
        name: 'approverId',
        type: 'string',
        default: '',
        description: 'Filter by approver user ID',
      },
      {
        displayName: 'Quote ID',
        name: 'quoteId',
        type: 'string',
        default: '',
        description: 'Filter by associated quote ID',
      },
      {
        displayName: 'Status',
        name: 'status',
        type: 'options',
        options: [
          { name: 'Approved', value: 'approved' },
          { name: 'Pending', value: 'pending' },
          { name: 'Rejected', value: 'rejected' },
        ],
        default: 'pending',
        description: 'Filter by approval status',
      },
    ],
  },

  // ----------------------------------
  //         approval: approve
  // ----------------------------------
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['approval'],
        operation: ['approve'],
      },
    },
    options: [
      {
        displayName: 'Comments',
        name: 'comments',
        type: 'string',
        typeOptions: {
          rows: 3,
        },
        default: '',
        description: 'Optional comments for the approval',
      },
    ],
  },

  // ----------------------------------
  //         approval: reject
  // ----------------------------------
  {
    displayName: 'Rejection Reason',
    name: 'rejectionReason',
    type: 'string',
    typeOptions: {
      rows: 3,
    },
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['approval'],
        operation: ['reject'],
      },
    },
    description: 'Reason for rejecting the approval',
  },

  // ----------------------------------
  //         approval: delegate
  // ----------------------------------
  {
    displayName: 'Delegate To User ID',
    name: 'delegateToUserId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['approval'],
        operation: ['delegate'],
      },
    },
    description: 'User ID to delegate the approval to',
  },
  {
    displayName: 'Options',
    name: 'delegateOptions',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['approval'],
        operation: ['delegate'],
      },
    },
    options: [
      {
        displayName: 'Reason',
        name: 'reason',
        type: 'string',
        typeOptions: {
          rows: 2,
        },
        default: '',
        description: 'Reason for delegating the approval',
      },
    ],
  },

  // ----------------------------------
  //         approval: getHistory
  // ----------------------------------
  {
    displayName: 'Quote ID',
    name: 'quoteId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['approval'],
        operation: ['getHistory'],
      },
    },
    description: 'The ID of the quote to get approval history for',
  },
];
