import { NextResponse } from "next/server";

const maxPhotoSize = 5 * 1024 * 1024;
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

function matchesImageType(bytes, type) {
  if (type === "image/jpeg") {
    return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }

  if (type === "image/png") {
    return (
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47 &&
      bytes[4] === 0x0d &&
      bytes[5] === 0x0a &&
      bytes[6] === 0x1a &&
      bytes[7] === 0x0a
    );
  }

  if (type === "image/webp") {
    return (
      String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
      String.fromCharCode(...bytes.slice(8, 12)) === "WEBP"
    );
  }

  return false;
}

export async function POST(request) {
  const apiKey = process.env.IMGBB_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Image uploads are not configured." },
      { status: 503 },
    );
  }

  let formData;

  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "A valid image file is required." },
      { status: 400 },
    );
  }

  const photo = formData.get("image") || formData.get("photo");

  if (!(photo instanceof File) || photo.size === 0) {
    return NextResponse.json(
      { error: "Choose an image file to continue." },
      { status: 400 },
    );
  }

  if (!allowedTypes.has(photo.type)) {
    return NextResponse.json(
      { error: "Choose a JPEG, PNG, or WebP image." },
      { status: 415 },
    );
  }

  if (photo.size > maxPhotoSize) {
    return NextResponse.json(
      { error: "Images must be 5 MB or smaller." },
      { status: 413 },
    );
  }

  const imageBytes = new Uint8Array(await photo.arrayBuffer());

  if (!matchesImageType(imageBytes, photo.type)) {
    return NextResponse.json(
      { error: "The selected file is not a valid image." },
      { status: 415 },
    );
  }

  const uploadData = new FormData();
  uploadData.set("image", photo, photo.name);

  let uploadResponse;

  try {
    uploadResponse = await fetch(
      `https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`,
      { method: "POST", body: uploadData },
    );
  } catch {
    return NextResponse.json(
      { error: "The image service could not be reached. Please try again." },
      { status: 502 },
    );
  }

  let uploadResult;

  try {
    uploadResult = await uploadResponse.json();
  } catch {
    return NextResponse.json(
      { error: "The image service returned an invalid response." },
      { status: 502 },
    );
  }

  if (
    !uploadResponse.ok ||
    !uploadResult.success ||
    typeof uploadResult.data?.url !== "string"
  ) {
    return NextResponse.json(
      { error: uploadResult.error?.message || "The image could not be uploaded." },
      { status: 502 },
    );
  }

  return NextResponse.json({ imageUrl: uploadResult.data.url });
}
