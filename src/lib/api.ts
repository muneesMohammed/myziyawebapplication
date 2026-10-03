import { Product } from "@/types/product.types";
import { Review } from "@/types/review.types";
import { newArrivalsData, relatedProductData, topSellingData, reviewsData } from "@/data/homepageData";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export interface GetProductsParams {
  category_slug?: string;
  category_id?: string;
  search?: string;
  min_price?: number;
  max_price?: number;
  sort_by?: string;
  skip?: number;
  limit?: number;
  published_only?: boolean;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  published?: boolean;
}

/**
 * Normalizes backend product object to ensure complete compatibility with frontend Product interface.
 */
export function normalizeProduct(data: any): Product {
  return {
    id: data.id ?? data.sku ?? Math.random(),
    title: data.title || data.name || "Untitled Perfume",
    category: data.category || (data.category_name ?? "Perfumes"),
    srcUrl: data.srcUrl || data.image_url || "/images/pic1.png",
    gallery: Array.isArray(data.gallery) && data.gallery.length > 0 ? data.gallery : [data.srcUrl || data.image_url || "/images/pic1.png"],
    price: Number(data.price ?? data.selling_price ?? 0),
    discount: {
      amount: Number(data.discount?.amount ?? data.discount_amount ?? 0),
      percentage: Number(data.discount?.percentage ?? data.discount_percentage ?? 0),
    },
    rating: Number(data.rating ?? 5.0),
    sku: data.sku,
    slug: data.slug,
    description: data.description,
  };
}

/**
 * Normalizes backend review object to Review interface.
 */
export function normalizeReview(data: any): Review {
  return {
    id: data.id ?? Math.random(),
    user: data.user_name || data.user || "Customer",
    content: data.content || "",
    rating: Number(data.rating ?? 5.0),
    date: data.date || "Recent",
    product_id: data.product_id,
  };
}

/**
 * Fetch all products from FastAPI backend with query parameters.
 */
export async function getProducts(params: GetProductsParams = {}): Promise<Product[]> {
  try {
    const queryParams = new URLSearchParams();
    if (params.category_slug) queryParams.append("category_slug", params.category_slug);
    if (params.category_id) queryParams.append("category_id", params.category_id);
    if (params.search) queryParams.append("search", params.search);
    if (params.min_price !== undefined) queryParams.append("min_price", params.min_price.toString());
    if (params.max_price !== undefined) queryParams.append("max_price", params.max_price.toString());
    if (params.sort_by) queryParams.append("sort_by", params.sort_by);
    if (params.skip !== undefined) queryParams.append("skip", params.skip.toString());
    if (params.limit !== undefined) queryParams.append("limit", params.limit.toString());
    if (params.published_only) queryParams.append("published_only", "true");

    const url = `${API_BASE_URL}/products${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) {
      console.warn(`[FastAPI] getProducts returned status ${res.status}, using static fallback.`);
      return getStaticProducts();
    }

    const data = await res.json();
    if (!Array.isArray(data)) return getStaticProducts();

    return data.map(normalizeProduct);
  } catch (error) {
    console.warn("[FastAPI] getProducts failed, using static fallback:", error);
    return getStaticProducts();
  }
}

/**
 * Fetch single product by ID or Slug from FastAPI backend.
 */
export async function getProductByIdOrSlug(idOrSlug: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/products/${encodeURIComponent(idOrSlug)}`, { cache: "no-store" });
    if (!res.ok) {
      console.warn(`[FastAPI] getProductByIdOrSlug(${idOrSlug}) returned ${res.status}, searching static data.`);
      return getStaticProductByIdOrSlug(idOrSlug);
    }

    const data = await res.json();
    return normalizeProduct(data);
  } catch (error) {
    console.warn(`[FastAPI] getProductByIdOrSlug(${idOrSlug}) failed:`, error);
    return getStaticProductByIdOrSlug(idOrSlug);
  }
}

/**
 * Fetch categories from FastAPI backend.
 */
