"use client";

import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
const campusSchema = z.object({
  campuses: z.array(
    z.object({
      name: z.string().min(1, "Campus name is required"),
      address: z.string().min(1, "Address is required"),
      phone: z.string().optional(),
      googleMapUrl: z
        .string()
        .url("Must be a valid URL")
        .or(z.literal("")) // allow empty string
        .optional(),
    })
  ),
});

export type CampusFormInputs = z.infer<typeof campusSchema>;

export default function CampusSectionForm({
  campuses,
}: {
  campuses: CampusFormInputs["campuses"] | null;
}) {
  const [expanded, setExpanded] = React.useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<CampusFormInputs>({
    resolver: zodResolver(campusSchema),
    defaultValues: {
      campuses: [
        { name: "Khagrachari", address: "", phone: "", googleMapUrl: "" },
        { name: "Lakshmichhari", address: "", phone: "", googleMapUrl: "" },
      ],
    },
  });

  const { fields } = useFieldArray({
    name: "campuses",
    control,
  });

  /* -----------------------------
     Hydrate form
  -------------------------------- */
  useEffect(() => {
    if (campuses && Array.isArray(campuses)) {
      reset({ campuses });
    }
  }, [campuses, reset]);

  /* -----------------------------
     React Query Mutation
  -------------------------------- */
  const campusMutation = useMutation<
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
  const onSubmit = (data: CampusFormInputs) => {
    const formData = new FormData();
    formData.append("key", "campuses");
    formData.append("value", JSON.stringify(data.campuses));

    campusMutation.mutate(formData);
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
          <h2 className="text-lg font-semibold text-gray-800">
            Campus Details
          </h2>
          <p className="text-sm text-gray-500">
            Update your campus information
          </p>
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
        {fields.map((field, index) => (
          <React.Fragment key={field.id}>
            <Input
              label={`Campus ${index + 1} Name`}
              placeholder="Campus Name"
              {...register(`campuses.${index}.name`)}
              error={errors.campuses?.[index]?.name?.message}
            />
            <Input
              label={`Campus ${index + 1} Address`}
              placeholder="123 Street"
              {...register(`campuses.${index}.address`)}
              error={errors.campuses?.[index]?.address?.message}
            />
            <Input
              label={`Campus ${index + 1} Phone`}
              placeholder="+8801XXXXXXXXX"
              {...register(`campuses.${index}.phone`)}
              error={errors.campuses?.[index]?.phone?.message}
            />
            <Input
              label={`Campus ${index + 1} Google Map URL`}
              placeholder="https://maps.google.com/..."
              {...register(`campuses.${index}.googleMapUrl`)}
              error={errors.campuses?.[index]?.googleMapUrl?.message}
            />
          </React.Fragment>
        ))}

        {/* Actions */}
        <div className="col-span-2 flex justify-end gap-4 mt-4">
          <Button type="button" variant="secondary" onClick={() => reset()}>
            Reset
          </Button>
          <Button type="submit" isLoading={campusMutation.isPending}>
            Save Changes
          </Button>
        </div>
      </div>
    </form>
  );
}
