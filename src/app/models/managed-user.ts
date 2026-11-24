export interface ManagedUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  age?: number;
  gender: string;
 image?: string;
  username: string;
  role: 'admin' | 'user';
  status: 'pending' | 'active';
  company: {
    name: string;
    title: string;
  };
}

export interface UsersApiResponse {
  users: ManagedUser[];
  total: number;
  skip: number;
  limit: number;
}
export interface UserDetailsResponse {
  user: ManagedUser;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  username: string;
  role: 'admin' | 'user';
  company: {
    name: string;
    title: string;
  };
}

export interface CreateUserResponse {
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'user';
    status: 'pending' | 'active';
  };
  activationToken?: string;
}
export interface ResendActivationResponse {
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
    status: 'pending' | 'active';
  };
  emailSent: boolean;
}