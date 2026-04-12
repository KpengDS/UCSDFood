import client from '@/api/client';

export const schema = {
  name: 'Inquiry',
  type: 'object',
  properties: {
    name:     { type: 'string', description: 'Full name' },
    email:    { type: 'string', description: 'Email address' },
    role:     { type: 'string', enum: ['family', 'donor', 'volunteer', 'organization', 'other'], description: 'How the person wants to engage' },
    message:  { type: 'string', description: 'Their message or question' },
    zip_code: { type: 'string', description: 'Their ZIP code for location matching' },
    status:   { type: 'string', enum: ['new', 'contacted', 'resolved'], default: 'new' },
  },
  required: ['name', 'email', 'role', 'message'],
};

const ENDPOINT = '/entities/inquiries';

const Inquiry = {
  schema,
  list:   (params)     => client.get(ENDPOINT, { params }),
  get:    (id)         => client.get(`${ENDPOINT}/${id}`),
  create: (data)       => client.post(ENDPOINT, data),
  update: (id, data)   => client.put(`${ENDPOINT}/${id}`, data),
  delete: (id)         => client.del(`${ENDPOINT}/${id}`),
};

export default Inquiry;
