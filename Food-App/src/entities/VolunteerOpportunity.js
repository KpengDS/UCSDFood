import client from '@/api/client';

export const schema = {
  name: 'VolunteerOpportunity',
  type: 'object',
  properties: {
    title:             { type: 'string', description: 'Title of the volunteer opportunity' },
    organization_name: { type: 'string', description: 'Name of the organization' },
    description:       { type: 'string', description: 'What the volunteer will do' },
    date:              { type: 'string', format: 'date-time', description: 'Date of the opportunity' },
    location:          { type: 'string', description: 'Where to show up' },
    city:              { type: 'string' },
    slots_available:   { type: 'number', description: 'Number of volunteer slots' },
    skills_needed:     { type: 'string', description: 'Any specific skills or requirements' },
    contact_email:     { type: 'string' },
    status:            { type: 'string', enum: ['open', 'filled', 'completed'], default: 'open' },
  },
  required: ['title', 'organization_name'],
};

const ENDPOINT = '/entities/volunteer-opportunities';

const VolunteerOpportunity = {
  schema,
  list:   (params)     => client.get(ENDPOINT, { params }),
  get:    (id)         => client.get(`${ENDPOINT}/${id}`),
  create: (data)       => client.post(ENDPOINT, data),
  update: (id, data)   => client.put(`${ENDPOINT}/${id}`, data),
  delete: (id)         => client.del(`${ENDPOINT}/${id}`),
};

export default VolunteerOpportunity;
