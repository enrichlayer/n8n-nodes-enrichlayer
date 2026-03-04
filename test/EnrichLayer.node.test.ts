import { EnrichLayer } from '../nodes/EnrichLayer/EnrichLayer.node';

describe('EnrichLayer Node', () => {
	let node: EnrichLayer;

	beforeEach(() => {
		node = new EnrichLayer();
	});

	describe('Node Definition', () => {
		it('should have correct basic properties', () => {
			expect(node.description.displayName).toBe('Enrich Layer');
			expect(node.description.name).toBe('enrichLayer');
			expect(node.description.version).toBe(1);
			expect(node.description.group).toContain('transform');
		});

		it('should require enrichLayerApi credentials', () => {
			const creds = node.description.credentials;
			expect(creds).toBeDefined();
			expect(creds!.length).toBe(1);
			expect(creds![0].name).toBe('enrichLayerApi');
			expect(creds![0].required).toBe(true);
		});

		it('should have a resource property with 7 resource groups', () => {
			const resourceProp = node.description.properties.find(
				(p) => p.name === 'resource',
			);
			expect(resourceProp).toBeDefined();
			expect(resourceProp!.type).toBe('options');
			const options = (resourceProp as any).options;
			expect(options.length).toBe(7);
			const values = options.map((o: any) => o.value);
			expect(values).toContain('company');
			expect(values).toContain('person');
			expect(values).toContain('contact');
			expect(values).toContain('school');
			expect(values).toContain('job');
			expect(values).toContain('search');
			expect(values).toContain('meta');
		});

		it('should have exactly 25 operations across all resource groups', () => {
			const operationProps = node.description.properties.filter(
				(p) => p.name === 'operation',
			);
			expect(operationProps.length).toBe(7);
			let totalOptions = 0;
			for (const prop of operationProps) {
				expect(prop.type).toBe('options');
				totalOptions += (prop as any).options.length;
			}
			expect(totalOptions).toBe(25);
		});
	});

	describe('Operation Definitions', () => {
		const getOperationOptions = () => {
			const operationProps = node.description.properties.filter(
				(p) => p.name === 'operation',
			);
			const allOptions: Array<{
				name: string;
				value: string;
				description: string;
				action: string;
			}> = [];
			for (const prop of operationProps) {
				allOptions.push(...(prop as any).options);
			}
			return allOptions;
		};

		// --- Company API (7) ---
		it('should have getCompanyProfile operation', () => {
			const ops = getOperationOptions();
			const op = ops.find((o) => o.value === 'getCompanyProfile');
			expect(op).toBeDefined();
			expect(op!.name).toBe('Get Company Profile');
			expect(op!.action).toBe('Get company profile');
		});

		it('should have lookupCompany operation', () => {
			const ops = getOperationOptions();
			const op = ops.find((o) => o.value === 'lookupCompany');
			expect(op).toBeDefined();
			expect(op!.name).toBe('Lookup Company');
		});

		it('should have lookupCompanyById operation', () => {
			const ops = getOperationOptions();
			const op = ops.find((o) => o.value === 'lookupCompanyById');
			expect(op).toBeDefined();
			expect(op!.name).toBe('Lookup Company by ID');
		});

		it('should have getCompanyProfilePicture operation', () => {
			const ops = getOperationOptions();
			const op = ops.find((o) => o.value === 'getCompanyProfilePicture');
			expect(op).toBeDefined();
			expect(op!.name).toBe('Get Company Profile Picture');
		});

		it('should have listEmployees operation', () => {
			const ops = getOperationOptions();
			const op = ops.find((o) => o.value === 'listEmployees');
			expect(op).toBeDefined();
			expect(op!.name).toBe('List Employees');
		});

		it('should have getEmployeeCount operation', () => {
			const ops = getOperationOptions();
			const op = ops.find((o) => o.value === 'getEmployeeCount');
			expect(op).toBeDefined();
			expect(op!.name).toBe('Get Employee Count');
		});

		it('should have searchEmployees operation', () => {
			const ops = getOperationOptions();
			const op = ops.find((o) => o.value === 'searchEmployees');
			expect(op).toBeDefined();
			expect(op!.name).toBe('Search Employees');
		});

		// --- People API (4) ---
		it('should have getPersonProfile operation', () => {
			const ops = getOperationOptions();
			const op = ops.find((o) => o.value === 'getPersonProfile');
			expect(op).toBeDefined();
			expect(op!.name).toBe('Get Person Profile');
		});

		it('should have lookupPerson operation', () => {
			const ops = getOperationOptions();
			const op = ops.find((o) => o.value === 'lookupPerson');
			expect(op).toBeDefined();
			expect(op!.name).toBe('Lookup Person');
		});

		it('should have getPersonProfilePicture operation', () => {
			const ops = getOperationOptions();
			const op = ops.find((o) => o.value === 'getPersonProfilePicture');
			expect(op).toBeDefined();
			expect(op!.name).toBe('Get Person Profile Picture');
		});

		it('should have lookupRole operation', () => {
			const ops = getOperationOptions();
			const op = ops.find((o) => o.value === 'lookupRole');
			expect(op).toBeDefined();
			expect(op!.name).toBe('Lookup Role');
		});

		// --- Contact API (6) ---
		it('should have reverseEmailLookup operation', () => {
			const ops = getOperationOptions();
			const op = ops.find((o) => o.value === 'reverseEmailLookup');
			expect(op).toBeDefined();
			expect(op!.name).toBe('Reverse Email Lookup');
		});

		it('should have reversePhoneLookup operation', () => {
			const ops = getOperationOptions();
			const op = ops.find((o) => o.value === 'reversePhoneLookup');
			expect(op).toBeDefined();
			expect(op!.name).toBe('Reverse Phone Lookup');
		});

		it('should have lookupWorkEmail operation', () => {
			const ops = getOperationOptions();
			const op = ops.find((o) => o.value === 'lookupWorkEmail');
			expect(op).toBeDefined();
			expect(op!.name).toBe('Work Email Lookup');
		});

		it('should have getPersonalContact operation', () => {
			const ops = getOperationOptions();
			const op = ops.find((o) => o.value === 'getPersonalContact');
			expect(op).toBeDefined();
			expect(op!.name).toBe('Get Personal Contact');
		});

		it('should have getPersonalEmail operation', () => {
			const ops = getOperationOptions();
			const op = ops.find((o) => o.value === 'getPersonalEmail');
			expect(op).toBeDefined();
			expect(op!.name).toBe('Get Personal Email');
		});

		it('should have checkDisposableEmail operation', () => {
			const ops = getOperationOptions();
			const op = ops.find((o) => o.value === 'checkDisposableEmail');
			expect(op).toBeDefined();
			expect(op!.name).toBe('Check Disposable Email');
		});

		// --- School API (2) ---
		it('should have getSchoolProfile operation', () => {
			const ops = getOperationOptions();
			const op = ops.find((o) => o.value === 'getSchoolProfile');
			expect(op).toBeDefined();
			expect(op!.name).toBe('Get School Profile');
		});

		it('should have listStudents operation', () => {
			const ops = getOperationOptions();
			const op = ops.find((o) => o.value === 'listStudents');
			expect(op).toBeDefined();
			expect(op!.name).toBe('List Students');
		});

		// --- Jobs API (3) ---
		it('should have getJobProfile operation', () => {
			const ops = getOperationOptions();
			const op = ops.find((o) => o.value === 'getJobProfile');
			expect(op).toBeDefined();
			expect(op!.name).toBe('Get Job Profile');
		});

		it('should have searchJobs operation', () => {
			const ops = getOperationOptions();
			const op = ops.find((o) => o.value === 'searchJobs');
			expect(op).toBeDefined();
			expect(op!.name).toBe('Search Jobs');
		});

		it('should have getJobCount operation', () => {
			const ops = getOperationOptions();
			const op = ops.find((o) => o.value === 'getJobCount');
			expect(op).toBeDefined();
			expect(op!.name).toBe('Get Job Count');
		});

		// --- Search API (2) ---
		it('should have searchCompanies operation', () => {
			const ops = getOperationOptions();
			const op = ops.find((o) => o.value === 'searchCompanies');
			expect(op).toBeDefined();
			expect(op!.name).toBe('Search Companies');
		});

		it('should have searchPeople operation', () => {
			const ops = getOperationOptions();
			const op = ops.find((o) => o.value === 'searchPeople');
			expect(op).toBeDefined();
			expect(op!.name).toBe('Search People');
		});

		// --- Meta API (1) ---
		it('should have getCreditBalance operation', () => {
			const ops = getOperationOptions();
			const op = ops.find((o) => o.value === 'getCreditBalance');
			expect(op).toBeDefined();
			expect(op!.name).toBe('Get Credit Balance');
		});
	});

	describe('Parameter Definitions', () => {
		const getPropertiesForOperation = (operationValue: string) => {
			return node.description.properties.filter((p) => {
				if (p.name === 'operation' || p.name === 'resource') return false;
				const showOps = (p as any).displayOptions?.show?.operation;
				return showOps && showOps.includes(operationValue);
			});
		};

		const getAdditionalFieldOptions = (operationValue: string) => {
			const props = getPropertiesForOperation(operationValue);
			const af = props.find((p) => p.name === 'additionalFields');
			return af ? (af as any).options || [] : [];
		};

		// --- getCompanyProfile ---
		it('getCompanyProfile should have url (required) and additional fields', () => {
			const props = getPropertiesForOperation('getCompanyProfile');
			const urlProp = props.find((p) => p.name === 'url');
			expect(urlProp).toBeDefined();
			expect(urlProp!.required).toBe(true);
			const afOptions = getAdditionalFieldOptions('getCompanyProfile');
			const afNames = afOptions.map((o: any) => o.name);
			expect(afNames).toContain('categories');
			expect(afNames).toContain('funding_data');
			expect(afNames).toContain('exit_data');
			expect(afNames).toContain('acquisitions');
			expect(afNames).toContain('extra');
			expect(afNames).toContain('use_cache');
		});

		// --- lookupCompany ---
		it('lookupCompany should have company_domain and company_name fields', () => {
			const props = getPropertiesForOperation('lookupCompany');
			expect(props.find((p) => p.name === 'company_domain')).toBeDefined();
			expect(props.find((p) => p.name === 'company_name')).toBeDefined();
			const afOptions = getAdditionalFieldOptions('lookupCompany');
			const afNames = afOptions.map((o: any) => o.name);
			expect(afNames).toContain('company_location');
			expect(afNames).toContain('enrich_profile');
		});

		// --- lookupCompanyById ---
		it('lookupCompanyById should have required id field', () => {
			const props = getPropertiesForOperation('lookupCompanyById');
			const idProp = props.find((p) => p.name === 'id');
			expect(idProp).toBeDefined();
			expect(idProp!.required).toBe(true);
		});

		// --- getCompanyProfilePicture ---
		it('getCompanyProfilePicture should have required company_profile_url', () => {
			const props = getPropertiesForOperation('getCompanyProfilePicture');
			const urlProp = props.find((p) => p.name === 'company_profile_url');
			expect(urlProp).toBeDefined();
			expect(urlProp!.required).toBe(true);
		});

		// --- listEmployees ---
		it('listEmployees should have url and rich additional fields', () => {
			const props = getPropertiesForOperation('listEmployees');
			expect(props.find((p) => p.name === 'url')).toBeDefined();
			const afOptions = getAdditionalFieldOptions('listEmployees');
			const afNames = afOptions.map((o: any) => o.name);
			expect(afNames).toContain('boolean_role_search');
			expect(afNames).toContain('coy_name_match');
			expect(afNames).toContain('country');
			expect(afNames).toContain('employment_status');
			expect(afNames).toContain('enrich_profiles');
			expect(afNames).toContain('page_size');
			expect(afNames).toContain('resolve_numeric_id');
			expect(afNames).toContain('sort_by');
			expect(afNames).toContain('use_cache');
		});

		// --- getEmployeeCount ---
		it('getEmployeeCount should have url and additional fields', () => {
			const props = getPropertiesForOperation('getEmployeeCount');
			expect(props.find((p) => p.name === 'url')).toBeDefined();
			const afOptions = getAdditionalFieldOptions('getEmployeeCount');
			const afNames = afOptions.map((o: any) => o.name);
			expect(afNames).toContain('at_date');
			expect(afNames).toContain('coy_name_match');
			expect(afNames).toContain('employment_status');
			expect(afNames).toContain('estimated_employee_count');
			expect(afNames).toContain('use_cache');
		});

		// --- searchEmployees ---
		it('searchEmployees should have required company_profile_url and keyword_boolean', () => {
			const props = getPropertiesForOperation('searchEmployees');
			const urlProp = props.find((p) => p.name === 'company_profile_url');
			const keywordProp = props.find((p) => p.name === 'keyword_boolean');
			expect(urlProp).toBeDefined();
			expect(urlProp!.required).toBe(true);
			expect(keywordProp).toBeDefined();
			expect(keywordProp!.required).toBe(true);
		});

		// --- getPersonProfile ---
		it('getPersonProfile should have three URL fields (all optional)', () => {
			const props = getPropertiesForOperation('getPersonProfile');
			const profileUrl = props.find((p) => p.name === 'profile_url');
			const twitterUrl = props.find((p) => p.name === 'twitter_profile_url');
			const facebookUrl = props.find((p) => p.name === 'facebook_profile_url');
			expect(profileUrl).toBeDefined();
			expect(profileUrl!.required).toBe(false);
			expect(twitterUrl).toBeDefined();
			expect(facebookUrl).toBeDefined();
			const afOptions = getAdditionalFieldOptions('getPersonProfile');
			const afNames = afOptions.map((o: any) => o.name);
			expect(afNames).toContain('extra');
			expect(afNames).toContain('personal_contact_number');
			expect(afNames).toContain('personal_email');
			expect(afNames).toContain('skills');
			expect(afNames).toContain('use_cache');
		});

		// --- lookupPerson ---
		it('lookupPerson should have required first_name and company_domain', () => {
			const props = getPropertiesForOperation('lookupPerson');
			const firstName = props.find((p) => p.name === 'first_name');
			const companyDomain = props.find((p) => p.name === 'company_domain');
			expect(firstName).toBeDefined();
			expect(firstName!.required).toBe(true);
			expect(companyDomain).toBeDefined();
			expect(companyDomain!.required).toBe(true);
			const afOptions = getAdditionalFieldOptions('lookupPerson');
			const afNames = afOptions.map((o: any) => o.name);
			expect(afNames).toContain('last_name');
			expect(afNames).toContain('title');
			expect(afNames).toContain('location');
			expect(afNames).toContain('similarity_checks');
			expect(afNames).toContain('enrich_profile');
		});

		// --- getPersonProfilePicture ---
		it('getPersonProfilePicture should have required person_profile_url', () => {
			const props = getPropertiesForOperation('getPersonProfilePicture');
			const urlProp = props.find((p) => p.name === 'person_profile_url');
			expect(urlProp).toBeDefined();
			expect(urlProp!.required).toBe(true);
		});

		// --- lookupRole ---
		it('lookupRole should have required company_name and role', () => {
			const props = getPropertiesForOperation('lookupRole');
			const companyName = props.find((p) => p.name === 'company_name');
			const role = props.find((p) => p.name === 'role');
			expect(companyName).toBeDefined();
			expect(companyName!.required).toBe(true);
			expect(role).toBeDefined();
			expect(role!.required).toBe(true);
		});

		// --- reverseEmailLookup ---
		it('reverseEmailLookup should have required email field', () => {
			const props = getPropertiesForOperation('reverseEmailLookup');
			const emailProp = props.find((p) => p.name === 'email');
			expect(emailProp).toBeDefined();
			expect(emailProp!.required).toBe(true);
			const afOptions = getAdditionalFieldOptions('reverseEmailLookup');
			const afNames = afOptions.map((o: any) => o.name);
			expect(afNames).toContain('lookup_depth');
			expect(afNames).toContain('enrich_profile');
		});

		// --- reversePhoneLookup ---
		it('reversePhoneLookup should have required phone_number', () => {
			const props = getPropertiesForOperation('reversePhoneLookup');
			const phoneProp = props.find((p) => p.name === 'phone_number');
			expect(phoneProp).toBeDefined();
			expect(phoneProp!.required).toBe(true);
		});

		// --- lookupWorkEmail ---
		it('lookupWorkEmail should have required profile_url and optional callback_url', () => {
			const props = getPropertiesForOperation('lookupWorkEmail');
			const urlProp = props.find((p) => p.name === 'profile_url');
			expect(urlProp).toBeDefined();
			expect(urlProp!.required).toBe(true);
			const afOptions = getAdditionalFieldOptions('lookupWorkEmail');
			const afNames = afOptions.map((o: any) => o.name);
			expect(afNames).toContain('callback_url');
		});

		// --- getPersonalContact ---
		it('getPersonalContact should have three optional URL fields', () => {
			const props = getPropertiesForOperation('getPersonalContact');
			expect(props.find((p) => p.name === 'profile_url')).toBeDefined();
			expect(props.find((p) => p.name === 'twitter_profile_url')).toBeDefined();
			expect(props.find((p) => p.name === 'facebook_profile_url')).toBeDefined();
			const afOptions = getAdditionalFieldOptions('getPersonalContact');
			const afNames = afOptions.map((o: any) => o.name);
			expect(afNames).toContain('page_size');
		});

		// --- getPersonalEmail ---
		it('getPersonalEmail should have three optional URL fields and email_validation', () => {
			const props = getPropertiesForOperation('getPersonalEmail');
			expect(props.find((p) => p.name === 'profile_url')).toBeDefined();
			expect(props.find((p) => p.name === 'twitter_profile_url')).toBeDefined();
			expect(props.find((p) => p.name === 'facebook_profile_url')).toBeDefined();
			const afOptions = getAdditionalFieldOptions('getPersonalEmail');
			const afNames = afOptions.map((o: any) => o.name);
			expect(afNames).toContain('email_validation');
			expect(afNames).toContain('page_size');
		});

		// --- checkDisposableEmail ---
		it('checkDisposableEmail should have required email field', () => {
			const props = getPropertiesForOperation('checkDisposableEmail');
			const emailProp = props.find((p) => p.name === 'email');
			expect(emailProp).toBeDefined();
			expect(emailProp!.required).toBe(true);
		});

		// --- getSchoolProfile ---
		it('getSchoolProfile should have required url and additional fields', () => {
			const props = getPropertiesForOperation('getSchoolProfile');
			const urlProp = props.find((p) => p.name === 'url');
			expect(urlProp).toBeDefined();
			expect(urlProp!.required).toBe(true);
			const afOptions = getAdditionalFieldOptions('getSchoolProfile');
			const afNames = afOptions.map((o: any) => o.name);
			expect(afNames).toContain('use_cache');
			expect(afNames).toContain('live_fetch');
		});

		// --- listStudents ---
		it('listStudents should have required school_url and additional fields', () => {
			const props = getPropertiesForOperation('listStudents');
			const urlProp = props.find((p) => p.name === 'school_url');
			expect(urlProp).toBeDefined();
			expect(urlProp!.required).toBe(true);
			const afOptions = getAdditionalFieldOptions('listStudents');
			const afNames = afOptions.map((o: any) => o.name);
			expect(afNames).toContain('boolean_search_keyword');
			expect(afNames).toContain('country');
			expect(afNames).toContain('enrich_profiles');
			expect(afNames).toContain('page_size');
			expect(afNames).toContain('resolve_numeric_id');
			expect(afNames).toContain('sort_by');
			expect(afNames).toContain('student_status');
		});

		// --- getJobProfile ---
		it('getJobProfile should have required url', () => {
			const props = getPropertiesForOperation('getJobProfile');
			const urlProp = props.find((p) => p.name === 'url');
			expect(urlProp).toBeDefined();
			expect(urlProp!.required).toBe(true);
		});

		// --- searchJobs ---
		it('searchJobs should have job-related additional fields', () => {
			const afOptions = getAdditionalFieldOptions('searchJobs');
			const afNames = afOptions.map((o: any) => o.name);
			expect(afNames).toContain('search_id');
			expect(afNames).toContain('job_type');
			expect(afNames).toContain('experience_level');
			expect(afNames).toContain('when');
			expect(afNames).toContain('flexibility');
			expect(afNames).toContain('geo_id');
			expect(afNames).toContain('keyword');
		});

		// --- getJobCount ---
		it('getJobCount should have same fields as searchJobs', () => {
			const afOptions = getAdditionalFieldOptions('getJobCount');
			const afNames = afOptions.map((o: any) => o.name);
			expect(afNames).toContain('search_id');
			expect(afNames).toContain('job_type');
			expect(afNames).toContain('experience_level');
			expect(afNames).toContain('when');
			expect(afNames).toContain('flexibility');
			expect(afNames).toContain('geo_id');
			expect(afNames).toContain('keyword');
		});

		// --- searchCompanies ---
		it('searchCompanies should have rich company search fields', () => {
			const afOptions = getAdditionalFieldOptions('searchCompanies');
			const afNames = afOptions.map((o: any) => o.name);
			expect(afNames).toContain('country');
			expect(afNames).toContain('region');
			expect(afNames).toContain('city');
			expect(afNames).toContain('type');
			expect(afNames).toContain('name');
			expect(afNames).toContain('industry');
			expect(afNames).toContain('employee_count_category');
			expect(afNames).toContain('founded_after_year');
			expect(afNames).toContain('funding_amount_min');
			expect(afNames).toContain('page_size');
			expect(afNames).toContain('enrich_profiles');
			expect(afNames).toContain('use_cache');
		});

		// --- searchPeople ---
		it('searchPeople should have rich person search fields', () => {
			const afOptions = getAdditionalFieldOptions('searchPeople');
			const afNames = afOptions.map((o: any) => o.name);
			expect(afNames).toContain('country');
			expect(afNames).toContain('first_name');
			expect(afNames).toContain('last_name');
			expect(afNames).toContain('current_role_title');
			expect(afNames).toContain('current_company_name');
			expect(afNames).toContain('education_school_name');
			expect(afNames).toContain('headline');
			expect(afNames).toContain('skills');
		});

		// --- getCreditBalance ---
		it('getCreditBalance should have no parameters', () => {
			const props = getPropertiesForOperation('getCreditBalance');
			expect(props.length).toBe(0);
		});
	});

	describe('Endpoint URL Mapping', () => {
		// Map each operation value to expected endpoint
		const operationEndpointMap: Record<string, string> = {
			getCompanyProfile: '/api/v2/company',
			lookupCompany: '/api/v2/company/resolve',
			lookupCompanyById: '/api/v2/company/resolve-id',
			getCompanyProfilePicture: '/api/v2/company/profile-picture',
			listEmployees: '/api/v2/company/employees/',
			getEmployeeCount: '/api/v2/company/employees/count',
			searchEmployees: '/api/v2/company/employee/search/',
			getPersonProfile: '/api/v2/profile',
			lookupPerson: '/api/v2/profile/resolve',
			getPersonProfilePicture: '/api/v2/person/profile-picture',
			lookupRole: '/api/v2/find/company/role/',
			reverseEmailLookup: '/api/v2/profile/resolve/email',
			reversePhoneLookup: '/api/v2/resolve/phone',
			lookupWorkEmail: '/api/v2/profile/email',
			getPersonalContact: '/api/v2/contact-api/personal-contact',
			getPersonalEmail: '/api/v2/contact-api/personal-email',
			checkDisposableEmail: '/api/v2/disposable-email',
			getSchoolProfile: '/api/v2/school',
			listStudents: '/api/v2/school/students/',
			getJobProfile: '/api/v2/job',
			searchJobs: '/api/v2/company/job',
			getJobCount: '/api/v2/company/job/count',
			searchCompanies: '/api/v2/search/company',
			searchPeople: '/api/v2/search/person',
			getCreditBalance: '/api/v2/credit-balance',
		};

		// The execute method contains the URL mapping logic. We verify it indirectly
		// by checking the source code of the execute method via a mock-based test.
		// Here we do a structural test: verify each operation exists in the node.
		it('should map all 25 operations to correct API endpoints', () => {
			const operations = Object.keys(operationEndpointMap);
			expect(operations.length).toBe(25);

			const operationProps = node.description.properties.filter(
				(p) => p.name === 'operation',
			);
			const optionValues: string[] = [];
			for (const prop of operationProps) {
				for (const opt of (prop as any).options) {
					optionValues.push(opt.value);
				}
			}

			for (const op of operations) {
				expect(optionValues).toContain(op);
			}
		});
	});

	describe('Execute Method - URL and Query String Verification', () => {
		// Helper to create a mock execution context
		const createMockContext = (
			operation: string,
			params: Record<string, any>,
			additionalFields: Record<string, any> = {},
		) => {
			const mockResponse = { data: 'test' };

			const context = {
				getInputData: () => [{ json: {} }],
				getNodeParameter: (name: string, _index: number, defaultValue?: any) => {
					if (name === 'operation') return operation;
					if (name === 'additionalFields') return additionalFields;
					if (params[name] !== undefined) return params[name];
					return defaultValue !== undefined ? defaultValue : '';
				},
				helpers: {
					httpRequestWithAuthentication: jest.fn().mockResolvedValue(mockResponse),
					constructExecutionMetaData: jest.fn().mockImplementation((data) => data),
					returnJsonArray: jest.fn().mockImplementation((data) => [{ json: data }]),
				},
				getNode: () => ({ name: 'EnrichLayer' }),
				continueOnFail: () => false,
			};

			return context;
		};

		it('getCompanyProfile should call /api/v2/company with url param', async () => {
			const ctx = createMockContext('getCompanyProfile', {
				url: 'https://www.linkedin.com/company/google/',
			});
			await node.execute.call(ctx as any);
			expect(ctx.helpers.httpRequestWithAuthentication).toHaveBeenCalledWith(
				'enrichLayerApi',
				expect.objectContaining({
					method: 'GET',
					url: 'https://enrichlayer.com/api/v2/company',
					qs: expect.objectContaining({ url: 'https://www.linkedin.com/company/google/' }),
				}),
			);
		});

		it('lookupCompany should call /api/v2/company/resolve', async () => {
			const ctx = createMockContext('lookupCompany', {
				company_domain: 'google.com',
				company_name: '',
			});
			await node.execute.call(ctx as any);
			expect(ctx.helpers.httpRequestWithAuthentication).toHaveBeenCalledWith(
				'enrichLayerApi',
				expect.objectContaining({
					url: 'https://enrichlayer.com/api/v2/company/resolve',
					qs: expect.objectContaining({ company_domain: 'google.com' }),
				}),
			);
		});

		it('lookupCompanyById should call /api/v2/company/resolve-id', async () => {
			const ctx = createMockContext('lookupCompanyById', { id: '1441' });
			await node.execute.call(ctx as any);
			expect(ctx.helpers.httpRequestWithAuthentication).toHaveBeenCalledWith(
				'enrichLayerApi',
				expect.objectContaining({
					url: 'https://enrichlayer.com/api/v2/company/resolve-id',
					qs: expect.objectContaining({ id: '1441' }),
				}),
			);
		});

		it('getCompanyProfilePicture should call /api/v2/company/profile-picture', async () => {
			const ctx = createMockContext('getCompanyProfilePicture', {
				company_profile_url: 'https://www.linkedin.com/company/apple/',
			});
			await node.execute.call(ctx as any);
			expect(ctx.helpers.httpRequestWithAuthentication).toHaveBeenCalledWith(
				'enrichLayerApi',
				expect.objectContaining({
					url: 'https://enrichlayer.com/api/v2/company/profile-picture',
				}),
			);
		});

		it('listEmployees should call /api/v2/company/employees/', async () => {
			const ctx = createMockContext('listEmployees', {
				url: 'https://www.linkedin.com/company/microsoft',
			}, { employment_status: 'current' });
			await node.execute.call(ctx as any);
			expect(ctx.helpers.httpRequestWithAuthentication).toHaveBeenCalledWith(
				'enrichLayerApi',
				expect.objectContaining({
					url: 'https://enrichlayer.com/api/v2/company/employees/',
					qs: expect.objectContaining({
						url: 'https://www.linkedin.com/company/microsoft',
						employment_status: 'current',
					}),
				}),
			);
		});

		it('getEmployeeCount should call /api/v2/company/employees/count', async () => {
			const ctx = createMockContext('getEmployeeCount', {
				url: 'https://www.linkedin.com/company/apple/',
			});
			await node.execute.call(ctx as any);
			expect(ctx.helpers.httpRequestWithAuthentication).toHaveBeenCalledWith(
				'enrichLayerApi',
				expect.objectContaining({
					url: 'https://enrichlayer.com/api/v2/company/employees/count',
				}),
			);
		});

		it('searchEmployees should call /api/v2/company/employee/search/', async () => {
			const ctx = createMockContext('searchEmployees', {
				company_profile_url: 'https://www.linkedin.com/company/microsoft/',
				keyword_boolean: 'ceo OR cto',
			});
			await node.execute.call(ctx as any);
			expect(ctx.helpers.httpRequestWithAuthentication).toHaveBeenCalledWith(
				'enrichLayerApi',
				expect.objectContaining({
					url: 'https://enrichlayer.com/api/v2/company/employee/search/',
					qs: expect.objectContaining({
						company_profile_url: 'https://www.linkedin.com/company/microsoft/',
						keyword_boolean: 'ceo OR cto',
					}),
				}),
			);
		});

		it('getPersonProfile should call /api/v2/profile with profile_url', async () => {
			const ctx = createMockContext('getPersonProfile', {
				profile_url: 'https://linkedin.com/in/test/',
				twitter_profile_url: '',
				facebook_profile_url: '',
			});
			await node.execute.call(ctx as any);
			expect(ctx.helpers.httpRequestWithAuthentication).toHaveBeenCalledWith(
				'enrichLayerApi',
				expect.objectContaining({
					url: 'https://enrichlayer.com/api/v2/profile',
					qs: expect.objectContaining({ profile_url: 'https://linkedin.com/in/test/' }),
				}),
			);
		});

		it('lookupPerson should call /api/v2/profile/resolve', async () => {
			const ctx = createMockContext('lookupPerson', {
				first_name: 'Bill',
				company_domain: 'gatesfoundation.org',
			});
			await node.execute.call(ctx as any);
			expect(ctx.helpers.httpRequestWithAuthentication).toHaveBeenCalledWith(
				'enrichLayerApi',
				expect.objectContaining({
					url: 'https://enrichlayer.com/api/v2/profile/resolve',
					qs: expect.objectContaining({
						first_name: 'Bill',
						company_domain: 'gatesfoundation.org',
					}),
				}),
			);
		});

		it('getPersonProfilePicture should call /api/v2/person/profile-picture', async () => {
			const ctx = createMockContext('getPersonProfilePicture', {
				person_profile_url: 'https://www.linkedin.com/in/williamhgates/',
			});
			await node.execute.call(ctx as any);
			expect(ctx.helpers.httpRequestWithAuthentication).toHaveBeenCalledWith(
				'enrichLayerApi',
				expect.objectContaining({
					url: 'https://enrichlayer.com/api/v2/person/profile-picture',
				}),
			);
		});

		it('lookupRole should call /api/v2/find/company/role/', async () => {
			const ctx = createMockContext('lookupRole', {
				company_name: 'enrichlayer',
				role: 'ceo',
			});
			await node.execute.call(ctx as any);
			expect(ctx.helpers.httpRequestWithAuthentication).toHaveBeenCalledWith(
				'enrichLayerApi',
				expect.objectContaining({
					url: 'https://enrichlayer.com/api/v2/find/company/role/',
					qs: expect.objectContaining({ company_name: 'enrichlayer', role: 'ceo' }),
				}),
			);
		});

		it('reverseEmailLookup should call /api/v2/profile/resolve/email', async () => {
			const ctx = createMockContext('reverseEmailLookup', {
				email: 'test@example.com',
			});
			await node.execute.call(ctx as any);
			expect(ctx.helpers.httpRequestWithAuthentication).toHaveBeenCalledWith(
				'enrichLayerApi',
				expect.objectContaining({
					url: 'https://enrichlayer.com/api/v2/profile/resolve/email',
					qs: expect.objectContaining({ email: 'test@example.com' }),
				}),
			);
		});

		it('reversePhoneLookup should call /api/v2/resolve/phone', async () => {
			const ctx = createMockContext('reversePhoneLookup', {
				phone_number: '+14155552671',
			});
			await node.execute.call(ctx as any);
			expect(ctx.helpers.httpRequestWithAuthentication).toHaveBeenCalledWith(
				'enrichLayerApi',
				expect.objectContaining({
					url: 'https://enrichlayer.com/api/v2/resolve/phone',
					qs: expect.objectContaining({ phone_number: '+14155552671' }),
				}),
			);
		});

		it('lookupWorkEmail should call /api/v2/profile/email', async () => {
			const ctx = createMockContext('lookupWorkEmail', {
				profile_url: 'https://linkedin.com/in/test',
			});
			await node.execute.call(ctx as any);
			expect(ctx.helpers.httpRequestWithAuthentication).toHaveBeenCalledWith(
				'enrichLayerApi',
				expect.objectContaining({
					url: 'https://enrichlayer.com/api/v2/profile/email',
				}),
			);
		});

		it('getPersonalContact should call /api/v2/contact-api/personal-contact', async () => {
			const ctx = createMockContext('getPersonalContact', {
				profile_url: 'https://linkedin.com/in/test',
				twitter_profile_url: '',
				facebook_profile_url: '',
			});
			await node.execute.call(ctx as any);
			expect(ctx.helpers.httpRequestWithAuthentication).toHaveBeenCalledWith(
				'enrichLayerApi',
				expect.objectContaining({
					url: 'https://enrichlayer.com/api/v2/contact-api/personal-contact',
				}),
			);
		});

		it('getPersonalEmail should call /api/v2/contact-api/personal-email', async () => {
			const ctx = createMockContext('getPersonalEmail', {
				profile_url: 'https://linkedin.com/in/test',
				twitter_profile_url: '',
				facebook_profile_url: '',
			});
			await node.execute.call(ctx as any);
			expect(ctx.helpers.httpRequestWithAuthentication).toHaveBeenCalledWith(
				'enrichLayerApi',
				expect.objectContaining({
					url: 'https://enrichlayer.com/api/v2/contact-api/personal-email',
				}),
			);
		});

		it('checkDisposableEmail should call /api/v2/disposable-email', async () => {
			const ctx = createMockContext('checkDisposableEmail', {
				email: 'test@temp.com',
			});
			await node.execute.call(ctx as any);
			expect(ctx.helpers.httpRequestWithAuthentication).toHaveBeenCalledWith(
				'enrichLayerApi',
				expect.objectContaining({
					url: 'https://enrichlayer.com/api/v2/disposable-email',
					qs: expect.objectContaining({ email: 'test@temp.com' }),
				}),
			);
		});

		it('getSchoolProfile should call /api/v2/school', async () => {
			const ctx = createMockContext('getSchoolProfile', {
				url: 'https://www.linkedin.com/school/nus',
			});
			await node.execute.call(ctx as any);
			expect(ctx.helpers.httpRequestWithAuthentication).toHaveBeenCalledWith(
				'enrichLayerApi',
				expect.objectContaining({
					url: 'https://enrichlayer.com/api/v2/school',
				}),
			);
		});

		it('listStudents should call /api/v2/school/students/', async () => {
			const ctx = createMockContext('listStudents', {
				school_url: 'https://www.linkedin.com/school/stanford-university',
			});
			await node.execute.call(ctx as any);
			expect(ctx.helpers.httpRequestWithAuthentication).toHaveBeenCalledWith(
				'enrichLayerApi',
				expect.objectContaining({
					url: 'https://enrichlayer.com/api/v2/school/students/',
				}),
			);
		});

		it('getJobProfile should call /api/v2/job', async () => {
			const ctx = createMockContext('getJobProfile', {
				url: 'https://www.linkedin.com/jobs/view/123/',
			});
			await node.execute.call(ctx as any);
			expect(ctx.helpers.httpRequestWithAuthentication).toHaveBeenCalledWith(
				'enrichLayerApi',
				expect.objectContaining({
					url: 'https://enrichlayer.com/api/v2/job',
				}),
			);
		});

		it('searchJobs should call /api/v2/company/job', async () => {
			const ctx = createMockContext('searchJobs', {}, { search_id: '2790400', job_type: 'full-time' });
			await node.execute.call(ctx as any);
			expect(ctx.helpers.httpRequestWithAuthentication).toHaveBeenCalledWith(
				'enrichLayerApi',
				expect.objectContaining({
					url: 'https://enrichlayer.com/api/v2/company/job',
					qs: expect.objectContaining({ search_id: '2790400', job_type: 'full-time' }),
				}),
			);
		});

		it('getJobCount should call /api/v2/company/job/count', async () => {
			const ctx = createMockContext('getJobCount', {}, { search_id: '2790400' });
			await node.execute.call(ctx as any);
			expect(ctx.helpers.httpRequestWithAuthentication).toHaveBeenCalledWith(
				'enrichLayerApi',
				expect.objectContaining({
					url: 'https://enrichlayer.com/api/v2/company/job/count',
				}),
			);
		});

		it('searchCompanies should call /api/v2/search/company', async () => {
			const ctx = createMockContext('searchCompanies', {}, { country: 'US', name: 'Google' });
			await node.execute.call(ctx as any);
			expect(ctx.helpers.httpRequestWithAuthentication).toHaveBeenCalledWith(
				'enrichLayerApi',
				expect.objectContaining({
					url: 'https://enrichlayer.com/api/v2/search/company',
					qs: expect.objectContaining({ country: 'US', name: 'Google' }),
				}),
			);
		});

		it('searchPeople should call /api/v2/search/person', async () => {
			const ctx = createMockContext('searchPeople', {}, { first_name: 'Bill', country: 'US' });
			await node.execute.call(ctx as any);
			expect(ctx.helpers.httpRequestWithAuthentication).toHaveBeenCalledWith(
				'enrichLayerApi',
				expect.objectContaining({
					url: 'https://enrichlayer.com/api/v2/search/person',
					qs: expect.objectContaining({ first_name: 'Bill', country: 'US' }),
				}),
			);
		});

		it('getCreditBalance should call /api/v2/credit-balance with empty qs', async () => {
			const ctx = createMockContext('getCreditBalance', {});
			await node.execute.call(ctx as any);
			expect(ctx.helpers.httpRequestWithAuthentication).toHaveBeenCalledWith(
				'enrichLayerApi',
				expect.objectContaining({
					url: 'https://enrichlayer.com/api/v2/credit-balance',
					qs: {},
				}),
			);
		});
	});

	describe('Error Handling', () => {
		it('should throw NodeApiError on API failure when continueOnFail is false', async () => {
			const mockError = new Error('API Error');
			const context = {
				getInputData: () => [{ json: {} }],
				getNodeParameter: (name: string) => {
					if (name === 'operation') return 'getCreditBalance';
					return '';
				},
				helpers: {
					httpRequestWithAuthentication: jest.fn().mockRejectedValue(mockError),
					constructExecutionMetaData: jest.fn(),
					returnJsonArray: jest.fn(),
				},
				getNode: () => ({ name: 'EnrichLayer' }),
				continueOnFail: () => false,
			};

			await expect(node.execute.call(context as any)).rejects.toThrow();
		});

		it('should return error data when continueOnFail is true', async () => {
			const mockError = new Error('API Error');
			const context = {
				getInputData: () => [{ json: {} }],
				getNodeParameter: (name: string) => {
					if (name === 'operation') return 'getCreditBalance';
					return '';
				},
				helpers: {
					httpRequestWithAuthentication: jest.fn().mockRejectedValue(mockError),
					constructExecutionMetaData: jest.fn().mockImplementation((data) => data),
					returnJsonArray: jest.fn().mockImplementation((data) => [{ json: data }]),
				},
				getNode: () => ({ name: 'EnrichLayer' }),
				continueOnFail: () => true,
			};

			const result = await node.execute.call(context as any);
			expect(result).toBeDefined();
			expect(result[0]).toBeDefined();
		});
	});
});
