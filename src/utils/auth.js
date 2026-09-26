// The login token is kept in localStorage so it survives a page refresh.

const TOKEN_KEY = "token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const saveToken = (token) => localStorage.setItem(TOKEN_KEY, token);

export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

// Fired when the server rejects the token, so App can log the user out
export const SESSION_EXPIRED_EVENT = "session-expired";
