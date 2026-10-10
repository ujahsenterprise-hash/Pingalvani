import crypto from "node:crypto";

function getConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET.");
  }
  return { cloudName, apiKey, apiSecret };
}

function signature(params: Record<string, string>, apiSecret: string) {
  const payload = Object.entries(params)
    .filter(([, value]) => value !== "" && value !== undefined && value !== null)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  return crypto.createHash("sha1").update(payload + apiSecret).digest("hex");
}

export async function uploadToCloudinary(buffer: Buffer, resourceType: "image" | "video" | "raw", originalFilename: string, folder = "poet-portfolio/about") {
  const { cloudName, apiKey, apiSecret } = getConfig();
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const params = { folder, timestamp };
  const form = new FormData();
  form.append("file", new Blob([new Uint8Array(buffer)]), originalFilename);
  form.append("api_key", apiKey);
  form.append("timestamp", timestamp);
  form.append("folder", folder);
  form.append("signature", signature(params, apiSecret));

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, { method: "POST", body: form });
  const data = await response.json();
  if (!response.ok || !data.secure_url || !data.public_id) {
    throw new Error(data?.error?.message || "Cloudinary upload failed.");
  }
  return { secure_url: data.secure_url as string, public_id: data.public_id as string };
}

export async function destroyFromCloudinary(publicId: string, resourceType: "image" | "video") {
  const { cloudName, apiKey, apiSecret } = getConfig();
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const params = { public_id: publicId, timestamp };
  const form = new URLSearchParams();
  form.set("public_id", publicId);
  form.set("timestamp", timestamp);
  form.set("api_key", apiKey);
  form.set("signature", signature(params, apiSecret));
  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/destroy`, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: form.toString() });
  const data = await response.json();
  if (!response.ok || (data.result !== "ok" && data.result !== "not found")) {
    throw new Error(data?.error?.message || "Cloudinary deletion failed.");
  }
  return data;
}
