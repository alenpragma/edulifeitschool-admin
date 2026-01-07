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

/* -----------------------------
   Zod Schema
-------------------------------- */
const openingHoursSchema = z.object({
  sunday: z.string().optional().or(z.literal("")),
  monday: z.string().optional().or(z.literal("")),
  tuesday: z.string().optional().or(z.literal("")),
  wednesday: z.string().optional().or(z.literal("")),
  thursday: z.string().optional().or(z.literal("")),
  friday: z.string().optional().or(z.literal("")),
  saturday: z.string().optional().or(z.literal("")),
});

export type OpeningHoursFormInputs = z.infer<typeof openingHoursSchema>;

export default function OpeningHoursSectionForm({
  openingHours,
}: {
  openingHours: OpeningHoursFormInputs | null;
}) {
  const [expanded, setExpanded] = React.useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<OpeningHoursFormInputs>({
    resolver: zodResolver(openingHoursSchema),
    defaultValues: {
      sunday: "",
      monday: "",
      tuesday: "",
      wednesday: "",
      thursday: "",
      friday: "",
      saturday: "",
    },
  });

  /* -----------------------------
     Hydrate form
  -------------------------------- */
  useEffect(() => {
    if (openingHours) {
      reset({
        sunday: openingHours.sunday || "",
        monday: openingHours.monday || "",
        tuesday: openingHours.tuesday || "",
        wednesday: openingHours.wednesday || "",
        thursday: openingHours.thursday || "",
        friday: openingHours.friday || "",
        saturday: openingHours.saturday || "",
      });
    }
  }, [openingHours, reset]);

  /* -----------------------------
     React Query Mutation
  -------------------------------- */
  const openingHoursMutation = useMutation<
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
  const onSubmit = (data: OpeningHoursFormInputs) => {
    const formData = new FormData();
    formData.append("key", "openingHours");
    formData.append("value", JSON.stringify(data));

    openingHoursMutation.mutate(formData);
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
          <h2 className="text-lg font-semibold text-gray-800">Opening Hours</h2>
          <p className="text-sm text-gray-500">Update your working hours</p>
        </div>
        <div className="text-gray-600">
          {expanded ? <Minus size={24} /> : <Plus size={24} />}
        </div>
      </div>

      {/* Collapsible Content */}
      <div
        className={`grid grid-cols-2 gap-4 transition-all duration-300 overflow-hidden mt-3 p-2 pt-0 ${
          expanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {[
          "sunday",
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
        ].map((day) => (
          <Input
            key={day}
            label={day.charAt(0).toUpperCase() + day.slice(1)}
            placeholder="e.g., 9:00 AM - 6:00 PM"
            {...register(day as keyof OpeningHoursFormInputs)}
            error={errors[day as keyof OpeningHoursFormInputs]?.message}
          />
        ))}

        {/* Actions */}
        <div className="col-span-2 flex justify-end gap-4 mt-4">
          <Button type="button" variant="secondary" onClick={() => reset()}>
            Reset
          </Button>
          <Button type="submit" isLoading={openingHoursMutation.isPending}>
            Save Changes
          </Button>
        </div>
      </div>
    </form>
  );
}
