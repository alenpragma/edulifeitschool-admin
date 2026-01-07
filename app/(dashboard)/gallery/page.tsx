"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Gallery } from "@/types/gallery";
import Image from "next/image";
import { Trash2, ChevronLeft, ChevronRight, Upload } from "lucide-react";
import Button from "@/components/ui/Button";

export default function SiteSettingsPage() {
  const { data: galleryData, refetch } = useQuery<Gallery>({
    queryKey: ["gallery"],
    queryFn: () => api.get("/admin/gallery").then((res) => res.data.data),
  });

  const [gallery, setGallery] = useState<Gallery>(galleryData || []);

  if (galleryData && galleryData !== gallery) {
    setGallery(galleryData);
  }

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/admin/gallery/${id}`),
    onSuccess: () => refetch(),
  });

  const reorderMutation = useMutation({
    mutationFn: (body: { id: number; newPosition: number }) =>
      api.post("/admin/gallery/reorder", body),
    onSuccess: () => refetch(),
  });

  const uploadMutation = useMutation({
    mutationFn: (files: FileList) => {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append("files", file); // "files" key in your backend
      });
      return api.post("/admin/gallery", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => refetch(),
  });

  const handleDelete = (id: number) => deleteMutation.mutate(id);

  const moveImage = (index: number, direction: "left" | "right") => {
    if (!gallery) return;

    const newIndex = direction === "left" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= gallery.length) return;

    const newGallery = [...gallery];
    [newGallery[index], newGallery[newIndex]] = [
      newGallery[newIndex],
      newGallery[index],
    ];

    setGallery(newGallery);

    reorderMutation.mutate({
      id: newGallery[newIndex].id,
      newPosition: newIndex,
    });
  };

  const handleUploadClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = "image/*";
    input.onchange = () => {
      if (input.files && input.files.length > 0) {
        uploadMutation.mutate(input.files);
      }
    };
    input.click();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
          Photo Gallery
        </h1>
        <Button leftIcon={<Upload size={20} />} onClick={handleUploadClick}>
          Upload
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {gallery?.map((item, idx) => (
          <div
            key={item.id}
            className="relative w-full h-40 rounded overflow-hidden shadow-md"
          >
            <Image
              src={item.url}
              alt={`Gallery ${idx + 1}`}
              fill
              className="object-cover"
              placeholder="blur"
              blurDataURL="/placeholder.png"
              unoptimized
            />

            <button
              className="absolute top-2 right-2 bg-red-600 bg-opacity-80 hover:bg-opacity-100 p-1 rounded-full text-white z-10"
              onClick={() => handleDelete(item.id)}
            >
              <Trash2 size={18} />
            </button>

            {idx > 0 && (
              <button
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-700 bg-opacity-70 hover:bg-opacity-100 p-1 rounded-full text-white z-10"
                onClick={() => moveImage(idx, "left")}
              >
                <ChevronLeft size={20} />
              </button>
            )}

            {idx < gallery.length - 1 && (
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-700 bg-opacity-70 hover:bg-opacity-100 p-1 rounded-full text-white z-10"
                onClick={() => moveImage(idx, "right")}
              >
                <ChevronRight size={20} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
