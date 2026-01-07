export type Photo = {
  id: number;
  url: string;
  position: number;
  createdAt: string;
  updatedAt: string;
};

export type Gallery = Photo[];
