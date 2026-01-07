"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as z from "zod";
import { Plus, Minus } from "lucide-react";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { Social } from "@/types/site-setting";

/* -----------------------------
   Zod Schema
-------------------------------- */
const socialSchema = z.object({
  facebook: z.string().url("Invalid Facebook URL").optional().or(z.literal("")),
  twitter: z.string().url("Invalid Twitter URL").optional().or(z.literal("")),
  instagram: z
    .string()
    .url("Invalid Instagram URL")
    .optional()
    .or(z.literal("")),
  youtube: z.string().url("Invalid YouTube URL").optional().or(z.literal("")),
});

export type SocialFormInputs = z.infer<typeof socialSchema>;

export default function SocialSectionForm({
  social,
}: {
  social: Social | null;
}) {
  const [expanded, setExpanded] = React.useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SocialFormInputs>({
    resolver: zodResolver(socialSchema),
    defaultValues: {
      facebook: "",
      twitter: "",
      instagram: "",
      youtube: "",
    },
  });

  /* -----------------------------
     Hydrate form
  -------------------------------- */
  useEffect(() => {
    if (social) {
      reset({
        facebook: social.facebook || "",
        twitter: social.twitter || "",
        instagram: social.instagram || "",
        youtube: social.youtube || "",
      });
    }
  }, [social, reset]);

  /* -----------------------------
     React Query Mutation
  -------------------------------- */
  const socialMutation = useMutation<
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

  /* -----------------------------
     Submit
  -------------------------------- */
  const onSubmit = (data: SocialFormInputs) => {
    const formData = new FormData();
    formData.append("key", "social");
    formData.append("value", JSON.stringify(data));

    socialMutation.mutate(formData);
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
          <h2 className="text-lg font-semibold text-gray-800">Social Links</h2>
          <p className="text-sm text-gray-500">
            Update your social media links
          </p>
        </div>

        <div className="text-gray-600">
          {expanded ? <Minus size={24} /> : <Plus size={24} />}
        </div>
      </div>

      {/* Collapsible Content */}
      <div
        className={`grid grid-cols-2 gap-4 transition-all duration-300 overflow-hidden mt-3 p-2 pt-0 ${
          expanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {/* Facebook */}
        <div className="col-span-2">
          <Input
            label="Facebook URL"
            placeholder="https://facebook.com/yourpage"
            {...register("facebook")}
            error={errors.facebook?.message}
          />
        </div>

        {/* Twitter */}
        <div className="col-span-2">
          <Input
            label="Twitter URL"
            placeholder="https://twitter.com/yourhandle"
            {...register("twitter")}
            error={errors.twitter?.message}
          />
        </div>

        {/* Instagram */}
        <div className="col-span-2">
          <Input
            label="Instagram URL"
            placeholder="https://instagram.com/yourprofile"
            {...register("instagram")}
            error={errors.instagram?.message}
          />
        </div>

        {/* YouTube */}
        <div className="col-span-2">
          <Input
            label="YouTube URL"
            placeholder="https://youtube.com/@yourchannel"
            {...register("youtube")}
            error={errors.youtube?.message}
          />
        </div>

        {/* Actions */}
        <div className="col-span-2 flex justify-end gap-4 mt-4">
          <Button type="button" variant="secondary" onClick={() => reset()}>
            Reset
          </Button>
          <Button type="submit" isLoading={socialMutation.isPending}>
            Save Changes
          </Button>
        </div>
      </div>
    </form>
  );
}
