interface Props {
  message?: string;
}

const FormError = ({ message }: Props) => {
  if (!message) return null;

  return (
    <p className="mt-1 text-sm text-red-500">
      {message}
    </p>
  );
};

export default FormError;