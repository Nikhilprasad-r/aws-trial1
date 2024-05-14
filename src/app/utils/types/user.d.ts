export interface UserDataType {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  password: string;
  role: string;
  s3Path: string;
  imageUrl: string;
  isactive: boolean;
}

// Path: src/app/utils/types/user.d.ts

export interface RegisterUserFormValues {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  role: string;
  s3Path: string;
  uploadUrl: string;
  imageUrl: string;
}
export interface UserData {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  role: string;
  imageUrl: string;
  s3Path?: string;
}

export interface UserContext {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  role: string;
  imageUrl: string;
  s3Path?: string;
  uploadUrl?: string;
}
