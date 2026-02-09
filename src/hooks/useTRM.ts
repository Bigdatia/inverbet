import { useQuery } from "@tanstack/react-query";

const FALLBACK_TRM = 3700; // Valor más cercano a la realidad actual (3690)
const API_URL = "https://open.er-api.com/v6/latest/USD";

// Cache time: 24 hours
const STALE_TIME = 1000 * 60 * 60 * 24;

export const useTRM = () => {
  return useQuery({
    queryKey: ["trm"],
    queryFn: async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error("Failed to fetch TRM");
        }
        const data = await response.json();
        const copRate = data.rates.COP;
        
        if (!copRate || typeof copRate !== "number") {
          throw new Error("Invalid rate format");
        }
        
        return copRate;
      } catch (error) {
        console.error("Error fetching TRM, using fallback:", error);
        return FALLBACK_TRM;
      }
    },
    staleTime: STALE_TIME,
    initialData: FALLBACK_TRM,
  });
};

export const formatCurrencyCOP = (value: number) => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
};
