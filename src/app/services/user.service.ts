import { getRepository, InsertResult } from "typeorm";
import bcrypt from 'bcryptjs';
import { User } from "../entities";
import { HttpException } from "../exceptions";
import { getToken } from "../../utils";

interface CreateData {
  email: string;
  password: string;
  firstName: string;
  middleName: string;
  lastName: string;
  country: string;
  city: string;
  phone: string;
  mobileOS: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface LoginResult {
  token: string;
  tokenExpirationDate: number;
}

class UserService {
  loginUser = async (data: LoginData): Promise<LoginResult> => {
    const {
      email,
      password
    } = data;
  
    const userRepo = getRepository(User);
  
    const user = await userRepo
      .createQueryBuilder('user')
      .where("user.email = :email", { email })
      .getOne();
  
    if (!user) {
      return Promise.reject(new HttpException(404, 'User not found'));
    }
  
    const isEqual: boolean = await bcrypt.compare(password, user.password);
  
    if (!isEqual) {
      return Promise.reject(new HttpException(400, 'Wrong credentials provided'));
    }
  
    const { token, exp } = getToken({
      userId: user.id,
      email: user.email,
    });
  
    return {
      token,
      tokenExpirationDate: exp,
    }
  }

  createUser = async (data: CreateData): Promise<InsertResult> => {
    const {
      email,
      password
    } = data;
    const userRepo = getRepository(User);
  
    const existingUser = await userRepo
      .createQueryBuilder('user')
      .where("user.email = :email", { email })
      .getOne();
  
  
    if (existingUser) {
      return Promise.reject(new HttpException(400, `User with email ${email} already exist`));
    }
  
    const hash = await bcrypt.hash(password, 10);
  
    return await userRepo
      .createQueryBuilder()
      .insert()
      .values({
        ...data,
        password: hash
      })
      .execute();
  }
}

export default UserService;