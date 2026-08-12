import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { register } from "../../features/auth/authSlice";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import toast from "react-hot-toast";

const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, token } = useSelector((state) => state.auth);

  // If already authenticated, redirect
  useEffect(() => {
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [token, navigate]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = async (data) => {
    const resultAction = await dispatch(register(data));
    if (register.fulfilled.match(resultAction)) {
      toast.success("Account created successfully!");
      navigate("/dashboard", { replace: true });
    } else {
      toast.error(resultAction.payload || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface-elevated rounded-xl shadow-card border border-border p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-text-primary">
            Create Account
          </h1>
          <p className="text-text-secondary mt-2">
            Sign up for HRMS Recruitment
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                label="Full Name"
                placeholder="John Doe"
                error={errors.name?.message}
                {...field}
              />
            )}
          />
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                type="email"
                label="Email Address"
                placeholder="you@company.com"
                error={errors.email?.message}
                {...field}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input
                type="password"
                label="Password"
                placeholder="••••••••"
                error={errors.password?.message}
                {...field}
              />
            )}
          />

          <Button
            type="submit"
            className="w-full"
            isLoading={status === "loading"}
          >
            Sign up
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-text-secondary">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary hover:text-primary-hover font-medium"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
