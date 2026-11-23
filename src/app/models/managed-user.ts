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