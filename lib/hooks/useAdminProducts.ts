import useSWR, { SWRConfiguration } from "swr";
import { Product } from "@/types";

const fetcher = async (url: string): Promise<Product[]> => {
  const response = await fetch(url, {
    // Use Next.js cache for 5 minutes
    next: { revalidate: 300 },
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || "Failed to load products");
  }

  return payload.products || [];
};

export function useAdminProducts(config?: SWRConfiguration<Product[]>) {
  const swr = useSWR<Product[]>(
    "/api/admin/products",
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60_000, // 60 seconds (increased from 30)
      focusThrottleInterval: 60_000, // Throttle focus revalidation
      ...config,
    }
  );

  return {
    products: swr.data || [],
    loading: !swr.data && !swr.error,
    error: swr.error,
    mutate: swr.mutate,
  };
}

