import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para adicionar token JWT
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para tratar respostas
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
        return Promise.reject(error);
    }
);

// Auth Services
export const authService = {
    async login(credentials) {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },

    async register(userData) {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },
};

// Coleta Services
export const coletaService = {
    async getAllColetas(filters = {}) {
        const params = new URLSearchParams();

        if (filters.bairro) params.append('bairro', filters.bairro);
        if (filters.diaSemana) params.append('diaSemana', filters.diaSemana);
        if (filters.tipoColeta) params.append('tipoColeta', filters.tipoColeta);

        const response = await api.get(`/coleta?${params.toString()}`);
        return response.data;
    },

    async getColetaById(id) {
        const response = await api.get(`/coleta/${id}`);
        return response.data;
    },

    async getBairros() {
        const response = await api.get('/coleta/bairros');
        return response.data;
    },

    async createColeta(coletaData) {
        const response = await api.post('/coleta', coletaData);
        return response.data;
    },

    async updateColeta(id, coletaData) {
        const response = await api.patch(`/coleta/${id}`, coletaData);
        return response.data;
    },

    async deleteColeta(id) {
        const response = await api.delete(`/coleta/${id}`);
        return response.data;
    },
};

export default api;
