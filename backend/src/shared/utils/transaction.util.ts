import mongoose, {
  ClientSession,
} from 'mongoose';

const MAX_TRANSACTION_ATTEMPTS = 3;

const TRANSIENT_TRANSACTION_LABEL =
  'TransientTransactionError';

const UNKNOWN_COMMIT_LABEL =
  'UnknownTransactionCommitResult';

const RETRYABLE_ERROR_CODES = [
  112, // WriteConflict
  244, // LockTimeout
  251, // NoSuchTransaction
];

interface MongoErrorLike {
  code?: number;
  codeName?: string;
  message?: string;
  errorLabels?: string[];
}

const asMongoError = (
  error: unknown
): MongoErrorLike | null =>
  typeof error === 'object' && error !== null
    ? (error as MongoErrorLike)
    : null;

const hasTransientTransactionLabel = (
  error: unknown
): boolean =>
  (
    asMongoError(error)?.errorLabels ?? []
  ).includes(TRANSIENT_TRANSACTION_LABEL);

const isTransientError = (
  error: unknown
): boolean => {
  if (hasTransientTransactionLabel(error)) {
    return true;
  }

  const mongoError = asMongoError(error);

  if (!mongoError) {
    return false;
  }

  if (
    typeof mongoError.code === 'number' &&
    RETRYABLE_ERROR_CODES.includes(
      mongoError.code
    )
  ) {
    return true;
  }

  if (mongoError.codeName === 'WriteConflict') {
    return true;
  }

  return (
    typeof mongoError.message === 'string' &&
    /WriteConflict|TransientTransactionError/i.test(
      mongoError.message
    )
  );
};

const isUnknownCommitResult = (
  error: unknown
): boolean =>
  (
    asMongoError(error)?.errorLabels ?? []
  ).includes(UNKNOWN_COMMIT_LABEL);

const delay = (milliseconds: number) =>
  new Promise((resolve) =>
    setTimeout(resolve, milliseconds)
  );

const commitTransactionWithRetry = async (
  session: ClientSession
): Promise<void> => {
  for (
    let attempt = 1;
    attempt <= MAX_TRANSACTION_ATTEMPTS;
    attempt++
  ) {
    try {
      await session.commitTransaction();

      return;
    } catch (error) {
      if (
        attempt === MAX_TRANSACTION_ATTEMPTS ||
        !isUnknownCommitResult(error)
      ) {
        throw error;
      }

      await delay(50 * attempt);
    }
  }
};

export const executeTransaction =
  async <T>(
    operation: (
      session: ClientSession
    ) => Promise<T>
  ): Promise<T> => {
    let lastError: unknown;

    for (
      let attempt = 1;
      attempt <= MAX_TRANSACTION_ATTEMPTS;
      attempt++
    ) {
      const session =
        await mongoose.startSession();

      try {
        session.startTransaction();

        const result =
          await operation(session);

        await commitTransactionWithRetry(
          session
        );

        return result;
      } catch (error) {
        lastError = error;

        if (session.inTransaction()) {
          await session
            .abortTransaction()
            .catch(() => undefined);
        }

        /*
         * Only retry transient failures such as
         * write conflicts. Application errors and
         * validation failures are thrown immediately.
         */
        if (
          attempt === MAX_TRANSACTION_ATTEMPTS ||
          !isTransientError(error)
        ) {
          throw error;
        }

        await delay(50 * attempt);
      } finally {
        await session.endSession();
      }
    }

    throw lastError;
  };
