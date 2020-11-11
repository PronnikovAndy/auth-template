import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';


export const getToken = (data: any) => {
  const expirationDate = new Date().setHours(new Date().getHours() + 1);

  const token = jwt.sign(
    {
      data,
      exp: expirationDate
    },
    JWT_SECRET
  );

  return {
    token,
    exp: expirationDate
  }
};

export const decodeToken = (token: string) => jwt.verify(token, JWT_SECRET);