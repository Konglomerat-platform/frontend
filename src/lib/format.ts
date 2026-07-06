import type { Lang, Ml } from "../types";

export const languages: Lang[] = ["uz", "ru", "en"];

export function localize(value?: Ml | string | null, lang: string = "ru") {
  if (!value) return "";
  if (typeof value === "string") return value;
  const key = lang as Lang;
  return value[key] || value.ru || value.en || value.uz || "";
}

export function initials(value?: string | null) {
  return (value || "?").trim().slice(0, 1).toUpperCase();
}

export function formatSeen(value?: string | number | null) {
  if (!value) return "";
  const date = new Date(value);
  const pad = (num: number) => String(num).padStart(2, "0");
  const time = `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  return date.toDateString() === new Date().toDateString()
    ? time
    : `${pad(date.getDate())}.${pad(date.getMonth() + 1)} ${time}`;
}

export function fileToDataUrl(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function formatFileSize(value?: number | null) {
  if (!value) return "";
  const units = ["B", "KB", "MB", "GB"];
  let size = value;
  let unit = 0;
  while (size >= 1024 && unit < units.length - 1) {
    size /= 1024;
    unit += 1;
  }
  return `${unit === 0 ? size : size.toFixed(size >= 10 ? 0 : 1)} ${units[unit]}`;
}
