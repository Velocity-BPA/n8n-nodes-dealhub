/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const dealRoomOperations: INodeProperties[] = [
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
        name: 'Add File',
        value: 'addFile',
        description: 'Add a file to DealRoom',
        action: 'Add file to DealRoom',
      },
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new DealRoom for a quote',
        action: 'Create a DealRoom',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete a DealRoom',
        action: 'Delete a DealRoom',
      },
      {
        name: 'Expire',
        value: 'expire',
        description: 'Manually expire a DealRoom',
        action: 'Expire a DealRoom',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get DealRoom details by ID',
        action: 'Get a DealRoom',
      },
      {
        name: 'Get Activity',
        value: 'getActivity',
        description: 'Get visitor activity and engagement metrics',
        action: 'Get DealRoom activity',
      },
      {
        name: 'Get Many',
        value: 'getAll',
        description: 'List all DealRooms',
        action: 'Get many DealRooms',
      },
      {
        name: 'Get Signers',
        value: 'getSigners',
        description: 'Get list of signers and their status',
        action: 'Get DealRoom signers',
      },
      {
        name: 'Remove File',
        value: 'removeFile',
        description: 'Remove a file from DealRoom',
        action: 'Remove file from DealRoom',
      },
      {
        name: 'Send Reminder',
        value: 'sendReminder',
        description: 'Send signing reminder to recipients',
        action: 'Send signing reminder',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update DealRoom settings and content',
        action: 'Update a DealRoom',
      },
    ],
    default: 'get',
  },
];

export const dealRoomFields: INodeProperties[] = [
  // ----------------------------------
  //         dealRoom: get, update, delete, expire, getActivity, getSigners
  // ----------------------------------
  {
    displayName: 'DealRoom ID',
    name: 'dealRoomId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['dealRoom'],
        operation: ['get', 'update', 'delete', 'expire', 'getActivity', 'getSigners', 'addFile', 'removeFile', 'sendReminder'],
      },
    },
    description: 'Unique DealRoom identifier',
  },

  // ----------------------------------
  //         dealRoom: create
  // ----------------------------------
  {
    displayName: 'Quote ID',
    name: 'quoteId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['dealRoom'],
        operation: ['create'],
      },
    },
    description: 'Quote ID to create DealRoom for',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['dealRoom'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'Access Code',
        name: 'accessCode',
        type: 'string',
        default: '',
        description: 'Optional access code for DealRoom protection',
      },
      {
        displayName: 'Allow Download',
        name: 'allowDownload',
        type: 'boolean',
        default: true,
        description: 'Whether to allow visitors to download documents',
      },
      {
        displayName: 'Expiration Days',
        name: 'expirationDays',
        type: 'number',
        default: 30,
        description: 'Days until DealRoom expires',
      },
      {
        displayName: 'Require Signature',
        name: 'requireSignature',
        type: 'boolean',
        default: false,
        description: 'Whether to require e-signature on documents',
      },
      {
        displayName: 'Signers',
        name: 'signers',
        type: 'fixedCollection',
        typeOptions: {
          multipleValues: true,
        },
        default: {},
        options: [
          {
            name: 'signerValues',
            displayName: 'Signer',
            values: [
              {
                displayName: 'Email',
                name: 'email',
                type: 'string',
                default: '',
                placeholder: 'signer@example.com',
                description: 'Signer email address',
              },
              {
                displayName: 'Name',
                name: 'name',
                type: 'string',
                default: '',
                description: 'Signer name',
              },
            ],
          },
        ],
        description: 'List of signers for the DealRoom',
      },
    ],
  },

  // ----------------------------------
  //         dealRoom: update
  // ----------------------------------
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['dealRoom'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'Access Code',
        name: 'accessCode',
        type: 'string',
        default: '',
        description: 'Optional access code for DealRoom protection',
      },
      {
        displayName: 'Allow Download',
        name: 'allowDownload',
        type: 'boolean',
        default: true,
        description: 'Whether to allow visitors to download documents',
      },
      {
        displayName: 'Expiration Date',
        name: 'expirationDate',
        type: 'dateTime',
        default: '',
        description: 'New expiration date for the DealRoom',
      },
      {
        displayName: 'Require Signature',
        name: 'requireSignature',
        type: 'boolean',
        default: false,
        description: 'Whether to require e-signature on documents',
      },
    ],
  },

  // ----------------------------------
  //         dealRoom: getAll
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['dealRoom'],
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
        resource: ['dealRoom'],
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
        resource: ['dealRoom'],
        operation: ['getAll'],
      },
    },
    options: [
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
          { name: 'Active', value: 'active' },
          { name: 'Expired', value: 'expired' },
          { name: 'Signed', value: 'signed' },
        ],
        default: '',
        description: 'Filter by DealRoom status',
      },
    ],
  },

  // ----------------------------------
  //         dealRoom: addFile
  // ----------------------------------
  {
    displayName: 'Binary Property',
    name: 'binaryPropertyName',
    type: 'string',
    required: true,
    default: 'data',
    displayOptions: {
      show: {
        resource: ['dealRoom'],
        operation: ['addFile'],
      },
    },
    description: 'Name of the binary property containing the file to upload',
  },
  {
    displayName: 'File Name',
    name: 'fileName',
    type: 'string',
    default: '',
    displayOptions: {
      show: {
        resource: ['dealRoom'],
        operation: ['addFile'],
      },
    },
    description: 'Name for the uploaded file (optional, uses binary filename if not specified)',
  },

  // ----------------------------------
  //         dealRoom: removeFile
  // ----------------------------------
  {
    displayName: 'File ID',
    name: 'fileId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['dealRoom'],
        operation: ['removeFile'],
      },
    },
    description: 'ID of the file to remove from DealRoom',
  },

  // ----------------------------------
  //         dealRoom: sendReminder
  // ----------------------------------
  {
    displayName: 'Signer Email',
    name: 'signerEmail',
    type: 'string',
    default: '',
    displayOptions: {
      show: {
        resource: ['dealRoom'],
        operation: ['sendReminder'],
      },
    },
    description: 'Specific signer email to send reminder to (leave empty to remind all pending signers)',
  },
  {
    displayName: 'Custom Message',
    name: 'customMessage',
    type: 'string',
    default: '',
    displayOptions: {
      show: {
        resource: ['dealRoom'],
        operation: ['sendReminder'],
      },
    },
    description: 'Custom message to include in the reminder email',
  },
];
