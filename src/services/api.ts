import axios, { AxiosError } from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:3333/api',

})
export const handleApiError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;

        if (axiosError.response?.status === 401) {
            return { credentials: 'Usuário ou senha inválidos' };
        } else if (axiosError.response) {
            return {
                general: typeof axiosError.response.data === 'object' && axiosError.response.data !== null && 'message' in axiosError.response.data 
                    ? String(axiosError.response.data.message) 
                    : 'Erro ao processar requisição'
            };
        } else if (axiosError.request) {
            return {
                general: 'Falha na conexão. Por favor, tente novamente.'
            };
        }
    }

    return {
        general: 'Ocorreu um erro inesperado. Por favor, tente novamente.'
    };
};