# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

기본 규칙·검수 항목은 AGENTS.md를 따른다: @AGENTS.md

## 명령

```sh
python3 -m http.server 8080 --bind 127.0.0.1   # http://127.0.0.1:8080
node --check entry.js && node --check app.js && node --check world.js
```

빌드·패키지·자동 테스트 없음. 문법 검사가 유일한 자동 검사이며 CI(`.github/workflows/pages.yml`)도 같은 검사만 한다.

## 배포

`main`에 push하면 GitHub Pages로 자동 배포된다 (https://graphicsoverfit.com/). 워크플로가 `index.html`, `styles.css`, JS 3개, `assets/`만 `_site/`로 복사하므로 **새 최상위 파일을 추가하면 워크플로의 `cp` 목록도 수정**해야 한다. OG 메타 태그는 공개 주소를 절대 경로로 쓴다.

## 아키텍처 핵심

- **스크립트 로드 순서**: `entry.js`는 `<head>`에서 동기 로드(레이아웃 전에 스크롤 복원 차단), `app.js`·`world.js`는 `defer`. 각 파일은 IIFE 단위로 기능을 나누며 프레임워크·모듈 없음.
- **`window.siteMotion`** (`entry.js`): 모션 감소의 단일 출처. OS `prefers-reduced-motion` + 페이지의 "모션 끄기" 토글(localStorage `gof-motion-paused`)을 합친 `matches`와 `change` 이벤트를 제공한다. 새 애니메이션은 `matchMedia`를 직접 쓰지 말고 이것을 구독하고, `change` 시 상태를 리셋해야 한다. `<html>`에 `motion-paused` 클래스, `<body>`에 `motion` 클래스가 토글된다.
- **새로고침 vs 앵커 이동**: `entry.js`가 reload일 때 해시를 지우고 맨 위로 보낸다. `world.js`의 회오리 진입 애니메이션도 reload에서는 재생하지 않는다. 메뉴/링크의 구역 이동은 유지되어야 한다.
- **JS가 DOM을 재구성함**: `app.js`가 런타임에 래퍼를 만들고 섹션 `id`를 래퍼로 옮긴다 — `.people` → `.people-track`(룩북), `.archive` → `.archive-track`(Collection Surfer). 앵커(`#people`, `#art`)는 실제로 이 래퍼를 가리킨다. 색상 팔레트, 룩북 번호 버튼(`.shot-nav`), 상태 표시 등도 JS가 생성한다. HTML만 보고 구조를 판단하지 말 것.
- **스크롤 연동 섹션 패턴**: 세로 스크롤 거리를 sticky 스테이지의 진행도로 바꾸는 방식(첫 화면 3D 갤러리, 히어로 takeover, 룩북, 아카이브). 공통적으로 `requestAnimationFrame` 1회 예약 + CSS 변수(`--world-progress`, `--gallery-progress`, `--product-scale` 등)로 스타일에 전달한다.
- **데스크톱 전용 스크롤 연동 조건**: 룩북은 `min-width: 901px` + `pointer: fine` + 높이 620px 이상 + 모션 허용, 아카이브는 `min-width: 901px` + `min-height: 680px` + `pointer: fine`. 그 외에는 가로 스와이프/수동 탐색으로 폴백.
- **데이터가 HTML과 JS에 나뉨**: 첫 화면 작품 제목·설명은 `world.js`의 `works` 배열, 제품 이름·설명·이미지 파일명 접두어(`prefix` → `assets/<prefix>-front|back.webp`)는 `app.js`의 `products` 객체, 아트 모달 내용은 HTML `data-image`/`data-title`/`data-description`, 룩북 이름은 HTML 캡션에서 읽는다. 항목을 추가·삭제할 때 양쪽 개수와 순서를 맞춘다.

## 수정 시 유의

- `index.html`의 CSS/JS 링크에 캐시 무효화용 `?v=날짜-설명` 쿼리가 붙어 있다. 해당 파일을 수정하면 값을 갱신한다.
- 이미지: 원본은 보존하고 WebP 사본을 `assets/`에 추가한다. 큰 이미지는 `-480w`/`-960w` 등 반응형 사본을 `srcset`으로 쓴다. 출처는 `DEVLOG.md`에 기록.
- 기존 JS/CSS는 한 줄에 여러 문장을 붙인 압축된 스타일이다. 주변 형식을 따르고 전체 재정렬은 하지 않는다.
- 작업 결과·디자인 결정은 `DEVLOG.md`에 날짜 섹션으로 추가한다. DEVLOG의 과거 기록은 현재 코드와 다를 수 있으니 코드를 우선한다.
