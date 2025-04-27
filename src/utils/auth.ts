// Funções de autenticação

/**
 * Obtém o token de autenticação do localStorage
 * @returns O token de autenticação ou null se não estiver autenticado
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

/**
 * Verifica se o usuário está autenticado
 * @returns true se o usuário estiver autenticado, false caso contrário
 */
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

/**
 * Salva o token de autenticação no localStorage
 * @param token O token de autenticação
 */
export const setAuthToken = (token: string): void => {
  localStorage.setItem('authToken', token);
};

/**
 * Remove o token de autenticação do localStorage
 */
export const removeAuthToken = (): void => {
  localStorage.removeItem('authToken');
};

/**
 * Obtém o ID do usuário autenticado
 * @returns O ID do usuário ou null se não estiver autenticado
 */
export const getUserId = (): number | null => {
  const userId = localStorage.getItem('userId');
  return userId ? parseInt(userId) : null;
};

/**
 * Obtém o papel do usuário autenticado (admin, editor, etc)
 * @returns O papel do usuário ou null se não estiver autenticado
 */
export const getUserRole = (): string | null => {
  return localStorage.getItem('userRole');
};

/**
 * Verifica se o usuário é administrador
 * @returns true se o usuário for administrador, false caso contrário
 */
export const isAdmin = (): boolean => {
  return getUserRole() === 'admin';
};
