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
import { TestimonialItem } from "@/types/testimonial";

/* -----------------------------
   Constants (IMPORTANT)
-------------------------------- */
const TESTIMONIAL_KEYS = [
  "testimonial1",
  "testimonial2",
  "testimonial3",
  "testimonial4",
] as const;

type TestimonialKey = (typeof TESTIMONIAL_KEYS)[number];

/* -----------------------------
   Zod Schema
-------------------------------- */
const testimonialSchema = z.object({
  testimonial1: z.object({
    title: z.string().min(1, "Title is required"),
    subtitle: z.string().min(1, "Subtitle is required"),
    value: z.string().min(1, "Value is required"),
  }),
  testimonial2: z.object({
    title: z.string().min(1, "Title is required"),
    subtitle: z.string().min(1, "Subtitle is required"),
    value: z.string().min(1, "Value is required"),
  }),
  testimonial3: z.object({
    title: z.string().min(1, "Title is required"),
    subtitle: z.string().min(1, "Subtitle is required"),
    value: z.string().min(1, "Value is required"),
  }),
  testimonial4: z.object({
    title: z.string().min(1, "Title is required"),
    subtitle: z.string().min(1, "Subtitle is required"),
    value: z.string().min(1, "Value is required"),
  }),
});

export type TestimonialFormInputs = z.infer<typeof testimonialSchema>;

export default function TestimonialSectionForm({
  testimonials,
}: {
  testimonials: TestimonialItem[] | null;
}) {
  const [expanded, setExpanded] = React.useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TestimonialFormInputs>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      testimonial1: { title: "", subtitle: "", value: "" },
      testimonial2: { title: "", subtitle: "", value: "" },
      testimonial3: { title: "", subtitle: "", value: "" },
      testimonial4: { title: "", subtitle: "", value: "" },
    },
  });

  /* -----------------------------
     Hydrate form
  -------------------------------- */
  useEffect(() => {
    if (!testimonials) return;

    const dataMap: Partial<
      Record<TestimonialKey, { title: string; subtitle: string; value: string }>
    > = {};

    testimonials.forEach((item, index) => {
      const key = TESTIMONIAL_KEYS[index];
      if (!key) return;

      dataMap[key] = {
        title: item.title || "",
        subtitle: item.subtitle || "",
        value: item.value || "",
      };
    });

    reset({
      testimonial1: dataMap.testimonial1 ?? {
        title: "",
        subtitle: "",
        value: "",
      },
      testimonial2: dataMap.testimonial2 ?? {
        title: "",
        subtitle: "",
        value: "",
      },
      testimonial3: dataMap.testimonial3 ?? {
        title: "",
        subtitle: "",
        value: "",
      },
      testimonial4: dataMap.testimonial4 ?? {
        title: "",
        subtitle: "",
        value: "",
      },
    });
  }, [testimonials, reset]);

  /* -----------------------------
     React Query Mutation
  -------------------------------- */
  const testimonialMutation = useMutation<
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
  const onSubmit = (data: TestimonialFormInputs) => {
    const valueArray = TESTIMONIAL_KEYS.map((key, index) => ({
      name: `Testimonial ${index + 1}`,
      ...data[key],
    }));

    const formData = new FormData();
    formData.append("key", "testimonials");
    formData.append("value", JSON.stringify(valueArray));

    testimonialMutation.mutate(formData);
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
          <h2 className="text-lg font-semibold text-gray-800">Testimonials</h2>
          <p className="text-sm text-gray-500">Update testimonial content</p>
        </div>

        <div className="text-gray-600">
          {expanded ? <Minus size={24} /> : <Plus size={24} />}
        </div>
      </div>

      {/* Collapsible Content */}
      <div
        className={`transition-all duration-300 overflow-hidden mt-3 p-2 pt-0 ${
          expanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {TESTIMONIAL_KEYS.map((key, index) => (
          <div key={key} className="grid grid-cols-3 gap-4 mb-4">
            <Input
              label={`Title ${index + 1}`}
              {...register(`${key}.title`)}
              error={errors[key]?.title?.message}
            />
            <Input
              label={`Subtitle ${index + 1}`}
              {...register(`${key}.subtitle`)}
              error={errors[key]?.subtitle?.message}
            />
            <Input
              label={`Value ${index + 1}`}
              {...register(`${key}.value`)}
              error={errors[key]?.value?.message}
            />
          </div>
        ))}

        {/* Actions */}
        <div className="flex justify-end gap-4 mt-4">
          <Button type="button" variant="secondary" onClick={() => reset()}>
            Reset
          </Button>
          <Button type="submit" isLoading={testimonialMutation.isPending}>
            Save Changes
          </Button>
        </div>
      </div>
    </form>
  );
}
