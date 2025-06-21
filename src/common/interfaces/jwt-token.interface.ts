export interface JwtToken  {
  iat: number;
  exp: number;
  id: string;
  email: string;
  name: string;
}