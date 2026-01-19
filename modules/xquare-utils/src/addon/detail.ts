import { getAccessToken, isAuthenticated } from "../auth/token";
import { fetchWithTimeout } from "../fetch";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export type AddonType =
  | "mysql"
  | "postgres"
  | "redis"
  | "mongodb"
  | "kafka"
  | "rabbitmq"
  | "elk"
  | "debezium"
  | string;

export interface AddonConfiguration {
  bootstrap?: string;
  [key: string]: unknown;
}

export interface AddonDetail {
  id: number;
  name: string;
  type: AddonType;
  storageGi: number;
  configuration: AddonConfiguration;
}

interface GetAddonDetailApiResponse {
  success: boolean;
  data?: {
    id: number;
    name: string;
    type: AddonType;
    storageGi: number;
    configuration?: AddonConfiguration;
  } | null;
}

/**
 * 애드온 상세 조회
 * - 경로: GET /api/v1/addons/{addonId}
 */
export const getAddonDetail = async (addonId: number): Promise<AddonDetail> => {
  if (!isAuthenticated()) {
    throw new Error("인증되지 않은 상태입니다.");
  }

  if (!API_BASE_URL) {
    throw new Error("API_BASE_URL이 설정되어 있지 않습니다.");
  }

  if (typeof addonId !== "number" || Number.isNaN(addonId) || addonId <= 0) {
    throw new Error("유효한 애드온 ID가 필요합니다.");
  }

  const accessToken = getAccessToken();
  if (!accessToken) {
    throw new Error("AccessToken이 없습니다.");
  }

  let response: Response;

  try {
    response = await fetchWithTimeout(`${API_BASE_URL}/addons/${addonId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "*/*",
      },
    });
  } catch (error) {
    console.error("[getAddonDetail] fetch 실패:", error);
    throw new Error("네트워크 오류가 발생했습니다.");
  }

  if (!response.ok) {
    throw new Error(`애드온 조회에 실패했습니다. (status: ${response.status})`);
  }

  let json: GetAddonDetailApiResponse;

  try {
    json = await response.json();
  } catch (error) {
    console.error("[getAddonDetail] JSON 파싱 실패:", error);
    throw new Error("서버 응답을 파싱할 수 없습니다.");
  }

  if (!json.success || !json.data) {
    throw new Error("애드온 조회 결과가 올바르지 않습니다.");
  }

  const { id, name, type, storageGi, configuration } = json.data;

  return {
    id,
    name,
    type,
    storageGi,
    configuration: configuration ?? {},
  };
};
