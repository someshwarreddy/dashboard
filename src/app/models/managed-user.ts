export interface ManagedUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  image: string;
  username: string;
  role: string;
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