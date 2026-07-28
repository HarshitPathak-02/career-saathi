import {
  useForm,
} from "react-hook-form";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import FormField
  from "../../../components/ui/Form/FormField";

import Button
  from "../../../components/ui/Button/Button";

import {
  registerSchema,
  type RegisterFormValues,
} from "../validation/auth.validation";

import {
  useAuth,
} from "../hooks/useAuth";

const RegisterForm = () => {

  const {
    registerUser,
    registerState,
  } = useAuth();

  const navigate = useNavigate();

  const {

    register,

    handleSubmit,

    formState: {
      errors,
    },

  } = useForm<RegisterFormValues>({

    resolver:
      zodResolver(
        registerSchema
      ),

    mode:
      "onTouched",

  });


  /*
  |--------------------------------------------------------------------------
  | Submit
  |--------------------------------------------------------------------------
  */

  const onSubmit = async (
    data: RegisterFormValues
  ) => {

    await registerUser(
      data.fullName,
      data.email,
      data.password
    );

    navigate("/login");

  };


  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (

    <div
      className="
                w-full
                max-w-md
            "
    >

      {/* Header */}

      <div>

        <p
          className="
                        text-sm
                        font-semibold
                        text-indigo-600
                    "
        >

          Create your account

        </p>

        <h1
          className="
                        mt-2
                        text-3xl
                        font-bold
                        tracking-tight
                        text-slate-900
                    "
        >

          Start building your career journey.

        </h1>

        <p
          className="
                        mt-3
                        text-sm
                        leading-6
                        text-slate-500
                    "
        >

          Create your CareerSaathi account to begin
          your personalized career assessment and
          build a plan around your goals.

        </p>

      </div>


      {/* Form */}

      <form
        onSubmit={
          handleSubmit(
            onSubmit
          )
        }
        className="
                    mt-8
                    space-y-5
                "
      >

        <FormField
          id="fullName"
          label="Full Name"
          placeholder="Enter your full name"
          autoComplete="name"
          errorMessage={
            errors.fullName
              ?.message
          }
          {...register(
            "fullName"
          )}
        />


        <FormField
          id="email"
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          errorMessage={
            errors.email
              ?.message
          }
          {...register(
            "email"
          )}
        />


        <FormField
          id="password"
          label="Password"
          type="password"
          placeholder="Create a secure password"
          autoComplete="new-password"
          errorMessage={
            errors.password
              ?.message
          }
          {...register(
            "password"
          )}
        />


        {/* Terms */}

        <p
          className="
                        text-xs
                        leading-5
                        text-slate-500
                    "
        >

          By creating an account, you agree to
          CareerSaathi's{" "}

          <Link
            to="/terms"
            className="
                            font-medium
                            text-slate-700
                            underline
                            underline-offset-2
                            hover:text-indigo-600
                        "
          >

            Terms of Service

          </Link>

          {" "}and{" "}

          <Link
            to="/privacy"
            className="
                            font-medium
                            text-slate-700
                            underline
                            underline-offset-2
                            hover:text-indigo-600
                        "
          >

            Privacy Policy

          </Link>

          .

        </p>


        {/* Submit */}

        <Button
          type="submit"
          fullWidth
          loading={
            registerState
              .isLoading
          }
        >

          Create Account

        </Button>

      </form>


      {/* Existing Account */}

      <div
        className="
                    mt-8
                    border-t
                    border-slate-200
                    pt-6
                    text-center
                "
      >

        <p
          className="
                        text-sm
                        text-slate-500
                    "
        >

          Already have an account?{" "}

          <Link
            to="/login"
            className="
                            font-semibold
                            text-indigo-600
                            transition
                            hover:text-indigo-700
                        "
          >

            Sign in

          </Link>

        </p>

      </div>

    </div>

  );

};

export default RegisterForm;