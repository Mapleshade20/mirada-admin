import type { AuthProvider } from "react-admin";

const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8091";

export const authProvider: AuthProvider = {
  login: async ({ username, password }) => {
    const request = new Request(`${apiUrl}/api/admin/auth/login`, {
      method: "POST",
      body: JSON.stringify({ email: username, password }),
      headers: new Headers({ "Content-Type": "application/json" }),
    });

    try {
      const response = await fetch(request);
      if (response.status < 200 || response.status >= 300) {
        throw new Error(response.statusText);
      }
      const { token } = await response.json();
      localStorage.setItem("token", token);
      return Promise.resolve();
    } catch {
      throw new Error("Invalid credentials");
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    return Promise.resolve();
  },

  checkAuth: () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return Promise.reject();
    }
    // You could also verify the token with the backend here
    return Promise.resolve();
  },

  checkError: (error) => {
    const status = error.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem("token");
      return Promise.reject();
    }
    return Promise.resolve();
  },

  getPermissions: () => {
    // For now, return admin permissions for all authenticated users
    // You can extend this to handle different user roles
    const token = localStorage.getItem("token");
    return token ? Promise.resolve("admin") : Promise.reject();
  },

  getIdentity: () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return Promise.reject();
    }

    // You could decode the JWT token here to get user info
    // For now, return a basic admin identity
    return Promise.resolve({
      id: "admin",
      fullName: "Admin User",
      avatar: undefined,
    });
  },
};
