"use client";

import { useQuery } from "@tanstack/react-query";
import HeroSectionForm from "./_components/HeroSectionForm";
import { api } from "@/lib/api";
import { SiteSettings } from "@/types/site-setting";
import SocialSectionForm from "./_components/SocialSectionForm";
import ContactSectionForm from "./_components/ContactSectionForm";
import CampusSectionForm from "./_components/CampusSectionForm";
import OpeningHoursSectionForm from "./_components/OpeningHoursForm";

export default function SiteSettingsPage() {
  const { data: settings } = useQuery<SiteSettings>({
    queryKey: ["site-settings"],
    queryFn: () => api.get("/admin/site-settings").then((res) => res.data.data),
  });

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 w-full">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 flex-shrink-0">
            Site Settings
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        <HeroSectionForm hero={settings?.hero || null} />

        <SocialSectionForm social={settings?.social || null} />

        <ContactSectionForm contact={settings?.contact || null} />

        <CampusSectionForm campuses={settings?.campuses || null} />

        <OpeningHoursSectionForm
          openingHours={settings?.openingHours || null}
        />
      </div>
    </div>
  );
}
