import { auth, db } from "./firebase";
import { sendPasswordResetEmail, type User } from "firebase/auth";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export interface SignUpData {
  name: string;
  id: string; //Application number or USN
  email: string;
  mobile: string;
  joiningYear: string;
  branch: string;
  password: string;
}

export const signUpUser = async (data: SignUpData): Promise<User> => {
  const { email, password, ...profile } = data;

  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  await setDoc(doc(db, "users", user.uid), {
    ...profile,
    email,
    createdAt: new Date(),
  });

  return user;
};

export const loginUser = async (email: string, password: string): Promise<User> => {
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