import { auth } from "./firebase";
import { sendPasswordResetEmail, type User, signInWithCustomToken } from "firebase/auth";
import { authApi } from "@/services/api/authApi";

export interface SignUpData {
  name: string;
  id: string; //Application number or USN
  email: string;
  mobile: string;
  joiningYear: number;
  branch: string;
  password: string;
}

export const signUpUser = async (data: SignUpData): Promise<User> => {
  const { custom_token } = await authApi.signup(data);
  if (!custom_token) {
    throw new Error("Signup failed: missing custom token from server.");
  }
  const userCredential = await signInWithCustomToken(auth, custom_token);
  return userCredential.user;
};

export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};