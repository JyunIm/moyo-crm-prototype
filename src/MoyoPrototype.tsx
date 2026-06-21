import { useState, useEffect, useRef } from "react";
import {
  ChevronLeft, ChevronRight, Bell, MessageSquareText, Share2, Sparkles,
  TriangleAlert, ArrowDown, Wallet, Calculator, Check, RefreshCw,
  Wifi, BatteryFull, SignalHigh, ChevronDown, Gift, Crown, ShieldCheck,
} from "lucide-react";

/* ============================== 디자인 토큰 ============================== */
const T = {
  violet: "#516AEC",
  violetDeep: "#2F41B5",
  violetSoft: "#ECF0FE",
  violetLine: "#D2DBFA",
  kakao: "#FEE500",
  kakaoInk: "#1A1700",
  ink: "#17151F",
  inkSoft: "#6A6580",
  inkFaint: "#9A95AE",
  paper: "#F3F1FA",
  card: "#FFFFFF",
  red: "#FB3B53",
  redSoft: "#FFE7EB",
  save: "#0FB67E",
  saveSoft: "#E0F7EF",
  line: "#ECE9F4",
};
const FONT =
  "'Pretendard','Pretendard Variable',-apple-system,BlinkMacSystemFont,'Apple SD Gothic Neo','Malgun Gothic',sans-serif";

/* ============================== 유틸 ============================== */
const won = (n) => n.toLocaleString("ko-KR") + "원";

function useCountUp(target, run, dur = 900) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!run) { setV(0); return; }
    let raf, start;
    const tick = (t) => {
      if (!start) start = t;
      const p = Math.min((t - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, run, dur]);
  return v;
}

/* ============================== 데이터 ============================== */
const STRATS = {
  1: {
    label: "전략 1",
    title: "요금제 혜택 종료 리마인드",
    tag: "Retention & Lock-in",
    goal: "이탈 방어 · 모요 내 N차 환승으로 수수료 반복 창출",
    target: "모요로 개통한 유저 중 프로모션 종료가 임박한 유저",
    steps: ["알림톡 수신", "랜딩 페이지", "환승 완료"],
  },
  2: {
    label: "전략 2",
    title: "‘통신비 누수’ 진단 캠페인",
    tag: "Win-back & Acquisition",
    goal: "손실 회피 편향 자극으로 심리 장벽↓ · 첫 개통 전환 극대화",
    target: "개통 이력 없는 유저 · 2개월+ 휴면 유저",
    steps: ["진단 푸시", "누수 계산기", "결과 · 개통"],
  },
};

const ANNOT = {
  "1-0": {
    head: "발송 시점 D-10 · 알림톡",
    why: "고객은 프로모션 종료일을 정확히 기억하지 못한다. 정상가 청구 ‘이전’에 선제적으로 알려, 타 플랫폼을 검색하기 전에 모요가 먼저 선점한다.",
    metric: "오픈율 · CTA 버튼별 클릭률(CTR)",
    next: "A/B 테스트: D-10 발송군 vs 첫 정상가 청구 시점 발송군의 전환율·VOC 비교",
  },
  "1-1": {
    head: "단일 랜딩 + 스크롤 앵커",
    why: "두 버튼 모두 같은 페이지로 보내 트래픽을 분산하지 않는다. 상단엔 ‘오를 요금’을 보여 위기감을 만들고, 하단엔 즉시 가입 가능한 대안을 큐레이션해 탐색 마찰을 0에 가깝게 줄인다.",
    metric: "랜딩 진입 후 대안 요금제 가입 전환율(CVR)",
    next: "B2B 밸런싱: 기존 통신사 ‘방어 혜택(할인 연장)’을 1순위로 노출해 생태계 안정화",
  },
  "1-2": {
    head: "모요 내 재개통 = 반복 CPA",
    why: "이탈을 막는 데 그치지 않고 모요 플랫폼 안에서 환승을 완료시킨다. 한 유저에게서 개통 수수료가 반복 발생하는 락인(Lock-in) 구조.",
    metric: "이탈 방어율 · 재개통 리텐션",
    next: "환승 주기를 학습해 다음 프로모션 종료 시점 자동 리마인드",
  },
  "2-0": {
    head: "손실 회피 편향 자극",
    why: "휴면·미개통 유저는 ‘알뜰폰이 싸다’는 메시지에 더는 반응하지 않는다. ‘버린 데이터를 돈으로 환산하면 얼마’라며 손실을 수치화하면 즉각적 행동으로 이어진다.",
    metric: "오픈율 · 계산기 진입률",
    next: "휴면 기간/과거 사용량별로 카피 개인화",
  },
  "2-1": {
    head: "인터랙티브 진단 퍼널",
    why: "슬라이더로 직관적으로 입력시켜 이탈을 줄인다. 유저가 입력한 ‘현재 요금·데이터 사용량’은 향후 정교한 타겟팅을 위한 First-party Data가 된다.",
    metric: "퍼널 완료율(Step1→Step3 도달률)",
    next: "입력 요금이 높을수록(누수액↑) 전환율이 비례하는지 상관관계 검증",
  },
  "2-2": {
    head: "손실 시각화 · 위약금 허들 제거",
    why: "‘매달 OO원을 기부 중’이라는 영수증으로 손실을 직면시킨다. 가장 큰 허들인 위약금은 손익분기점 계산으로 ‘몇 개월이면 회수’임을 보여 망설임을 제거한다.",
    metric: "결과 확인 후 개통 완료 CVR",
    next: "카톡 공유로 가족 결합 바이럴 + 오가닉 유저·1st party data 확보",
  },
};

