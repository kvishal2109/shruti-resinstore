import useSWR, { SWRConfiguration } from "swr";
import { Product } from "@/types";

const fetcher = async (url: string): Promise<Product[]> => {
  const response = await fetch(url);
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
      dedupingInterval: 30_000,
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

