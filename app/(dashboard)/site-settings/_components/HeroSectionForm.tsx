"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as z from "zod";
import { Plus, Minus } from "lucide-react";

import Input from "@/components/ui/Input";
import TextField from "@/components/ui/TextField";
import Button from "@/components/ui/Button";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { Hero } from "@/types/site-setting";
import { useEffect } from "react";

/* -----------------------------
   Zod Schema
-------------------------------- */
const heroSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters" })
    .max(100, { message: "Title must be at most 100 characters" }),
  subtitle: z
    .string()
    .min(3, { message: "Subtitle must be at least 3 characters" })
    .max(500, { message: "Subtitle must be at most 500 characters" }),
  heroImage: z.any(),
});

export type HeroFormInputs = z.infer<typeof heroSchema>;

export default function HeroSectionForm({ hero }: { hero: Hero | null }) {
  const [expanded, setExpanded] = React.useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<HeroFormInputs>({
    resolver: zodResolver(heroSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      heroImage: null,
    },
  });

  useEffect(() => {
    if (hero) {
      reset({
        title: hero.title || "",
        subtitle: hero.subtitle || "",
        heroImage: null,
      });
    }
  }, [hero, reset]);

  /* -----------------------------
     React Query Mutation
  -------------------------------- */
  const heroMutation = useMutation<
    { message: string },
    AxiosError<{ message: string }>,
    FormData
  >({
    mutationFn: async (data) => {
      return api.post("/admin/site-settings", data).then((res) => res.data);
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["site-settings"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || error.message);
    },
  });

  const watchedFile = watch("heroImage");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setValue("heroImage", e.target.files[0], { shouldValidate: true });
    }
  };

  const onSubmit = (data: HeroFormInputs) => {
    const formData = new FormData();
    formData.append("key", "hero");
    formData.append(
      "value",
      JSON.stringify({ title: data.title, subtitle: data.subtitle })
    );

    if (data.heroImage) {
      formData.append("heroImage", data.heroImage);
    }

    heroMutation.mutate(formData);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-4 border border-[#E2E8F0] shadow-[0px_8px_13px_-3px_rgba(0,0,0,0.08)] bg-white"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between cursor-pointer mb-1"
        onClick={() => setExpanded((prev) => !prev)}
      >
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Hero Section</h2>
          <p className="text-sm text-gray-500">
            Update hero title, subtitle and image
          </p>
        </div>

        <div className="text-gray-600">
          {expanded ? <Minus size={24} /> : <Plus size={24} />}
        </div>
      </div>

      {/* Collapsible Content */}
      <div
        className={`space-y-4 transition-all duration-300 overflow-hidden mt-3 p-2 pt-0 ${
          expanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {/* Hero Title */}
        <Input
          label="Hero Title"
          placeholder="Enter hero title"
          {...register("title")}
          error={errors.title?.message}
        />

        {/* Hero Subtitle */}
        <TextField
          label="Hero Subtitle"
          placeholder="Enter hero subtitle"
          {...register("subtitle")}
          error={errors.subtitle?.message}
          rows={3}
        />

        {/* Hero Image */}
        <div className="flex flex-col">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hero Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
          />
          {watchedFile && (
            <p className="text-sm mt-1 text-gray-500">
              Selected file: {(watchedFile as File).name}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="col-span-2 flex justify-end gap-4 mt-4">
          <Button type="button" variant="secondary" onClick={() => reset()}>
            Reset
          </Button>
          <Button type="submit" isLoading={heroMutation.isPending}>
            Save Changes
          </Button>
        </div>
      </div>
    </form>
  );
}
