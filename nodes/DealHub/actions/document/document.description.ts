/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const documentOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['document'],
      },
    },
    options: [
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete a document',
        action: 'Delete a document',
      },
      {
        name: 'Download',
        value: 'download',
        description: 'Download document file',
        action: 'Download a document',
      },
      {
        name: 'Generate',
        value: 'generate',
        description: 'Generate document from quote',
        action: 'Generate a document',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get document by ID',
        action: 'Get a document',
      },
      {
        name: 'Get Many',
        value: 'getAll',
        description: 'Get many documents',
        action: 'Get many documents',
      },
      {
        name: 'Get Templates',
        value: 'getTemplates',
        description: 'List available document templates',
        action: 'Get document templates',
      },
      {
        name: 'Preview',
        value: 'preview',
        description: 'Preview document before generation',
        action: 'Preview a document',
      },
    ],
    default: 'get',
  },
];

export const documentFields: INodeProperties[] = [
  // ----------------------------------
  //         document: get
  // ----------------------------------
  {
    displayName: 'Document ID',
    name: 'documentId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['document'],
        operation: ['get', 'download', 'delete'],
      },
    },
    description: 'The ID of the document',
  },

  // ----------------------------------
  //         document: getAll
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['document'],
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
        resource: ['document'],
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
        resource: ['document'],
        operation: ['getAll'],
      },
    },
    options: [
      {
        displayName: 'Format',
        name: 'format',
        type: 'options',
        options: [
          { name: 'DOCX', value: 'docx' },
          { name: 'PDF', value: 'pdf' },
          { name: 'XLSX', value: 'xlsx' },
        ],
        default: 'pdf',
        description: 'Filter by document format',
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
          { name: 'Failed', value: 'failed' },
          { name: 'Generating', value: 'generating' },
          { name: 'Ready', value: 'ready' },
        ],
        default: 'ready',
        description: 'Filter by document status',
      },
      {
        displayName: 'Template ID',
        name: 'templateId',
        type: 'string',
        default: '',
        description: 'Filter by document template ID',
      },
    ],
  },

  // ----------------------------------
  //         document: generate
  // ----------------------------------
  {
    displayName: 'Quote ID',
    name: 'quoteId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['document'],
        operation: ['generate', 'preview'],
      },
    },
    description: 'The ID of the quote to generate document from',
  },
  {
    displayName: 'Template ID',
    name: 'templateId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['document'],
        operation: ['generate', 'preview'],
      },
    },
    description: 'The ID of the document template to use',
  },
  {
    displayName: 'Options',
    name: 'generateOptions',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['document'],
        operation: ['generate'],
      },
    },
    options: [
      {
        displayName: 'Format',
        name: 'format',
        type: 'options',
        options: [
          { name: 'DOCX', value: 'docx' },
          { name: 'PDF', value: 'pdf' },
          { name: 'XLSX', value: 'xlsx' },
        ],
        default: 'pdf',
        description: 'Output format for the document',
      },
      {
        displayName: 'Include Line Items',
        name: 'includeLineItems',
        type: 'boolean',
        default: true,
        description: 'Whether to include line items in the document',
      },
      {
        displayName: 'Include Terms',
        name: 'includeTerms',
        type: 'boolean',
        default: true,
        description: 'Whether to include terms and conditions',
      },
      {
        displayName: 'Language',
        name: 'language',
        type: 'string',
        default: 'en',
        description: 'Language code for the document (e.g., en, de, fr)',
      },
      {
        displayName: 'Version Number',
        name: 'versionNumber',
        type: 'number',
        default: 0,
        description: 'Specific quote version to generate document for (0 for active version)',
      },
    ],
  },

  // ----------------------------------
  //         document: download
  // ----------------------------------
  {
    displayName: 'Binary Property',
    name: 'binaryPropertyName',
    type: 'string',
    default: 'data',
    displayOptions: {
      show: {
        resource: ['document'],
        operation: ['download'],
      },
    },
    description: 'Name of the binary property to store the downloaded file',
  },

  // ----------------------------------
  //         document: getTemplates
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['document'],
        operation: ['getTemplates'],
      },
    },
    description: 'Whether to return all templates or only up to a given limit',
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
        resource: ['document'],
        operation: ['getTemplates'],
        returnAll: [false],
      },
    },
    description: 'Max number of templates to return',
  },
  {
    displayName: 'Filters',
    name: 'templateFilters',
    type: 'collection',
    placeholder: 'Add Filter',
    default: {},
    displayOptions: {
      show: {
        resource: ['document'],
        operation: ['getTemplates'],
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
        description: 'Search templates by name',
      },
      {
        displayName: 'Type',
        name: 'type',
        type: 'options',
        options: [
          { name: 'Contract', value: 'contract' },
          { name: 'Proposal', value: 'proposal' },
          { name: 'Quote', value: 'quote' },
          { name: 'SOW', value: 'sow' },
        ],
        default: 'quote',
        description: 'Filter by template type',
      },
    ],
  },
];
