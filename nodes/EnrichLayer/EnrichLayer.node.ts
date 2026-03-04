import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeApiError,
} from 'n8n-workflow';

export class EnrichLayer implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Enrich Layer',
		name: 'enrichLayer',
		icon: 'file:enrichlayer.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
		description: 'Enrich company, person, and school profiles via the Enrich Layer API',
		defaults: {
			name: 'Enrich Layer',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'enrichLayerApi',
				required: true,
			},
		],
		properties: [
			// ==================================================================
			//  Resource selector — 7 API groups
			// ==================================================================
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Company', value: 'company', description: 'Company profile, lookup, employees, and pictures' },
					{ name: 'Person', value: 'person', description: 'Person profile, lookup, pictures, and role search' },
					{ name: 'Contact', value: 'contact', description: 'Email/phone lookup, personal contact info, disposable email check' },
					{ name: 'School', value: 'school', description: 'School profiles and student listings' },
					{ name: 'Job', value: 'job', description: 'Job profiles, search, and counts' },
					{ name: 'Search', value: 'search', description: 'Advanced company and people search' },
					{ name: 'Meta', value: 'meta', description: 'Credit balance and account info' },
				],
				default: 'company',
			},

			// ==================================================================
			//  Operation selectors — one per resource
			// ==================================================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['company'] } },
				options: [
					{ name: 'Get Company Profile', value: 'getCompanyProfile', description: 'Get structured data of a Company Profile. Cost: 1 credit.', action: 'Get company profile' },
					{ name: 'Lookup Company', value: 'lookupCompany', description: 'Look up a company by name or domain. Cost: 2 credits.', action: 'Lookup company' },
					{ name: 'Lookup Company by ID', value: 'lookupCompanyById', description: 'Look up a company by its internal numeric ID. Cost: 0 credits.', action: 'Lookup company by ID' },
					{ name: 'Get Company Profile Picture', value: 'getCompanyProfilePicture', description: 'Get the profile picture URL of a company. Cost: 0 credits.', action: 'Get company profile picture' },
					{ name: 'List Employees', value: 'listEmployees', description: 'List employees of a company. Cost: 3 credits per employee.', action: 'List employees' },
					{ name: 'Get Employee Count', value: 'getEmployeeCount', description: 'Get the number of employees at a company. Cost: 1 credit.', action: 'Get employee count' },
					{ name: 'Search Employees', value: 'searchEmployees', description: 'Search employees by keyword at a company. Cost: 10 credits per request.', action: 'Search employees' },
				],
				default: 'getCompanyProfile',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['person'] } },
				options: [
					{ name: 'Get Person Profile', value: 'getPersonProfile', description: 'Get structured data of a Person Profile. Cost: 1 credit.', action: 'Get person profile' },
					{ name: 'Lookup Person', value: 'lookupPerson', description: 'Look up a person by name and company. Cost: 2 credits.', action: 'Lookup person' },
					{ name: 'Get Person Profile Picture', value: 'getPersonProfilePicture', description: 'Get the profile picture URL of a person. Cost: 0 credits.', action: 'Get person profile picture' },
					{ name: 'Lookup Role', value: 'lookupRole', description: 'Look up a person by their role at a company. Cost: 3 credits.', action: 'Lookup role' },
				],
				default: 'getPersonProfile',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['contact'] } },
				options: [
					{ name: 'Reverse Email Lookup', value: 'reverseEmailLookup', description: 'Look up a profile by email address. Cost: 3 credits.', action: 'Reverse email lookup' },
					{ name: 'Reverse Phone Lookup', value: 'reversePhoneLookup', description: 'Look up a profile by phone number. Cost: 3 credits.', action: 'Reverse phone lookup' },
					{ name: 'Work Email Lookup', value: 'lookupWorkEmail', description: 'Get the work email of a person. Cost: 3 credits.', action: 'Work email lookup' },
					{ name: 'Get Personal Contact', value: 'getPersonalContact', description: 'Get personal contact numbers of a person. Cost: 1 credit per number.', action: 'Get personal contact' },
					{ name: 'Get Personal Email', value: 'getPersonalEmail', description: 'Get personal email addresses of a person. Cost: 1 credit per email.', action: 'Get personal email' },
					{ name: 'Check Disposable Email', value: 'checkDisposableEmail', description: 'Check if an email address is disposable. Cost: 0 credits.', action: 'Check disposable email' },
				],
				default: 'reverseEmailLookup',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['school'] } },
				options: [
					{ name: 'Get School Profile', value: 'getSchoolProfile', description: 'Get structured data of a School Profile. Cost: 1 credit.', action: 'Get school profile' },
					{ name: 'List Students', value: 'listStudents', description: 'List students of a school. Cost: 3 credits per student.', action: 'List students' },
				],
				default: 'getSchoolProfile',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['job'] } },
				options: [
					{ name: 'Get Job Profile', value: 'getJobProfile', description: 'Get structured data of a Job Profile. Cost: 2 credits.', action: 'Get job profile' },
					{ name: 'Search Jobs', value: 'searchJobs', description: 'Search jobs at a company. Cost: 2 credits.', action: 'Search jobs' },
					{ name: 'Get Job Count', value: 'getJobCount', description: 'Get the number of jobs at a company. Cost: 2 credits.', action: 'Get job count' },
				],
				default: 'getJobProfile',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['search'] } },
				options: [
					{ name: 'Search Companies', value: 'searchCompanies', description: 'Search for companies by criteria. Cost: 3 credits per URL returned.', action: 'Search companies' },
					{ name: 'Search People', value: 'searchPeople', description: 'Search for people by criteria. Cost: 3 credits per URL returned.', action: 'Search people' },
				],
				default: 'searchCompanies',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['meta'] } },
				options: [
					{ name: 'Get Credit Balance', value: 'getCreditBalance', description: 'View your current credit balance. Cost: 0 credits.', action: 'Get credit balance' },
				],
				default: 'getCreditBalance',
			},

			// ==================================================================
			//  getCompanyProfile parameters
			// ==================================================================
			{
				displayName: 'Company URL',
				name: 'url',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'e.g. a company profile URL',
				description: 'URL of the Company Profile to look up',
				displayOptions: { show: { resource: ['company'], operation: ['getCompanyProfile'] } },
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: { show: { resource: ['company'], operation: ['getCompanyProfile'] } },
				options: [
					{
						displayName: 'Categories',
						name: 'categories',
						type: 'options',
						options: [
							{ name: 'Exclude', value: 'exclude' },
							{ name: 'Include', value: 'include' },
						],
						default: 'exclude',
						description: 'Append categories data. Costs 1 extra credit if included.',
					},
					{
						displayName: 'Funding Data',
						name: 'funding_data',
						type: 'options',
						options: [
							{ name: 'Exclude', value: 'exclude' },
							{ name: 'Include', value: 'include' },
						],
						default: 'exclude',
						description: 'Returns a list of funding rounds. Costs 1 extra credit if included.',
					},
					{
						displayName: 'Exit Data',
						name: 'exit_data',
						type: 'options',
						options: [
							{ name: 'Exclude', value: 'exclude' },
							{ name: 'Include', value: 'include' },
						],
						default: 'exclude',
						description: 'Returns a list of investment portfolio exits. Costs 1 extra credit if included.',
					},
					{
						displayName: 'Acquisitions',
						name: 'acquisitions',
						type: 'options',
						options: [
							{ name: 'Exclude', value: 'exclude' },
							{ name: 'Include', value: 'include' },
						],
						default: 'exclude',
						description: 'Enriched data on acquisitions. Costs 1 extra credit if included.',
					},
					{
						displayName: 'Extra',
						name: 'extra',
						type: 'options',
						options: [
							{ name: 'Exclude', value: 'exclude' },
							{ name: 'Include', value: 'include' },
						],
						default: 'exclude',
						description: 'Extra details (Crunchbase ranking, contact email, phone, social accounts, funding, IPO status). Costs 1 extra credit if included.',
					},
					{
						displayName: 'Use Cache',
						name: 'use_cache',
						type: 'options',
						options: [
							{ name: 'Default (Dashboard Setting)', value: '' },
							{ name: 'If Present', value: 'if-present' },
							{ name: 'If Recent', value: 'if-recent' },
						],
						default: '',
						description: '"if-present" fetches from cache regardless of age. "if-recent" returns a profile no older than 29 days (costs 1 extra credit).',
					},
				],
			},

			// ==================================================================
			//  lookupCompany parameters
			// ==================================================================
			{
				displayName: 'Company Domain',
				name: 'company_domain',
				type: 'string',
				required: false,
				default: '',
				placeholder: 'accenture.com',
				description: 'Company website or domain. Provide either this or Company Name.',
				displayOptions: { show: { resource: ['company'], operation: ['lookupCompany'] } },
			},
			{
				displayName: 'Company Name',
				name: 'company_name',
				type: 'string',
				required: false,
				default: '',
				placeholder: 'Accenture',
				description: 'Company name. Provide either this or Company Domain.',
				displayOptions: { show: { resource: ['company'], operation: ['lookupCompany'] } },
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: { show: { resource: ['company'], operation: ['lookupCompany'] } },
				options: [
					{
						displayName: 'Company Location',
						name: 'company_location',
						type: 'string',
						default: '',
						description: 'ISO 3166-1 alpha-2 country code. Example: sg',
					},
					{
						displayName: 'Enrich Profile',
						name: 'enrich_profile',
						type: 'options',
						options: [
							{ name: 'Skip', value: 'skip' },
							{ name: 'Enrich', value: 'enrich' },
						],
						default: 'skip',
						description: 'Enrich result with cached profile data.',
					},
				],
			},

			// ==================================================================
			//  lookupCompanyById parameters
			// ==================================================================
			{
				displayName: 'Company ID',
				name: 'id',
				type: 'string',
				required: true,
				default: '',
				placeholder: '1441',
				description: "Company's internal, immutable numeric ID",
				displayOptions: { show: { resource: ['company'], operation: ['lookupCompanyById'] } },
			},

			// ==================================================================
			//  getCompanyProfilePicture parameters
			// ==================================================================
			{
				displayName: 'Company Profile URL',
				name: 'company_profile_url',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'e.g. a company profile URL',
				description: 'Professional network profile URL of the company',
				displayOptions: { show: { resource: ['company'], operation: ['getCompanyProfilePicture'] } },
			},

			// ==================================================================
			//  listEmployees parameters
			// ==================================================================
			{
				displayName: 'Company URL',
				name: 'url',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'e.g. a company profile URL',
				description: 'URL of the Company Profile',
				displayOptions: { show: { resource: ['company'], operation: ['listEmployees'] } },
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: { show: { resource: ['company'], operation: ['listEmployees'] } },
				options: [
					{
						displayName: 'Boolean Role Search',
						name: 'boolean_role_search',
						type: 'string',
						default: '',
						description: 'Boolean search expression for job titles (max 255 chars). Example: "founder" OR "co-founder"',
					},
					{
						displayName: 'Company Name Match',
						name: 'coy_name_match',
						type: 'options',
						options: [
							{ name: 'Include', value: 'include' },
							{ name: 'Exclude', value: 'exclude' },
						],
						default: 'include',
						description: 'Include profiles that match the company name.',
					},
					{
						displayName: 'Country',
						name: 'country',
						type: 'string',
						default: '',
						description: 'ISO3166 country code(s), comma separated. Example: us',
					},
					{
						displayName: 'Employment Status',
						name: 'employment_status',
						type: 'options',
						options: [
							{ name: 'Current', value: 'current' },
							{ name: 'Past', value: 'past' },
							{ name: 'All', value: 'all' },
						],
						default: 'current',
						description: 'Filter by employment status.',
					},
					{
						displayName: 'Enrich Profiles',
						name: 'enrich_profiles',
						type: 'options',
						options: [
							{ name: 'Skip', value: 'skip' },
							{ name: 'Enrich', value: 'enrich' },
						],
						default: 'skip',
						description: 'Return full profile data for each employee.',
					},
					{
						displayName: 'Page Size',
						name: 'page_size',
						type: 'string',
						default: '',
						description: 'Max results per call (1-9999, or 1-10 if enriched). Example: 10',
					},
					{
						displayName: 'Resolve Numeric ID',
						name: 'resolve_numeric_id',
						type: 'options',
						options: [
							{ name: 'False', value: 'false' },
							{ name: 'True', value: 'true' },
						],
						default: 'false',
						description: 'Enable numeric ID support for the company URL.',
					},
					{
						displayName: 'Sort By',
						name: 'sort_by',
						type: 'options',
						options: [
							{ name: 'Recently Joined', value: 'recently-joined' },
							{ name: 'Recently Left', value: 'recently-left' },
							{ name: 'Oldest', value: 'oldest' },
							{ name: 'None', value: 'none' },
						],
						default: 'none',
						description: 'Sorting option for results.',
					},
					{
						displayName: 'Use Cache',
						name: 'use_cache',
						type: 'options',
						options: [
							{ name: 'Default (Dashboard Setting)', value: '' },
							{ name: 'If Present', value: 'if-present' },
							{ name: 'If Recent', value: 'if-recent' },
						],
						default: '',
						description: 'Cache freshness guarantee.',
					},
				],
			},

			// ==================================================================
			//  getEmployeeCount parameters
			// ==================================================================
			{
				displayName: 'Company URL',
				name: 'url',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'e.g. a company profile URL',
				description: 'URL of the Company Profile',
				displayOptions: { show: { resource: ['company'], operation: ['getEmployeeCount'] } },
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: { show: { resource: ['company'], operation: ['getEmployeeCount'] } },
				options: [
					{
						displayName: 'At Date',
						name: 'at_date',
						type: 'string',
						default: '',
						description: 'ISO8601 date (YYYY-MM-DD) for historical count. Example: 2023-12-31',
					},
					{
						displayName: 'Company Name Match',
						name: 'coy_name_match',
						type: 'options',
						options: [
							{ name: 'Include', value: 'include' },
							{ name: 'Exclude', value: 'exclude' },
						],
						default: 'include',
						description: 'Include profiles matching company name.',
					},
					{
						displayName: 'Employment Status',
						name: 'employment_status',
						type: 'options',
						options: [
							{ name: 'Current', value: 'current' },
							{ name: 'Past', value: 'past' },
							{ name: 'All', value: 'all' },
						],
						default: 'current',
						description: 'Filter by employment status.',
					},
					{
						displayName: 'Estimated Employee Count',
						name: 'estimated_employee_count',
						type: 'options',
						options: [
							{ name: 'Include', value: 'include' },
							{ name: 'Exclude', value: 'exclude' },
						],
						default: 'exclude',
						description: 'Include estimated count from profile.',
					},
					{
						displayName: 'Use Cache',
						name: 'use_cache',
						type: 'options',
						options: [
							{ name: 'Default (Dashboard Setting)', value: '' },
							{ name: 'If Present', value: 'if-present' },
							{ name: 'If Recent', value: 'if-recent' },
						],
						default: '',
						description: 'Cache freshness guarantee.',
					},
				],
			},

			// ==================================================================
			//  searchEmployees parameters
			// ==================================================================
			{
				displayName: 'Company Profile URL',
				name: 'company_profile_url',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'e.g. a company profile URL',
				description: 'Professional network profile URL of the target company',
				displayOptions: { show: { resource: ['company'], operation: ['searchEmployees'] } },
			},
			{
				displayName: 'Keyword (Boolean)',
				name: 'keyword_boolean',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'ceo OR cto',
				description: 'Job title keyword in Boolean Search Syntax (max 255 chars)',
				displayOptions: { show: { resource: ['company'], operation: ['searchEmployees'] } },
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: { show: { resource: ['company'], operation: ['searchEmployees'] } },
				options: [
					{
						displayName: 'Country',
						name: 'country',
						type: 'string',
						default: '',
						description: 'ISO3166 country code for filtering. Example: us',
					},
					{
						displayName: 'Enrich Profiles',
						name: 'enrich_profiles',
						type: 'options',
						options: [
							{ name: 'Skip', value: 'skip' },
							{ name: 'Enrich', value: 'enrich' },
						],
						default: 'skip',
						description: 'Return full profile data for each result.',
					},
					{
						displayName: 'Page Size',
						name: 'page_size',
						type: 'string',
						default: '',
						description: 'Max results per call (1-9999, or 1-10 if enriched). Example: 10',
					},
					{
						displayName: 'Resolve Numeric ID',
						name: 'resolve_numeric_id',
						type: 'options',
						options: [
							{ name: 'False', value: 'false' },
							{ name: 'True', value: 'true' },
						],
						default: 'false',
						description: 'Enable numeric ID support.',
					},
				],
			},

			// ==================================================================
			//  getPersonProfile parameters
			// ==================================================================
			{
				displayName: 'Profile URL',
				name: 'profile_url',
				type: 'string',
				required: false,
				default: '',
				placeholder: 'e.g. a person profile URL',
				description: 'Professional network Profile URL. Provide exactly one of: Profile URL, Twitter Profile URL, or Facebook Profile URL.',
				displayOptions: { show: { resource: ['person'], operation: ['getPersonProfile'] } },
			},
			{
				displayName: 'Twitter Profile URL',
				name: 'twitter_profile_url',
				type: 'string',
				required: false,
				default: '',
				placeholder: 'https://x.com/johnrmarty/',
				description: 'Twitter/X Profile URL. Provide exactly one of the three URL fields.',
				displayOptions: { show: { resource: ['person'], operation: ['getPersonProfile'] } },
			},
			{
				displayName: 'Facebook Profile URL',
				name: 'facebook_profile_url',
				type: 'string',
				required: false,
				default: '',
				placeholder: 'https://facebook.com/johnrmarty/',
				description: 'Facebook Profile URL. Provide exactly one of the three URL fields.',
				displayOptions: { show: { resource: ['person'], operation: ['getPersonProfile'] } },
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: { show: { resource: ['person'], operation: ['getPersonProfile'] } },
				options: [
					{
						displayName: 'Extra',
						name: 'extra',
						type: 'options',
						options: [
							{ name: 'Exclude', value: 'exclude' },
							{ name: 'Include', value: 'include' },
						],
						default: 'exclude',
						description: 'Enriches with extra details (gender, birth date, industry, interests). Costs 1 extra credit.',
					},
					{
						displayName: 'Personal Contact Number',
						name: 'personal_contact_number',
						type: 'options',
						options: [
							{ name: 'Exclude', value: 'exclude' },
							{ name: 'Include', value: 'include' },
						],
						default: 'exclude',
						description: 'Enriches with personal phone numbers. Costs 1 extra credit per number.',
					},
					{
						displayName: 'Personal Email',
						name: 'personal_email',
						type: 'options',
						options: [
							{ name: 'Exclude', value: 'exclude' },
							{ name: 'Include', value: 'include' },
						],
						default: 'exclude',
						description: 'Enriches with personal emails. Costs 1 extra credit per email.',
					},
					{
						displayName: 'Skills',
						name: 'skills',
						type: 'options',
						options: [
							{ name: 'Exclude', value: 'exclude' },
							{ name: 'Include', value: 'include' },
						],
						default: 'exclude',
						description: 'Include skills data. No extra credit charged.',
					},
					{
						displayName: 'Use Cache',
						name: 'use_cache',
						type: 'options',
						options: [
							{ name: 'Default (Dashboard Setting)', value: '' },
							{ name: 'If Present', value: 'if-present' },
							{ name: 'If Recent', value: 'if-recent' },
						],
						default: '',
						description: 'Cache freshness guarantee.',
					},
				],
			},

			// ==================================================================
			//  lookupPerson parameters
			// ==================================================================
			{
				displayName: 'First Name',
				name: 'first_name',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'Bill',
				description: 'First name of the person',
				displayOptions: { show: { resource: ['person'], operation: ['lookupPerson'] } },
			},
			{
				displayName: 'Company Domain',
				name: 'company_domain',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'gatesfoundation.org',
				description: 'Company name or domain',
				displayOptions: { show: { resource: ['person'], operation: ['lookupPerson'] } },
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: { show: { resource: ['person'], operation: ['lookupPerson'] } },
				options: [
					{
						displayName: 'Last Name',
						name: 'last_name',
						type: 'string',
						default: '',
						description: 'Last name of the person. Example: Gates',
					},
					{
						displayName: 'Title',
						name: 'title',
						type: 'string',
						default: '',
						description: 'Job title at current job. Example: Co-chair',
					},
					{
						displayName: 'Location',
						name: 'location',
						type: 'string',
						default: '',
						description: 'Location (country, city, or state). Example: Seattle',
					},
					{
						displayName: 'Similarity Checks',
						name: 'similarity_checks',
						type: 'options',
						options: [
							{ name: 'Include', value: 'include' },
							{ name: 'Skip', value: 'skip' },
						],
						default: 'include',
						description: 'Perform similarity checks for false positive elimination.',
					},
					{
						displayName: 'Enrich Profile',
						name: 'enrich_profile',
						type: 'options',
						options: [
							{ name: 'Skip', value: 'skip' },
							{ name: 'Enrich', value: 'enrich' },
						],
						default: 'skip',
						description: 'Enrich result with cached profile data.',
					},
				],
			},

			// ==================================================================
			//  getPersonProfilePicture parameters
			// ==================================================================
			{
				displayName: 'Person Profile URL',
				name: 'person_profile_url',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'e.g. a person profile URL',
				description: 'Professional network profile URL of the person',
				displayOptions: { show: { resource: ['person'], operation: ['getPersonProfilePicture'] } },
			},

			// ==================================================================
			//  lookupRole parameters
			// ==================================================================
			{
				displayName: 'Company Name',
				name: 'company_name',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'enrichlayer',
				description: 'Name of the company',
				displayOptions: { show: { resource: ['person'], operation: ['lookupRole'] } },
			},
			{
				displayName: 'Role',
				name: 'role',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'ceo',
				description: 'Role of the profile being looked up',
				displayOptions: { show: { resource: ['person'], operation: ['lookupRole'] } },
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: { show: { resource: ['person'], operation: ['lookupRole'] } },
				options: [
					{
						displayName: 'Enrich Profile',
						name: 'enrich_profile',
						type: 'options',
						options: [
							{ name: 'Skip', value: 'skip' },
							{ name: 'Enrich', value: 'enrich' },
						],
						default: 'skip',
						description: 'Enrich result with cached profile data.',
					},
				],
			},

			// ==================================================================
			//  reverseEmailLookup parameters
			// ==================================================================
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'johndoe@enrichlayer.com',
				description: 'Email address to look up',
				displayOptions: { show: { resource: ['contact'], operation: ['reverseEmailLookup'] } },
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: { show: { resource: ['contact'], operation: ['reverseEmailLookup'] } },
				options: [
					{
						displayName: 'Lookup Depth',
						name: 'lookup_depth',
						type: 'options',
						options: [
							{ name: 'Superficial', value: 'superficial' },
							{ name: 'Deep', value: 'deep' },
						],
						default: 'superficial',
						description: 'Depth of lookup.',
					},
					{
						displayName: 'Enrich Profile',
						name: 'enrich_profile',
						type: 'options',
						options: [
							{ name: 'Skip', value: 'skip' },
							{ name: 'Enrich', value: 'enrich' },
						],
						default: 'skip',
						description: 'Enrich result with cached profile data.',
					},
				],
			},

			// ==================================================================
			//  reversePhoneLookup parameters
			// ==================================================================
			{
				displayName: 'Phone Number',
				name: 'phone_number',
				type: 'string',
				required: true,
				default: '',
				placeholder: '+14155552671',
				description: 'E.164 formatted phone number',
				displayOptions: { show: { resource: ['contact'], operation: ['reversePhoneLookup'] } },
			},

			// ==================================================================
			//  lookupWorkEmail parameters
			// ==================================================================
			{
				displayName: 'Profile URL',
				name: 'profile_url',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'e.g. a person profile URL',
				description: 'Professional network profile URL of the person',
				displayOptions: { show: { resource: ['contact'], operation: ['lookupWorkEmail'] } },
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: { show: { resource: ['contact'], operation: ['lookupWorkEmail'] } },
				options: [
					{
						displayName: 'Callback URL',
						name: 'callback_url',
						type: 'string',
						default: '',
						description: 'Webhook URL for async notification.',
					},
				],
			},

			// ==================================================================
			//  getPersonalContact parameters
			// ==================================================================
			{
				displayName: 'Profile URL',
				name: 'profile_url',
				type: 'string',
				required: false,
				default: '',
				placeholder: 'e.g. a person profile URL',
				description: 'Professional network profile URL. Provide at least one of: Profile URL, Twitter URL, or Facebook URL.',
				displayOptions: { show: { resource: ['contact'], operation: ['getPersonalContact'] } },
			},
			{
				displayName: 'Twitter Profile URL',
				name: 'twitter_profile_url',
				type: 'string',
				required: false,
				default: '',
				placeholder: 'https://x.com/enrichlayer',
				description: 'Twitter/X profile URL.',
				displayOptions: { show: { resource: ['contact'], operation: ['getPersonalContact'] } },
			},
			{
				displayName: 'Facebook Profile URL',
				name: 'facebook_profile_url',
				type: 'string',
				required: false,
				default: '',
				placeholder: 'https://www.facebook.com/zuck',
				description: 'Facebook profile URL.',
				displayOptions: { show: { resource: ['contact'], operation: ['getPersonalContact'] } },
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: { show: { resource: ['contact'], operation: ['getPersonalContact'] } },
				options: [
					{
						displayName: 'Page Size',
						name: 'page_size',
						type: 'string',
						default: '',
						description: 'Max results per call (default 0 = no limit).',
					},
				],
			},

			// ==================================================================
			//  getPersonalEmail parameters
			// ==================================================================
			{
				displayName: 'Profile URL',
				name: 'profile_url',
				type: 'string',
				required: false,
				default: '',
				placeholder: 'e.g. a person profile URL',
				description: 'Professional network profile URL. Provide at least one of: Profile URL, Twitter URL, or Facebook URL.',
				displayOptions: { show: { resource: ['contact'], operation: ['getPersonalEmail'] } },
			},
			{
				displayName: 'Twitter Profile URL',
				name: 'twitter_profile_url',
				type: 'string',
				required: false,
				default: '',
				placeholder: 'https://x.com/enrichlayer',
				description: 'Twitter/X profile URL.',
				displayOptions: { show: { resource: ['contact'], operation: ['getPersonalEmail'] } },
			},
			{
				displayName: 'Facebook Profile URL',
				name: 'facebook_profile_url',
				type: 'string',
				required: false,
				default: '',
				placeholder: 'https://www.facebook.com/zuck',
				description: 'Facebook profile URL.',
				displayOptions: { show: { resource: ['contact'], operation: ['getPersonalEmail'] } },
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: { show: { resource: ['contact'], operation: ['getPersonalEmail'] } },
				options: [
					{
						displayName: 'Email Validation',
						name: 'email_validation',
						type: 'options',
						options: [
							{ name: 'None', value: 'none' },
							{ name: 'Fast', value: 'fast' },
							{ name: 'Precise', value: 'precise' },
						],
						default: 'none',
						description: 'Email validation method.',
					},
					{
						displayName: 'Page Size',
						name: 'page_size',
						type: 'string',
						default: '',
						description: 'Max results per call (default 0 = no limit).',
					},
				],
			},

			// ==================================================================
			//  checkDisposableEmail parameters
			// ==================================================================
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'johndoe@enrichlayer.com',
				description: 'Email address to check',
				displayOptions: { show: { resource: ['contact'], operation: ['checkDisposableEmail'] } },
			},

			// ==================================================================
			//  getSchoolProfile parameters
			// ==================================================================
			{
				displayName: 'School URL',
				name: 'url',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'e.g. a school profile URL',
				description: 'URL of the School Profile to look up',
				displayOptions: { show: { resource: ['school'], operation: ['getSchoolProfile'] } },
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: { show: { resource: ['school'], operation: ['getSchoolProfile'] } },
				options: [
					{
						displayName: 'Use Cache',
						name: 'use_cache',
						type: 'options',
						options: [
							{ name: 'Default (Dashboard Setting)', value: '' },
							{ name: 'If Present', value: 'if-present' },
							{ name: 'If Recent', value: 'if-recent' },
						],
						default: '',
						description: 'Cache freshness guarantee.',
					},
					{
						displayName: 'Live Fetch',
						name: 'live_fetch',
						type: 'options',
						options: [
							{ name: 'Default', value: 'default' },
							{ name: 'Force', value: 'force' },
						],
						default: 'default',
						description: 'Force a fresh fetch. Costs 9 extra credits when set to "force".',
					},
				],
			},

			// ==================================================================
			//  listStudents parameters
			// ==================================================================
			{
				displayName: 'School URL',
				name: 'school_url',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'e.g. a school profile URL',
				description: 'URL of the School Profile to target',
				displayOptions: { show: { resource: ['school'], operation: ['listStudents'] } },
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: { show: { resource: ['school'], operation: ['listStudents'] } },
				options: [
					{
						displayName: 'Boolean Search Keyword',
						name: 'boolean_search_keyword',
						type: 'string',
						default: '',
						description: 'Boolean search for student major (max 255 chars). Example: computer OR cs',
					},
					{
						displayName: 'Country',
						name: 'country',
						type: 'string',
						default: '',
						description: 'ISO3166 country code for filtering. Example: us',
					},
					{
						displayName: 'Enrich Profiles',
						name: 'enrich_profiles',
						type: 'options',
						options: [
							{ name: 'Skip', value: 'skip' },
							{ name: 'Enrich', value: 'enrich' },
						],
						default: 'skip',
						description: 'Return full profile data for each student.',
					},
					{
						displayName: 'Page Size',
						name: 'page_size',
						type: 'string',
						default: '',
						description: 'Max results per call (1-9999, or 1-10 if enriched).',
					},
					{
						displayName: 'Resolve Numeric ID',
						name: 'resolve_numeric_id',
						type: 'options',
						options: [
							{ name: 'False', value: 'false' },
							{ name: 'True', value: 'true' },
						],
						default: 'false',
						description: 'Enable numeric ID support.',
					},
					{
						displayName: 'Sort By',
						name: 'sort_by',
						type: 'options',
						options: [
							{ name: 'Recently Matriculated', value: 'recently-matriculated' },
							{ name: 'Recently Graduated', value: 'recently-graduated' },
							{ name: 'None', value: 'none' },
						],
						default: 'none',
						description: 'Sorting option for results.',
					},
					{
						displayName: 'Student Status',
						name: 'student_status',
						type: 'options',
						options: [
							{ name: 'Current', value: 'current' },
							{ name: 'Past', value: 'past' },
							{ name: 'All', value: 'all' },
						],
						default: 'current',
						description: 'Current or past students.',
					},
				],
			},

			// ==================================================================
			//  getJobProfile parameters
			// ==================================================================
			{
				displayName: 'Job URL',
				name: 'url',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'e.g. a job listing URL',
				description: 'URL of the Job Profile to target',
				displayOptions: { show: { resource: ['job'], operation: ['getJobProfile'] } },
			},

			// ==================================================================
			//  searchJobs parameters
			// ==================================================================
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: { show: { resource: ['job'], operation: ['searchJobs'] } },
				options: [
					{
						displayName: 'Search ID',
						name: 'search_id',
						type: 'string',
						default: '',
						description: 'search_id of the company (get via Company Profile API). Example: 2790400',
					},
					{
						displayName: 'Job Type',
						name: 'job_type',
						type: 'options',
						options: [
							{ name: 'Full-Time', value: 'full-time' },
							{ name: 'Part-Time', value: 'part-time' },
							{ name: 'Contract', value: 'contract' },
							{ name: 'Internship', value: 'internship' },
							{ name: 'Temporary', value: 'temporary' },
							{ name: 'Volunteer', value: 'volunteer' },
							{ name: 'Anything', value: 'anything' },
						],
						default: 'anything',
						description: 'Nature of the job.',
					},
					{
						displayName: 'Experience Level',
						name: 'experience_level',
						type: 'options',
						options: [
							{ name: 'Internship', value: 'internship' },
							{ name: 'Entry Level', value: 'entry_level' },
							{ name: 'Associate', value: 'associate' },
							{ name: 'Mid-Senior Level', value: 'mid_senior_level' },
							{ name: 'Director', value: 'director' },
							{ name: 'Anything', value: 'anything' },
						],
						default: 'anything',
						description: 'Experience level needed.',
					},
					{
						displayName: 'When',
						name: 'when',
						type: 'options',
						options: [
							{ name: 'Yesterday', value: 'yesterday' },
							{ name: 'Past Week', value: 'past-week' },
							{ name: 'Past Month', value: 'past-month' },
							{ name: 'Anytime', value: 'anytime' },
						],
						default: 'anytime',
						description: 'When the job was posted.',
					},
					{
						displayName: 'Flexibility',
						name: 'flexibility',
						type: 'options',
						options: [
							{ name: 'Remote', value: 'remote' },
							{ name: 'On-Site', value: 'on-site' },
							{ name: 'Hybrid', value: 'hybrid' },
							{ name: 'Anything', value: 'anything' },
						],
						default: 'anything',
						description: 'Job flexibility.',
					},
					{
						displayName: 'Geo ID',
						name: 'geo_id',
						type: 'string',
						default: '',
						description: 'geo_id of the location to search. Example: 92000000',
					},
					{
						displayName: 'Keyword',
						name: 'keyword',
						type: 'string',
						default: '',
						description: 'Keyword to search for. Example: engineer',
					},
				],
			},

			// ==================================================================
			//  getJobCount parameters
			// ==================================================================
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: { show: { resource: ['job'], operation: ['getJobCount'] } },
				options: [
					{
						displayName: 'Search ID',
						name: 'search_id',
						type: 'string',
						default: '',
						description: 'search_id of the company. Example: 2790400',
					},
					{
						displayName: 'Job Type',
						name: 'job_type',
						type: 'options',
						options: [
							{ name: 'Full-Time', value: 'full-time' },
							{ name: 'Part-Time', value: 'part-time' },
							{ name: 'Contract', value: 'contract' },
							{ name: 'Internship', value: 'internship' },
							{ name: 'Temporary', value: 'temporary' },
							{ name: 'Volunteer', value: 'volunteer' },
							{ name: 'Anything', value: 'anything' },
						],
						default: 'anything',
						description: 'Nature of the job.',
					},
					{
						displayName: 'Experience Level',
						name: 'experience_level',
						type: 'options',
						options: [
							{ name: 'Internship', value: 'internship' },
							{ name: 'Entry Level', value: 'entry_level' },
							{ name: 'Associate', value: 'associate' },
							{ name: 'Mid-Senior Level', value: 'mid_senior_level' },
							{ name: 'Director', value: 'director' },
							{ name: 'Anything', value: 'anything' },
						],
						default: 'anything',
						description: 'Experience level needed.',
					},
					{
						displayName: 'When',
						name: 'when',
						type: 'options',
						options: [
							{ name: 'Yesterday', value: 'yesterday' },
							{ name: 'Past Week', value: 'past-week' },
							{ name: 'Past Month', value: 'past-month' },
							{ name: 'Anytime', value: 'anytime' },
						],
						default: 'anytime',
						description: 'When the job was posted.',
					},
					{
						displayName: 'Flexibility',
						name: 'flexibility',
						type: 'options',
						options: [
							{ name: 'Remote', value: 'remote' },
							{ name: 'On-Site', value: 'on-site' },
							{ name: 'Hybrid', value: 'hybrid' },
							{ name: 'Anything', value: 'anything' },
						],
						default: 'anything',
						description: 'Job flexibility.',
					},
					{
						displayName: 'Geo ID',
						name: 'geo_id',
						type: 'string',
						default: '',
						description: 'geo_id of the location to search. Example: 92000000',
					},
					{
						displayName: 'Keyword',
						name: 'keyword',
						type: 'string',
						default: '',
						description: 'Keyword to search for. Example: engineer',
					},
				],
			},

			// ==================================================================
			//  searchCompanies parameters
			// ==================================================================
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: { show: { resource: ['search'], operation: ['searchCompanies'] } },
				options: [
					{
						displayName: 'Country',
						name: 'country',
						type: 'string',
						default: '',
						description: 'ISO3166 country code. Example: US',
					},
					{
						displayName: 'Region',
						name: 'region',
						type: 'string',
						default: '',
						description: 'State, province, or region (Boolean search). Example: Maryland OR "New York"',
					},
					{
						displayName: 'City',
						name: 'city',
						type: 'string',
						default: '',
						description: 'City name (Boolean search). Example: "Los Angeles"',
					},
					{
						displayName: 'Company Type',
						name: 'type',
						type: 'options',
						options: [
							{ name: 'Educational', value: 'EDUCATIONAL' },
							{ name: 'Government Agency', value: 'GOVERNMENT_AGENCY' },
							{ name: 'Non Profit', value: 'NON_PROFIT' },
							{ name: 'Partnership', value: 'PARTNERSHIP' },
							{ name: 'Privately Held', value: 'PRIVATELY_HELD' },
							{ name: 'Public Company', value: 'PUBLIC_COMPANY' },
							{ name: 'Self Employed', value: 'SELF_EMPLOYED' },
							{ name: 'Self Owned', value: 'SELF_OWNED' },
						],
						default: '',
						description: 'Type of company.',
					},
					{
						displayName: 'Follower Count Min',
						name: 'follower_count_min',
						type: 'string',
						default: '',
						description: 'Minimum follower count. Example: 1000',
					},
					{
						displayName: 'Follower Count Max',
						name: 'follower_count_max',
						type: 'string',
						default: '',
						description: 'Maximum follower count. Example: 10000',
					},
					{
						displayName: 'Company Name',
						name: 'name',
						type: 'string',
						default: '',
						description: 'Company name (Boolean search). Example: circle || amelex',
					},
					{
						displayName: 'Industry',
						name: 'industry',
						type: 'string',
						default: '',
						description: 'Industry (Boolean search). Example: technology || manufacturing',
					},
					{
						displayName: 'Primary Industry',
						name: 'primary_industry',
						type: 'string',
						default: '',
						description: 'Primary industry (Boolean search). Example: software development',
					},
					{
						displayName: 'Specialities',
						name: 'specialities',
						type: 'string',
						default: '',
						description: 'Company specialities (Boolean search). Example: innovative product development',
					},
					{
						displayName: 'Employee Count Category',
						name: 'employee_count_category',
						type: 'options',
						options: [
							{ name: 'Custom', value: 'custom' },
							{ name: 'Startup', value: 'startup' },
							{ name: 'Small', value: 'small' },
							{ name: 'Medium', value: 'medium' },
							{ name: 'Large', value: 'large' },
							{ name: 'Enterprise', value: 'enterprise' },
						],
						default: '',
						description: 'Employee count category.',
					},
					{
						displayName: 'Employee Count Min',
						name: 'employee_count_min',
						type: 'string',
						default: '',
						description: 'Minimum employee count. Example: 100',
					},
					{
						displayName: 'Employee Count Max',
						name: 'employee_count_max',
						type: 'string',
						default: '',
						description: 'Maximum employee count. Example: 1000',
					},
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
						description: 'Company description (Boolean search). Example: navy or naval',
					},
					{
						displayName: 'Founded After Year',
						name: 'founded_after_year',
						type: 'string',
						default: '',
						description: 'Founded after this year. Example: 1985',
					},
					{
						displayName: 'Founded Before Year',
						name: 'founded_before_year',
						type: 'string',
						default: '',
						description: 'Founded before this year. Example: 2015',
					},
					{
						displayName: 'Funding Amount Min',
						name: 'funding_amount_min',
						type: 'string',
						default: '',
						description: 'Minimum funding amount in USD. Example: 1000000',
					},
					{
						displayName: 'Funding Amount Max',
						name: 'funding_amount_max',
						type: 'string',
						default: '',
						description: 'Maximum funding amount in USD. Example: 1000000',
					},
					{
						displayName: 'Funding Raised After',
						name: 'funding_raised_after',
						type: 'string',
						default: '',
						description: 'Funding raised after this date (YYYY-MM-DD). Example: 2019-12-30',
					},
					{
						displayName: 'Funding Raised Before',
						name: 'funding_raised_before',
						type: 'string',
						default: '',
						description: 'Funding raised before this date (YYYY-MM-DD). Example: 2019-12-30',
					},
					{
						displayName: 'Page Size',
						name: 'page_size',
						type: 'string',
						default: '',
						description: 'Max results per call (1-100, or 1-10 if enriched). Example: 10',
					},
					{
						displayName: 'Enrich Profiles',
						name: 'enrich_profiles',
						type: 'options',
						options: [
							{ name: 'Skip', value: 'skip' },
							{ name: 'Enrich', value: 'enrich' },
						],
						default: 'skip',
						description: 'Return complete profile data.',
					},
					{
						displayName: 'Use Cache',
						name: 'use_cache',
						type: 'options',
						options: [
							{ name: 'Default (Dashboard Setting)', value: '' },
							{ name: 'If Present', value: 'if-present' },
							{ name: 'If Recent', value: 'if-recent' },
						],
						default: '',
						description: 'Cache freshness guarantee.',
					},
				],
			},

			// ==================================================================
			//  searchPeople parameters
			// ==================================================================
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: { show: { resource: ['search'], operation: ['searchPeople'] } },
				options: [
					{
						displayName: 'Country',
						name: 'country',
						type: 'string',
						default: '',
						description: 'ISO3166 country code. Example: US',
					},
					{
						displayName: 'First Name',
						name: 'first_name',
						type: 'string',
						default: '',
						description: 'First name (Boolean search). Example: Bill OR Mark',
					},
					{
						displayName: 'Last Name',
						name: 'last_name',
						type: 'string',
						default: '',
						description: 'Last name (Boolean search). Example: Gates or Zuckerberg',
					},
					{
						displayName: 'Education Field of Study',
						name: 'education_field_of_study',
						type: 'string',
						default: '',
						description: 'Field of study (Boolean search). Example: computer science',
					},
					{
						displayName: 'Education Degree Name',
						name: 'education_degree_name',
						type: 'string',
						default: '',
						description: 'Degree name (Boolean search). Example: MBA',
					},
					{
						displayName: 'Education School Name',
						name: 'education_school_name',
						type: 'string',
						default: '',
						description: 'School name (Boolean search). Example: "Harvard University"',
					},
					{
						displayName: 'Education School Profile URL',
						name: 'education_school_profile_url',
						type: 'string',
						default: '',
						description: 'School profile URL.',
					},
					{
						displayName: 'Current Role Title',
						name: 'current_role_title',
						type: 'string',
						default: '',
						description: 'Current role title (Boolean search). Example: CEO || Founder',
					},
					{
						displayName: 'Past Role Title',
						name: 'past_role_title',
						type: 'string',
						default: '',
						description: 'Past role title (Boolean search). Example: founder',
					},
					{
						displayName: 'Current Role Before',
						name: 'current_role_before',
						type: 'string',
						default: '',
						description: 'Started current role before this date (ISO8601). Example: 2019-12-30',
					},
					{
						displayName: 'Current Role After',
						name: 'current_role_after',
						type: 'string',
						default: '',
						description: 'Started current role after this date (ISO8601). Example: 2019-12-30',
					},
					{
						displayName: 'Current Company Profile URL',
						name: 'current_company_profile_url',
						type: 'string',
						default: '',
						description: 'Currently working at this company (professional network profile URL).',
					},
					{
						displayName: 'Past Company Profile URL',
						name: 'past_company_profile_url',
						type: 'string',
						default: '',
						description: 'Previously worked at this company (professional network profile URL).',
					},
					{
						displayName: 'Current Job Description',
						name: 'current_job_description',
						type: 'string',
						default: '',
						description: 'Current job description (Boolean search).',
					},
					{
						displayName: 'Past Job Description',
						name: 'past_job_description',
						type: 'string',
						default: '',
						description: 'Past job description (Boolean search).',
					},
					{
						displayName: 'Current Company Name',
						name: 'current_company_name',
						type: 'string',
						default: '',
						description: 'Current company name (Boolean search).',
					},
					{
						displayName: 'Past Company Name',
						name: 'past_company_name',
						type: 'string',
						default: '',
						description: 'Past company name (Boolean search).',
					},
					{
						displayName: 'Groups',
						name: 'groups',
						type: 'string',
						default: '',
						description: 'Group membership (Boolean search).',
					},
					{
						displayName: 'Languages',
						name: 'languages',
						type: 'string',
						default: '',
						description: 'Languages (Boolean search).',
					},
					{
						displayName: 'Region',
						name: 'region',
						type: 'string',
						default: '',
						description: 'Region, state, or province (Boolean search).',
					},
					{
						displayName: 'City',
						name: 'city',
						type: 'string',
						default: '',
						description: 'City (Boolean search).',
					},
					{
						displayName: 'Headline',
						name: 'headline',
						type: 'string',
						default: '',
						description: 'Headline field (Boolean search).',
					},
					{
						displayName: 'Summary',
						name: 'summary',
						type: 'string',
						default: '',
						description: 'Summary field (Boolean search).',
					},
					{
						displayName: 'Industries',
						name: 'industries',
						type: 'string',
						default: '',
						description: 'Inferred industry (Boolean search).',
					},
					{
						displayName: 'Interests',
						name: 'interests',
						type: 'string',
						default: '',
						description: 'Interests (Boolean search).',
					},
					{
						displayName: 'Skills',
						name: 'skills',
						type: 'string',
						default: '',
						description: 'Skills (Boolean search).',
					},
				],
			},

			// ==================================================================
			//  getCreditBalance — no additional parameters
			// ==================================================================
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const operation = this.getNodeParameter('operation', i) as string;

				let endpoint = '';
				const qs: Record<string, string> = {};

				// Helper to add non-empty additional fields to qs
				const addAdditionalFields = (fields: Record<string, string | undefined>) => {
					for (const [key, value] of Object.entries(fields)) {
						if (value !== undefined && value !== '') {
							qs[key] = value;
						}
					}
				};

				// ==========================================================
				//  getCompanyProfile
				// ==========================================================
				if (operation === 'getCompanyProfile') {
					endpoint = '/api/v2/company';
					qs.url = this.getNodeParameter('url', i) as string;
					const af = this.getNodeParameter('additionalFields', i) as Record<string, string>;
					addAdditionalFields(af);
				}

				// ==========================================================
				//  lookupCompany
				// ==========================================================
				else if (operation === 'lookupCompany') {
					endpoint = '/api/v2/company/resolve';
					const domain = this.getNodeParameter('company_domain', i, '') as string;
					const name = this.getNodeParameter('company_name', i, '') as string;
					if (domain) qs.company_domain = domain;
					if (name) qs.company_name = name;
					const af = this.getNodeParameter('additionalFields', i) as Record<string, string>;
					addAdditionalFields(af);
				}

				// ==========================================================
				//  lookupCompanyById
				// ==========================================================
				else if (operation === 'lookupCompanyById') {
					endpoint = '/api/v2/company/resolve-id';
					qs.id = this.getNodeParameter('id', i) as string;
				}

				// ==========================================================
				//  getCompanyProfilePicture
				// ==========================================================
				else if (operation === 'getCompanyProfilePicture') {
					endpoint = '/api/v2/company/profile-picture';
					qs.company_profile_url = this.getNodeParameter('company_profile_url', i) as string;
				}

				// ==========================================================
				//  listEmployees
				// ==========================================================
				else if (operation === 'listEmployees') {
					endpoint = '/api/v2/company/employees/';
					qs.url = this.getNodeParameter('url', i) as string;
					const af = this.getNodeParameter('additionalFields', i) as Record<string, string>;
					addAdditionalFields(af);
				}

				// ==========================================================
				//  getEmployeeCount
				// ==========================================================
				else if (operation === 'getEmployeeCount') {
					endpoint = '/api/v2/company/employees/count';
					qs.url = this.getNodeParameter('url', i) as string;
					const af = this.getNodeParameter('additionalFields', i) as Record<string, string>;
					addAdditionalFields(af);
				}

				// ==========================================================
				//  searchEmployees
				// ==========================================================
				else if (operation === 'searchEmployees') {
					endpoint = '/api/v2/company/employee/search/';
					qs.company_profile_url = this.getNodeParameter('company_profile_url', i) as string;
					qs.keyword_boolean = this.getNodeParameter('keyword_boolean', i) as string;
					const af = this.getNodeParameter('additionalFields', i) as Record<string, string>;
					addAdditionalFields(af);
				}

				// ==========================================================
				//  getPersonProfile
				// ==========================================================
				else if (operation === 'getPersonProfile') {
					endpoint = '/api/v2/profile';
					const profileUrl = this.getNodeParameter('profile_url', i, '') as string;
					const twitterUrl = this.getNodeParameter('twitter_profile_url', i, '') as string;
					const facebookUrl = this.getNodeParameter('facebook_profile_url', i, '') as string;
					if (profileUrl) qs.profile_url = profileUrl;
					else if (twitterUrl) qs.twitter_profile_url = twitterUrl;
					else if (facebookUrl) qs.facebook_profile_url = facebookUrl;
					const af = this.getNodeParameter('additionalFields', i) as Record<string, string>;
					addAdditionalFields(af);
				}

				// ==========================================================
				//  lookupPerson
				// ==========================================================
				else if (operation === 'lookupPerson') {
					endpoint = '/api/v2/profile/resolve';
					qs.first_name = this.getNodeParameter('first_name', i) as string;
					qs.company_domain = this.getNodeParameter('company_domain', i) as string;
					const af = this.getNodeParameter('additionalFields', i) as Record<string, string>;
					addAdditionalFields(af);
				}

				// ==========================================================
				//  getPersonProfilePicture
				// ==========================================================
				else if (operation === 'getPersonProfilePicture') {
					endpoint = '/api/v2/person/profile-picture';
					qs.person_profile_url = this.getNodeParameter('person_profile_url', i) as string;
				}

				// ==========================================================
				//  lookupRole
				// ==========================================================
				else if (operation === 'lookupRole') {
					endpoint = '/api/v2/find/company/role/';
					qs.company_name = this.getNodeParameter('company_name', i) as string;
					qs.role = this.getNodeParameter('role', i) as string;
					const af = this.getNodeParameter('additionalFields', i) as Record<string, string>;
					addAdditionalFields(af);
				}

				// ==========================================================
				//  reverseEmailLookup
				// ==========================================================
				else if (operation === 'reverseEmailLookup') {
					endpoint = '/api/v2/profile/resolve/email';
					qs.email = this.getNodeParameter('email', i) as string;
					const af = this.getNodeParameter('additionalFields', i) as Record<string, string>;
					addAdditionalFields(af);
				}

				// ==========================================================
				//  reversePhoneLookup
				// ==========================================================
				else if (operation === 'reversePhoneLookup') {
					endpoint = '/api/v2/resolve/phone';
					qs.phone_number = this.getNodeParameter('phone_number', i) as string;
				}

				// ==========================================================
				//  lookupWorkEmail
				// ==========================================================
				else if (operation === 'lookupWorkEmail') {
					endpoint = '/api/v2/profile/email';
					qs.profile_url = this.getNodeParameter('profile_url', i) as string;
					const af = this.getNodeParameter('additionalFields', i) as Record<string, string>;
					addAdditionalFields(af);
				}

				// ==========================================================
				//  getPersonalContact
				// ==========================================================
				else if (operation === 'getPersonalContact') {
					endpoint = '/api/v2/contact-api/personal-contact';
					const profileUrl = this.getNodeParameter('profile_url', i, '') as string;
					const twitterUrl = this.getNodeParameter('twitter_profile_url', i, '') as string;
					const facebookUrl = this.getNodeParameter('facebook_profile_url', i, '') as string;
					if (profileUrl) qs.profile_url = profileUrl;
					if (twitterUrl) qs.twitter_profile_url = twitterUrl;
					if (facebookUrl) qs.facebook_profile_url = facebookUrl;
					const af = this.getNodeParameter('additionalFields', i) as Record<string, string>;
					addAdditionalFields(af);
				}

				// ==========================================================
				//  getPersonalEmail
				// ==========================================================
				else if (operation === 'getPersonalEmail') {
					endpoint = '/api/v2/contact-api/personal-email';
					const profileUrl = this.getNodeParameter('profile_url', i, '') as string;
					const twitterUrl = this.getNodeParameter('twitter_profile_url', i, '') as string;
					const facebookUrl = this.getNodeParameter('facebook_profile_url', i, '') as string;
					if (profileUrl) qs.profile_url = profileUrl;
					if (twitterUrl) qs.twitter_profile_url = twitterUrl;
					if (facebookUrl) qs.facebook_profile_url = facebookUrl;
					const af = this.getNodeParameter('additionalFields', i) as Record<string, string>;
					addAdditionalFields(af);
				}

				// ==========================================================
				//  checkDisposableEmail
				// ==========================================================
				else if (operation === 'checkDisposableEmail') {
					endpoint = '/api/v2/disposable-email';
					qs.email = this.getNodeParameter('email', i) as string;
				}

				// ==========================================================
				//  getSchoolProfile
				// ==========================================================
				else if (operation === 'getSchoolProfile') {
					endpoint = '/api/v2/school';
					qs.url = this.getNodeParameter('url', i) as string;
					const af = this.getNodeParameter('additionalFields', i) as Record<string, string>;
					addAdditionalFields(af);
				}

				// ==========================================================
				//  listStudents
				// ==========================================================
				else if (operation === 'listStudents') {
					endpoint = '/api/v2/school/students/';
					qs.school_url = this.getNodeParameter('school_url', i) as string;
					const af = this.getNodeParameter('additionalFields', i) as Record<string, string>;
					addAdditionalFields(af);
				}

				// ==========================================================
				//  getJobProfile
				// ==========================================================
				else if (operation === 'getJobProfile') {
					endpoint = '/api/v2/job';
					qs.url = this.getNodeParameter('url', i) as string;
				}

				// ==========================================================
				//  searchJobs
				// ==========================================================
				else if (operation === 'searchJobs') {
					endpoint = '/api/v2/company/job';
					const af = this.getNodeParameter('additionalFields', i) as Record<string, string>;
					addAdditionalFields(af);
				}

				// ==========================================================
				//  getJobCount
				// ==========================================================
				else if (operation === 'getJobCount') {
					endpoint = '/api/v2/company/job/count';
					const af = this.getNodeParameter('additionalFields', i) as Record<string, string>;
					addAdditionalFields(af);
				}

				// ==========================================================
				//  searchCompanies
				// ==========================================================
				else if (operation === 'searchCompanies') {
					endpoint = '/api/v2/search/company';
					const af = this.getNodeParameter('additionalFields', i) as Record<string, string>;
					addAdditionalFields(af);
				}

				// ==========================================================
				//  searchPeople
				// ==========================================================
				else if (operation === 'searchPeople') {
					endpoint = '/api/v2/search/person';
					const af = this.getNodeParameter('additionalFields', i) as Record<string, string>;
					addAdditionalFields(af);
				}

				// ==========================================================
				//  getCreditBalance
				// ==========================================================
				else if (operation === 'getCreditBalance') {
					endpoint = '/api/v2/credit-balance';
				}

				// ==========================================================
				//  Execute API request
				// ==========================================================
				const response = await this.helpers.httpRequestWithAuthentication.call(
					this,
					'enrichLayerApi',
					{
						method: 'GET',
						url: `https://enrichlayer.com${endpoint}`,
						qs,
						json: true,
					},
				);

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(response as INodeExecutionData[]),
					{ itemData: { item: i } },
				);
				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					const executionData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray({ error: (error as Error).message }),
						{ itemData: { item: i } },
					);
					returnData.push(...executionData);
					continue;
				}
				throw new NodeApiError(this.getNode(), error as Record<string, unknown> as any, {
					itemIndex: i,
				});
			}
		}

		return [returnData];
	}
}
