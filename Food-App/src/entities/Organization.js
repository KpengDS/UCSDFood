import client from '@/api/client';

export const schema = {
  name: 'Organization',
  type: 'object',
  properties: {
    name:                       { type: 'string', description: 'Organization name' },
    type:                       { type: 'string', enum: ['nonprofit', 'faith_based', 'community', 'government', 'other'], description: 'Type of organization' },
    description:                { type: 'string', description: 'Brief description of the organization' },
    address:                    { type: 'string', description: 'Main address' },
    city:                       { type: 'string' },
    state:                      { type: 'string', default: 'MD' },
    zip_code:                   { type: 'string' },
    contact_email:              { type: 'string' },
    contact_phone:              { type: 'string' },
    website_url:                { type: 'string' },
    accepts_food_donations:     { type: 'boolean', default: false },
    accepts_monetary_donations: { type: 'boolean', default: false },
    needs_volunteers:           { type: 'boolean', default: false },
    service_area:               { type: 'string', description: 'Geographic area served' },
  },
  required: ['name', 'type'],
};

const ENDPOINT = '/entities/organizations';

const Organization = {
  schema,
  list:   (params)     => client.get(ENDPOINT, { params }),
  get:    (id)         => client.get(`${ENDPOINT}/${id}`),
  create: (data)       => client.post(ENDPOINT, data),
  update: (id, data)   => client.put(`${ENDPOINT}/${id}`, data),
  delete: (id)         => client.del(`${ENDPOINT}/${id}`),
};

export default Organization;
