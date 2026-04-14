import { useCallback, useRef, useState } from "react";
import { searchUsersByName } from "@xquare/utils";
import type { UserSearchResult } from "@xquare/utils";

interface UseSearchUsersState {
  loading: boolean;
  error: Error | null;
  results: UserSearchResult[];
}

export const useSearchUsers = () => {
  const requestSeqRef = useRef(0);
  const [state, setState] = useState<UseSearchUsersState>({
    loading: false,
    error: null,
    results: [],
  });

  const search = useCallback(async (name: string) => {
    const seq = ++requestSeqRef.current;
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const results = await searchUsersByName(name);
      if (seq !== requestSeqRef.current) return [];
      setState({ loading: false, error: null, results });
      return results;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      if (seq !== requestSeqRef.current) return [];
      setState({ loading: false, error, results: [] });
      throw error;
    }
  }, []);

  return { ...state, search };
};
