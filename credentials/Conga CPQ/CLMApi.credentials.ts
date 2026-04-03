import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class CongaCPQCLMApi implements ICredentialType {
	name = 'congaCPQCLMApi';
	displayName = 'Conga CPQ/CLM API';
	documentationUrl = 'https://developer.conga.com/';
	properties: INodeProperties[] = [
		{
			displayName: 'Client ID',
			name: 'clientId',
			type: 'string',
			default: '',
			required: true,
			description: 'OAuth 2.0 Client ID obtained from Conga Cloud application registration',
		},
		{
			displayName: 'Client Secret',
			name: 'clientSecret',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'OAuth 2.0 Client Secret obtained from Conga Cloud application registration',
		},
		{
			displayName: 'Authorization URL',
			name: 'authUrl',
			type: 'string',
			default: 'https://login.congacloud.com/oauth2/authorize',
			required: true,
			description: 'OAuth 2.0 authorization endpoint',
		},
		{
			displayName: 'Token URL',
			name: 'tokenUrl',
			type: 'string',
			default: 'https://login.congacloud.com/oauth2/token',
			required: true,
			description: 'OAuth 2.0 token endpoint',
		},
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.congacloud.com/cpq/v1',
			required: true,
			description: 'Base URL for Conga CPQ/CLM API',
		},
		{
			displayName: 'Scope',
			name: 'scope',
			type: 'string',
			default: 'cpq:read cpq:write clm:read clm:write',
			required: true,
			description: 'OAuth 2.0 scopes for API access permissions',
		},
	];
}