/* 전략1 대안 요금제
   ① 지금 쓰는 통신사(KT망) 그대로 갈아타는 안전한 선택
   ② 현재와 비슷한 스펙(11GB 안팎 · 통화 무제한)의 더 저렴한 요금제 */
const SAME_CARRIER = {
  kind: "same", badge: "KT망 그대로", icon: ShieldCheck,
  name: "KT망 11GB+ 그대로", carrier: "KT M모바일",
  data: "11GB+ / 통화 무제한", price: 18700, sub: "쓰던 통신망 · 번호 그대로",
};
const SIMILAR_PLANS = [
  {
    kind: "deal", badge: "모요 단독 특가", icon: Sparkles,
    name: "0원 요금제 11GB+", carrier: "U+유모바일",
    data: "11GB + 매일 2GB / 통화 무제한", price: 0, sub: "첫 7개월 0원, 이후 22,000원",
  },
  {
    kind: "pop", badge: "인기", icon: Crown,
    name: "넉넉 15GB+", carrier: "KT스카이라이프",
    data: "15GB+ / 통화 무제한", price: 16300, sub: "데이터 더 넉넉하게",
  },
  {
    kind: "save", badge: "최저가", icon: Wallet,
    name: "가성비 11GB", carrier: "LG헬로비전",
    data: "11GB / 통화 무제한", price: 9900, sub: "딱 지금만큼, 최저가",
  },
];

/* 전략2 데이터 구간별 모요 최저가 */
const TIERS = [
  { id: "lite", label: "10GB 미만", note: "웹·카톡 위주", low: 8800,
    plan: "모요 단독 7GB+", carrier: "KT M모바일" },
  { id: "mid", label: "10~50GB", note: "영상 가끔", low: 16900,
    plan: "통화 충분 15GB", carrier: "KT스카이라이프" },
  { id: "unli", label: "무제한", note: "맘껏 사용", low: 38200,
    plan: "100GB+ 평생할인", carrier: "U+유모바일" },
];

/* ============================== 작은 컴포넌트 ============================== */
function StatusBar({ dark }) {
  const c = dark ? "#fff" : T.ink;
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "10px 22px 4px", fontSize: 13, fontWeight: 700, color: c }}>
      <span>9:41</span>
      <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
        <SignalHigh size={15} /><Wifi size={15} /><BatteryFull size={17} />
      </div>
    </div>
  );
}

function Pill({ children, bg, color }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: bg,
      color, fontSize: 11, fontWeight: 800, padding: "4px 9px", borderRadius: 999,
      letterSpacing: "-0.01em" }}>{children}</span>
  );
}

