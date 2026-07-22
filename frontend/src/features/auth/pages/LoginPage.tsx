import LoginForm from "../components/LoginForm";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-3xl font-bold">
        <LoginForm/>
      </h1>
    </div>
  );
};

export default LoginPage;