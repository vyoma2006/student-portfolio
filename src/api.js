// Central place for all backend API calls + token handling.
// Change API_URL if your backend runs on a different port.
const API_URL = 'http://localhost:5050';
const TOKEN_KEY = 'token';

// ---- token helpers ----
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);
export const isLoggedIn = () => Boolean(getToken());

// ---- core request helper ----
// protectedCall = true  → sends the Bearer token, and a 401 means the session
//                         is invalid/expired → clear token and go to /login
// protectedCall = false → login/register, where a 401 just means bad credentials
async function request(path, { method = 'GET', body, protectedCall = true } = {}) {
    const headers = {};
    if (body) headers['Content-Type'] = 'application/json';

    const token = getToken();
    if (protectedCall && token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${API_URL}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });

    const data = await res.json().catch(() => ({}));

    if (res.status === 401 && protectedCall) {
        clearToken();
        window.location.assign('/login?expired=1');
        throw new Error(data.message || 'Session expired. Please log in again.');
    }

    if (!res.ok) {
        const message = data.errors?.join(', ') || data.message || `Request failed (${res.status})`;
        throw new Error(message);
    }

    return data;
}

// ---- auth ----
export const register = (email, password) =>
    request('/register', { method: 'POST', body: { email, password }, protectedCall: false });

export async function login(email, password) {
    const data = await request('/login', {
        method: 'POST',
        body: { email, password },
        protectedCall: false,
    });
    setToken(data.token);
    return data;
}

export const logout = () => clearToken();
export const getMe = () => request('/me');

// ---- tasks (all protected) ----
export const getTasks = () => request('/tasks');
export const createTask = (task) => request('/tasks', { method: 'POST', body: task });
export const updateTask = (id, updates) =>
    request(`/tasks/${id}`, { method: 'PUT', body: updates });
export const deleteTask = (id) => request(`/tasks/${id}`, { method: 'DELETE' });