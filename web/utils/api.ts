import { API_CONFIG } from '@/config/index'

export const apiClient = {
  login: async (email: string, senha: string) => {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.endpoints.login}`, {
      method: 'POST',
      headers: API_CONFIG.headers,
      body: JSON.stringify({ email, senha }),
    })
    return response
  },

  validateToken: async (token: string) => {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.endpoints.validateToken}`, {
      method: 'GET',
      headers: {
        ...API_CONFIG.headers,
        Authorization: `Bearer ${token}`,
      },
    })
    return response
  },
}
