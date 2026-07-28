import {
  useForm,
} from "react-hook-form";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import {
  Link,
} from "react-router-dom";

import FormField
  from "../../../components/ui/Form/FormField";

import Button
  from "../../../components/ui/Button/Button";

import {
  loginSchema,
  type LoginFormValues,
} from "../validation/auth.validation";

import {
  useAuth,
} from "../hooks/useAuth";

const LoginForm = () => {

  const {
    loginUser,
    loginState,
  } = useAuth();

  const {
    register,
    handleSubmit,

    formState: {
      errors,
    },

  } = useForm<LoginFormValues>({

    resolver:
      zodResolver(
        loginSchema
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
    data: LoginFormValues
  ) => {

    await loginUser(
      data.email,
      data.password
    );

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
          Welcome back
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
          Continue your career journey.
        </h1>

        <p
          className="
                        mt-3
                        text-sm
                        leading-6
                        text-slate-500
                    "
        >
          Sign in to access your workspace,
          continue your current mission, and
          track your progress.
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

        {/* Email */}

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


        {/* Password */}

        <div>

          <div
            className="
                            mb-2
                            flex
                            items-center
                            justify-between
                        "
          >
            <span />

            <Link
              to="/forgot-password"
              className="
                                text-sm
                                font-medium
                                text-indigo-600
                                transition
                                hover:text-indigo-700
                            "
            >
              Forgot password?
            </Link>

          </div>

          <FormField
            id="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            errorMessage={
              errors.password
                ?.message
            }
            {...register(
              "password"
            )}
          />

        </div>


        {/* Submit */}

        <div className="pt-1">

          <Button
            type="submit"
            fullWidth
            loading={
              loginState
                .isLoading
            }
          >
            Sign In
          </Button>

        </div>

      </form>


      {/* Register */}

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
          Don't have an account?{" "}

          <Link
            to="/register"
            className="
                            font-semibold
                            text-indigo-600
                            transition
                            hover:text-indigo-700
                        "
          >
            Start your journey
          </Link>
        </p>

      </div>

    </div>

  );

};

export default LoginForm;