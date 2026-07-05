export type Lang = "uz" | "ru" | "en";

export type Ml = Partial<Record<Lang, string>>;

export type User = {
  id: number;
  username: string;
  role: "admin" | "company";
  name: string;
  company?: { id: number; name: string; slug: string } | null;
};

export type Company = {
  id: number;
  name: string;
  slug: string;
  sector?: string;
  email?: string;
  phone?: string;
  active?: boolean;
};

export type Product = {
  id: string;
  ico?: string;
  icon?: string;
  company: string;
  name: Ml;
  desc: Ml;
  price: string;
  images?: string[];
  image?: string | null;
};

export type NewsArticle = {
  id: string;
  ico?: string;
  company: string;
  date: string;
  title: Ml;
  text: Ml;
  body?: Partial<Record<Lang, string[]>>;
  image?: string | null;
};

export type Order = {
  id: string;
  product: { name: Ml; price: string; company: string; ico?: string };
  customer: { name: string; contact: string };
  qty: number;
  at: string;
  status: string;
};

export type Complaint = {
  id: string;
  from: string;
  contact: string;
  title?: Ml | null;
  text: Ml | string;
  official: boolean;
  reply?: string | null;
  status: string;
  at: string;
};

export type Rnd = {
  id: string;
  company: string;
  cat: string;
  name: Ml;
  desc: Ml;
  patent: boolean;
  status: string;
};

export type Conference = {
  id: string;
  name: string;
  date: string;
  time: string;
  desc?: string;
  link?: string;
  joined: number;
  total: number;
};

export type ChatMessage = {
  id: string;
  chat: string;
  sender: string;
  role?: string;
  kind: "text" | "image" | "file" | "voice";
  text: string;
  data?: string | null;
  name?: string | null;
  seenBy?: Array<{ name: string; at: string }>;
  edited?: boolean;
  ts: number;
  dur?: number | null;
};

export type NotificationResponse = {
  list: Array<{ id: number; title: Ml; text: string; link?: string | null; at: string; read: boolean }>;
  unread: number;
};

export type AiChatResponse = {
  reply: string | null;
  offTopic?: boolean;
  offtopic?: boolean;
  locked?: boolean;
  remaining?: number | null;
};
