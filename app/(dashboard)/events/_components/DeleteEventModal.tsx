"use client";

import { X } from "lucide-react";
import Modal from "react-responsive-modal";
import { Event } from "@/types/event";
import Button from "@/components/ui/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  selectedItem: Event | null;
};

export default function DeleteEventModal({
  isOpen,
  onClose,
  selectedItem,
}: Props) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation<
    { message: string },
    AxiosError<{ message: string }>,
    Event | null
  >({
    mutationFn: (event) =>
      api.delete(`/admin/events/${event?.id}`).then((res) => res.data),

    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["events"] });
      onClose();
    },

    onError: (error) =>
      toast.error(error.response?.data?.message || error.message),
  });

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      center
      classNames={{
        modal:
          "rounded-lg !p-0 lg:min-w-md min-w-xs overflow-hidden !shadow-none",
      }}
      showCloseIcon={false}
    >
      {/* Header */}
      <div className="border-b border-gray-200 px-5 py-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Delete Event?</h2>

        <button onClick={onClose} className="text-black text-2xl">
          <X size={20} />
        </button>
      </div>

      {/* Body */}
      <div className="p-5">
        <p className="text-gray-700 text-lg">
          Are you sure you want to delete event:{" "}
          <span className="font-semibold">{selectedItem?.title}</span>?
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-3 p-5">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={() => deleteMutation.mutate(selectedItem)}
          isLoading={deleteMutation.isPending}
        >
          Delete
        </Button>
      </div>
    </Modal>
  );
}
