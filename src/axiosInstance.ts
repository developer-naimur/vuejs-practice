// src/plugins/axios.ts (or wherever your axiosInstance is defined)

import axios from 'axios';
import router from '@/router'; // make sure this is correct based on your project
import { useUserStore } from '@/stores/useUserStore'; // correct import

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
});

// ✅ Request Interceptor
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;

    const userStore = useUserStore();
    const companyId = userStore.authUser?.company?.slug ?? null;
    const routeCompanyId = router.currentRoute.value?.params?.company_id;

    if (routeCompanyId && companyId !== routeCompanyId) {
      //logout for hit to bad url
      userStore.clearUser();
      router.push('/login');
    }else{
      //go next
    }
    
   

  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// ✅ Response Interceptor for handling expired or invalid token
axiosInstance.interceptors.response.use(
  response => response,
  (error) => {
    const status = error.response?.status;
    
    if (status === 401 || status === 419) {
      const userStore = useUserStore();
      userStore.clearUser();
      router.push(`/login`);

    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
