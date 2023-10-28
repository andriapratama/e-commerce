export const MAX_FILE_SIZE = 500000;
export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export interface ImageInputType {
  image: File | undefined | Blob;
  preview: string;
  pathName: string;
}
