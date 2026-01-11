/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const playbookOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['playbook'],
      },
    },
    options: [
      {
        name: 'Get',
        value: 'get',
        description: 'Get playbook details',
        action: 'Get a playbook',
      },
      {
        name: 'Get Answer Options',
        value: 'getAnswerOptions',
        description: 'Get answer options for a question',
        action: 'Get answer options',
      },
      {
        name: 'Get Many',
        value: 'getAll',
        description: 'List all playbooks',
        action: 'Get many playbooks',
      },
      {
        name: 'Get Questions',
        value: 'getQuestions',
        description: 'Get playbook questions',
        action: 'Get playbook questions',
      },
      {
        name: 'Simulate',
        value: 'simulate',
        description: 'Simulate playbook answers to preview output',
        action: 'Simulate playbook',
      },
    ],
    default: 'get',
  },
];

export const playbookFields: INodeProperties[] = [
  // ----------------------------------
  //         playbook: get, getQuestions
  // ----------------------------------
  {
    displayName: 'Playbook ID',
    name: 'playbookId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['playbook'],
        operation: ['get', 'getQuestions', 'getAnswerOptions', 'simulate'],
      },
    },
    description: 'Unique playbook identifier',
  },

  // ----------------------------------
  //         playbook: getAll
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['playbook'],
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
        resource: ['playbook'],
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
        resource: ['playbook'],
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
      {
        displayName: 'Search',
        name: 'search',
        type: 'string',
        default: '',
        description: 'Search playbooks by name',
      },
      {
        displayName: 'Type',
        name: 'type',
        type: 'options',
        options: [
          { name: 'Amendment', value: 'amendment' },
          { name: 'Renewal', value: 'renewal' },
          { name: 'Standard', value: 'standard' },
          { name: 'Upsell', value: 'upsell' },
        ],
        default: '',
        description: 'Filter by playbook type',
      },
    ],
  },

  // ----------------------------------
  //         playbook: getAnswerOptions
  // ----------------------------------
  {
    displayName: 'Question ID',
    name: 'questionId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['playbook'],
        operation: ['getAnswerOptions'],
      },
    },
    description: 'Question ID to get answer options for',
  },

  // ----------------------------------
  //         playbook: simulate
  // ----------------------------------
  {
    displayName: 'Answers',
    name: 'answers',
    type: 'fixedCollection',
    typeOptions: {
      multipleValues: true,
    },
    required: true,
    default: {},
    displayOptions: {
      show: {
        resource: ['playbook'],
        operation: ['simulate'],
      },
    },
    options: [
      {
        name: 'answerValues',
        displayName: 'Answer',
        values: [
          {
            displayName: 'Question ID',
            name: 'questionId',
            type: 'string',
            default: '',
            description: 'Question ID to answer',
          },
          {
            displayName: 'Answer Value',
            name: 'answerValue',
            type: 'string',
            default: '',
            description: 'Answer value (for multi-select, use comma-separated values)',
          },
        ],
      },
    ],
    description: 'Playbook answers for simulation',
  },
];
