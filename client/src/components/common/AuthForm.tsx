import imgLogin from "../../../assets/imges/imglogin.png";
import FormInput from "./FormInput";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useSearchParams } from "react-router-dom";
import { type AuthFormProps } from "../../types/auth.types";

function AuthForm({
  type,
  onSubmit,
  isPending,
  error,
  resetForm,
  token: propToken,
}: AuthFormProps) {
  const [searchParams] = useSearchParams();
  const [tokenError, setTokenError] = useState("");

  //get token for Url or propToken
  const token = searchParams.get("token") || propToken;

  //Register or login or forgotPassword or reset-password?
  const isRegister = type === "register";
  const isLogin = type === "login";
  const isForgotPassword = type === "forgot-password";
  const isResetPassword = type === "reset-password";
  //
  useEffect(() => {
    if (isResetPassword && !token) {
      setTokenError("لینک بازیابی رمز عبور معتبر نیست");
    } else {
      setTokenError("");
    }
  }, [isResetPassword, token]);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm({
    mode: "onChange",
    defaultValues: isRegister
      ? {
          email: "",
          password: "",
          display_name: "",
          age: undefined,
          rules: false,
        }
      : isLogin
        ? { email: "", password: "", rememberMe: true }
        : isResetPassword
          ? { password: "" }
          : { email: "" },
  });
  useEffect(() => {
    if (resetForm) {
      if (isRegister) {
        reset({
          email: "",
          password: "",
          display_name: "",
          age: undefined,
          rules: false,
        });
      } else if (isLogin) {
        reset({
          email: "",
          password: "",
          rememberMe: true,
        });
      } else {
        reset({ email: "" });
      }
    }
  }, [reset, isRegister, isLogin, resetForm]);

  const handleFormSubmit = (data: any) => {
    let submitData = data;

    if (isRegister) {
      const cleaned = { ...data };

      if (!cleaned.display_name) {
        delete cleaned.display_name;
      }

      if (
        cleaned.age === undefined ||
        cleaned.age === null ||
        cleaned.age === ""
      ) {
        delete cleaned.age;
      }

      submitData = cleaned;
    }

    if (isResetPassword) {
      onSubmit({ ...submitData, token });
    } else {
      onSubmit(submitData);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl mt-10 overflow-hidden max-w-4xl w-full flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 p-6 sm:p-8 lg:p-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-yellow-600 mb-6 text-center">
            {isRegister ? "ثبت نام" : isLogin ? "ورود" : "فراموشی رمز عبور"}
          </h1>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            {!isResetPassword && (
              <FormInput
                label="ایمیل"
                name="email"
                type="email"
                placeholder="ایمیل خود را وارد کنید"
                register={register}
                error={errors.email}
                validation={{
                  required: "ایمیل نمی‌تواند خالی باشد",
                  pattern: {
                    value:
                      /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/,
                    message: "ایمیل وارد شده معتبر نمی‌باشد",
                  },
                }}
              />
            )}

            {(isLogin || isRegister || isResetPassword) && (
              <FormInput
                label="رمز عبور"
                name="password"
                type="password"
                placeholder="رمز عبور خود را وارد کنید"
                register={register}
                error={errors.password}
                validation={{
                  required: "رمز عبور نمی‌تواند خالی باشد",
                  minLength: {
                    value: 6,
                    message: "رمز عبور باید حداقل ۶ کاراکتر باشد",
                  },
                  maxLength: {
                    value: 20,
                    message: "رمز عبور باید حداکثر ۲۰ کاراکتر باشد",
                  },
                  pattern: {
                    value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]+$/,
                    message:
                      "رمز عبور باید شامل حداقل یک حرف، یک عدد و می‌تواند شامل !@#$%^&* باشد",
                  },
                }}
              />
            )}

            {isLogin && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    {...register("rememberMe")}
                  />
                  <label className="text-[18px] text-gray-600">
                    مرا به خاطر بسپار
                  </label>
                </div>
                <Link
                  to="/forgot-password"
                  className="text-[18px] text-yellow-600 hover:text-yellow-700 font-medium"
                >
                  رمز عبور را فراموش کرده‌اید؟
                </Link>
              </div>
            )}

            {isForgotPassword && (
              <p className="text-sm text-gray-600 text-center">
                لطفاً ایمیل خود را وارد کنید. لینک بازیابی رمز عبور برای ایمیل
                شما ارسال خواهد شد.
              </p>
            )}
            {isResetPassword && (
              <p className="text-sm text-gray-600 text-center">
                رمز عبور جدید خود را وارد کنید
              </p>
            )}

            {isRegister && (
              <>
                <FormInput
                  label="نام کاربری"
                  name="display_name"
                  type="text"
                  placeholder="نام خود را وارد کنید"
                  register={register}
                  error={errors.display_name}
                  validation={{
                    minLength: {
                      value: 3,
                      message: "نام کاربری باید حداقل ۳ کاراکتر باشد",
                    },
                    maxLength: {
                      value: 40,
                      message: "نام کاربری باید حداکثر ۴۰ کاراکتر باشد",
                    },
                  }}
                />

                <FormInput
                  label="سن"
                  name="age"
                  type="number"
                  placeholder="سن خود را وارد کنید"
                  register={register}
                  error={errors.age}
                  validation={{
                    validate: (value) => {
                      if (
                        value === "" ||
                        value === undefined ||
                        value === null
                      ) {
                        return true;
                      }
                      const num = Number(value);
                      if (isNaN(num)) return "سن باید یک عدد باشد";
                      if (num < 0) return "سن حداقل ۰ سال است";
                      if (num > 120) return "سن حداکثر ۱۲۰ سال است";
                      return true;
                    },
                  }}
                />
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="rules"
                    {...register("rules", {
                      required: "برای ثبت‌نام باید با قوانین موافقت کنید",
                    })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="rules" className="text-[17px] text-gray-600">
                    با
                    <Link
                      to="/roles"
                      className="mx-1 text-yellow-500 hover:text-yellow-600 font-medium"
                    >
                      قوانین و مقررات سایت
                    </Link>
                    موافقت می‌کنم
                  </label>
                </div>
                {errors.rules && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.rules.message}
                  </p>
                )}
              </>
            )}

            {isPending && (
              <div className="text-blue-500 text-sm text-center">
                در حال ارسال اطلاعات...
              </div>
            )}

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <button
              type="submit"
              disabled={!isValid || isPending}
              className={`w-full font-medium py-2.5 rounded-lg transition duration-300 ${
                isValid && !isPending
                  ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                  : "bg-gray-300 cursor-not-allowed text-gray-500"
              }`}
            >
              {isPending
                ? isRegister
                  ? "در حال ثبت‌نام..."
                  : isLogin
                    ? "در حال ورود..."
                    : isResetPassword
                      ? "در حال تغییر رمز..."
                      : "در حال ارسال..."
                : isRegister
                  ? "ثبت‌نام"
                  : isLogin
                    ? "ورود"
                    : isResetPassword
                      ? "تغییر رمز عبور"
                      : "ارسال لینک بازیابی"}
            </button>

            <p className="text-center text-[18px] text-gray-600 mt-4">
              {isRegister ? (
                <>
                  قبلاً ثبت‌نام کرده‌اید؟
                  <Link
                    to="/login"
                    className="text-yellow-500 hover:text-yellow-600 font-medium mr-1"
                  >
                    وارد شوید
                  </Link>
                </>
              ) : (
                <>
                  حساب کاربری ندارید؟
                  <Link
                    to="/register"
                    className="text-yellow-500 hover:text-yellow-00 font-medium mr-1"
                  >
                    ثبت‌نام کنید
                  </Link>
                </>
              )}
            </p>
          </form>
        </div>

        <div className="hidden md:block md:w-1/2 bg-gradient-to-br p-8 flex items-center justify-center">
          <img
            src={imgLogin}
            alt="auth"
            className="w-full h-auto max-w-md object-contain"
          />
        </div>
      </div>
    </div>
  );
}

export default AuthForm;
