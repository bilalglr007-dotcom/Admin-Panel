const BASE_URL = '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: token } : {}),
  };
};

const request = async (method, endpoint, body = null) => {
  const options = {
    method,
    headers: getAuthHeaders(),
  };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(`${BASE_URL}${endpoint}`, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error?.message || 'İstek başarısız oldu');
  return data;
};

export const authAPI = {
  login: (body) => request('POST', '/auth/login', body),
  register: (body) => request('POST', '/auth/register', body),
};

export const profileAPI = {
  getMe: () => request('GET', '/users/profile/me'),
  updateMe: (body) => request('PUT', '/users/profile/me', body),
};

export const usersAPI = {
  getAll: () => request('GET', '/users'),
  getById: (id) => request('GET', `/users/${id}`),
  create: (body) => request('POST', '/users', body),
  update: (id, body) => request('PUT', `/users/${id}`, body),
  delete: (id) => request('DELETE', `/users/${id}`),
};

export const rolesAPI = {
  getAll: () => request('GET', '/roles'),
  getById: (id) => request('GET', `/roles/${id}`),
  create: (body) => request('POST', '/roles', body),
  update: (id, body) => request('PUT', `/roles/${id}`, body),
  delete: (id) => request('DELETE', `/roles/${id}`),
};

export const categoriesAPI = {
  getAll: () => request('GET', '/categories'),
  getById: (id) => request('GET', `/categories/${id}`),
  create: (body) => request('POST', '/categories', body),
  update: (id, body) => request('PUT', `/categories/${id}`, body),
  delete: (id) => request('DELETE', `/categories/${id}`),
};

export const userRolesAPI = {
  getAll: () => request('GET', '/user-roles'),
  create: (body) => request('POST', '/user-roles', body),
  delete: (id) => request('DELETE', `/user-roles/${id}`),
};

export const rolePrivilegesAPI = {
  getAll: () => request('GET', '/role-privileges'),
  create: (body) => request('POST', '/role-privileges', body),
  update: (id, body) => request('PUT', `/role-privileges/${id}`, body),
  delete: (id) => request('DELETE', `/role-privileges/${id}`),
};

export const auditLogsAPI = {
  getAll: () => request('GET', '/audit-logs'),
  getById: (id) => request('GET', `/audit-logs/${id}`),
  delete: (id) => request('DELETE', `/audit-logs/${id}`),
};
