import bcrypt from 'bcryptjs';
import { getRepository } from 'typeorm';
import { User } from '../entities';

export const initUser = async () => {
  try {
    const userRepo = getRepository(User);

    const createdUser = await userRepo
      .createQueryBuilder('user')
      .where('user.email = :email', { email: 'test@test.com'})
      .getOne();

    if(createdUser) {
      return new Promise((resolve) => resolve(console.log("Users already exist")))
    }

    const testHash = await bcrypt.hash('test1234', 10);

    const test = new User();

    test.email = 'test@test.com';
    test.password = testHash;
    test.firstName = 'Test';
    test.lastName = 'Test';
    test.middleName = "Test"
    test.country = 'Russia';
    test.city = "Moscow"
    test.phone = '+440000000000';
    test.mobileOS = "Android";

    await userRepo.save(test);

    console.log('Create users');
  } catch (error) {
    console.log("error", error);
  }
}