/* ============================== 전략 1 화면 ============================== */
function S1_Alimtalk({ go }) {
  return (
    <div style={{ background: "#B2C7DA", minHeight: "100%", paddingBottom: 24 }}>
      {/* 카톡 헤더 */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px 12px" }}>
        <ChevronLeft size={20} color={T.kakaoInk} />
        <span style={{ fontWeight: 800, color: T.kakaoInk, fontSize: 15 }}>모요(모두의요금제)</span>
      </div>
      <div style={{ padding: "4px 16px" }}>
        <div style={{ fontSize: 11, color: "#5b6b7a", textAlign: "center", marginBottom: 12 }}>
          오늘 · 알림톡 도착
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
          {/* 채널 프로필 (모요) */}
          <div style={{ width: 36, height: 36, borderRadius: 999, background: T.violet,
            display: "grid", placeItems: "center", flexShrink: 0, fontWeight: 900,
            color: "#fff", fontSize: 12 }}>모요</div>
          <div style={{ flex: 1 }}>
            {/* 채널명 */}
            <div style={{ fontSize: 12, fontWeight: 800, color: "#3a3340",
              marginBottom: 5, marginLeft: 2 }}>모요(모두의요금제)</div>
            {/* 알림톡 카드 */}
            <div style={{ background: "#fff", borderRadius: "4px 16px 16px 16px",
              overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,.08)" }}>
              {/* 노란 헤더 */}
              <div style={{ background: T.kakao, padding: "9px 14px", display: "flex",
                alignItems: "center", gap: 6 }}>
                <Bell size={13} color={T.kakaoInk} />
                <span style={{ fontSize: 12, fontWeight: 800, color: T.kakaoInk }}>알림톡 도착</span>
                <span style={{ marginLeft: "auto", fontSize: 10, fontWeight: 800,
                  color: T.red, background: "#fff", padding: "2px 7px", borderRadius: 999 }}>D-10</span>
              </div>
              {/* 헤딩 밴드 + 벨 */}
              <div style={{ background: "#F4F5F7", padding: "16px 15px", display: "flex",
                alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: T.ink, lineHeight: 1.4,
                  letterSpacing: "-0.02em" }}>
                  곧 통신비 할인이<br />종료됩니다
                </div>
                <span style={{ fontSize: 32, flexShrink: 0 }}>🔔</span>
              </div>
              {/* 본문 */}
              <div style={{ padding: "16px 15px 6px" }}>
                <p style={{ fontSize: 13.5, color: T.inkSoft, lineHeight: 1.7 }}>
                  고객님, 곧 통신비 할인이 종료되어 다음 달부터 요금이 인상되니 미리 확인하세요.
                </p>
              </div>
              {/* 버튼 */}
              <div style={{ padding: "8px 12px 14px", display: "grid", gap: 8 }}>
                <button onClick={() => go(1, "mine")} style={btnGhost}>신청한 요금제 확인</button>
                <button onClick={() => go(1, "other")} style={btnGhost}>다른 요금제 확인</button>
              </div>
            </div>
            <div style={{ fontSize: 10, color: "#5b6b7a", marginTop: 4, marginLeft: 4 }}>오전 9:41</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function S1_Landing({ entry, go }) {
  const scroller = useRef(null);
  const altRef = useRef(null);
  const current = 19000, normal = 39000, diff = normal - current;
  const bump = useCountUp(diff, true);

  useEffect(() => {
    if (entry === "other" && altRef.current && scroller.current) {
      const t = setTimeout(() => {
        altRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 550);
      return () => clearTimeout(t);
    } else if (scroller.current) {
      scroller.current.scrollTo({ top: 0 });
    }
  }, [entry]);

  return (
    <div ref={scroller} style={{ background: T.paper, height: "100%", overflowY: "auto" }}>
      {/* 헤더 */}
      <div style={{ background: "#fff", padding: "12px 18px", display: "flex",
        alignItems: "center", gap: 8, position: "sticky", top: 0, zIndex: 5,
        borderBottom: `1px solid ${T.line}` }}>
        <ChevronLeft size={20} color={T.ink} />
        <span style={{ fontWeight: 800, color: T.ink, fontSize: 15 }}>내 요금제 관리</span>
      </div>

      {/* 상단: 현재 요금제 + 인상 경고 */}
      <div style={{ padding: "16px 16px 6px" }}>
        <Pill bg={T.redSoft} color={T.red}><TriangleAlert size={12} /> 10일 뒤 요금 인상</Pill>
        <div style={{ background: "#fff", borderRadius: 18, padding: 18, marginTop: 10,
          border: `1px solid ${T.line}`, boxShadow: "0 6px 18px rgba(110,46,244,.06)" }}>
          <div style={{ fontSize: 12, color: T.inkSoft, fontWeight: 700 }}>현재 이용 중</div>
          <div style={{ fontSize: 17, fontWeight: 800, color: T.ink, marginTop: 3 }}>
            데이터 11GB+ / 통화 무제한
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 10, marginTop: 16 }}>
            <div>
              <div style={{ fontSize: 11, color: T.inkFaint }}>프로모션가</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: T.inkSoft,
                textDecoration: "line-through" }}>{won(current)}</div>
            </div>
            <ChevronRight size={18} color={T.inkFaint} style={{ marginBottom: 3 }} />
            <div>
              <div style={{ fontSize: 11, color: T.red, fontWeight: 700 }}>다음 달 정상가</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: T.red, letterSpacing: "-0.02em" }}>
                {won(normal)}
              </div>
            </div>
          </div>
          <div style={{ marginTop: 14, background: T.redSoft, borderRadius: 12,
            padding: "11px 14px", display: "flex", alignItems: "center", gap: 8 }}>
            <TriangleAlert size={16} color={T.red} />
            <span style={{ fontSize: 13, color: T.red, fontWeight: 800 }}>
              매달 +{won(bump)} 더 내게 돼요
            </span>
          </div>
        </div>
      </div>

      {/* 스크롤 유도 */}
      <div style={{ textAlign: "center", padding: "10px 0 2px", color: T.violet,
        fontSize: 12, fontWeight: 800, display: "flex", alignItems: "center",
        justifyContent: "center", gap: 5 }}>
        <ArrowDown size={13} /> 인상 전, 비슷한 요금제로 갈아타기
      </div>

      {/* 하단: 대안 요금제 리스트 */}
      <div ref={altRef} style={{ padding: "8px 16px 20px", scrollMarginTop: 52 }}>
        <div style={{ fontSize: 15, fontWeight: 900, color: T.ink, margin: "8px 2px 12px" }}>
          지금 바로 갈아탈 수 있어요
        </div>

        {/* ① 같은 통신사 그대로 */}
        <SubLabel>현재 통신사(KT망) 그대로</SubLabel>
        <div style={{ display: "grid", gap: 11 }}>
          <PlanCard p={SAME_CARRIER} onClick={() => go(2)} />
        </div>

        {/* ② 비슷한 스펙, 더 저렴하게 */}
        <SubLabel style={{ marginTop: 18 }}>비슷한 요금제, 더 저렴하게</SubLabel>
        <div style={{ display: "grid", gap: 11 }}>
          {SIMILAR_PLANS.map((p, i) => (
            <PlanCard key={i} p={p} onClick={() => go(2)} />
          ))}
        </div>

        <div style={{ fontSize: 11, color: T.inkFaint, textAlign: "center", marginTop: 14, lineHeight: 1.6 }}>
          모든 버튼은 같은 페이지로 연결돼요.<br />
          ‘다른 요금제 확인’으로 들어오면 이 목록으로 자동 이동됩니다.
        </div>
      </div>
    </div>
  );
}

