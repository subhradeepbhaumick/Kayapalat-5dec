export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserInput {
  name: string;
  email: string;
  password: string;
} 