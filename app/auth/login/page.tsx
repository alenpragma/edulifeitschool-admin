"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

/* -----------------------------
   Zod Schema
-------------------------------- */
const loginSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .min(3, { message: "Email must be at least 3 characters" })
    .max(50, { message: "Email must be at most 50 characters" }),
  password: z
    .string()
    .min(5, { message: "Password must be at least 5 characters" }),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

type LoginResponse = {
  message: string;
  data: {
    accessToken: string;
  };
};

/* -----------------------------
   Component
-------------------------------- */
export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useMutation<
    LoginResponse,
    AxiosError<{ message: string }>,
    LoginFormInputs
  >({
    mutationFn: (formData) =>
      api.post("/auth/login", formData).then((res) => res.data),

    onSuccess: (data) => {
      Cookies.set("accessToken", data.data.accessToken, {
        expires: 30,
        sameSite: "strict",
      });
      toast.success(data.message);
      window.location.href = "/";
    },

    onError: (error) => {
      toast.error(error.response?.data?.message || "Login failed");
    },
  });

  const onSubmit = (data: LoginFormInputs) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1c2333] p-4 flex-col gap-6">
      <Image src="/logo.svg" alt="Logo" width={180} height={120} />

      <div className="border border-[#E2E8F0] shadow-[0px_8px_13px_-3px_rgba(0,0,0,0.08)] bg-white w-full max-w-sm p-6">
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Email"
            type="email"
            placeholder="Enter email"
            {...register("email")}
            error={errors.email?.message}
          />

          <Input
            label="Password"
            type="password"
            placeholder="******"
            {...register("password")}
            error={errors.password?.message}
          />

          <Button type="submit" fullWidth isLoading={loginMutation.isPending}>
            Login
          </Button>
        </form>
      </div>
    </div>
  );
}
