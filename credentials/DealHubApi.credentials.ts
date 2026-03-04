import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class DealHubApi implements ICredentialType {
	name = 'dealHubApi';
	displayName = 'DealHub API';
	documentationUrl = 'https://docs.dealhub.io/api';
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
			description: 'API key generated in DealHub admin panel under API Settings',
		},
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.dealhub.io/v1',
			required: true,
			description: 'Base URL for DealHub API',
		},
	];
}