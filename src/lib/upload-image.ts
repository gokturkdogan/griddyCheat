import { configureCloudinary } from "@/lib/cloudinary";

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;
const MAX_BYTES = 10 * 1024 * 1024;

export function validateImageFile(file: File): string | null {
  if (!ALLOWED.includes(file.type as (typeof ALLOWED)[number])) {
    return "Sadece JPEG, PNG, WebP veya GIF";
  }
  if (file.size > MAX_BYTES) {
    return "Dosya en fazla 10MB";
  }
  return null;
}

/** Önce Cloudinary'e yükle, secure_url'i DB'ye yaz. */
export async function storeImage(file: File): Promise<string> {
  const cloudinary = configureCloudinary();
  const buffer = Buffer.from(await file.arrayBuffer());
  const folder = process.env.CLOUDINARY_FOLDER || "griddycheats";

  const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, uploadResult) => {
        if (error || !uploadResult?.secure_url) {
          reject(error ?? new Error("Cloudinary upload başarısız"));
          return;
        }
        resolve({ secure_url: uploadResult.secure_url });
      },
    );
    stream.end(buffer);
  });

  return result.secure_url;
}
