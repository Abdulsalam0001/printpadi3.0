// ============================================================
// PrintPadi – lib/cloudinary.ts
// Exact port of lib/cloudinary.ts from the Next.js project.
// (process.env.NEXT_PUBLIC_* → import.meta.env.VITE_*)
// ============================================================

export type CloudinaryUploadResult = {
  publicId: string;
  url: string;
  secureUrl: string;
};

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined;
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string | undefined;

export const hasCloudinaryUploadConfig = Boolean(cloudName && uploadPreset);

export async function uploadImageToCloudinary(
  file: File,
): Promise<CloudinaryUploadResult> {
  if (!cloudName || !uploadPreset) {
    throw new Error(
      'Cloudinary upload is not fully configured yet. Add the cloud name and upload preset to .env.local.',
    );
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: 'POST',
      body: formData,
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message ?? 'Cloudinary upload failed.');
  }

  return {
    publicId: data.public_id,
    url: data.secure_url,
    secureUrl: data.secure_url,
  };
}
