import mongoose, { ClientSession } from 'mongoose';

export const executeTransaction = async <T>(
  operation: (
    session: ClientSession
  ) => Promise<T>
): Promise<T> => {
  const session =
    await mongoose.startSession();

  try {
    session.startTransaction();

    const result = await operation(
      session
    );

    await session.commitTransaction();

    return result;
  } catch (error) {
    await session.abortTransaction();

    throw error;
  } finally {
    session.endSession();
  }
};