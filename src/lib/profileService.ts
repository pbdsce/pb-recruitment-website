import { auth } from "./firebase";
import { updatePassword, updateEmail, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { userApi, getDepartmentFromBranch, getCurrentYear } from "@/services/api/userApi";

export interface UserProfile {
  name: string;
  id: string; 
  email: string;
  mobile: string;
  joiningYear: string;
  branch: string;
}

const mapApiToProfile = (apiData: any): UserProfile => {
  const departmentToBranch: Record<string, string> = {
    'AI': 'Artificial Intelligence and Machine Learning',
    'AE': 'Aeronautical Engineering',
    'AU': 'Automobile Engineering',
    'BT': 'Biotechnology',
    'CG': 'Computer Science and Design',
    'MD': 'Medical Electronics',
    'ET': 'Electronics and Telecommunication Engineering',
    'EC': 'Electronics and Communication Engineering',
    'EI': 'Electronics and Instrumentation Engineering',
    'ME': 'Mechanical Engineering',
    'EE': 'Electrical Engineering',
    'CH': 'Chemical Engineering',
    'CY': 'Computer Science and Engineering(Cyber Security)',
    'CD': 'Computer Science and Engineering(Data Science)',
    'IC': 'Computer Science and Engineering(IoT and Cyber Security Including Blockchain)',
    'IS': 'Information Science Engineering',
    'CS': 'Computer Science Engineering',
    'CB': 'Computer Science and Business Systems',
    'CV': 'Civil Engineering',
    'RI': 'Robotics and Artificial Intelligence',
  };

  let joiningYear = '1st year';
  if (apiData.current_year === 2) joiningYear = '2nd year';
  if (apiData.current_year === 3) joiningYear = '3rd year';

  return {
    name: apiData.name || '',
    id: apiData.usn || '',
    email: apiData.email || '',
    mobile: apiData.mobile_number || '',
    joiningYear,
    branch: departmentToBranch[apiData.department] || apiData.department || '',
  };
};

export const fetchUserProfile = async (_userId: string): Promise<UserProfile | null> => {
  try {
    const apiData = await userApi.getUserProfile();
    return mapApiToProfile(apiData);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

export const updateUserProfile = async (_userId: string, data: Partial<UserProfile>): Promise<void> => {
  try {
    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.id) updateData.usn = data.id;
    if (data.mobile) updateData.mobile_number = data.mobile;
    if (data.joiningYear) updateData.current_year = getCurrentYear(data.joiningYear);
    if (data.branch) updateData.department = getDepartmentFromBranch(data.branch);

    await userApi.updateUserProfile(updateData);
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

