# ✨ XQUARE Infrastructure Frontend v3

> 안녕하세요, tema-xquare입니다 :)  
> XQUARE Infrastructure는 대덕소프트웨어마이스터고등학교만을 위한 통합 인프라 서비스로 DSM 학생이라면 누구나 쉽게 배포할 수 있도록 도와줍니다.

---

## 📚 목차
- [한눈에 보기](#-한눈에-보기)
- [기술 스택](#-기술-스택)
- [아키텍처 개요](#-아키텍처-개요)
- [시작하기](#-시작하기)
- [핵심 스크립트 모음](#-핵심-스크립트-모음)
- [환경 변수](#-환경-변수)
- [모듈 상세](#-모듈-상세)
- [개발 가이드](#-개발-가이드)
- [기여하기](#-기여하기)
- [라이선스](#-라이선스)

## 🧭 한눈에 보기

- 🧑‍💻 **역할 기반 대시보드**: 사용자 대시보드와 관리자 도구를 제공해 배포 전 과정을 한 곳에서 관리합니다.
- 🧱 **모듈형 모노레포**: 공통 UI, Hooks, API 유틸을 패키지로 분리해 재사용성과 유지보수성을 높였습니다.
- ⚡ **Turbo 파이프라인**: Turbo Repo를 이용해 다중 애플리케이션 빌드, 테스트, 린트를 병렬로 실행합니다.
- 🛡️ **일관된 품질 보장**: Husky와 lint-staged로 커밋 전 자동 포맷팅 및 린트 검사를 수행합니다.

## 🛠️ 기술 스택
- React 19 · TypeScript 5.9 · React Router DOM
- Vite 7 · Bun 1.3.2 · Turbo Repo 2.x
- Emotion · Storybook (추가 예정, 디자인 시스템 기반)
- ESLint 9 · Prettier 3 · Husky · lint-staged

## 🏗️ 아키텍처 개요

```
.
├─ applications/
│  ├─ xquare-user-application/      # 사용자 어플리케이션
│  └─ xquare-admin-application/     # 관리자 어플리케이션
└─ modules/
    ├─ xquare-hooks/                 # 비즈니스 로직 React Hooks
    ├─ xquare-user-interfaces/       # 공통 UI 컴포넌트
    ├─ xquare-utils/                 # API 클라이언트 및 도메인 유틸
    └─ xquare-eslint-configs/        # ESLint 프리셋
```

- **런타임**: 각 애플리케이션은 Vite 기반 SPA로 빌드되어 별도 환경에서 호스팅됩니다.
- **공통 코드 공유**: [applications/xquare-user-application/vite.config.ts](applications/xquare-user-application/vite.config.ts#L1-L28)에서 모듈 경로를 alias로 매핑합니다.
- **데이터 흐름**: Utils 모듈이 REST API 호출을 담당하고, Hooks가 React 컴포넌트에 비즈니스 로직을 주입합니다. UI 모듈은 공용 디자인 토큰과 컴포넌트를 제공합니다.
- **작업 자동화**: 루트 [package.json](package.json)에서 Turbo 스크립트를 orchestrate하여 다중 앱의 작업을 한 번에 수행합니다.

## 🚀 시작하기

### ✅ 요구 사항
- Node.js 20 이상 (LTS 권장)
- Bun 1.3.2 이상
- Git

### 📥 설치

```bash
git clone https://github.com/tema-xquare/xquare-infra-frontend-v3.git
cd xquare-infra-frontend-v3
```

```bash
bun install
```

### 🧪 개발 서버
| 목적 | 명령어 |
| --- | --- |
| 전체 앱 개발 서버 실행 | `bun run dev` |
| 사용자 앱만 실행 | `bun run dev --filter=@xquare/user-application` |
| 관리자 앱만 실행 | `bun run dev --filter=@xquare/admin-application` |

각 앱의 프리뷰 설정은 [applications/xquare-user-application/package.json](applications/xquare-user-application/package.json#L8-L12)과 [applications/xquare-admin-application/package.json](applications/xquare-admin-application/package.json#L8-L12)에서 확인할 수 있습니다.

### 🏗️ 빌드 & 품질 확인
| 작업 | 명령어 |
| --- | --- |
| 전체 워크스페이스 빌드 | `bun run build` |
| 사용자 앱만 빌드 | `bun run build --filter=@xquare/user-application` |
| 관리자 앱만 빌드 | `bun run build --filter=@xquare/admin-application` |
| 린트 검사 | `bun run lint` |

> Husky와 lint-staged가 커밋 전 자동으로 포맷팅 및 린트를 실행합니다. 로컬에서 동일한 명령을 수행하면 CI와 일관된 결과를 확인할 수 있습니다.

## 🔧 핵심 스크립트 모음

| 스크립트 | 설명 |
| --- | --- |
| `bun run dev` | Turbo가 각 애플리케이션의 `dev` 명령을 병렬로 실행합니다. |
| `bun run build` | TypeScript 타입 체크 후 Vite 빌드를 실행해 정적 자산을 생성합니다. |
| `bun run lint` | 워크스페이스 전역 ESLint 규칙으로 코드 품질을 검사합니다. |
| `bun run format` | Prettier를 통해 Markdown, JSON, TypeScript 파일을 포맷팅합니다. |
| `bunx turbo run <task> --filter=<pkg>` | 특정 패키지에 대해 Turbo 작업을 수행할 수 있는 저수준 명령입니다. |

## 🌐 환경 변수

- `VITE_API_BASE_URL`: 백엔드 API 엔드포인트. 타입 정의는 [modules/xquare-utils/src/env.d.ts](modules/xquare-utils/src/env.d.ts#L3-L9)에서 확인할 수 있습니다.

Vite 규칙에 따라 `applications/<app>/.env` 또는 `.env.local` 파일에 값을 설정한 뒤 `bun run dev`를 실행하세요.

환경 설정 예시는 다음과 같습니다.

```
VITE_API_BASE_URL=https://api.example.com
```

## 📦 모듈 상세

- **[modules/xquare-hooks](modules/xquare-hooks)**:
   - 인증, 팀 관리, 배포 모니터링 등 도메인 로직을 React Hook으로 제공합니다.
   - 예시: [useLogin](modules/xquare-hooks/src/useLogin.ts#L1-L33), [useDeploymentSummary](modules/xquare-hooks/src/useDeploymentSummary.ts#L1-L40).
- **[modules/xquare-user-interfaces](modules/xquare-user-interfaces)**:
   - 버튼, 폼, 모달 등 핵심 UI 컴포넌트와 디자인 토큰을 정의합니다.
   - Emotion 기반으로 구현되어 테마 확장이 용이합니다.
- **[modules/xquare-utils](modules/xquare-utils)**:
   - fetch 래퍼, 응답 파서, 날짜 포맷터 등을 제공해 서비스 전반의 데이터 처리를 표준화합니다.
   - API 클라이언트 엔트리는 [modules/xquare-utils/index.ts](modules/xquare-utils/index.ts)에서 확인할 수 있습니다.
- **[modules/xquare-eslint-configs](modules/xquare-eslint-configs)**:
   - React, TypeScript, Emotion 등을 포괄하는 ESLint 규칙을 정의합니다. 각 앱의 전역 린트 설정은 [applications/xquare-user-application/eslint.config.js](applications/xquare-user-application/eslint.config.js)에 적용됩니다.

## 🤝 기여하기

- 버그 리포트, 기능 제안, 문서 개선을 환영합니다.
- 이슈와 PR에는 재현 방법, 변경 의도, 테스트 결과(해당하는 경우)를 포함해 주세요.
- 멀티 앱 변경 시 영향 범위를 README 또는 PR 설명에 명확히 기재해 주세요.

## 📄 라이선스

이 저장소는 [MIT License](LICENSE)를 따릅니다.
