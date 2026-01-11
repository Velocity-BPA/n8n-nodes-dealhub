/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const opportunityOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['opportunity'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Create new opportunity',
        action: 'Create an opportunity',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get opportunity details',
        action: 'Get an opportunity',
      },
      {
        name: 'Get Many',
        value: 'getAll',
        description: 'List all opportunities',
        action: 'Get many opportunities',
      },
      {
        name: 'Get Quotes',
        value: 'getQuotes',
        description: 'Get quotes for opportunity',
        action: 'Get opportunity quotes',
      },
      {
        name: 'Sync',
        value: 'sync',
        description: 'Sync opportunity with CRM',
        action: 'Sync opportunity',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update opportunity details',
        action: 'Update an opportunity',
      },
    ],
    default: 'get',
  },
];

export const opportunityFields: INodeProperties[] = [
  // ----------------------------------
  //         opportunity: get, update, getQuotes, sync
  // ----------------------------------
  {
    displayName: 'Opportunity ID',
    name: 'opportunityId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['opportunity'],
        operation: ['get', 'update', 'getQuotes', 'sync'],
      },
    },
    description: 'Unique opportunity identifier',
  },

  // ----------------------------------
  //         opportunity: create
  // ----------------------------------
  {
    displayName: 'Account Name',
    name: 'accountName',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['opportunity'],
        operation: ['create'],
      },
    },
    description: 'Account/company name',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['opportunity'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'Amount',
        name: 'amount',
        type: 'number',
        default: 0,
        description: 'Opportunity value',
      },
      {
        displayName: 'Close Date',
        name: 'closeDate',
        type: 'dateTime',
        default: '',
        description: 'Expected close date',
      },
      {
        displayName: 'Contact Email',
        name: 'contactEmail',
        type: 'string',
        default: '',
        description: 'Primary contact email',
      },
      {
        displayName: 'Contact Name',
        name: 'contactName',
        type: 'string',
        default: '',
        description: 'Primary contact name',
      },
      {
        displayName: 'CRM Opportunity ID',
        name: 'crmOpportunityId',
        type: 'string',
        default: '',
        description: 'CRM system opportunity ID for syncing',
      },
      {
        displayName: 'Currency',
        name: 'currency',
        type: 'string',
        default: 'USD',
        description: 'Currency code (ISO 4217)',
      },
      {
        displayName: 'Probability',
        name: 'probability',
        type: 'number',
        typeOptions: {
          minValue: 0,
          maxValue: 100,
        },
        default: 50,
        description: 'Win probability percentage',
      },
      {
        displayName: 'Stage',
        name: 'stage',
        type: 'string',
        default: '',
        description: 'Sales stage',
      },
    ],
  },

  // ----------------------------------
  //         opportunity: update
  // ----------------------------------
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['opportunity'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'Account Name',
        name: 'accountName',
        type: 'string',
        default: '',
        description: 'Account/company name',
      },
      {
        displayName: 'Amount',
        name: 'amount',
        type: 'number',
        default: 0,
        description: 'Opportunity value',
      },
      {
        displayName: 'Close Date',
        name: 'closeDate',
        type: 'dateTime',
        default: '',
        description: 'Expected close date',
      },
      {
        displayName: 'Contact Email',
        name: 'contactEmail',
        type: 'string',
        default: '',
        description: 'Primary contact email',
      },
      {
        displayName: 'Contact Name',
        name: 'contactName',
        type: 'string',
        default: '',
        description: 'Primary contact name',
      },
      {
        displayName: 'Probability',
        name: 'probability',
        type: 'number',
        typeOptions: {
          minValue: 0,
          maxValue: 100,
        },
        default: 50,
        description: 'Win probability percentage',
      },
      {
        displayName: 'Stage',
        name: 'stage',
        type: 'string',
        default: '',
        description: 'Sales stage',
      },
    ],
  },

  // ----------------------------------
  //         opportunity: getAll
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['opportunity'],
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
        resource: ['opportunity'],
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
        resource: ['opportunity'],
        operation: ['getAll'],
      },
    },
    options: [
      {
        displayName: 'Account Name',
        name: 'accountName',
        type: 'string',
        default: '',
        description: 'Filter by account name',
      },
      {
        displayName: 'Search',
        name: 'search',
        type: 'string',
        default: '',
        description: 'Search opportunities',
      },
      {
        displayName: 'Stage',
        name: 'stage',
        type: 'string',
        default: '',
        description: 'Filter by sales stage',
      },
    ],
  },
];
