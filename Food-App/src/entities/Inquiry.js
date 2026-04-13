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

export default { schema };
