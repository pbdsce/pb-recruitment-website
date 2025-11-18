import axios, { type AxiosInstance } from 'axios';
import { getDepartmentFromBranch } from '@/constants';
import { encodeBase64 } from '@/lib/base64';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

interface SignupResponse {
  custom_token: string;
}

export interface SignupPayload {
  name: string;
  id: string;
  email: string;
  mobile: string;
  joiningYear: number;
  branch: string;
  password: string;
}

class AuthApiService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async signup(data: SignupPayload): Promise<SignupResponse> {
    const encodedPassword = encodeBase64(data.password);

    const payload = {
      name: data.name,
      usn: data.id,
      email: data.email,
      mobile_number: data.mobile,
      current_year: data.joiningYear,
      department: getDepartmentFromBranch(data.branch),
      password: encodedPassword,
    };

    const response = await this.axiosInstance.post<SignupResponse>('/auth/signup', payload);
    return response.data;
  }
}

export const authApi = new AuthApiService();

