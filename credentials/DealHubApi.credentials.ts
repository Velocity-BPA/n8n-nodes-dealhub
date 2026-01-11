/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class DealHubApi implements ICredentialType {
  name = 'dealHubApi';
  displayName = 'DealHub API';
  documentationUrl = 'https://developers.dealhub.io';

  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      required: true,
      description: 'API key generated from DealHub Admin Settings > API Configuration',
    },
    {
      displayName: 'Environment',
      name: 'environment',
      type: 'options',
      options: [
        {
          name: 'Production',
          value: 'production',
        },
        {
          name: 'Sandbox',
          value: 'sandbox',
        },
      ],
      default: 'production',
      required: true,
      description: 'Select the DealHub environment to connect to',
    },
    {
      displayName: 'Subdomain',
      name: 'subdomain',
      type: 'string',
      default: '',
      required: true,
      placeholder: 'your-company',
      description: 'Your DealHub subdomain identifier (e.g., if your URL is your-company.dealhub.io, enter "your-company")',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        Authorization: '=Bearer {{$credentials.apiKey}}',
        'X-DealHub-Version': '2024-01',
        'X-DealHub-Subdomain': '={{$credentials.subdomain}}',
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: '={{$credentials.environment === "sandbox" ? "https://sandbox-api.dealhub.io" : "https://api.dealhub.io"}}',
      url: '/v1/users/me',
      method: 'GET',
    },
  };
}
