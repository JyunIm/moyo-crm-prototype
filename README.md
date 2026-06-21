# 모요 CRM 프로토타입

모요(Moyo) 제출용 포트폴리오 데모입니다. CRM 전략 기획을 인터랙티브한 모바일 목업으로 보여줍니다.

- **전략 1 — 요금제 혜택 종료 리마인드** (Retention & Lock-in)
- **전략 2 — '통신비 누수' 진단 캠페인** (Win-back & Acquisition)

각 단계별로 기획 의도(why)·측정 지표·다음 액션을 주석(annotation)으로 함께 제공합니다.

## 데모

GitHub Pages로 배포됩니다. 코드를 수정한 뒤 아래 명령으로 재배포합니다.

```bash
npm run deploy
```

`gh-pages` 브랜치에 빌드 결과물이 올라가고, 저장소 Settings → Pages 소스가 `gh-pages` 브랜치로 지정되어 서빙됩니다.

## 로컬 실행

```bash
npm install
npm run dev
```

## 빌드

```bash
npm run build
npm run preview
```

## 기술 스택

- React 18 + TypeScript
- Vite
- lucide-react (아이콘)
- Pretendard (웹폰트)