function S1_Done() {
  const saved = useCountUp(39000 - 16300, true);
  return (
    <div style={{ background: `linear-gradient(180deg,${T.violet},${T.violetDeep})`,
      height: "100%", display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: 26, textAlign: "center", color: "#fff" }}>
      <div style={{ width: 76, height: 76, borderRadius: 28, background: "rgba(255,255,255,.16)",
        display: "grid", placeItems: "center", animation: "pop .5s ease" }}>
        <div style={{ width: 54, height: 54, borderRadius: 20, background: "#fff",
          display: "grid", placeItems: "center" }}>
          <Check size={30} color={T.violet} strokeWidth={3} />
        </div>
      </div>
      <div style={{ fontSize: 22, fontWeight: 900, marginTop: 22, letterSpacing: "-0.02em" }}>
        모요에서 바로<br />환승 완료! 🎉
      </div>
      <p style={{ fontSize: 13.5, color: "rgba(255,255,255,.85)", lineHeight: 1.6, marginTop: 12 }}>
        타 플랫폼 검색 없이 모요 안에서<br />더 저렴한 요금제로 갈아탔어요.
      </p>
      <div style={{ background: "rgba(255,255,255,.14)", borderRadius: 16, padding: "16px 20px",
        marginTop: 22, width: "100%" }}>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,.8)" }}>인상가 대비 매달 절약</div>
        <div style={{ fontSize: 30, fontWeight: 900, marginTop: 4 }}>{won(saved)}</div>
      </div>
      <div style={{ marginTop: 18, fontSize: 12, color: "rgba(255,255,255,.78)",
        display: "flex", alignItems: "center", gap: 6 }}>
        <RefreshCw size={13} /> 다음 혜택 종료 때 또 알려드릴게요 (N차 환승)
      </div>
    </div>
  );
}

/* ============================== 전략 2 화면 ============================== */
function S2_Push({ go }) {
  return (
    <div style={{ background: `linear-gradient(180deg,#2A1066,#120A2E)`, height: "100%",
      position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, opacity: .4,
        background: "radial-gradient(420px 220px at 70% 8%, rgba(110,46,244,.55), transparent)" }} />
      <div style={{ position: "relative", paddingTop: 40, textAlign: "center", color: "#fff" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,.7)" }}>잠금화면</div>
        <div style={{ fontSize: 54, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1 }}>9:41</div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,.7)", marginTop: 4 }}>6월 18일 목요일</div>
      </div>
      {/* 푸시 배너 */}
      <div style={{ position: "relative", margin: "30px 14px 0", animation: "slideDown .5s ease" }}>
        <div style={{ background: "rgba(255,255,255,.92)", backdropFilter: "blur(8px)",
          borderRadius: 20, padding: 15, boxShadow: "0 12px 30px rgba(0,0,0,.3)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 9 }}>
            <div style={{ width: 22, height: 22, borderRadius: 7, background: T.violet,
              display: "grid", placeItems: "center", color: "#fff", fontWeight: 900, fontSize: 9 }}>모요</div>
            <span style={{ fontSize: 12, fontWeight: 800, color: T.ink }}>모요 · 지금</span>
          </div>
          <div style={{ fontSize: 14.5, fontWeight: 800, color: T.ink, lineHeight: 1.45 }}>
            매달 쓰지도 않고 버려지는 내 데이터 💸
          </div>
          <p style={{ fontSize: 12.5, color: T.inkSoft, lineHeight: 1.55, marginTop: 5 }}>
            돈으로 환산하면 얼마일까? 1분 만에 내 통신비 누수액을 진단해 보세요.
          </p>
          <button onClick={() => go(1)} style={{ ...btnSolid, marginTop: 12 }}>
            내 통신비 누수액 진단하기
          </button>
        </div>
      </div>
    </div>
  );
}

function S2_Calc({ go, fee, setFee, tier, setTier }) {
  const sel = TIERS.find((t) => t.id === tier);
  return (
    <div style={{ background: T.paper, height: "100%", overflowY: "auto" }}>
      <StatusBarSpacer />
      <div style={{ padding: "8px 20px 24px" }}>
        <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
          {[0, 1].map((i) => (
            <div key={i} style={{ height: 4, flex: 1, borderRadius: 9,
              background: T.violet, opacity: 1 }} />
          ))}
          <div style={{ height: 4, flex: 1, borderRadius: 9, background: T.violetLine }} />
        </div>

        {/* Step 1 */}
        <div style={{ fontSize: 12, fontWeight: 800, color: T.violet }}>STEP 1</div>
        <div style={{ fontSize: 18, fontWeight: 900, color: T.ink, marginTop: 4, lineHeight: 1.4 }}>
          현재 한 달에<br />통신비를 얼마 내시나요?
        </div>
        <div style={{ background: "#fff", borderRadius: 18, padding: "22px 18px 18px",
          marginTop: 14, border: `1px solid ${T.line}` }}>
          <div style={{ textAlign: "center", fontSize: 30, fontWeight: 900, color: T.violet }}>
            {won(fee)}
          </div>
          <input type="range" min={30000} max={150000} step={1000} value={fee}
            onChange={(e) => setFee(+e.target.value)}
            style={{ width: "100%", marginTop: 16, accentColor: T.violet, height: 6 }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11,
            color: T.inkFaint, marginTop: 6 }}>
            <span>3만원</span><span>15만원</span>
          </div>
        </div>

        {/* Step 2 */}
        <div style={{ fontSize: 12, fontWeight: 800, color: T.violet, marginTop: 26 }}>STEP 2</div>
        <div style={{ fontSize: 18, fontWeight: 900, color: T.ink, marginTop: 4, lineHeight: 1.4 }}>
          실제로 한 달에<br />데이터를 얼마나 쓰시나요?
        </div>
        <div style={{ display: "grid", gap: 9, marginTop: 14 }}>
          {TIERS.map((t) => {
            const on = t.id === tier;
            return (
              <button key={t.id} onClick={() => setTier(t.id)} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                background: on ? T.violetSoft : "#fff",
                border: `1.5px solid ${on ? T.violet : T.line}`,
                borderRadius: 14, padding: "14px 16px", cursor: "pointer", width: "100%",
                textAlign: "left" }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800,
                    color: on ? T.violetDeep : T.ink }}>{t.label}</div>
                  <div style={{ fontSize: 11.5, color: T.inkSoft, marginTop: 1 }}>{t.note}</div>
                </div>
                <div style={{ width: 22, height: 22, borderRadius: 999,
                  border: `2px solid ${on ? T.violet : T.violetLine}`,
                  display: "grid", placeItems: "center",
                  background: on ? T.violet : "transparent" }}>
                  {on && <Check size={13} color="#fff" strokeWidth={3} />}
                </div>
              </button>
            );
          })}
        </div>

        <button onClick={() => go(2)} disabled={!tier} style={{ ...btnSolid, marginTop: 22,
          opacity: tier ? 1 : 0.45, fontSize: 15, padding: "15px" }}>
          내 누수액 결과 보기
        </button>
      </div>
    </div>
  );
}

