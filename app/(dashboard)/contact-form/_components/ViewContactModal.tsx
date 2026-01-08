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
import { Contact } from "@/types/contact";
import { useEffect } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  selectedItem: Contact | null;
};

/* ---------------------- Schema ---------------------- */
const noteSchema = z.object({
  note: z.string().optional(),
});

export type NoteInputs = z.infer<typeof noteSchema>;

export type UpdateNoteResponse = {
  message: string;
  data: {
    id: number;
    note?: string;
  };
};

export default function ViewContactModal({
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
  } = useForm<NoteInputs>({
    resolver: zodResolver(noteSchema),
  });

  // Populate form when modal opens
  useEffect(() => {
    if (selectedItem) {
      setValue("note", selectedItem.note || "");
    } else {
      reset();
    }
  }, [selectedItem, setValue, reset]);

  const updateMutation = useMutation<
    UpdateNoteResponse,
    AxiosError<{ message: string }>,
    { id: number; note: string }
  >({
    mutationFn: ({ id, note }) =>
      api
        .put(`/admin/contact-forms/${id}/note`, { note })
        .then((res) => res.data),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["contact-forms"] });
      reset();
      onClose();
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || error.message),
  });

  const onSubmit = (data: NoteInputs) => {
    if (!selectedItem) return;
    updateMutation.mutate({ id: selectedItem.id, note: data.note || "" });
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
        <h2 className="text-xl font-semibold text-gray-800">View Form</h2>
        <button onClick={onClose} className="text-gray-600">
          <X size={20} />
        </button>
      </div>

      {/* Body */}
      <div className="p-6 max-h-[80vh] overflow-y-auto">
        {selectedItem && (
          <>
            {/* Contact Info */}
            <div className="mb-6 space-y-2">
              <div>
                <span className="font-semibold">Name: </span>
                {selectedItem.name}
              </div>
              <div>
                <span className="font-semibold">Phone: </span>
                {selectedItem.phone}
              </div>
              <div>
                <span className="font-semibold">Email: </span>
                {selectedItem.email || "N/A"}
              </div>
              <div>
                <span className="font-semibold">Subject: </span>
                {selectedItem.subject}
              </div>
              <div>
                <span className="font-semibold">Message: </span>
                <p className="whitespace-pre-wrap">{selectedItem.message}</p>
              </div>
              <div>
                <span className="font-semibold">Date Time: </span>
                {new Date(selectedItem.createdAt).toLocaleString()}
              </div>
            </div>

            {/* Note Input */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                label="Note"
                placeholder="Enter a note"
                {...register("note")}
                error={errors.note?.message}
              />

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3 pt-4">
                <Button variant="outline" type="button" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" isLoading={updateMutation.isPending}>
                  Save
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </Modal>
  );
}
