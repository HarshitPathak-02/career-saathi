import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Card from "../../../components/ui/Card/Card";
import CardHeader from "../../../components/ui/Card/CardHeader";
import CardBody from "../../../components/ui/Card/CardBody";
import CardFooter from "../../../components/ui/Card/CardFooter";

import FormField from "../../../components/ui/Form/FormField";
import Button from "../../../components/ui/Button/Button";

import {
  registerSchema,
  type RegisterFormValues,
} from "../validation/auth.validation";

import { useAuth } from "../hooks/useAuth";

const RegisterForm = () => {
  const {
    registerUser,
    registerState,
  } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
  });

  const onSubmit = async (
    data: RegisterFormValues
  ) => {
    await registerUser(
      data.fullName,
      data.email,
      data.password
    );
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            CareerSaathi
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Create your account
          </p>
        </div>
      </CardHeader>

      <CardBody>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <FormField
            id="fullName"
            label="Full Name"
            placeholder="Enter your full name"
            errorMessage={errors.fullName?.message}
            {...register("fullName")}
          />

          <FormField
            id="email"
            label="Email"
            type="email"
            placeholder="Enter your email"
            errorMessage={errors.email?.message}
            {...register("email")}
          />

          <FormField
            id="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            errorMessage={errors.password?.message}
            {...register("password")}
          />

          <CardFooter className="mt-6 p-0">
            <Button
              type="submit"
              fullWidth
              loading={registerState.isLoading}
            >
              Create Account
            </Button>
          </CardFooter>
        </form>
      </CardBody>
    </Card>
  );
};

export default RegisterForm;