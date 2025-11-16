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
  }): Promise<void> {
    await this.axiosInstance.post('/users/create', data);
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

const branchToDepartment: Record<string, string> = {
  'Artificial Intelligence and Machine Learning': 'AI',
  'Aeronautical Engineering': 'AE',
  'Automobile Engineering': 'AU',
  'Biotechnology': 'BT',
  'Computer Science and Design': 'CG',
  'Medical Electronics Engineering': 'MD',
  'Electronics and Telecommunication Engineering': 'ET',
  'Electronics & Communication Engineering': 'EC',
  'Electronics and Instrumentation Engineering': 'EI',
  'Mechanical Engineering': 'ME',
  'Electrical & Electronics Engineering': 'EE',
  'Chemical Engineering': 'CH',
  'Computer Science & Engineering (Cyber Security)': 'CY',
  'Computer Science & Engineering (Data Science)': 'CD',
  'Computer Science & Engineering (IoT and Cyber Security Including Blockchain)': 'IC',
  'Information Science and Engineering': 'IS',
  'Computer Science and Engineering': 'CS',
  'Computer Science and Business Systems': 'CB',
  'Civil Engineering': 'CV',
  'Robotics and Artificial Intelligence': 'RI',
};

export const getDepartmentFromBranch = (branch: string): string => {
  return branchToDepartment[branch] || branch.substring(0, 2).toUpperCase();
};

export const getBranchFromDepartment = (department: string): string => {
  const entry = Object.entries(branchToDepartment).find(([_, code]) => code === department);
  return entry ? entry[0] : department;
};

export const getCurrentYear = (joiningYear: string): number => {
  if (joiningYear === '1st year') return 1;
  if (joiningYear === '2nd year') return 2;
  if (joiningYear === '3rd year') return 3;
  return 1;
};

export const userApi = new UserApiService();

