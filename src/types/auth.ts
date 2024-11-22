export type UserRole =
  | 'STANDALONE_ADMIN'
  | 'STANDALONE_USER'
  | 'LSP_BAP_COLLECTOR'
  | 'CUSTOM';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  permissions: string[];
}