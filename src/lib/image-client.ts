import { fitWithin } from "./image-size";

const OUTPUT_TYPE = "image/webp";
const OUTPUT_QUALITY = 0.85;

/** Shrinks a photo in the browser and converts it to WebP, so uploads are fast and storage lasts. */
export async function prepareImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  try {
    const { width, height } = fitWithin(bitmap.width, bitmap.height);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Your browser could not prepare this photo.");
    context.drawImage(bitmap, 0, 0, width, height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, OUTPUT_TYPE, OUTPUT_QUALITY));
    if (!blob) throw new Error("Your browser could not prepare this photo.");
    return blob;
  } finally {
    bitmap.close();
  }
}
