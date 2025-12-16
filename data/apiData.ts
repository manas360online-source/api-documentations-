import { ApiEndpoint } from '../types';

export const endpoints: ApiEndpoint[] = [
  {
    id: 'get-patients',
    method: 'GET',
    path: '/v1/patients',
    summary: 'List all patients',
    description: 'Retrieve a paginated list of patients. Includes basic demographic info.',
    tags: ['Patients'],
    parameters: [
      { name: 'limit', type: 'integer', in: 'query', required: false, description: 'Max number of results (default 20)' },
      { name: 'offset', type: 'integer', in: 'query', required: false, description: 'Number of records to skip' },
    ],
    responses: [
      {
        status: 200,
        description: 'Successful response',
        schema: {
          data: [
            { id: 'pat_123', name: 'John Doe', status: 'Active', last_visit: '2023-10-24' },
            { id: 'pat_124', name: 'Jane Smith', status: 'Discharged', last_visit: '2023-09-12' }
          ],
          meta: { total: 452, limit: 20 }
        }
      }
    ]
  },
  {
    id: 'get-patient-detail',
    method: 'GET',
    path: '/v1/patients/{id}',
    summary: 'Get patient details',
    description: 'Retrieve full details for a specific patient, including medical history summary.',
    tags: ['Patients'],
    parameters: [
      { name: 'id', type: 'string', in: 'path', required: true, description: 'The unique patient ID' },
    ],
    responses: [
      {
        status: 200,
        description: 'Patient found',
        schema: {
          id: 'pat_123',
          name: 'John Doe',
          dob: '1985-04-12',
          insurance_provider: 'BlueCross',
          assigned_therapist: 'ther_998',
          allergies: ['Penicillin']
        }
      },
      { status: 404, description: 'Patient not found' }
    ]
  },
  {
    id: 'create-document',
    method: 'POST',
    path: '/v1/patients/{id}/documents',
    summary: 'Upload Patient Document',
    description: 'Upload a clinical note, lab result, or imaging report for a patient.',
    tags: ['Documents'],
    parameters: [
      { name: 'id', type: 'string', in: 'path', required: true, description: 'Patient ID' }
    ],
    requestBody: {
      type: 'object',
      properties: {
        document_type: { type: 'string', enum: ['Lab Result', 'Clinical Note', 'Imaging'] },
        content: { type: 'string', description: 'Base64 encoded content or raw text' },
        provider_id: { type: 'string' }
      }
    },
    responses: [
      {
        status: 201,
        description: 'Document uploaded successfully',
        schema: { doc_id: 'doc_555', uploaded_at: '2023-10-27T10:00:00Z' }
      }
    ]
  },
  {
    id: 'analyze-document',
    method: 'POST',
    path: '/v1/documents/analyze',
    summary: 'AI Document Analysis',
    description: 'Uses MedCore AI (powered by Gemini) to analyze unstructured medical text and extract structured clinical data.',
    tags: ['Documents', 'AI'],
    isAiPowered: true,
    requestBody: {
      type: 'object',
      properties: {
        text: { type: 'string', description: 'The raw clinical note text to analyze' }
      }
    },
    responses: [
      {
        status: 200,
        description: 'Analysis successful',
        schema: {
          summary: "Patient presents with...",
          symptoms: ["Cough", "Fever"],
          urgency: "Medium"
        }
      }
    ]
  },
  {
    id: 'list-therapists',
    method: 'GET',
    path: '/v1/therapists',
    summary: 'List Therapists',
    description: 'Retrieve a list of available therapists and their specializations.',
    tags: ['Therapists'],
    parameters: [
      { name: 'specialty', type: 'string', in: 'query', required: false, description: 'Filter by specialty (e.g., Physical, Occupational)' }
    ],
    responses: [
      {
        status: 200,
        description: 'Success',
        schema: {
          data: [
            { id: 'ther_998', name: 'Dr. Sarah Connor', specialty: 'Physical Therapy', available: true },
            { id: 'ther_999', name: 'Dr. Miles Dyson', specialty: 'Neurology', available: false }
          ]
        }
      }
    ]
  }
];

export const errorCodes = [
  { code: 400, message: 'Bad Request', description: 'The request was unacceptable, often due to missing a required parameter.' },
  { code: 401, message: 'Unauthorized', description: 'No valid API key provided.' },
  { code: 402, message: 'Request Failed', description: 'The parameters were valid but the request failed.' },
  { code: 404, message: 'Not Found', description: 'The requested resource doesn\'t exist.' },
  { code: 429, message: 'Too Many Requests', description: 'You hit the rate limit (100 req/min).' },
  { code: 500, message: 'Server Error', description: 'Something went wrong on MedCore\'s end.' },
];
