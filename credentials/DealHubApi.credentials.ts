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
			typeOptions: { password: true },
			default: '',
			description: 'API key for DealHub authentication. Generated in DealHub admin console under Settings > API Configuration.',
			required: true,
		},
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.dealhub.io/v1',
			description: 'Base URL for the DealHub API',
			required: true,
		},
	];
}