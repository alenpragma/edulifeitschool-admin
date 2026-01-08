"use client";

import { X } from "lucide-react";
import Modal from "react-responsive-modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

/* ---------------------- Schema ---------------------- */
const addTeacherSchema = z.object({
  name: z.string().min(1, "Name is required"),
  subject: z.string().min(1, "Subject is required"),
  qualification: z.string().min(1, "Qualification is required"),
  profilePicture: z.any().optional(), // optional now
});

export type AddTeacherInputs = z.infer<typeof addTeacherSchema>;

export type AddTeacherResponse = {
  message: string;
  data: {
    id: string;
  };
};

export default function AddTeacherModal({ isOpen, onClose }: Props) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddTeacherInputs>({
    resolver: zodResolver(addTeacherSchema),
  });

  const addMutation = useMutation<
    AddTeacherResponse,
    AxiosError<{ message: string }>,
    FormData
  >({
    mutationFn: (formData) =>
      api.post("/admin/teachers", formData).then((res) => res.data),

    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      reset();
      onClose();
    },

    onError: (error) =>
      toast.error(error.response?.data?.message || error.message),
  });

  const onSubmit = (data: AddTeacherInputs) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("subject", data.subject);
    formData.append("qualification", data.qualification);

    if (data.profilePicture && data.profilePicture.length > 0) {
      formData.append("profilePicture", data.profilePicture[0]); // optional
    }

    addMutation.mutate(formData);
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      center
      classNames={{
        modal:
          "rounded-lg !p-0 lg:min-w-[520px] min-w-[320px] overflow-hidden !shadow-none",
      }}
      showCloseIcon={false}
    >
      {/* Header */}
      <div className="border-b border-gray-200 p-4 flex items-center justify-between bg-gray-50">
        <h2 className="text-xl font-semibold text-gray-800">Add Teacher</h2>
        <button onClick={onClose} className="text-gray-600">
          <X size={20} />
        </button>
      </div>

      {/* Body */}
      <div className="p-6 max-h-[80vh] overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Inputs */}
          <div className="grid grid-cols-1 gap-3">
            <Input
              label="Full Name"
              placeholder="Enter full name"
              {...register("name")}
              error={errors.name?.message}
            />

            <Input
              label="Subject"
              placeholder="Enter subject"
              {...register("subject")}
              error={errors.subject?.message}
            />

            <Input
              label="Qualification"
              placeholder="Enter qualification"
              {...register("qualification")}
              error={errors.qualification?.message}
            />

            <Input
              type="file"
              label="Profile Picture (Optional)"
              {...register("profilePicture")}
            />
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3 pt-8">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>

            <Button type="submit" isLoading={addMutation.isPending}>
              Save
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