function S2_Result({ fee, tier, go }) {
  const sel = TIERS.find((t) => t.id === tier) || TIERS[1];
  const leak = Math.max(0, fee - sel.low);
  const leakNum = useCountUp(leak, true, 1100);
  const yearLeak = leak * 12;

  const [penalty, setPenalty] = useState(100000);
  const breakeven = leak > 0 ? (penalty / leak) : 0;

  return (
    <div style={{ background: T.paper, height: "100%", overflowY: "auto" }}>
      <StatusBarSpacer />
      {/* 손실 영수증 */}
      <div style={{ padding: "6px 16px 0" }}>
        <div style={{ background: `linear-gradient(180deg,${T.ink},#2A2538)`, borderRadius: 22,
          padding: "24px 20px", color: "#fff", position: "relative", overflow: "hidden" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,.7)" }}>
            고객님의 한 달 통신비 누수액
          </div>
          <div style={{ fontSize: 40, fontWeight: 900, marginTop: 6, color: "#FF8A98",
            letterSpacing: "-0.03em" }}>
            {won(leakNum)}
          </div>
          <p style={{ fontSize: 13.5, color: "rgba(255,255,255,.85)", lineHeight: 1.55, marginTop: 10 }}>
            지금 요금제는 실제 사용량보다 비싸요.<br />
            매달 약 <b style={{ color: "#fff" }}>{won(leak)}</b>을 통신사에 기부하고 계세요 😭
          </p>
          <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px dashed rgba(255,255,255,.2)",
            display: "flex", justifyContent: "space-between", fontSize: 12.5 }}>
            <span style={{ color: "rgba(255,255,255,.7)" }}>1년이면</span>
            <span style={{ fontWeight: 800, color: "#FF8A98" }}>약 {won(yearLeak)} 낭비</span>
          </div>
        </div>
      </div>

      {/* 맞춤 요금제 */}
      <div style={{ padding: "16px 16px 4px" }}>
        <div style={{ fontSize: 14, fontWeight: 900, color: T.ink, margin: "4px 2px 10px" }}>
          {sel.label} 사용량에 딱 맞는 1위 요금제
        </div>
        <div style={{ background: "#fff", borderRadius: 18, padding: 16,
          border: `1.5px solid ${T.violet}`, boxShadow: "0 8px 20px rgba(110,46,244,.12)" }}>
          <Pill bg={T.violetSoft} color={T.violet}><Crown size={12} /> 맞춤 추천 1위</Pill>
          <div style={{ fontSize: 16, fontWeight: 800, color: T.ink, marginTop: 9 }}>{sel.plan}</div>
          <div style={{ fontSize: 12, color: T.inkSoft, marginTop: 2 }}>{sel.carrier}</div>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between",
            marginTop: 12 }}>
            <span style={{ fontSize: 12, color: T.save, fontWeight: 800 }}>
              월 {won(leak)} 절약
            </span>
            <span style={{ fontSize: 22, fontWeight: 900, color: T.ink }}>{won(sel.low)}</span>
          </div>
        </div>
        <button onClick={() => go(2)} style={{ ...btnSolid, marginTop: 12, fontSize: 15, padding: "15px" }}>
          월 {won(leak)} 아끼러 가기 · 바로 개통
        </button>
      </div>

      {/* 위약금 손익분기점 */}
      <div style={{ padding: "18px 16px 4px" }}>
        <div style={{ background: T.saveSoft, borderRadius: 18, padding: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Calculator size={15} color={T.save} />
            <span style={{ fontSize: 13.5, fontWeight: 900, color: "#0a7a55" }}>
              위약금 손익분기점 계산
            </span>
          </div>
          <p style={{ fontSize: 12, color: "#3c8a6e", marginTop: 6, lineHeight: 1.5 }}>
            위약금이 남아 망설여지나요? 갈아타면 매달 아끼니까 금방 회수돼요.
          </p>
          <div style={{ background: "#fff", borderRadius: 12, padding: "12px 14px", marginTop: 10 }}>
            <div style={{ fontSize: 11.5, color: T.inkSoft, fontWeight: 700 }}>남은 위약금</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: T.ink, marginTop: 2 }}>{won(penalty)}</div>
            <input type="range" min={0} max={300000} step={10000} value={penalty}
              onChange={(e) => setPenalty(+e.target.value)}
              style={{ width: "100%", marginTop: 8, accentColor: T.save, height: 6 }} />
          </div>
          <div style={{ background: "#fff", borderRadius: 12, padding: "13px 14px", marginTop: 9,
            textAlign: "center" }}>
            {leak > 0 ? (
              <span style={{ fontSize: 14, fontWeight: 800, color: "#0a7a55", lineHeight: 1.5 }}>
                약 <span style={{ color: T.save, fontSize: 18 }}>{breakeven.toFixed(1)}개월</span>이면<br />
                위약금을 모두 회수해요!
              </span>
            ) : (
              <span style={{ fontSize: 13, color: T.inkSoft }}>이미 사용량에 맞는 요금제예요 👍</span>
            )}
          </div>
        </div>
      </div>

      {/* 카톡 공유 */}
      <div style={{ padding: "14px 16px 24px" }}>
        <button style={{ width: "100%", display: "flex", alignItems: "center",
          justifyContent: "center", gap: 8, background: T.kakao, color: T.kakaoInk,
          border: "none", borderRadius: 14, padding: "14px", fontWeight: 800, fontSize: 14,
          cursor: "pointer", fontFamily: FONT }}>
          <Share2 size={16} /> 카톡으로 우리 가족 호갱 지수 공유하기
        </button>
        <div style={{ fontSize: 11, color: T.inkFaint, textAlign: "center", marginTop: 8 }}>
          “내 통신비 누수액은 월 {Math.round(leak / 1000)}천 원! 너는?”
        </div>
      </div>
    </div>
  );
}

