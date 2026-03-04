import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class EnrichLayerApi implements ICredentialType {
	name = 'enrichLayerApi';
	displayName = 'Enrich Layer API';
	documentationUrl = 'https://enrichlayer.com/docs?utm_source=n8n&utm_medium=integration&utm_campaign=docs';

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
			description: 'Your Enrich Layer API key. Find it in your dashboard at https://enrichlayer.com?utm_source=n8n&utm_medium=integration&utm_campaign=homepage.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://enrichlayer.com',
			url: '/api/v2/credit-balance',
			method: 'GET',
		},
	};
}
