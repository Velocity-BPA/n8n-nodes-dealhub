/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const userOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['user'],
      },
    },
    options: [
      {
        name: 'Get',
        value: 'get',
        description: 'Get user details by ID',
        action: 'Get a user',
      },
      {
        name: 'Get Activity',
        value: 'getActivity',
        description: 'Get user activity log',
        action: 'Get user activity',
      },
      {
        name: 'Get Current',
        value: 'getCurrent',
        description: 'Get current authenticated user',
        action: 'Get current user',
      },
      {
        name: 'Get Many',
        value: 'getAll',
        description: 'List all users',
        action: 'Get many users',
      },
      {
        name: 'Get Quotes',
        value: 'getQuotes',
        description: 'Get quotes assigned to user',
        action: 'Get user quotes',
      },
      {
        name: 'Get Teams',
        value: 'getTeams',
        description: 'Get teams user belongs to',
        action: 'Get user teams',
      },
    ],
    default: 'get',
  },
];

export const userFields: INodeProperties[] = [
  // ----------------------------------
  //         user: get, getTeams, getQuotes, getActivity
  // ----------------------------------
  {
    displayName: 'User ID',
    name: 'userId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['get', 'getTeams', 'getQuotes', 'getActivity'],
      },
    },
    description: 'Unique user identifier',
  },

  // ----------------------------------
  //         user: getAll
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['user'],
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
        resource: ['user'],
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
        resource: ['user'],
        operation: ['getAll'],
      },
    },
    options: [
      {
        displayName: 'Email',
        name: 'email',
        type: 'string',
        default: '',
        description: 'Filter by email address',
      },
      {
        displayName: 'Is Active',
        name: 'isActive',
        type: 'boolean',
        default: true,
        description: 'Filter by active status',
      },
      {
        displayName: 'Role',
        name: 'role',
        type: 'options',
        options: [
          { name: 'Admin', value: 'admin' },
          { name: 'Manager', value: 'manager' },
          { name: 'Sales Rep', value: 'sales_rep' },
          { name: 'Viewer', value: 'viewer' },
        ],
        default: '',
        description: 'Filter by user role',
      },
      {
        displayName: 'Search',
        name: 'search',
        type: 'string',
        default: '',
        description: 'Search users by name or email',
      },
      {
        displayName: 'Team ID',
        name: 'teamId',
        type: 'string',
        default: '',
        description: 'Filter by team membership',
      },
    ],
  },

  // ----------------------------------
  //         user: getActivity
  // ----------------------------------
  {
    displayName: 'Activity Filters',
    name: 'activityFilters',
    type: 'collection',
    placeholder: 'Add Filter',
    default: {},
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['getActivity'],
      },
    },
    options: [
      {
        displayName: 'After',
        name: 'after',
        type: 'dateTime',
        default: '',
        description: 'Filter activities after this date',
      },
      {
        displayName: 'Before',
        name: 'before',
        type: 'dateTime',
        default: '',
        description: 'Filter activities before this date',
      },
      {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        typeOptions: {
          minValue: 1,
          maxValue: 100,
        },
        default: 50,
        description: 'Max number of activities to return',
      },
    ],
  },
];
