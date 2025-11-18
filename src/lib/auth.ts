import { auth } from "./firebase";
import { sendPasswordResetEmail, type User, signInWithEmailAndPassword } from "firebase/auth";
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
  const { email, password } = data;
  
  // Backend creates Firebase user and NeonDB user
  await authApi.signup(data);
  
  // Sign in with email/password after backend creates the user
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
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