export interface User {
  id: string;
  account: string;
  email: string;
  fullName: string;
  dateOfBirth: string;
  gender: number;
  role: string;
  status: number;
  isVerified: boolean;
  phoneNumber?: string;
  password?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserMeta {
  totalItems: number;
  totalPages: number | null;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface UserApiResponse {
  data: User[];
  meta: UserMeta;
}
