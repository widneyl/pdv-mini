import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { RestaurantTable } from "@/model/restaurantTable";
import { restaurantTableService } from "@/services/restaurantTableService";

interface TablesContextValue {
  tables: RestaurantTable[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const TablesContext = createContext<TablesContextValue | null>(null);

export function TablesProvider({ children }: { children: ReactNode }) {
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await restaurantTableService.list();
      setTables(data);
    } catch {
      setError("Não foi possível carregar as mesas.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const data = await restaurantTableService.list();
        if (!active) return;
        setTables(data);
      } catch {
        if (active) setError("Não foi possível carregar as mesas.");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  return (
    <TablesContext.Provider value={{ tables, loading, error, refresh }}>
      {children}
    </TablesContext.Provider>
  );
}

export function useTables(): TablesContextValue {
  const context = useContext(TablesContext);
  if (!context) throw new Error("useTables must be used within TablesProvider");
  return context;
}