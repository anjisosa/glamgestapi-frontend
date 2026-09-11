export interface UserProfile {
  userId: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: UserProfile;
}

export interface ApiError {
  status: number;
  message: string;
  error?: string;
  validationErrors?: Record<string, string> | null;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

export interface AuthSession {
  token: string;
  refreshToken: string;
}
