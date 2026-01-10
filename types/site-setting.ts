export type Hero = {
  title: string;
  subtitle: string;
  heroImage: string;
};

export type Social = {
  facebook: string;
  twitter: string;
  instagram: string;
  youtube: string;
};

export type ContactItem = {
  name: "Phone" | "Email" | "Address" | "Main Campus" | "Working Hours";
  value: string;
  description: string;
};

export type Campus = {
  id: number;
  name: string;
  address: string;
  phone: string;
  googleMapUrl: string;
};

export type OpeningHours = {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
};

export type TestimonialItem = {
  name: string;
  title: string;
  subtitle?: string;
  value: string;
};

export type SiteSettings = {
  hero: Hero;
  social: Social;
  contact: ContactItem[];
  campuses: Campus[];
  openingHours: OpeningHours;
  testimonials: TestimonialItem[];
};
