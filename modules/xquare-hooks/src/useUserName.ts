import { useEffect, useState } from "react";
import { CheckUser, getCachedUserName, isAuthenticated } from "@xquare/utils";

const USERNAME_CACHE_KEY = "xquare:username";

export const useUserName = (): {
  userName: string | null;
  loading: boolean;
} => {
  const [userName, setUserName] = useState<string | null>(getCachedUserName());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      const authed = isAuthenticated();

      if (!authed) {
        if (mounted) {
          setUserName(null);
          setLoading(false);
        }
        return;
      }

      setLoading(true);

      try {
        const me = await CheckUser();
        if (mounted) {
          setUserName(me.username);
        }
      } catch (error) {
        console.error("[useUserName] 유저 조회 실패:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadUser();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== USERNAME_CACHE_KEY) return;
      setUserName(event.newValue ?? null);
    };

    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return { userName, loading };
};
