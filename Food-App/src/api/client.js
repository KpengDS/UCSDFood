/**
 * API Client — replaces the Base44 base44Client.js
 *
 * Reads configuration from environment variables and app-params,
 * and exports a configured client instance.
 */
import { appParams } from '@/lib/app-params';

const appId = appParams.appId || import.meta.env.VITE_APP_ID;
const appToken = appParams.token || import.meta.env.VITE_APP_TOKEN;
const appBaseUrl = appParams.appBaseUrl || import.meta.env.VITE_APP_BASE_URL;
const functionsVersion = appParams.functionsVersion || import.meta.env.VITE_FUNCTIONS_VERSION;

function createClient({ appId, token, functionsVersion, appBaseUrl }) {
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  async function request(path, options = {}) {
    const url = `${appBaseUrl}${path}`;
    const res = await fetch(url, {
      ...options,
      headers: { ...headers, ...options.headers },
    });
    if (!res.ok) {
      throw new Error(`API request failed: ${res.status} ${res.statusText}`);
    }
    return res.json();
  }

  return {
    appId,
    functionsVersion,
    get:  (path, opts) => request(path, { method: 'GET', ...opts }),
    post: (path, body, opts) => request(path, { method: 'POST', body: JSON.stringify(body), ...opts }),
    put:  (path, body, opts) => request(path, { method: 'PUT', body: JSON.stringify(body), ...opts }),
    del:  (path, opts) => request(path, { method: 'DELETE', ...opts }),
  };
}

const client = createClient({
  appId,
  token: appToken,
  functionsVersion,
  appBaseUrl,
});

/**
 * Entity CRUD helper factory — creates list/filter/get/create/update/delete
 * methods that mirror the Base44 SDK entity interface.
 */
function createEntityHelper(entityName) {
  const endpoint = `/entities/${entityName}`;

  return {
    list: (sort, limit) => {
      const params = new URLSearchParams();
      if (sort) params.set('sort', sort);
      if (limit) params.set('limit', limit);
      const qs = params.toString();
      return client.get(`${endpoint}${qs ? `?${qs}` : ''}`);
    },
    filter: (filters) => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => params.set(k, v));
      return client.get(`${endpoint}?${params.toString()}`);
    },
    get: (id) => client.get(`${endpoint}/${id}`),
    create: (data) => client.post(endpoint, data),
    update: (id, data) => client.put(`${endpoint}/${id}`, data),
    delete: (id) => client.del(`${endpoint}/${id}`),
  };
}

/**
 * base44 — drop-in replacement for the Base44 SDK.
 * Pages import { base44 } from "@/api/base44Client" which we alias here.
 * Usage: base44.entities.FoodEvent.list("-event_date", 50)
 */
export const base44 = {
  auth: {
    me: () => client.get('/auth/me'),
  },
  entities: {
    FoodEvent: createEntityHelper('food-events'),
    Inquiry: createEntityHelper('inquiries'),
    Organization: createEntityHelper('organizations'),
    VolunteerOpportunity: createEntityHelper('volunteer-opportunities'),
  },
};

export default client;