export async function getCategories(): Promise<CategoryItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/categories?published_only=true`, { cache: "no-store" });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.warn("[FastAPI] getCategories failed:", error);
    return [];
  }
}

/**
 * Fetch reviews from FastAPI backend.
 */
export async function getReviews(productId?: string): Promise<Review[]> {
  try {
    const url = productId
      ? `${API_BASE_URL}/reviews?product_id=${encodeURIComponent(productId)}`
      : `${API_BASE_URL}/reviews`;

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return reviewsData;

    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return reviewsData;
    return data.map(normalizeReview);
  } catch (error) {
    console.warn("[FastAPI] getReviews failed, using fallback:", error);
    return reviewsData;
  }
}

export interface CreateOrderPayload {
  coupon_code?: string;
  payment_method?: string;
  shipping_cost?: number;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  customer_address?: string;
  items: { product_id: string; quantity: number; unit_price?: number }[];
}

export interface RegisterUserPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}

export interface LoginUserPayload {
  email: string;
  password: string;
}

export interface RazorpayOrderResponse {
  id: string;
  amount: number;
  currency: string;
  key: string;
  receipt?: string;
  mock?: boolean;
}

export interface UpdateUserProfilePayload {
  name?: string;
  phone?: string;
  address?: string;
}

/**
 * Register new customer account on FastAPI backend.
 */
export async function registerUser(payload: RegisterUserPayload): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({ detail: "Registration failed" }));
    throw new Error(errData.detail || "Registration failed");
  }

  return await res.json();
}

/**
 * Login customer account on FastAPI backend.
 */
export async function loginUser(payload: LoginUserPayload): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({ detail: "Login failed" }));
    throw new Error(errData.detail || "Login failed");
  }

  return await res.json();
}

/**
 * Fetch current authenticated user info.
 */
export async function getMe(token: string): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch user session");
  }

  return await res.json();
}

export async function createRazorpayOrder(amount: number, receipt?: string): Promise<RazorpayOrderResponse> {
  const res = await fetch(`${API_BASE_URL}/payments/create-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount, currency: "INR", receipt: receipt || `receipt_${Date.now()}` }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({ detail: "Unable to start Razorpay payment" }));
    throw new Error(errData.detail || "Unable to start Razorpay payment");
  }

  return await res.json();
}

export async function verifyRazorpayPayment(payload: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/payments/verify-payment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({ detail: "Payment verification failed" }));
    throw new Error(errData.detail || "Payment verification failed");
  }

  return await res.json();
}

export async function updateUserProfile(userId: string, payload: UpdateUserProfilePayload, token?: string): Promise<any> {
  const params = new URLSearchParams();
  if (payload.name) params.append("name", payload.name);
  if (payload.phone !== undefined) params.append("phone", payload.phone || "");
  if (payload.address !== undefined) params.append("address", payload.address || "");

  const res = await fetch(`${API_BASE_URL}/customers/${encodeURIComponent(userId)}?${params.toString()}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({ detail: "Profile update failed" }));
    throw new Error(errData.detail || "Profile update failed");
  }

  return await res.json();
}

export async function getCustomerOrders(token: string): Promise<any[]> {
  const res = await fetch(`${API_BASE_URL}/orders`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch your orders");
  }

  return await res.json();
}

/**
 * Create order on FastAPI backend connected to database.
 */
export async function createOrder(payload: CreateOrderPayload, token?: string): Promise<any> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}/orders`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({ detail: "Order placement failed" }));
    throw new Error(errData.detail || "Order placement failed");
  }

  return await res.json();
}

/**
 * Validate coupon code against FastAPI backend.
 */
export async function validateCoupon(code: string): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/coupons/validate/${encodeURIComponent(code)}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Invalid or expired coupon code");
  }
  return await res.json();
}

/* Fallback helper functions */
function getStaticProducts(): Product[] {
  return [...newArrivalsData, ...topSellingData, ...relatedProductData];
}

function getStaticProductByIdOrSlug(idOrSlug: string): Product | null {
  const all = getStaticProducts();
  return (
    all.find((p) => String(p.id) === idOrSlug || p.title.toLowerCase().replace(/\s+/g, "-") === idOrSlug) ||
    all[0] ||
    null
  );
}

