"use client";

import Button from "@/components/ui/Button";
import { Edit, Trash2, AlertCircle, Inbox } from "lucide-react";
import { useState } from "react";
import DeleteEventModal from "./DeleteEventModal";
import UpdateEventModal from "./UpdateEventModal";
import { Event } from "@/types/event";
import Image from "next/image";

type Props = {
  isFetching: boolean;
  isError: boolean;
  events: Event[];
};

export default function EventTable({
  isFetching,
  isError,
  events = [],
}: Props) {
  const colSpan = 5; // Title, Date & Time, Location, Icon, Actions
  const [selectedItem, setSelectedItem] = useState<Event | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleUpdate = (event: Event) => {
    setSelectedItem(event);
    setIsUpdateModalOpen(true);
  };

  const handleDelete = (event: Event) => {
    setSelectedItem(event);
    setIsDeleteModalOpen(true);
  };

  return (
    <>
      <UpdateEventModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        selectedItem={selectedItem}
      />

      <DeleteEventModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        selectedItem={selectedItem}
      />

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse text-sm md:text-base">
          <thead>
            <tr className="bg-[#3d50e0] text-base">
              <th className="p-3 md:p-5 text-left font-semibold text-white border-b">
                Title
              </th>
              <th className="p-3 md:p-5 text-left font-semibold text-white border-b">
                Date & Time
              </th>
              <th className="p-3 md:p-5 text-left font-semibold text-white border-b">
                Location
              </th>
              <th className="p-3 md:p-5 text-left font-semibold text-white border-b">
                Icon
              </th>
              <th className="p-3 md:p-5 text-right font-semibold text-white border-b">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {/* Loading Skeleton */}
            {isFetching &&
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {Array.from({ length: colSpan }).map((__, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 bg-gray-200 rounded w-full" />
                    </td>
                  ))}
                </tr>
              ))}

            {/* Empty / Error */}
            {!isFetching && (isError || events.length === 0) && (
              <tr>
                <td colSpan={colSpan}>
                  <div className="flex flex-col items-center justify-center gap-2 w-full py-10">
                    {isError ? (
                      <AlertCircle size={32} className="text-red-600" />
                    ) : (
                      <Inbox size={32} className="text-gray-500" />
                    )}
                    <span
                      className={isError ? "text-red-600" : "text-gray-500"}
                    >
                      {isError
                        ? "Something went wrong while fetching events."
                        : "No events found."}
                    </span>
                  </div>
                </td>
              </tr>
            )}

            {/* Data Rows */}
            {!isFetching &&
              !isError &&
              events.map((event) => (
                <tr key={event.id} className="hover:bg-gray-100">
                  <td className="px-4 py-3 font-semibold">{event.title}</td>

                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                      <span className="text-gray-600">{event.time}</span>
                    </div>
                  </td>

                  <td className="px-4 py-3">{event.location}</td>

                  <td className="px-4 py-3">
                    {event.icon ? (
                      <Image
                        src={event.icon}
                        alt={event.title}
                        className="h-10 w-10 object-cover rounded"
                        width={60}
                        height={60}
                        unoptimized
                      />
                    ) : (
                      <span className="text-gray-500">N/A</span>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex gap-2 items-center justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<Edit size={16} />}
                        className="border-blue-600 text-blue-600 hover:bg-blue-50"
                        aria-label="Edit Event"
                        onClick={() => handleUpdate(event)}
                      />

                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<Trash2 size={16} />}
                        className="border-red-600 text-red-600 hover:bg-red-50"
                        aria-label="Delete Event"
                        onClick={() => handleDelete(event)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
