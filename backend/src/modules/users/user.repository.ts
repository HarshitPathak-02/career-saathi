import { ClientSession } from 'mongoose';
import { UserDocument, UserModel } from './user.model.js';
import {
  CreateUserInput,
  UpdateUserInput,
} from './user.types.js';

const MAX_ACTIVE_REFRESH_TOKENS = 5;

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
    const query = UserModel.findById({ _id: id, deletedAt: null });

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
      deletedAt: null,
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

  /*
   * Keeps at most MAX_ACTIVE_REFRESH_TOKENS sessions per user
   * so a single account can be used on multiple devices without
   * unbounded document growth.
   */
  async addRefreshTokenHash(
    id: string,
    tokenHash: string,
    session?: ClientSession
  ): Promise<UserDocument | null> {
    return UserModel.findByIdAndUpdate(
      id,
      {
        $push: {
          refreshTokenHashes: {
            $each: [tokenHash],
            $slice: -MAX_ACTIVE_REFRESH_TOKENS,
          },
        },
      },
      {
        new: true,
        session,
      }
    );
  }

  async replaceRefreshTokenHash(
    id: string,
    currentHash: string,
    nextHash: string,
    session?: ClientSession
  ): Promise<UserDocument | null> {
    return UserModel.findOneAndUpdate(
      {
        _id: id,
        refreshTokenHashes: currentHash,
      },
      {
        $set: {
          'refreshTokenHashes.$': nextHash,
        },
      },
      {
        new: true,
        session,
      }
    );
  }

  async removeRefreshTokenHash(
    id: string,
    tokenHash: string,
    session?: ClientSession
  ): Promise<UserDocument | null> {
    return UserModel.findByIdAndUpdate(
      id,
      {
        $pull: {
          refreshTokenHashes: tokenHash,
        },
      },
      {
        new: true,
        session,
      }
    );
  }

  async clearRefreshTokenHashes(
    id: string,
    session?: ClientSession
  ): Promise<UserDocument | null> {
    return UserModel.findByIdAndUpdate(
      id,
      {
        $set: {
          refreshTokenHashes: [],
        },
      },
      {
        new: true,
        session,
      }
    );
  }
}

export const userRepository = new UserRepository();