export const safeText = (value: any, fallback = "") => {
  if (!value || typeof value !== "string") return fallback;
  return value;
};