import jwt from 'jsonwebtoken';

interface JwtPayload {
  user_id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
}

export function decodeToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    return decoded;
  } catch (error) {
    console.error('Invalid or expired token:', error);
    return null;
  }
}
