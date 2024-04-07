import type { APIRoute } from "astro";
import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";

cloudinary.config({
  cloud_name: "djqrrlwav",
  api_key: "264158849151883",
  api_secret: import.meta.env.CLOUDINARY_SECRET,
});

const uploadStream = async (
  buffer: Uint8Array,
  options: {
    folder: string;
  }
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(options, (error, result) => {
        if (result) resolve(result);
        reject(error);
      })
      .end(buffer);
  });
};

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (file == null) {
    return new Response("No file found", { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);

  const result = await uploadStream(uint8Array, {
    folder: "images/food",
  });

  const { asset_id: id, secure_url: img_url } = result;

  return new Response(
    JSON.stringify({
      id,
      img_url,
    })
  );
};
