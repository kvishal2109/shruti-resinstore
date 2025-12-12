import useSWR, { SWRConfiguration } from "swr";
import { Order } from "@/types";

const fetcher = async (url: string): Promise<Order[]> => {
  const response = await fetch(url);
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || "Failed to load orders");
  }

  return payload.orders || [];
};

export function useAdminOrders(config?: SWRConfiguration<Order[]>) {
  const swr = useSWR<Order[]>(
    "/api/admin/orders",
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 30_000,
      ...config,
    }
  );

  return {
    orders: swr.data || [],
    loading: !swr.data && !swr.error,
    error: swr.error,
    mutate: swr.mutate,
  };
}

