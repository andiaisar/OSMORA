export interface UserInput {
  username: string;
  password: string;
  role: 'Booth' | string;
}

export interface User {
  id: number;
  username: string;
  role: 'Booth' | string;
  created_at: string;
  updated_at: string;
}