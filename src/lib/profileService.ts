import { auth, db } from "./firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { updatePassword, updateEmail, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";

export interface UserProfile {
  name: string;
  id: string; 
  email: string;
  mobile: string;
  joiningYear: string;
  branch: string;
}

export const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

export const updateUserProfile = async (userId: string, data: Partial<UserProfile>): Promise<void> => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, data);
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

export const updateUserEmail = async (newEmail: string, password: string): Promise<void> => {
  const user = auth.currentUser;
  if (!user || !user.email) {
    throw new Error("No user logged in");
  }

  try {
    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential);

    await updateEmail(user, newEmail);
  } catch (error) {
    console.error("Error updating email:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to update email";
    throw new Error(errorMessage);
  }
};

export const updateUserPassword = async (currentPassword: string, newPassword: string): Promise<void> => {
  const user = auth.currentUser;
  if (!user || !user.email) {
    throw new Error("No user logged in");
  }

  try {
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);

    await updatePassword(user, newPassword);
  } catch (error) {
    console.error("Error updating password:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to update password";
    throw new Error(errorMessage);
  }
};

