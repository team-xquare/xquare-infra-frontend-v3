import { getAccessToken, isAuthenticated } from "../auth/token";
import { fetchWithTimeout } from "../fetch";

export interface CreateAddonRequest {
  teamId: number;
  name: string;
  type:
    | "mysql"
    | "postgres"
    | "redis"
    | "mongodb"
    | "kafka"
    | "rabbitmq"
    | "elk"
    | "debezium";
  storageGi: number;
  configuration: {
    bootstrap?: string;
  };
}

interface CreateAddonApiResponse {
  success: boolean;
  data: {
    addonId: number;
  };
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * 애드온 생성
 * - 경로: POST {API_BASE_URL}/addons
 * - 헤더: Authorization Bearer, Content-Type: application/json
 */
export const createAddon = async (
  request: CreateAddonRequest,
): Promise<number> => {
  if (!isAuthenticated()) {
    console.error("[createAddon] not authenticated");
    throw new Error("인증되지 않은 상태입니다.");
  }

  if (!API_BASE_URL) {
    console.error("[createAddon] missing API_BASE_URL");
    throw new Error("API_BASE_URL이 설정되어 있지 않습니다.");
  }

  if (typeof request.teamId !== "number" || Number.isNaN(request.teamId)) {
    throw new Error("유효한 팀 ID가 필요합니다.");
  }

  if (!request.name?.trim()) {
    throw new Error("Addon 이름이 필요합니다.");
  }

  if (
    !request.type ||
    ![
      "mysql",
      "postgres",
      "redis",
      "mongodb",
      "kafka",
      "rabbitmq",
      "elk",
      "debezium",
    ].includes(request.type)
  ) {
    throw new Error("유효한 Addon 타입이 필요합니다.");
  }

  if (typeof request.storageGi !== "number" || request.storageGi <= 0) {
    throw new Error("유효한 스토리지 용량이 필요합니다.");
  }

  const isDebezium = request.type === "debezium";
  if (isDebezium) {
    const bootstrap = request.configuration?.bootstrap?.trim();
    if (!bootstrap) {
      throw new Error("Debezium bootstrap이 필요합니다.");
    }
  }

  const accessToken = getAccessToken();
  if (!accessToken) {
    console.error("[createAddon] no access token");
    throw new Error("액세스 토큰이 없습니다.");
  }

  try {
    const payload = { ...request } as CreateAddonRequest;
    if (isDebezium) {
      const bootstrap = request.configuration?.bootstrap?.trim() ?? "";
      payload.configuration = { bootstrap };
    } else {
      payload.configuration = {};
    }

    const response = await fetchWithTimeout(`${API_BASE_URL}/addons`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("[createAddon] api error", {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
      });
      throw new Error(
        errorData?.message ||
          `Addon 생성 실패: ${response.status} ${response.statusText}`,
      );
    }

    const result: CreateAddonApiResponse = await response.json();

    if (!result.success || !result.data?.addonId) {
      console.error("[createAddon] invalid response", result);
      throw new Error("Addon 생성 응답이 유효하지 않습니다.");
    }

    return result.data.addonId;
  } catch (error) {
    console.error("[createAddon] error", error);
    throw error;
  }
};
