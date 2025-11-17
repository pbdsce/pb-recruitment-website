import axios, { type AxiosInstance } from 'axios';
import { auth } from '@/lib/firebase';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

class UserApiService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.axiosInstance.interceptors.request.use(
      async (config) => {
        const user = auth.currentUser;
        if (user && config.headers) {
          try {
            const token = await user.getIdToken();
            if (token) {
              config.headers.Authorization = `Bearer ${token}`;
            }
          } catch (error) {
            console.error('Error getting auth token:', error);
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  async createUser(data: {
    name: string;
    usn: string;
    mobile_number: string;
    current_year: number;
    department: string;
    password: string;
  }): Promise<void> {
    const encodedPassword = btoa(unescape(encodeURIComponent(data.password)));
    await this.axiosInstance.post('/users/create', {
      ...data,
      password: encodedPassword,
    });
  }

  async getUserProfile(): Promise<any> {
    const response = await this.axiosInstance.get('/users/profile');
    return response.data;
  }

  async updateUserProfile(data: Partial<{
    name: string;
    usn: string;
    mobile_number: string;
    current_year: number;
    department: string;
  }>): Promise<void> {
    await this.axiosInstance.post('/users/profile', data);
  }
}

export const getCurrentYear = (joiningYear: string): number => {
  const year = parseInt(joiningYear, 10);
  if (year === 1 || year === 2 || year === 3) return year;
  if (joiningYear === '1st year') return 1;
  if (joiningYear === '2nd year') return 2;
  if (joiningYear === '3rd year') return 3;
  return 1;
};

export const userApi = new UserApiService();

