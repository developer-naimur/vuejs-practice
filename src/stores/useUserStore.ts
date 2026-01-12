import { defineStore } from 'pinia'

interface Permission {
  id: number;
  name: string;
}

interface Role {
  id: number;
  name: string;
  permissions: Permission[];
}

interface Company {
  name: string;
  contact: string;
  address: string;
  business_type: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  company: Company;
  roles: Role[];
}

export const useUserStore = defineStore('user', {
  state: () => ({
    user: (() => {
      const storedUser = localStorage.getItem("user");
      try {
        return storedUser ? JSON.parse(storedUser) as User : null;
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
        return null;
      }
    })(),
    token: localStorage.getItem("token") as string | null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    authUser: (state) => state.user,

    /**
     * permission getter
     * if no role, allow all permission
     * otherwise flatten all permission names
     */
    permissions: (state) => {
      if (!state.user) return [];
      const roles = state.user.roles ?? [];
      if (roles.length === 0) {
        return ['*']; // allow all if no role assigned
      }
      return roles.flatMap(role => role.permissions.map(p => p.name));
    },

  },
  actions: {
    /**
     * store user + token
     */
    setUser(userData: User, token: string) { 
      this.user = userData;
      this.token = token;
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token);
    },

    /**
     * clear user + token
     */
    clearUser() {
      this.user = null;
      this.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },

    /**
     * userCan - single permission checker
     * fallback: if no role → allow all
     */
    userCan(permissionName: string): boolean {
      if (!this.user) return false;

      if (this.permissions.includes('*')) {
        return true;
      }
      return this.permissions.includes(permissionName);
    },
  },
});
