import { ClientSession } from 'mongoose';
import { UserDocument, UserModel } from './user.model.js';
import {
  CreateUserInput,
  UpdateUserInput,
} from './user.types.js';

class UserRepository {
  async create(
    userData: CreateUserInput,
    session?: ClientSession
  ): Promise<UserDocument> {
    if (session) {
      const [user] = await UserModel.create(
        [userData],
        { session }
      );

      return user;
    }

    return UserModel.create(userData);
  }

  async findById(
    id: string,
    session?: ClientSession
  ): Promise<UserDocument | null> {
    const query = UserModel.findById(id);

    if (session) {
      query.session(session);
    }

    return query;
  }

  async findByEmail(
    email: string,
    session?: ClientSession
  ): Promise<UserDocument | null> {
    const query = UserModel.findOne({
      email,
    });

    if (session) {
      query.session(session);
    }

    return query;
  }

  async updateById(
    id: string,
    updateData: UpdateUserInput,
    session?: ClientSession
  ): Promise<UserDocument | null> {
    return UserModel.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
        session,
      }
    );
  }

  async updateLastLogin(
    id: string,
    session?: ClientSession
  ): Promise<UserDocument | null> {
    return UserModel.findByIdAndUpdate(
      id,
      {
        lastLogin: new Date(),
      },
      {
        new: true,
        runValidators: true,
        session,
      }
    );
  }
}

export const userRepository = new UserRepository();