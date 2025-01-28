export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
}

export interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  department: string;
}

export type UserAction = 'add' | 'edit' | null;