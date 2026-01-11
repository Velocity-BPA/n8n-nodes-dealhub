/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const versionOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['version'],
      },
    },
    options: [
      {
        name: 'Get',
        value: 'get',
        description: 'Get version details',
        action: 'Get a version',
      },
      {
        name: 'Get Current',
        value: 'getCurrent',
        description: 'Get currently active version',
        action: 'Get current version',
      },
      {
        name: 'Get Many',
        value: 'getAll',
        description: 'List all versions',
        action: 'Get many versions',
      },
      {
        name: 'Get Playbooks',
        value: 'getPlaybooks',
        description: 'Get playbooks in a version',
        action: 'Get version playbooks',
      },
      {
        name: 'Get Products',
        value: 'getProducts',
        description: 'Get products in a version',
        action: 'Get version products',
      },
      {
        name: 'Publish',
        value: 'publish',
        description: 'Publish a version',
        action: 'Publish a version',
      },
      {
        name: 'Rollback',
        value: 'rollback',
        description: 'Rollback to previous version',
        action: 'Rollback version',
      },
    ],
    default: 'get',
  },
];

export const versionFields: INodeProperties[] = [
  // ----------------------------------
  //         version: get, getProducts, getPlaybooks, publish, rollback
  // ----------------------------------
  {
    displayName: 'Version ID',
    name: 'versionId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['version'],
        operation: ['get', 'getProducts', 'getPlaybooks', 'publish', 'rollback'],
      },
    },
    description: 'Unique version identifier',
  },

  // ----------------------------------
  //         version: getAll
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['version'],
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
        resource: ['version'],
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
        resource: ['version'],
        operation: ['getAll'],
      },
    },
    options: [
      {
        displayName: 'Status',
        name: 'status',
        type: 'options',
        options: [
          { name: 'Active', value: 'active' },
          { name: 'Archived', value: 'archived' },
          { name: 'Draft', value: 'draft' },
        ],
        default: '',
        description: 'Filter by version status',
      },
    ],
  },

  // ----------------------------------
  //         version: publish
  // ----------------------------------
  {
    displayName: 'Publish Options',
    name: 'publishOptions',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['version'],
        operation: ['publish'],
      },
    },
    options: [
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        default: '',
        description: 'Description for this version release',
      },
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        description: 'Name for this version',
      },
    ],
  },
];
