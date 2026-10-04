# Graphics Overfit — Brand Story

HTML, CSS, 브라우저 JavaScript로 만든 브랜드 소개 사이트입니다. 별도 빌드나 패키지 설치가 필요하지 않습니다.

## 실행과 검사

```sh
python3 -m http.server 8080 --bind 127.0.0.1
node --check entry.js
node --check app.js
node --check world.js
```

브라우저에서 http://127.0.0.1:8080 을 엽니다.

## 파일 구성

- `index.html`: 브랜드 공간, 스토리, 제품, 아트 아카이브, 룩북, 스토어 연결
- `styles.css`: 반응형 레이아웃과 모션
- `entry.js`: 초기 스크롤 복원, 공통 모션 설정
- `world.js`: CSS 3D 작품 선택과 진입 연출
- `app.js`: 제품 앞뒤·확대, 작품 모달, 모바일 메뉴, 룩북 탐색
- `assets/`: 웹용 이미지와 480/960px 반응형 사본
- `DEVLOG.md`: 이미지 출처, 작업 이력과 디자인 결정

## 현재 동작

- 첫 화면에서 ‘컬렉션 보기’로 제품 영역에 바로 이동할 수 있습니다. 새로고침하면 첫 화면으로 돌아갑니다.
- WEAR YOUR GRAPHICS의 스크롤 타이포와 사진 콜라주 사이에 대각선 라임색 문구 띠를 배치합니다.
- 히어로의 투명 인물 뒤 레인보우 배경은 4초에 한 바퀴 회전합니다. 하단 인물 카드의 파스텔 그라데이션은 정적입니다.
- 룩북은 화면 높이 620px 이상이면 모바일·터치 기기를 포함해 세로 스크롤과 연동됩니다. 짧은 화면·모션 감소 환경에서는 가로 탐색을 사용합니다. 번호 버튼과 방향키로도 이동합니다(좌우 화살표 버튼은 없음).
- 아트 아카이브(Collection Surfer)는 너비 901px 이상에서 높이 680px 이상, 900px 이하에서 높이 600px 이상이면 스크롤로 카드를 한 장씩 넘깁니다. 그 외에는 격자로 표시합니다.
- 제목 효과: STEP INSIDE YOUR WORLD는 마우스 호버 또는 터치로 Letter Cascade, WEAR YOUR GRAPHICS는 마우스·터치 지점에서 글자가 밀려납니다. ‘생각은 자유롭게…’ 세 문장과 ‘그림이 되고…’ 제목은 스크롤로 화면에 들어오면 자동 재생합니다.
- 모바일(600px 이하)에서는 컬러칩이 히어로 사진 위 오른쪽에 놓입니다. 하단 MAKE IT 옆 CLICK ME 말풍선은 스토어 링크의 일부입니다.
- ‘모션 끄기’ 설정은 브라우저에 저장합니다. 운영체제의 모션 감소 설정을 우선합니다.
- 작품 확대는 Escape로 닫습니다. 제품은 GOLDEN YOUTH·ESSENTIAL LOGO·SPIRIT·PURE YOUTH 4종을 선택하고 BACK/FRONT 및 디테일 보기로 탐색합니다.

## 이미지와 검수

브랜드 제공 원본을 보존하고 WebP 사본을 사용합니다. 투명 인물은 `d.__.j2/무배경 작업2.png`와 `d.__.j2/d.__.j2_1.png`에서 변환했습니다. 추가 출처는 개발일지에 기록합니다.

변경 후 JavaScript 문법, 로컬 이미지·앵커·중복 ID와 Chrome 데스크톱/390px 모바일 레이아웃을 확인합니다. 실제 iOS Safari와 터치 기기는 별도 검수가 필요합니다.

## 배포

`index.html`, `styles.css`, `entry.js`, `app.js`, `world.js`, `assets/`를 함께 정적 호스팅에 올립니다. 공개 주소: https://graphicsoverfit.com/

저장소: https://github.com/jmwfdisk/graphicsoverfit-interactive

`main` 브랜치에 push하면 `.github/workflows/pages.yml`이 스크립트 문법 검사 후 사이트 파일만 GitHub Pages에 배포합니다. OG 주소도 공개 주소로 설정했습니다. 도메인 `graphicsoverfit.com`은 가비아 DNS에서 GitHub Pages로 연결하며, 저장소 Pages 설정의 Custom domain으로 지정합니다(`CNAME` 파일 불필요).