function StatusBarSpacer() {
  return <div style={{ height: 6 }} />;
}

/* ============================== 버튼 스타일 ============================== */
const btnSolid = {
  width: "100%", background: T.violet, color: "#fff", border: "none",
  borderRadius: 12, padding: "13px", fontWeight: 800, fontSize: 14, cursor: "pointer",
  fontFamily: FONT, letterSpacing: "-0.01em",
};
const btnGhost = {
  width: "100%", background: "#fff", color: T.violet, border: `1.5px solid ${T.violetLine}`,
  borderRadius: 12, padding: "13px", fontWeight: 800, fontSize: 14, cursor: "pointer",
  fontFamily: FONT, letterSpacing: "-0.01em",
};

/* ============================== 메인 ============================== */
export default function MoyoPrototype() {
  const [strat, setStrat] = useState(1);
  const [step, setStep] = useState(0);
  const [entry, setEntry] = useState("mine");
  // 전략2 상태
  const [fee, setFee] = useState(65000);
  const [tier, setTier] = useState("mid");

  const S = STRATS[strat];
  const a = ANNOT[`${strat}-${step}`];

  const switchStrat = (n) => { setStrat(n); setStep(0); };
  const goStep = (n, e) => { if (e) setEntry(e); setStep(n); };
  const reset = () => { setStep(0); setFee(65000); setTier("mid"); setEntry("mine"); };

  const darkStatus =
    (strat === 1 && step === 2) || (strat === 2 && step === 0);

  let screen;
  if (strat === 1) {
    screen = step === 0 ? <S1_Alimtalk go={goStep} />
      : step === 1 ? <S1_Landing entry={entry} go={goStep} />
      : <S1_Done />;
  } else {
    screen = step === 0 ? <S2_Push go={goStep} />
      : step === 1 ? <S2_Calc go={goStep} fee={fee} setFee={setFee} tier={tier} setTier={setTier} />
      : <S2_Result fee={fee} tier={tier} go={goStep} />;
  }

  return (
    <div style={{ fontFamily: FONT, background: T.paper, minHeight: "100vh",
      color: T.ink, WebkitFontSmoothing: "antialiased" }}>
      <style>{`
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css');
        * { box-sizing: border-box; }
        button:focus-visible, input:focus-visible { outline: 2px solid ${T.violet}; outline-offset: 2px; }
        @keyframes pop { 0%{transform:scale(.6);opacity:0} 60%{transform:scale(1.08)} 100%{transform:scale(1);opacity:1} }
        @keyframes slideDown { from{transform:translateY(-16px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        ::-webkit-scrollbar { width: 0; height: 0; }
        @media (prefers-reduced-motion: reduce){ *{animation:none!important} }
      `}</style>

      {/* 상단 헤더 */}
      <header style={{ maxWidth: 1080, margin: "0 auto", padding: "26px 24px 6px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: T.violet, letterSpacing: "-0.04em" }}>
            모요
          </div>
          <span style={{ width: 1, height: 16, background: T.violetLine }} />
          <h1 style={{ fontSize: 16, fontWeight: 800, color: T.ink, margin: 0,
            letterSpacing: "-0.02em" }}>
            CRM &amp; 그로스 전략 · 인터랙티브 프로토타입
          </h1>
        </div>
        <p style={{ fontSize: 13, color: T.inkSoft, marginTop: 8, lineHeight: 1.55, maxWidth: 620 }}>
          기획안이 실제 화면에서 어떻게 작동하는지 플로우로 보여주는 데모예요.
          폰 안의 버튼·슬라이더를 직접 눌러보면 다음 단계로 이동합니다.
        </p>
      </header>

      {/* 전략 탭 */}
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "14px 24px 0",
        display: "flex", gap: 10, flexWrap: "wrap" }}>
        {[1, 2].map((n) => {
          const on = strat === n;
          return (
            <button key={n} onClick={() => switchStrat(n)} style={{
              flex: "1 1 240px", textAlign: "left", cursor: "pointer",
              background: on ? T.violet : "#fff", color: on ? "#fff" : T.ink,
              border: `1.5px solid ${on ? T.violet : T.line}`, borderRadius: 16,
              padding: "14px 16px", fontFamily: FONT, transition: "all .15s" }}>
              <div style={{ fontSize: 11, fontWeight: 800,
                color: on ? "rgba(255,255,255,.8)" : T.violet }}>
                {STRATS[n].label} · {STRATS[n].tag}
              </div>
              <div style={{ fontSize: 16, fontWeight: 900, marginTop: 3,
                letterSpacing: "-0.02em" }}>{STRATS[n].title}</div>
            </button>
          );
        })}
      </div>

      {/* 본문: 폰 + 주석 */}
      <main style={{ maxWidth: 1080, margin: "0 auto", padding: "22px 24px 60px",
        display: "grid", gridTemplateColumns: "minmax(0,340px) minmax(0,1fr)",
        gap: 30, alignItems: "start" }} className="moyo-grid">
        {/* 폰 */}
        <div style={{ position: "sticky", top: 18 }}>
          <div style={{ width: "100%", maxWidth: 340, margin: "0 auto",
            background: "#0E0B1A", borderRadius: 44, padding: 11,
            boxShadow: "0 30px 60px rgba(40,20,90,.25), 0 0 0 1px rgba(0,0,0,.4)" }}>
            <div style={{ position: "relative", borderRadius: 34, overflow: "hidden",
              background: "#fff", height: 620 }}>
              {/* 노치 */}
              <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
                width: 120, height: 26, background: "#0E0B1A", borderRadius: "0 0 16px 16px",
                zIndex: 30 }} />
              <StatusBar dark={darkStatus} />
              <div key={`${strat}-${step}`} style={{ height: "calc(100% - 38px)",
                animation: "fadeIn .35s ease" }}>
                {screen}
              </div>
            </div>
          </div>
          {/* 단계 네비 */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center",
            gap: 12, marginTop: 18 }}>
            <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}
              style={{ ...navBtn, opacity: step === 0 ? 0.35 : 1 }}>
              <ChevronLeft size={18} />
            </button>
            <div style={{ display: "flex", gap: 7 }}>
              {S.steps.map((_, i) => (
                <button key={i} onClick={() => setStep(i)} aria-label={`${i + 1}단계`}
                  style={{ width: i === step ? 22 : 8, height: 8, borderRadius: 99,
                    border: "none", cursor: "pointer", transition: "all .2s",
                    background: i === step ? T.violet : T.violetLine }} />
              ))}
            </div>
            <button onClick={() => setStep(Math.min(2, step + 1))} disabled={step === 2}
              style={{ ...navBtn, opacity: step === 2 ? 0.35 : 1 }}>
              <ChevronRight size={18} />
            </button>
          </div>
          {step === 2 && (
            <div style={{ textAlign: "center", marginTop: 12 }}>
              <button onClick={reset} style={{ background: "none", border: "none",
                color: T.violet, fontWeight: 800, fontSize: 13, cursor: "pointer",
                display: "inline-flex", alignItems: "center", gap: 5, fontFamily: FONT }}>
                <RefreshCw size={13} /> 처음부터 다시 보기
              </button>
            </div>
          )}
        </div>

        {/* 주석 */}
        <div style={{ animation: "fadeIn .35s ease" }} key={`a-${strat}-${step}`}>
          {/* 단계 헤더 */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: T.violet,
              background: T.violetSoft, padding: "5px 11px", borderRadius: 999 }}>
              STEP {step + 1} / 3
            </span>
            <span style={{ fontSize: 17, fontWeight: 900, color: T.ink, letterSpacing: "-0.02em" }}>
              {S.steps[step]}
            </span>
          </div>

          {/* 전략 메타 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 16 }}
            className="moyo-meta">
            <MetaCard label="🎯 타겟" value={S.target} />
            <MetaCard label="💡 목표" value={S.goal} />
          </div>

          {/* 핵심 주석 */}
          <div style={{ background: "#fff", border: `1px solid ${T.line}`, borderRadius: 18,
            padding: 20, marginTop: 14, boxShadow: "0 6px 18px rgba(110,46,244,.05)" }}>
            <div style={{ fontSize: 15, fontWeight: 900, color: T.violetDeep,
              letterSpacing: "-0.02em" }}>{a.head}</div>
            <p style={{ fontSize: 13.5, color: T.ink, lineHeight: 1.7, marginTop: 10 }}>{a.why}</p>

            <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${T.line}`,
              display: "grid", gap: 12 }}>
              <AnnotRow icon="📊" label="추적 지표 (Analysis)" text={a.metric} color={T.violet} />
            </div>
          </div>

          <div style={{ fontSize: 12, color: T.inkFaint, marginTop: 14, lineHeight: 1.6 }}>
            * 본 프로토타입은 기획안의 플로우 시연용 데모이며, 요금·수치는 예시 값입니다.
            슬라이더와 선택지를 바꾸면 결과가 실시간으로 계산됩니다.
          </div>
        </div>
      </main>

      <style>{`
        @media (max-width: 860px){
          .moyo-grid { grid-template-columns: 1fr !important; }
          .moyo-grid > div:first-child { position: static !important; }
        }
        @media (max-width: 420px){
          .moyo-meta { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

/* 전략1 대안 요금제 소제목 */
function SubLabel({ children, style }) {
  return (
    <div style={{ fontSize: 12, fontWeight: 800, color: T.inkSoft,
      margin: "0 2px 8px", ...style }}>
      {children}
    </div>
  );
}

/* 전략1 대안 요금제 카드 */
function PlanCard({ p, onClick }) {
  const Icon = p.icon;
  const ACCENT = {
    same: [T.inkSoft, "#EFEEF4"],
    deal: [T.violet, T.violetSoft],
    pop: ["#E8A400", "#FFF3D6"],
    save: [T.save, T.saveSoft],
  };
  const [accent, accentBg] = ACCENT[p.kind] || ACCENT.same;
  return (
    <button onClick={onClick} style={{
      textAlign: "left", background: "#fff", border: `1px solid ${T.line}`,
      borderRadius: 16, padding: 15, cursor: "pointer", width: "100%",
      boxShadow: "0 2px 8px rgba(20,18,40,.03)" }}>
      <Pill bg={accentBg} color={accent}><Icon size={12} /> {p.badge}</Pill>
      <div style={{ fontSize: 15.5, fontWeight: 800, color: T.ink, marginTop: 9 }}>{p.name}</div>
      <div style={{ fontSize: 12, color: T.inkSoft, marginTop: 2 }}>{p.carrier} · {p.data}</div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between",
        marginTop: 12 }}>
        <span style={{ fontSize: 11.5, color: T.inkFaint }}>{p.sub}</span>
        <span style={{ fontSize: 20, fontWeight: 900, color: p.price === 0 ? T.violet : T.ink }}>
          {p.price === 0 ? "0원" : won(p.price)}
        </span>
      </div>
    </button>
  );
}

function MetaCard({ label, value }) {
  return (
    <div style={{ background: "#fff", border: `1px solid ${T.line}`, borderRadius: 14,
      padding: "13px 15px" }}>
      <div style={{ fontSize: 12, fontWeight: 800, color: T.inkSoft }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 700, color: T.ink, marginTop: 5, lineHeight: 1.5 }}>
        {value}
      </div>
    </div>
  );
}

function AnnotRow({ icon, label, text, color }) {
  return (
    <div style={{ display: "flex", gap: 11 }}>
      <span style={{ fontSize: 15, flexShrink: 0 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 12, fontWeight: 800, color, letterSpacing: "-0.01em" }}>{label}</div>
        <div style={{ fontSize: 13, color: T.ink, lineHeight: 1.6, marginTop: 2 }}>{text}</div>
      </div>
    </div>
  );
}

const navBtn = {
  width: 40, height: 40, borderRadius: 999, border: `1.5px solid ${T.violetLine}`,
  background: "#fff", color: T.violet, display: "grid", placeItems: "center",
  cursor: "pointer",
};
