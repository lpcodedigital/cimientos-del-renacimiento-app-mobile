export interface AuthRequestDTO {
  email: string;
  password: string;
}

export interface AuthBasicUserResponseDTO {
  idUser: number;
  name: string;
  email: string;
  active: boolean;
  role: string;
  isFirstLogin: boolean;
}

export interface AuthResponseDTO {
  token: string;
  expiresAt: string;
  user: AuthBasicUserResponseDTO;
  mfaRequired: boolean;
}
