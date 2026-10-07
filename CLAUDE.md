# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

기본 규칙·검수 항목은 AGENTS.md를 따른다: @AGENTS.md

## 명령

```sh
python3 -m http.server 8080 --bind 127.0.0.1   # http://127.0.0.1:8080
node --check entry.js && node --check app.js && node --check world.js
```

빌드·패키지·자동 테스트 없음. 문법 검사가 유일한 자동 검사이며 CI(`.github/workflows/pages.yml`)도 같은 검사만 한다. 8080 포트에 다른 프로젝트 서버가 떠 있을 수 있으니 `curl -s http://127.0.0.1:8080/ | grep title`로 이 사이트인지 확인하고, 아니면 다른 포트를 쓴다. 화면 검수는 헤드리스 Chrome(puppeteer-core, 임시 폴더에 설치)으로 1440×900과 390×844 터치 에뮬레이션을 캡처해 왔다. 테스트 스크립트는 저장소에 두지 않는다.

## 배포

저장소 `jmwfdisk/graphicsoverfit-interactive`의 `main`에 push하면 GitHub Pages로 자동 배포된다 (https://graphicsoverfit.com/). 워크플로가 `index.html`, `styles.css`, JS 3개, `assets/`만 `_site/`로 복사하므로 **새 최상위 파일을 추가하면 워크플로의 `cp` 목록도 수정**해야 한다. `assets/`는 통째로 배포되므로 원본 PNG 등은 `assets/`에 커밋하지 않는다(현재 미추적 `assets/click me.png`는 의도적으로 올리지 않은 원본). 커스텀 도메인은 Pages 설정에서 지정하며 `CNAME` 파일은 만들지 않는다. OG 메타 태그는 공개 주소를 절대 경로로 쓴다.

## 아키텍처 핵심

- **스크립트 로드 순서**: `entry.js`는 `<head>`에서 동기 로드(레이아웃 전에 스크롤 복원 차단), `app.js`·`world.js`는 `defer`. 각 파일은 IIFE 단위로 기능을 나누며 프레임워크·모듈 없음. `app.js` 상단 변수 `reduceMotion`이 `window.siteMotion`을 가리킨다.
- **`window.siteMotion`** (`entry.js`): 모션 감소의 단일 출처. OS `prefers-reduced-motion` + 페이지의 "모션 끄기" 토글(localStorage `gof-motion-paused`)을 합친 `matches`와 `change` 이벤트를 제공한다. 새 애니메이션은 `matchMedia`를 직접 쓰지 말고 이것을 구독하고, `change` 시 상태를 리셋해야 한다. `<html>`에 `motion-paused` 클래스, `<body>`에 `motion` 클래스가 토글된다.
- **새로고침 vs 앵커 이동**: `entry.js`가 reload일 때 해시를 지우고 맨 위로 보낸다. `world.js`의 회오리 진입 애니메이션도 reload에서는 재생하지 않는다. 메뉴/링크의 구역 이동은 유지되어야 한다.
- **JS가 DOM을 재구성함**: `app.js`가 런타임에 래퍼를 만들고 섹션 `id`를 래퍼로 옮긴다 — `.people` → `.people-track`(룩북), `.archive` → `.archive-track`(Collection Surfer). 앵커(`#people`, `#art`)는 실제로 이 래퍼를 가리킨다. 색상 팔레트, 룩북 번호 버튼(`.shot-nav`), 상태 표시 등도 JS가 생성한다. HTML만 보고 구조를 판단하지 말 것.
- **제목 텍스트 효과도 DOM을 글자 단위로 쪼갬**: `#hero-title`(Text Repel, 커서·터치 밀어내기), `.manifesto`(스프링 Cascade, 스크롤 진입 시 세 문장 순차 재생), `.closing-link`(클릭 Cascade, `.closing-arrow`·`.click-me` 자식을 꺼내 다시 붙임), `.product-copy h2`(Flip Text)는 `app.js`의 IIFE가, `.world-heading` 제목(Letter Cascade)은 `world.js`가 텍스트 노드를 `<span>` 글자로 바꾸고 원문을 `aria-label`로 옮긴다. 이 제목들의 문구는 HTML에서 바꿔도 되지만 안쪽 마크업 구조(줄 `<span>`, `<i>`, `<em>`, 자식 요소)를 바꾸면 해당 IIFE도 같이 고쳐야 한다.
- **스크롤 연동 섹션 패턴**: 세로 스크롤 거리를 sticky 스테이지의 진행도로 바꾸는 방식(첫 화면 3D 갤러리, 히어로 takeover, 룩북, 아카이브). 공통적으로 `requestAnimationFrame` 1회 예약 + CSS 변수(`--world-progress`, `--gallery-progress`, `--product-scale` 등)로 스타일에 전달한다. 스크롤 진입형 효과는 `IntersectionObserver`로 켜고, 화면을 벗어나면 리셋해 재진입 시 다시 재생한다.
- **스크롤 연동 켜짐 조건**: 포인터 종류와 무관하게 모바일·터치에서도 켜진다. 룩북은 높이 620px 이상 + 모션 허용, 아카이브는 너비와 무관하게 높이 600px 이상(2026-10-07 전까지는 901px 이상에서 680px이었고, 아이패드 가로 모드가 그리드로 떨어졌음. 좁은 화면용 배치는 `styles.css` 끝의 `max-width:900px` 블록). 그 외에는 가로 스와이프/격자로 폴백. 높이는 `innerHeight`가 아니라 `app.js`의 `stableHeight()`(100svh)로 잰다 — 모바일 주소창이 접힐 때 구간 길이가 튀지 않게 하기 위함. 아카이브 카드 기울임과 히어로 사진 따라오기는 아직 마우스 전용.
- **데이터가 HTML과 JS에 나뉨**: 첫 화면 작품 제목·설명은 `world.js`의 `works` 배열, 제품 이름·설명·이미지 파일명 접두어(`prefix` → `assets/<prefix>-front|back.webp`)는 `app.js`의 `products` 객체, 아트 모달 내용은 HTML `data-image`/`data-title`/`data-description`, 룩북 이름은 HTML 캡션에서 읽는다. 항목을 추가·삭제할 때 양쪽 개수와 순서를 맞춘다. 첫 화면 3D 갤러리(4점)와 아트 아카이브 카드는 서로 다른 목록이며 일치시키지 않았다.

## 수정 시 유의

- `index.html`의 CSS/JS 링크에 캐시 무효화용 `?v=날짜-설명` 쿼리가 붙어 있다. 해당 파일을 수정하면 값을 갱신한다.
- 이미지: 원본은 보존하고 WebP 사본을 `assets/`에 추가한다. 큰 이미지는 `-480w`/`-960w` 등 반응형 사본을 `srcset`으로 쓴다. 출처는 `DEVLOG.md`에 기록.
- 기존 JS/CSS는 한 줄에 여러 문장을 붙인 압축된 스타일이다. 주변 형식을 따르고 전체 재정렬은 하지 않는다.
- 작업 결과·디자인 결정은 `DEVLOG.md`에 날짜 섹션으로 추가한다. 「세션 정리와 재개 지점」 섹션에 미해결 항목과 코드 위치 표가 있으니 이어서 작업할 때 먼저 본다. DEVLOG의 과거 기록은 현재 코드와 다를 수 있으니 코드를 우선한다.
