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
import { ContactItem } from "@/types/site-setting";

/* -----------------------------
   Zod Schema
-------------------------------- */
const contactSchema = z.object({
  phone: z.object({
    value: z.string().min(1, "Phone is required"),
    description: z.string().optional().or(z.literal("")),
  }),
  email: z.object({
    value: z.string().email("Invalid email"),
    description: z.string().optional().or(z.literal("")),
  }),
  address: z.object({
    value: z.string().min(1, "Address is required"),
    description: z.string().optional().or(z.literal("")),
  }),
  mainCampus: z.object({
    value: z.string().min(1, "Main Campus is required"),
    description: z.string().optional().or(z.literal("")),
  }),
  workingHours: z.object({
    value: z.string().min(1, "Working Hours required"),
    description: z.string().optional().or(z.literal("")),
  }),
});

export type ContactFormInputs = z.infer<typeof contactSchema>;

export default function ContactSectionForm({
  contact,
}: {
  contact: ContactItem[] | null;
}) {
  const [expanded, setExpanded] = React.useState(false); // default open
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormInputs>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      phone: { value: "", description: "" },
      email: { value: "", description: "" },
      address: { value: "", description: "" },
      mainCampus: { value: "", description: "" },
      workingHours: { value: "", description: "" },
    },
  });

  /* -----------------------------
     Hydrate form
  -------------------------------- */
  useEffect(() => {
    if (contact && Array.isArray(contact)) {
      const dataMap: Record<string, { value: string; description: string }> =
        {};

      contact.forEach((item: ContactItem) => {
        switch (item.name) {
          case "Phone":
            dataMap.phone = {
              value: item.value || "",
              description: item.description || "",
            };
            break;
          case "Email":
            dataMap.email = {
              value: item.value || "",
              description: item.description || "",
            };
            break;
          case "Address":
            dataMap.address = {
              value: item.value || "",
              description: item.description || "",
            };
            break;
          case "Main Campus":
            dataMap.mainCampus = {
              value: item.value || "",
              description: item.description || "",
            };
            break;
          case "Working Hours":
            dataMap.workingHours = {
              value: item.value || "",
              description: item.description || "",
            };
            break;
        }
      });

      reset({
        phone: dataMap.phone || { value: "", description: "" },
        email: dataMap.email || { value: "", description: "" },
        address: dataMap.address || { value: "", description: "" },
        mainCampus: dataMap.mainCampus || { value: "", description: "" },
        workingHours: dataMap.workingHours || { value: "", description: "" },
      });
    }
  }, [contact, reset]);

  /* -----------------------------
     React Query Mutation
  -------------------------------- */
  const contactMutation = useMutation<
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
  const onSubmit = (data: ContactFormInputs) => {
    const valueArray = [
      {
        name: "Phone",
        value: data.phone.value,
        description: data.phone.description,
      },
      {
        name: "Email",
        value: data.email.value,
        description: data.email.description,
      },
      {
        name: "Address",
        value: data.address.value,
        description: data.address.description,
      },
      {
        name: "Main Campus",
        value: data.mainCampus.value,
        description: data.mainCampus.description,
      },
      {
        name: "Working Hours",
        value: data.workingHours.value,
        description: data.workingHours.description,
      },
    ];

    const formData = new FormData();
    formData.append("key", "contact");
    formData.append("value", JSON.stringify(valueArray));

    contactMutation.mutate(formData);
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
            Contact Details
          </h2>
          <p className="text-sm text-gray-500">
            Update your contact information
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
        {/* Phone */}
        <Input
          label="Phone"
          placeholder="+8801XXXXXXXXX"
          {...register("phone.value")}
          error={errors.phone?.value?.message}
        />
        <Input
          label="Phone Description"
          placeholder="Primary phone"
          {...register("phone.description")}
          error={errors.phone?.description?.message}
        />

        {/* Email */}
        <Input
          label="Email"
          placeholder="email@example.com"
          {...register("email.value")}
          error={errors.email?.value?.message}
        />
        <Input
          label="Email Description"
          placeholder="Support email"
          {...register("email.description")}
          error={errors.email?.description?.message}
        />

        {/* Address */}
        <Input
          label="Address"
          placeholder="123 Street"
          {...register("address.value")}
          error={errors.address?.value?.message}
        />
        <Input
          label="Address Description"
          placeholder="Head Office"
          {...register("address.description")}
          error={errors.address?.description?.message}
        />

        {/* Main Campus */}
        <Input
          label="Main Campus"
          placeholder="Dhaka"
          {...register("mainCampus.value")}
          error={errors.mainCampus?.value?.message}
        />
        <Input
          label="Main Campus Description"
          placeholder="Main campus location"
          {...register("mainCampus.description")}
          error={errors.mainCampus?.description?.message}
        />

        {/* Working Hours */}
        <Input
          label="Working Hours"
          placeholder="Mon-Fri 9:00-18:00"
          {...register("workingHours.value")}
          error={errors.workingHours?.value?.message}
        />
        <Input
          label="Working Hours Description"
          placeholder="Weekdays"
          {...register("workingHours.description")}
          error={errors.workingHours?.description?.message}
        />

        {/* Actions */}
        <div className="col-span-2 flex justify-end gap-4 mt-4">
          <Button type="button" variant="secondary" onClick={() => reset()}>
            Reset
          </Button>
          <Button type="submit" isLoading={contactMutation.isPending}>
            Save Changes
          </Button>
        </div>
      </div>
    </form>
  );
}
