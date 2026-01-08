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
import { Event } from "@/types/event";
import { useEffect } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  selectedItem: Event | null;
};

/* ---------------------- Schema ---------------------- */
const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  time: z.string().min(1, "Time is required"),
  location: z.string().min(1, "Location is required"),
  date: z.string().min(1, "Date is required"),
  icon: z.any().optional(), // optional
});

export type UpdateEventInputs = z.infer<typeof eventSchema>;

export type UpdateEventResponse = {
  message: string;
  data: {
    id: string;
  };
};

export default function UpdateEventModal({
  isOpen,
  onClose,
  selectedItem,
}: Props) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<UpdateEventInputs>({
    resolver: zodResolver(eventSchema),
  });

  // Populate form when modal opens
  useEffect(() => {
    if (selectedItem) {
      setValue("title", selectedItem.title);
      setValue("time", selectedItem.time);
      setValue("location", selectedItem.location);
      setValue(
        "date",
        selectedItem.date
          ? new Date(selectedItem.date).toISOString().split("T")[0]
          : ""
      );
    } else {
      reset();
    }
  }, [selectedItem, setValue, reset]);

  const updateMutation = useMutation<
    UpdateEventResponse,
    AxiosError<{ message: string }>,
    FormData
  >({
    mutationFn: (formData) =>
      api
        .put(`/admin/events/${selectedItem?.id}`, formData)
        .then((res) => res.data),

    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["events"] });
      reset();
      onClose();
    },

    onError: (error) =>
      toast.error(error.response?.data?.message || error.message),
  });

  const onSubmit = (data: UpdateEventInputs) => {
    if (!selectedItem) return;

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("time", data.time);
    formData.append("location", data.location);
    formData.append("date", data.date);

    if (data.icon && data.icon.length > 0) {
      formData.append("icon", data.icon[0]);
    }

    updateMutation.mutate(formData);
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
        <h2 className="text-xl font-semibold text-gray-800">Update Event</h2>
        <button onClick={onClose} className="text-gray-600">
          <X size={20} />
        </button>
      </div>

      {/* Body */}
      <div className="p-6 max-h-[80vh] overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-3">
            <Input
              label="Title"
              placeholder="Enter event title"
              {...register("title")}
              error={errors.title?.message}
            />

            <Input
              label="Time"
              placeholder="e.g. 10:00 AM - 1:00 PM"
              {...register("time")}
              error={errors.time?.message}
            />

            <Input
              label="Location"
              placeholder="Enter location"
              {...register("location")}
              error={errors.location?.message}
            />

            <Input
              type="date"
              label="Event Date"
              {...register("date")}
              error={errors.date?.message}
            />

            <Input
              type="file"
              label="Event Icon (Optional)"
              {...register("icon")}
            />
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3 pt-8">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>

            <Button type="submit" isLoading={updateMutation.isPending}>
              Update
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
