import { Hono } from 'hono'

const app = new Hono()

const SCNU_CALENDAR_ENDPOINT = 'https://www.scnu.ac.kr/haksa/sv/schdulView/selectSvList.do'

app.get('/api/scnu/calendar', async (c) => {
  try {
    const response = await fetch(SCNU_CALENDAR_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'User-Agent': 'UniStarter/1.0 (+https://www.scnu.ac.kr)'
      },
      body: 'sysId=SCNU'
    })

    if (!response.ok) throw new Error(`SCNU upstream responded ${response.status}`)

    const source = await response.json() as Array<Record<string, unknown>>
    const events = source
      .map((item) => ({
        id: String(item.schdulSeq ?? ''),
        title: String(item.schdulTitle ?? '').trim(),
        description: String(item.schdulCn ?? '').replace(/<[^>]*>/g, '').trim(),
        start: String(item.bgnde ?? '').replaceAll('/', '-'),
        end: String(item.endde ?? item.bgnde ?? '').replaceAll('/', '-'),
        allDay: item.alldayAt === 'Y'
      }))
      .filter((item) => item.title && /^\d{4}-\d{2}-\d{2}$/.test(item.start))

    return c.json({
      source: '국립순천대학교 학사안내',
      sourceUrl: 'https://www.scnu.ac.kr/haksa/sv/schdulView/schdulCalendarView.do?mi=1416',
      syncedAt: new Date().toISOString(),
      events
    }, 200, { 'Cache-Control': 'public, max-age=1800, stale-while-revalidate=86400' })
  } catch (error) {
    console.error('SCNU calendar sync failed', error)
    return c.json({ error: '국립순천대학교 학사일정을 불러오지 못했습니다.', events: [] }, 502)
  }
})

app.get('*', (c) => c.html(`<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <meta name="theme-color" content="#f6f8fc">
  <meta name="description" content="대학 신입생을 위한 혜택, 학사 일정, 캠퍼스 생활 올인원 가이드">
  <meta name="application-name" content="UniStarter">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="default">
  <meta name="apple-mobile-web-app-title" content="UniStarter">
  <link rel="manifest" href="/manifest.webmanifest">
  <link rel="apple-touch-icon" href="/static/icon-192.png">
  <title>UniStarter — 대학생활의 좋은 시작</title>
  <script>try{if(localStorage.getItem('unistarter-theme')==='dark'||(!localStorage.getItem('unistarter-theme')&&matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.classList.add('dark')}catch(e){}</script>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>tailwind.config={darkMode:'class'}</script>
  <script src="https://unpkg.com/lucide@0.468.0/dist/umd/lucide.min.js"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600;700;800&display=swap');
    :root{--primary:#3157e5;--primary2:#6046ea;--mint:#16b886;--ink:#172033;--muted:#6c7589;--bg:#f6f8fc;--card:#fff;--line:#e8ebf2;--soft:#eef2ff;--shadow:0 12px 40px rgba(35,48,90,.08)}
    .dark{--ink:#f3f6ff;--muted:#9da8bd;--bg:#0d1321;--card:#161e2f;--line:#263148;--soft:#202b46;--shadow:0 14px 44px rgba(0,0,0,.22)}
    *{box-sizing:border-box} html{scroll-behavior:smooth} body{margin:0;background:var(--bg);color:var(--ink);font-family:Pretendard,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;transition:background .25s,color .25s;-webkit-tap-highlight-color:transparent}
    button,input,select{font:inherit} button{cursor:pointer} .app-shell{min-height:100vh}.desktop-nav{display:none}.main-wrap{width:min(100%,1180px);margin:auto;padding:0 18px 108px}.page{display:none;animation:pageIn .28s ease}.page.active{display:block}@keyframes pageIn{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:none}}
    .topbar{display:flex;align-items:center;justify-content:space-between;padding:20px 0 15px}.brand{display:flex;align-items:center;gap:10px;font-size:20px;font-weight:800;letter-spacing:-.5px}.brand-mark{width:34px;height:34px;border-radius:11px;display:grid;place-items:center;background:linear-gradient(135deg,var(--primary),var(--primary2));color:#fff;box-shadow:0 7px 18px rgba(49,87,229,.25)}
    .icon-btn{width:42px;height:42px;border:1px solid var(--line);border-radius:14px;background:var(--card);color:var(--ink);display:grid;place-items:center;transition:.2s}.icon-btn:hover{transform:translateY(-2px);box-shadow:var(--shadow)}
    .hero{position:relative;overflow:hidden;border-radius:28px;padding:27px 23px;background:linear-gradient(135deg,#294fd8,#6546e9);color:#fff;box-shadow:0 20px 50px rgba(64,70,210,.22)}.hero:before,.hero:after{content:"";position:absolute;border-radius:50%;background:rgba(255,255,255,.1)}.hero:before{width:180px;height:180px;right:-58px;top:-72px}.hero:after{width:110px;height:110px;right:64px;bottom:-75px}.eyebrow{display:flex;align-items:center;gap:7px;font-size:12px;font-weight:700;opacity:.9}.hero h1{font-size:27px;line-height:1.32;letter-spacing:-1px;margin:11px 0 8px;font-weight:800}.hero p{margin:0 0 21px;font-size:14px;color:#e6e9ff}.search-box{position:relative;z-index:1;display:flex;align-items:center;gap:10px;background:#fff;border-radius:16px;padding:0 15px;color:#25304c;box-shadow:0 10px 25px rgba(20,26,80,.16)}.search-box input{width:100%;height:52px;border:0;outline:0;background:transparent;color:#1d2740;font-size:14px}.search-key{font-size:10px;padding:3px 6px;border:1px solid #dfe3ed;border-radius:6px;color:#8c95a8}
    .section{margin-top:27px}.section-head{display:flex;align-items:end;justify-content:space-between;margin-bottom:14px}.section-title{font-size:20px;font-weight:800;letter-spacing:-.6px}.section-sub{font-size:12px;color:var(--muted);margin-top:3px}.text-btn{border:0;background:none;color:var(--primary);font-size:13px;font-weight:700;padding:6px}
    .stats{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin-top:15px}.stat{background:var(--card);border:1px solid var(--line);padding:14px 11px;border-radius:17px}.stat b{display:block;font-size:18px}.stat span{font-size:11px;color:var(--muted)}
    .category-scroll{display:flex;gap:8px;overflow:auto;padding:2px 1px 7px;scrollbar-width:none}.category-scroll::-webkit-scrollbar{display:none}.chip{white-space:nowrap;border:1px solid var(--line);background:var(--card);color:var(--muted);padding:9px 13px;border-radius:999px;font-size:12px;font-weight:700;transition:.2s}.chip.active{color:#fff;border-color:var(--primary);background:var(--primary);box-shadow:0 6px 15px rgba(49,87,229,.22)}
    .benefit-grid{display:grid;grid-template-columns:1fr;gap:11px}.benefit-card{position:relative;display:grid;grid-template-columns:52px 1fr 38px;gap:12px;align-items:center;padding:16px;background:var(--card);border:1px solid var(--line);border-radius:20px;transition:.22s}.benefit-card:hover{transform:translateY(-3px);box-shadow:var(--shadow);border-color:#cad3ff}.benefit-logo{width:52px;height:52px;border-radius:15px;display:grid;place-items:center;font-weight:800;font-size:18px}.benefit-card h3{font-size:15px;margin:0 0 5px;letter-spacing:-.2px}.benefit-card p{font-size:12px;color:var(--muted);margin:0;line-height:1.45}.badge{display:inline-flex;align-items:center;padding:4px 8px;margin-top:8px;border-radius:99px;background:#e9fbf5;color:#087d59;font-size:10px;font-weight:800}.dark .badge{background:#153c35;color:#62dcb7}.save-btn{width:38px;height:38px;border:0;border-radius:12px;background:var(--bg);color:var(--muted);display:grid;place-items:center;transition:.2s}.save-btn.saved{background:#fff0e6;color:#ef7c24}.save-btn.saved svg{fill:currentColor}.save-btn:active{transform:scale(.88)}
    .progress-card{background:var(--card);border:1px solid var(--line);border-radius:22px;padding:19px}.progress-top{display:flex;justify-content:space-between;align-items:center}.progress-ring{width:54px;height:54px;border-radius:50%;display:grid;place-items:center;background:conic-gradient(var(--mint) var(--progress),var(--line) 0);position:relative}.progress-ring:after{content:"";position:absolute;inset:6px;background:var(--card);border-radius:50%}.progress-ring b{position:relative;z-index:1;font-size:12px}.progress-track{height:7px;background:var(--line);border-radius:99px;margin-top:16px;overflow:hidden}.progress-fill{height:100%;background:linear-gradient(90deg,var(--mint),#49d8aa);border-radius:inherit;transition:width .45s cubic-bezier(.2,.9,.3,1)}
    .check-list{display:grid;gap:10px}.check-card{display:grid;grid-template-columns:42px 1fr auto;gap:12px;align-items:center;padding:15px;background:var(--card);border:1px solid var(--line);border-radius:18px;transition:.2s}.check-card.done{opacity:.68}.check-card.done h3{text-decoration:line-through}.check-icon{width:42px;height:42px;border-radius:13px;background:var(--soft);color:var(--primary);display:grid;place-items:center}.check-card h3{font-size:14px;margin:0 0 3px}.check-card p{font-size:11px;color:var(--muted);margin:0}.check-toggle{width:25px;height:25px;border:2px solid #cbd1de;border-radius:8px;background:transparent;display:grid;place-items:center;color:#fff}.check-card.done .check-toggle{border-color:var(--mint);background:var(--mint);animation:pop .3s ease}@keyframes pop{50%{transform:scale(1.22)}}
    .dday-hero{background:linear-gradient(145deg,#161f38,#293653);color:white;border-radius:25px;padding:23px;position:relative;overflow:hidden}.dday-hero:after{content:"";position:absolute;width:130px;height:130px;border:30px solid rgba(255,255,255,.05);border-radius:50%;right:-45px;top:-35px}.dday-big{font-size:35px;font-weight:800;margin:18px 0 3px;letter-spacing:-1px}.dday-list{display:grid;gap:10px;margin-top:13px}.dday-row{display:flex;align-items:center;gap:13px;padding:15px;background:var(--card);border:1px solid var(--line);border-radius:17px}.date-box{width:44px;text-align:center;color:var(--primary)}.date-box b{display:block;font-size:18px}.date-box span{font-size:10px;font-weight:700}.dday-info{flex:1}.dday-info b{font-size:14px}.dday-info p{font-size:11px;color:var(--muted);margin:3px 0 0}.d-pill{font-size:11px;font-weight:800;color:var(--primary);background:var(--soft);padding:6px 9px;border-radius:9px}
    .faq{border:1px solid var(--line);background:var(--card);border-radius:17px;overflow:hidden;margin-bottom:9px}.faq-q{width:100%;display:flex;align-items:center;gap:10px;text-align:left;border:0;background:none;color:var(--ink);padding:16px;font-weight:700;font-size:13px}.faq-q span{flex:1}.faq-a{display:none;padding:0 16px 16px 48px;color:var(--muted);font-size:12px;line-height:1.65}.faq.open .faq-a{display:block}.faq.open .chev{transform:rotate(180deg)}.chev{transition:.2s}
    .profile-card{background:linear-gradient(135deg,var(--card),var(--soft));border:1px solid var(--line);border-radius:24px;padding:20px}.profile-row{display:flex;align-items:center;gap:13px}.avatar{width:54px;height:54px;border-radius:18px;background:linear-gradient(135deg,#84a5ff,#7455ec);color:#fff;display:grid;place-items:center}.profile-row h2{font-size:17px;margin:0 0 4px}.profile-row p{font-size:12px;color:var(--muted);margin:0}.select-row{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:17px}.select-row select{width:100%;border:1px solid var(--line);background:var(--card);color:var(--ink);padding:11px;border-radius:12px;font-size:12px;outline:none}.empty{padding:42px 20px;text-align:center;color:var(--muted);background:var(--card);border:1px dashed var(--line);border-radius:20px}.empty-icon{width:52px;height:52px;margin:0 auto 12px;border-radius:16px;display:grid;place-items:center;background:var(--soft);color:var(--primary)}
    .bottom-nav{position:fixed;z-index:50;bottom:0;left:0;right:0;display:grid;grid-template-columns:repeat(4,1fr);background:color-mix(in srgb,var(--card) 92%,transparent);backdrop-filter:blur(18px);border-top:1px solid var(--line);padding:8px 8px calc(8px + env(safe-area-inset-bottom))}.nav-btn{border:0;background:none;color:var(--muted);display:flex;flex-direction:column;align-items:center;gap:3px;padding:5px;font-size:10px;font-weight:700}.nav-btn.active{color:var(--primary)}.nav-icon{position:relative}.nav-btn.active .nav-icon:after{content:"";position:absolute;width:5px;height:5px;border-radius:50%;background:var(--primary);top:-2px;right:-5px}.toast{position:fixed;z-index:100;left:50%;bottom:92px;transform:translate(-50%,25px);background:#172033;color:#fff;padding:11px 16px;border-radius:12px;font-size:12px;font-weight:700;opacity:0;pointer-events:none;transition:.25s;box-shadow:0 12px 30px rgba(0,0,0,.22)}.toast.show{opacity:1;transform:translate(-50%,0)}
    .search-results{display:none;margin-top:12px;background:var(--card);border:1px solid var(--line);border-radius:20px;padding:10px;box-shadow:var(--shadow)}.search-results.show{display:block}.result-item{display:flex;align-items:center;gap:11px;padding:11px;border-radius:12px}.result-item:hover{background:var(--bg)}.result-item b{font-size:13px}.result-item small{display:block;color:var(--muted);margin-top:2px}.result-type{font-size:9px;color:var(--primary);font-weight:800;background:var(--soft);padding:4px 6px;border-radius:6px}.highlight{outline:2px solid var(--primary);animation:flash 1.4s ease}@keyframes flash{to{outline-color:transparent}}
    .guide-tip{display:flex;gap:12px;padding:16px;border-radius:18px;background:#fff8e8;border:1px solid #f7df9a;color:#7c5c0e}.dark .guide-tip{background:#352d1b;border-color:#5b4a22;color:#f4d883}.guide-tip p{font-size:12px;line-height:1.55;margin:3px 0 0}.footer-note{text-align:center;color:var(--muted);font-size:11px;margin:28px 0 0}.sync-status{display:flex;align-items:center;gap:7px;color:var(--muted);font-size:11px}.sync-dot{width:7px;height:7px;border-radius:50%;background:var(--mint);box-shadow:0 0 0 4px color-mix(in srgb,var(--mint) 14%,transparent)}.sync-dot.loading{background:#f59e0b;animation:pulse 1s infinite}.sync-dot.error{background:#ef4444}@keyframes pulse{50%{opacity:.35}}.quick-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:9px}.quick-link{display:flex;align-items:center;gap:11px;text-decoration:none;color:var(--ink);background:var(--card);border:1px solid var(--line);padding:14px;border-radius:16px;transition:.2s}.quick-link:hover{transform:translateY(-2px);border-color:#c8d1ff;box-shadow:var(--shadow)}.quick-link i{color:var(--primary)}.quick-link b{font-size:12px}.quick-link small{display:block;color:var(--muted);font-size:10px;margin-top:2px}.settings-row{display:flex;align-items:center;gap:12px;padding:15px;background:var(--card);border:1px solid var(--line);border-radius:17px}.settings-row>div{flex:1}.settings-row b{font-size:13px}.settings-row p{font-size:11px;color:var(--muted);margin:3px 0 0}.primary-btn{border:0;border-radius:12px;background:var(--primary);color:#fff;padding:10px 13px;font-size:12px;font-weight:700;white-space:nowrap}.secondary-btn{border:1px solid var(--line);border-radius:12px;background:var(--card);color:var(--ink);padding:9px 12px;font-size:11px;font-weight:700}.install-banner{display:none;margin-top:14px;align-items:center;gap:12px;background:linear-gradient(135deg,#ecf2ff,#f2edff);color:#283769;border:1px solid #d9e0ff;border-radius:17px;padding:14px}.dark .install-banner{background:linear-gradient(135deg,#202c4a,#2a2447);color:#dfe5ff;border-color:#354364}.install-banner.show{display:flex}.install-banner>div{flex:1}.install-banner b{font-size:13px}.install-banner p{font-size:10px;margin:3px 0 0;opacity:.72}
    @media(min-width:760px){.main-wrap{padding:0 28px 70px}.benefit-grid{grid-template-columns:repeat(2,1fr)}.check-list{grid-template-columns:repeat(2,1fr)}.dday-layout{display:grid;grid-template-columns:1fr 1.5fr;gap:16px}.hero{padding:38px}.hero h1{font-size:36px}.stats{gap:13px}.stat{padding:17px}.stat b{font-size:22px}}
    @media(min-width:1050px){.app-shell{display:grid;grid-template-columns:238px 1fr}.desktop-nav{position:sticky;top:0;height:100vh;display:flex;flex-direction:column;padding:28px 18px;background:var(--card);border-right:1px solid var(--line)}.desktop-nav .brand{padding:0 10px 28px}.desktop-links{display:grid;gap:6px}.desktop-link{display:flex;align-items:center;gap:12px;border:0;background:none;color:var(--muted);padding:13px 14px;border-radius:13px;font-size:13px;font-weight:700;text-align:left}.desktop-link.active{background:var(--soft);color:var(--primary)}.desktop-profile{margin-top:auto;padding:14px;background:var(--bg);border-radius:16px;font-size:12px}.bottom-nav{display:none}.main-wrap{padding-bottom:55px}.topbar{padding-top:28px}.benefit-grid{grid-template-columns:repeat(3,1fr)}.hero-grid{display:grid;grid-template-columns:1.5fr .75fr;gap:15px}.hero-grid .stats{margin:0;grid-template-columns:1fr;gap:9px}.hero-grid .stat{display:flex;align-items:center;justify-content:space-between}.hero-grid .stat b{order:2}.toast{bottom:30px}}
  </style>
</head>
<body>
<div class="app-shell">
  <aside class="desktop-nav" aria-label="주요 메뉴">
    <div class="brand"><span class="brand-mark"><i data-lucide="sparkles" size="18"></i></span>UniStarter</div>
    <nav class="desktop-links">
      <button class="desktop-link active" data-page="home"><i data-lucide="home" size="19"></i>홈 · 혜택</button>
      <button class="desktop-link" data-page="guide"><i data-lucide="list-checks" size="19"></i>필수 가이드</button>
      <button class="desktop-link" data-page="calendar"><i data-lucide="calendar-days" size="19"></i>학사 캘린더</button>
      <button class="desktop-link" data-page="saved"><i data-lucide="bookmark" size="19"></i>저장 · 마이</button>
    </nav>
    <div class="desktop-profile"><b id="sideMajor">새내기 님</b><br><span style="color:var(--muted)">오늘도 한 걸음씩!</span></div>
  </aside>

  <main class="main-wrap">
    <header class="topbar">
      <div class="brand"><span class="brand-mark"><i data-lucide="sparkles" size="18"></i></span><span>UniStarter</span></div>
      <button id="themeToggle" class="icon-btn" aria-label="테마 전환"><i data-lucide="moon" size="19"></i></button>
    </header>

    <section id="home" class="page active">
      <div class="hero-grid">
        <article class="hero">
          <div class="eyebrow"><i data-lucide="graduation-cap" size="15"></i> 새내기의 오늘을 더 가볍게</div>
          <h1>학교생활, 헤매지 말고<br>한 번에 시작하세요.</h1>
          <p>놓치기 쉬운 혜택부터 꼭 필요한 학사 정보까지</p>
          <label class="search-box" for="globalSearch"><i data-lucide="search" size="20"></i><input id="globalSearch" placeholder="혜택, 수강신청, 장학금 검색" autocomplete="off"><span class="search-key">⌘K</span></label>
          <div id="searchResults" class="search-results" aria-live="polite"></div>
        </article>
        <div class="stats">
          <div class="stat"><b id="benefitCount">12</b><span>검증된 학생 혜택</span></div>
          <div class="stat"><b id="savedCount">0</b><span>내가 저장한 정보</span></div>
          <div class="stat"><b id="taskCount">0/7</b><span>완료한 첫 학기 준비</span></div>
        </div>
      </div>

      <section class="section" aria-labelledby="benefits-title">
        <div class="section-head"><div><h2 id="benefits-title" class="section-title">혜택 모아보기</h2><p class="section-sub">학생 인증 한 번으로 누리는 알짜 혜택</p></div><button class="text-btn" id="resetFilter">전체보기</button></div>
        <div id="categoryFilters" class="category-scroll"></div>
        <div id="benefitGrid" class="benefit-grid" style="margin-top:10px"></div>
      </section>

      <section class="section" aria-labelledby="faq-title">
        <div class="section-head"><div><h2 id="faq-title" class="section-title">새내기 빠른 답변</h2><p class="section-sub">선배들이 가장 많이 받은 질문이에요</p></div></div>
        <div id="faqList"></div>
      </section>
    </section>

    <section id="guide" class="page">
      <div class="section-head" style="margin-top:6px"><div><h1 class="section-title">첫 학기 생존 체크리스트</h1><p class="section-sub">하나씩 완료하며 캠퍼스에 적응해 보세요</p></div></div>
      <div class="progress-card">
        <div class="progress-top"><div><b style="font-size:16px">나의 준비 현황</b><p id="progressMessage" style="font-size:12px;color:var(--muted);margin:5px 0 0">첫 번째 미션을 시작해 보세요</p></div><div id="progressRing" class="progress-ring" style="--progress:0%"><b id="progressText">0%</b></div></div>
        <div class="progress-track"><div id="progressFill" class="progress-fill" style="width:0%"></div></div>
      </div>
      <div class="guide-tip section"><i data-lucide="lightbulb" size="22"></i><div><b>새내기 선배의 한마디</b><p>학교 이메일은 할인 인증과 공지 수신에 꼭 필요해요. 가장 먼저 활성화해 두면 이후 과정이 쉬워집니다.</p></div></div>
      <div id="checkList" class="check-list section"></div>
    </section>

    <section id="calendar" class="page">
      <div class="section-head" style="margin-top:6px"><div><h1 class="section-title">학사 캘린더</h1><p class="section-sub">국립순천대학교 공식 일정에서 실시간으로 불러와요</p></div><button id="calendarRefresh" class="icon-btn" aria-label="학사일정 새로고침"><i data-lucide="refresh-cw" size="17"></i></button></div>
      <div class="sync-status" style="margin:-5px 0 14px"><span id="syncDot" class="sync-dot loading"></span><span id="syncText">공식 학사일정을 연결하는 중...</span></div>
      <div class="dday-layout">
        <article class="dday-hero"><div class="eyebrow"><i data-lucide="alarm-clock" size="15"></i> 가장 가까운 일정</div><div id="nextDday" class="dday-big">D-12</div><b id="nextEvent">1학기 중간고사</b><p id="nextDate" style="font-size:12px;color:#bdc8e0;margin:7px 0 0"></p></article>
        <div id="ddayList" class="dday-list"></div>
      </div>
      <section class="section"><div class="section-head"><div><h2 class="section-title">나만의 D-Day</h2><p class="section-sub">기억하고 싶은 일정을 계산해 보세요</p></div></div>
        <form id="ddayForm" class="progress-card" style="display:grid;grid-template-columns:1fr 1fr auto;gap:9px;align-items:end">
          <label style="font-size:11px;color:var(--muted)">일정 이름<input id="customEvent" required placeholder="예: MT 신청" style="display:block;width:100%;margin-top:6px;border:1px solid var(--line);background:var(--bg);color:var(--ink);padding:11px;border-radius:11px;outline:none"></label>
          <label style="font-size:11px;color:var(--muted)">날짜<input id="customDate" required type="date" style="display:block;width:100%;margin-top:6px;border:1px solid var(--line);background:var(--bg);color:var(--ink);padding:10px;border-radius:11px;outline:none"></label>
          <button style="height:42px;border:0;border-radius:11px;background:var(--primary);color:white;padding:0 15px;font-weight:700" type="submit">계산</button>
        </form>
        <div id="customResult" style="margin-top:10px"></div>
      </section>
      <section class="section"><div class="section-head"><div><h2 class="section-title">일정 알림</h2><p class="section-sub">앱 실행 시 다가오는 학사일정을 알려드려요</p></div></div><div class="settings-row"><div><b>브라우저 일정 알림</b><p id="notificationStatus">알림을 켜면 중요한 일정을 놓치지 않아요</p></div><select id="reminderDays" aria-label="알림 시점" style="border:1px solid var(--line);background:var(--bg);color:var(--ink);padding:9px;border-radius:10px;font-size:11px"><option value="1">1일 전</option><option value="3" selected>3일 전</option><option value="7">7일 전</option></select><button id="notificationToggle" class="primary-btn">알림 켜기</button></div></section>
    </section>

    <section id="saved" class="page">
      <div class="profile-card">
        <div class="profile-row"><div class="avatar"><i data-lucide="user-round" size="25"></i></div><div><h2>반가워요, 새내기 님</h2><p id="profileSummary">학교와 전공을 설정해 맞춤 정보를 받아보세요</p></div></div>
        <div class="select-row"><select id="universitySelect" aria-label="대학교"><option value="">대학교 선택</option><optgroup label="광주광역시"><option>전남대학교</option><option>광주교육대학교</option><option>광주과학기술원(GIST)</option><option>조선대학교</option><option>광주대학교</option><option>호남대학교</option><option>광주여자대학교</option><option>남부대학교</option><option>송원대학교</option><option>광신대학교</option><option>호남신학대학교</option></optgroup><optgroup label="전라남도"><option value="순천대학교">국립순천대학교</option><option>광주가톨릭대학교</option><option>국립목포대학교</option><option>국립목포해양대학교</option><option>한국에너지공과대학교(KENTECH)</option><option>동신대학교</option><option>초당대학교</option><option>세한대학교</option><option>영산선학대학교</option></optgroup><optgroup label="광주·전남 전문대학"><option>전남도립대학교</option><option>광주보건대학교</option><option>기독간호대학교</option><option>동강대학교</option><option>서영대학교</option><option>조선간호대학교</option><option>조선이공대학교</option><option>순천제일대학교</option><option>청암대학교</option><option>목포과학대학교</option><option>전남과학대학교</option><option>동아보건대학교</option><option>한영대학교</option></optgroup></select><select id="majorSelect" aria-label="전공"><option value="">전공 선택</option></select></div>
        <div id="installBanner" class="install-banner"><i data-lucide="download" size="21"></i><div><b>UniStarter 앱 설치</b><p>홈 화면에서 더 빠르고 안정적으로 이용하세요</p></div><button id="installButton" class="primary-btn">설치</button></div>
      </div>
      <section class="section"><div class="section-head"><div><h2 class="section-title">국립순천대학교 바로가기</h2><p class="section-sub">공식 서비스로 안전하게 이동해요</p></div></div><div class="quick-grid"><a class="quick-link" href="https://portal.scnu.ac.kr/" target="_blank" rel="noopener"><i data-lucide="layout-dashboard" size="20"></i><span><b>향림통 포털</b><small>통합 학생 서비스</small></span></a><a class="quick-link" href="https://ecampus.scnu.ac.kr/" target="_blank" rel="noopener"><i data-lucide="monitor-play" size="20"></i><span><b>e-캠퍼스</b><small>온라인 강의</small></span></a><a class="quick-link" href="https://library.scnu.ac.kr/" target="_blank" rel="noopener"><i data-lucide="library" size="20"></i><span><b>도서관</b><small>좌석·자료 검색</small></span></a><a class="quick-link" href="https://www.scnu.ac.kr/haksa/main.do" target="_blank" rel="noopener"><i data-lucide="school" size="20"></i><span><b>학사안내</b><small>공식 공지 확인</small></span></a></div></section>
      <section class="section"><div class="section-head"><div><h2 class="section-title">저장한 혜택</h2><p class="section-sub">나중에 다시 보고 싶은 정보를 모았어요</p></div><span id="savedBadge" class="badge">0개</span></div><div id="savedGrid" class="benefit-grid"></div></section>
      <section class="section"><div class="section-head"><div><h2 class="section-title">내 활동 요약</h2></div></div><div class="stats"><div class="stat"><b id="mySaved">0</b><span>저장한 혜택</span></div><div class="stat"><b id="myDone">0</b><span>완료 미션</span></div><div class="stat"><b id="myRate">0%</b><span>준비 달성률</span></div></div></section>
      <p class="footer-note">UniStarter · 대학생활의 좋은 시작</p>
    </section>
  </main>
</div>
<nav class="bottom-nav" aria-label="하단 메뉴">
  <button class="nav-btn active" data-page="home"><span class="nav-icon"><i data-lucide="home" size="21"></i></span>홈</button>
  <button class="nav-btn" data-page="guide"><span class="nav-icon"><i data-lucide="list-checks" size="21"></i></span>가이드</button>
  <button class="nav-btn" data-page="calendar"><span class="nav-icon"><i data-lucide="calendar-days" size="21"></i></span>캘린더</button>
  <button class="nav-btn" data-page="saved"><span class="nav-icon"><i data-lucide="bookmark" size="21"></i></span>저장</button>
</nav>
<div id="toast" class="toast" role="status"></div>
<script>
const benefits=[
{id:'adobe',name:'Adobe Creative Cloud',cat:'IT · 소프트웨어',desc:'학생 인증 시 모든 크리에이티브 앱 최대 60% 할인',tag:'연간 최대 40만원 절약',logo:'Ae',color:'#fff0f5',ink:'#d6336c'},
{id:'notion',name:'Notion Plus',cat:'IT · 소프트웨어',desc:'학교 이메일 인증으로 Plus 교육 요금제 무료',tag:'학생 무료',logo:'N',color:'#f0f1f3',ink:'#222'},
{id:'ms',name:'Microsoft 365',cat:'IT · 소프트웨어',desc:'Word, Excel, PowerPoint 등 교육용 앱 무료 사용',tag:'재학 중 무료',logo:'M',color:'#edf5ff',ink:'#2775d6'},
{id:'github',name:'GitHub Student Pack',cat:'IT · 소프트웨어',desc:'개발 도구와 클라우드 크레딧을 한 번에',tag:'개발 전공 필수',logo:'GH',color:'#eeeefe',ink:'#4b42a9'},
{id:'korail',name:'코레일 내일로',cat:'교통 · 여행',desc:'만 29세 이하를 위한 철도 자유여행 패스',tag:'전국 기차 여행',logo:'KTX',color:'#eaf5ff',ink:'#1769aa'},
{id:'air',name:'학생 항공권 할인',cat:'교통 · 여행',desc:'국제학생증 ISIC 제휴 항공권 및 여행 상품 할인',tag:'ISIC 인증',logo:'IS',color:'#e8fbf4',ink:'#07805b'},
{id:'meal',name:'학생회 제휴 맛집',cat:'맛집 · 카페',desc:'학생증 제시 시 캠퍼스 주변 제휴 매장 5~15% 할인',tag:'우리 학교 주변',logo:'FO',color:'#fff4e8',ink:'#df741e'},
{id:'cafe',name:'텀블러 캠퍼스 할인',cat:'맛집 · 카페',desc:'교내 카페 개인 컵 이용 시 최대 700원 할인',tag:'친환경 혜택',logo:'CA',color:'#effaf0',ink:'#378846'},
{id:'library',name:'도서관 전자자료',cat:'교내 시설',desc:'학술 DB, 전자책, 뉴욕타임스 등 무료 열람',tag:'교외 접속 가능',logo:'LIB',color:'#f2efff',ink:'#6648bf'},
{id:'gym',name:'교내 체육시설',cat:'교내 시설',desc:'헬스장, 수영장, 테니스장을 학생가로 이용',tag:'학기권 추천',logo:'GYM',color:'#ecf8ff',ink:'#1680a4'},
{id:'museum',name:'문화시설 학생 할인',cat:'문화 · 전시',desc:'국공립 박물관과 미술관 무료 또는 학생 할인',tag:'학생증 지참',logo:'ART',color:'#fff0ec',ink:'#c95839'},
{id:'cinema',name:'영화관 청소년 요금',cat:'문화 · 전시',desc:'만 24세 이하 청소년 요금 및 대학생 프로모션',tag:'현장 확인',logo:'MOV',color:'#fff8df',ink:'#b27b00'}];
const tasks=[
{id:'email',title:'학교 이메일 활성화',desc:'포털에서 계정 생성 후 복구 이메일 등록',icon:'mail-check'},
{id:'id',title:'학생증 발급 신청',desc:'모바일 학생증과 실물 카드 모두 확인',icon:'badge-check'},
{id:'wifi',title:'캠퍼스 Wi-Fi 연결',desc:'eduroam 설정을 미리 완료해 두기',icon:'wifi'},
{id:'course',title:'수강신청 연습',desc:'장바구니와 서버 시간 확인은 필수',icon:'mouse-pointer-click'},
{id:'library',title:'도서관 좌석 앱 설치',desc:'열람실 예약 및 출입 방법 알아보기',icon:'library'},
{id:'scholar',title:'장학금 일정 확인',desc:'국가장학금 2차 신청 대상 점검',icon:'circle-dollar-sign'},
{id:'club',title:'동아리 박람회 둘러보기',desc:'관심 동아리 3곳을 미리 저장해 두기',icon:'users'}];
const faqs=[
{q:'수강신청은 어떻게 준비하나요?',a:'수강편람에서 선수과목과 강의 시간을 먼저 확인하고, 희망과목 장바구니를 활용하세요. 당일에는 유선 인터넷과 정확한 서버 시간을 준비하는 것이 좋아요.'},
{q:'학생 상담센터는 언제 이용할 수 있나요?',a:'대부분 평일 09:00~18:00 운영하며 학교 포털에서 무료 상담을 예약할 수 있어요. 위기 상담은 교내 안내 번호를 통해 별도로 연결됩니다.'},
{q:'국가장학금은 신입생도 신청할 수 있나요?',a:'네. 신입생도 신청 가능하며 대학 정보가 확정되기 전에는 소속 대학을 미정으로 신청할 수 있어요. 한국장학재단의 신청·서류·가구원 동의 일정을 모두 확인하세요.'},
{q:'공강 시간은 어디에서 보내면 좋나요?',a:'도서관 열람실, 학생 라운지, 단과대 휴게실을 추천해요. 좌석 예약 앱이 필요한 공간이 있으니 첫 주에 이용 방법을 확인해 두세요.'}];
const fallbackEvents=[
{id:'fallback-1',title:'수업일수 1/4',start:'2026-09-29',end:'2026-09-29',description:'국립순천대학교 2026학년도 학사일정'},
{id:'fallback-2',title:'제2학기 중간시험',start:'2026-10-19',end:'2026-10-23',description:'강의별 시험 일정을 확인하세요'},
{id:'fallback-3',title:'동계 계절학기 수강신청',start:'2026-11-11',end:'2026-11-13',description:'수강신청 및 개설 교과목 확인'},
{id:'fallback-4',title:'제2학기 기말시험',start:'2026-12-14',end:'2026-12-18',description:'강의별 시험 및 과제 마감 확인'},
{id:'fallback-5',title:'제2학기 종강',start:'2026-12-18',end:'2026-12-18',description:'국립순천대학교 공식 학사일정'}];
let events=[...fallbackEvents];
const genericMajors=['경영학과','컴퓨터공학과','미디어학과','심리학과','자유전공학부'];
const scnuMajorGroups={
'본부직속':['자유전공학부','스마트팩토리혁신학과','식품영양학과','융합바이오시스템기계공학과','간호학과','국제한국어교육학과','건축학부','글로벌인재학부-글로벌매니지먼트전공','글로벌인재학부-글로벌ICT문화예술콘텐츠전공'],
'그린스마트팜스쿨':['농생명과학전공','산림자원학전공','조경학전공','동물자원과학전공','원예학전공','식품공학전공','농업경제학전공','의생명과학전공','조리과학전공','바이오한약자원학전공','국제농축산학과'],
'애니메이션문화콘텐츠스쿨':['경영학전공','법학전공','회계학전공','경제학전공','무역학전공','행정학전공','물류학전공','사회복지학전공','사학전공','철학전공','글로벌중국학전공','일본어일본문화학전공','문예창작학전공','사회체육학전공','음악예술융합학전공','사진미디어학전공','영상디자인학전공','만화애니메이션학전공','패션디자인학전공'],
'우주항공첨단소재스쿨':['토목공학전공','환경공학전공','기계우주항공공학전공','첨단신소재공학전공','화학공학전공','전기공학전공','전자공학전공','인공지능공학전공','컴퓨터공학전공','화학전공','에너지응용공학전공']};
const categories=['전체',...new Set(benefits.map(x=>x.cat))];
let activeCategory='전체';
const store={get(k,f){try{const v=localStorage.getItem('unistarter-'+k);return v?JSON.parse(v):f}catch(e){showToast('저장 정보를 불러오지 못했어요');return f}},set(k,v){try{localStorage.setItem('unistarter-'+k,JSON.stringify(v));return true}catch(e){showToast('브라우저 저장 공간을 확인해 주세요');return false}}};
let saved=store.get('saved',[]),done=store.get('tasks',[]),profile=store.get('profile',{university:'',major:''});
const el=id=>document.getElementById(id);
function iconRefresh(){if(window.lucide)lucide.createIcons()}
function showToast(msg){const t=el('toast');t.textContent=msg;t.classList.add('show');clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>t.classList.remove('show'),1800)}
function daysUntil(date){const now=new Date();now.setHours(0,0,0,0);return Math.ceil((date-now)/86400000)}
function eventDate(evt){return new Date(evt.start+'T00:00:00')}
function safeText(value){const node=document.createElement('span');node.textContent=String(value||'');return node.innerHTML}
function renderCategories(){el('categoryFilters').innerHTML=categories.map(c=>'<button class="chip '+(c===activeCategory?'active':'')+'" data-cat="'+c+'">'+c+'</button>').join('')}
function card(b){const isSaved=saved.includes(b.id);return '<article id="benefit-'+b.id+'" class="benefit-card"><div class="benefit-logo" style="background:'+b.color+';color:'+b.ink+'">'+b.logo+'</div><div><h3>'+b.name+'</h3><p>'+b.desc+'</p><span class="badge">'+b.tag+'</span></div><button class="save-btn '+(isSaved?'saved':'')+'" data-save="'+b.id+'" aria-label="'+b.name+' 저장"><i data-lucide="bookmark" size="18"></i></button></article>'}
function renderBenefits(){const list=activeCategory==='전체'?benefits:benefits.filter(b=>b.cat===activeCategory);el('benefitGrid').innerHTML=list.map(card).join('');iconRefresh()}
function toggleSave(id){saved=saved.includes(id)?saved.filter(x=>x!==id):[...saved,id];if(store.set('saved',saved)){renderBenefits();renderSaved();updateStats();showToast(saved.includes(id)?'혜택을 저장했어요':'저장에서 삭제했어요')}}
function renderTasks(){el('checkList').innerHTML=tasks.map(t=>'<article class="check-card '+(done.includes(t.id)?'done':'')+'" data-task="'+t.id+'"><div class="check-icon"><i data-lucide="'+t.icon+'" size="19"></i></div><div><h3>'+t.title+'</h3><p>'+t.desc+'</p></div><button class="check-toggle" aria-label="'+t.title+' 완료"><i data-lucide="check" size="16"></i></button></article>').join('');updateProgress();iconRefresh()}
function updateProgress(){const pct=Math.round(done.length/tasks.length*100);el('progressRing').style.setProperty('--progress',pct+'%');el('progressText').textContent=pct+'%';el('progressFill').style.width=pct+'%';el('progressMessage').textContent=pct===100?'완벽해요! 캠퍼스 생활 준비 완료':done.length+'개 완료 · '+(tasks.length-done.length)+'개 남았어요';updateStats()}
function renderFaqs(){el('faqList').innerHTML=faqs.map((f,i)=>'<article class="faq"><button class="faq-q" data-faq="'+i+'"><span class="result-type">Q</span><span>'+f.q+'</span><i class="chev" data-lucide="chevron-down" size="17"></i></button><div class="faq-a">'+f.a+'</div></article>').join('');iconRefresh()}
function renderCalendar(){const today=new Date();today.setHours(0,0,0,0);const sorted=events.map(e=>({...e,date:eventDate(e),endDate:new Date((e.end||e.start)+'T23:59:59')})).filter(e=>e.endDate>=today).sort((a,b)=>a.date-b.date).slice(0,8);if(!sorted.length){el('nextDday').textContent='—';el('nextEvent').textContent='예정된 일정이 없어요';el('nextDate').textContent='공식 학사안내에서 새 일정을 확인해 주세요';el('ddayList').innerHTML='<div class="empty"><b>다가오는 학사일정이 없습니다</b></div>';return}const first=sorted[0],d=Math.max(0,daysUntil(first.date));el('nextDday').textContent=d===0?'D-DAY':'D-'+d;el('nextEvent').textContent=first.title;el('nextDate').textContent=first.date.toLocaleDateString('ko-KR',{year:'numeric',month:'long',day:'numeric'});el('ddayList').innerHTML=sorted.map(e=>{const x=Math.max(0,daysUntil(e.date)),month=e.date.getMonth()+1,day=e.date.getDate(),period=e.end&&e.end!==e.start?e.start.replaceAll('-','.')+' ~ '+e.end.replaceAll('-','.'):(e.description||'국립순천대학교 공식 일정');return '<article class="dday-row"><div class="date-box"><span>'+month+'월</span><b>'+day+'</b></div><div class="dday-info"><b>'+safeText(e.title)+'</b><p>'+safeText(period)+'</p></div><span class="d-pill">'+(x===0?'D-DAY':'D-'+x)+'</span></article>'}).join('');iconRefresh()}
async function loadOfficialCalendar(force=false){const dot=el('syncDot'),text=el('syncText'),cached=store.get('calendar-cache',null);dot.className='sync-dot loading';text.textContent='국립순천대학교 공식 일정을 동기화하는 중...';if(cached&&cached.events&&!force){events=cached.events;renderCalendar()}try{const res=await fetch('/api/scnu/calendar',{cache:force?'reload':'default'});if(!res.ok)throw new Error('HTTP '+res.status);const data=await res.json();if(!Array.isArray(data.events)||!data.events.length)throw new Error('empty calendar');events=data.events;store.set('calendar-cache',{events:events,syncedAt:data.syncedAt});renderCalendar();dot.className='sync-dot';const synced=new Date(data.syncedAt);text.textContent='공식 일정 동기화 · '+synced.toLocaleString('ko-KR',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'});checkReminders()}catch(error){console.warn('Calendar sync fallback',error);dot.className='sync-dot error';text.textContent=cached?'오프라인 캐시 일정 표시 중':'연결 실패 · 기본 일정 표시 중';renderCalendar()}}
function renderSaved(){const list=benefits.filter(b=>saved.includes(b.id));el('savedGrid').innerHTML=list.length?list.map(card).join(''):'<div class="empty" style="grid-column:1/-1"><div class="empty-icon"><i data-lucide="bookmark" size="23"></i></div><b>아직 저장한 혜택이 없어요</b><p style="font-size:12px">혜택 카드의 북마크를 눌러 모아보세요.</p></div>';el('savedBadge').textContent=list.length+'개';iconRefresh()}
function updateStats(){el('savedCount').textContent=saved.length;el('taskCount').textContent=done.length+'/'+tasks.length;el('mySaved').textContent=saved.length;el('myDone').textContent=done.length;el('myRate').textContent=Math.round(done.length/tasks.length*100)+'%'}
function renderMajorOptions(){const select=el('majorSelect'),isScnu=profile.university==='순천대학교';let html='<option value="">전공 선택</option>';if(isScnu){Object.entries(scnuMajorGroups).forEach(([group,items])=>{html+='<optgroup label="'+group+'">'+items.map(item=>'<option>'+item+'</option>').join('')+'</optgroup>'})}else{html+=genericMajors.map(item=>'<option>'+item+'</option>').join('')}select.innerHTML=html;if([...select.options].some(o=>o.value===profile.major))select.value=profile.major;else{profile.major='';select.value=''}}
function renderProfile(){el('universitySelect').value=profile.university||'';renderMajorOptions();const summary=[profile.university==='순천대학교'?'국립순천대학교':profile.university,profile.major].filter(Boolean).join(' · ');el('profileSummary').textContent=summary||'학교와 전공을 설정해 맞춤 정보를 받아보세요';el('sideMajor').textContent=profile.major||'새내기 님'}
function navigate(page){document.querySelectorAll('.page').forEach(x=>x.classList.toggle('active',x.id===page));document.querySelectorAll('[data-page]').forEach(x=>x.classList.toggle('active',x.dataset.page===page));window.scrollTo({top:0,behavior:'smooth'});if(page==='saved')renderSaved()}
function search(q){const box=el('searchResults');q=q.trim().toLowerCase();if(!q){box.classList.remove('show');return}const found=[];benefits.forEach(b=>{if((b.name+b.cat+b.desc+b.tag).toLowerCase().includes(q))found.push({type:'혜택',title:b.name,sub:b.desc,id:b.id})});tasks.forEach(t=>{if((t.title+t.desc).toLowerCase().includes(q))found.push({type:'가이드',title:t.title,sub:t.desc,task:t.id})});faqs.forEach((f,i)=>{if((f.q+f.a).toLowerCase().includes(q))found.push({type:'FAQ',title:f.q,sub:f.a,faq:i})});box.innerHTML=found.length?found.slice(0,6).map((r,i)=>'<button class="result-item" data-result="'+i+'" style="width:100%;border:0;background:none;color:var(--ink);text-align:left"><span class="result-type">'+r.type+'</span><span><b>'+r.title+'</b><small>'+r.sub.slice(0,45)+(r.sub.length>45?'…':'')+'</small></span></button>').join(''):'<div class="empty" style="border:0;padding:25px"><b>검색 결과가 없어요</b><p style="font-size:12px">다른 키워드로 검색해 보세요.</p></div>';box.dataset.results=JSON.stringify(found.slice(0,6));box.classList.add('show')}
document.addEventListener('click',e=>{const nav=e.target.closest('[data-page]');if(nav)navigate(nav.dataset.page);const cat=e.target.closest('[data-cat]');if(cat){activeCategory=cat.dataset.cat;renderCategories();renderBenefits()}const save=e.target.closest('[data-save]');if(save)toggleSave(save.dataset.save);const task=e.target.closest('[data-task]');if(task){const id=task.dataset.task;done=done.includes(id)?done.filter(x=>x!==id):[...done,id];if(store.set('tasks',done)){renderTasks();if(done.includes(id))showToast('미션 완료! 잘하고 있어요')}}const fq=e.target.closest('[data-faq]');if(fq)fq.closest('.faq').classList.toggle('open');const result=e.target.closest('[data-result]');if(result){const list=JSON.parse(el('searchResults').dataset.results||'[]'),r=list[Number(result.dataset.result)];el('globalSearch').value='';el('searchResults').classList.remove('show');if(r.type==='혜택'){activeCategory='전체';renderCategories();renderBenefits();setTimeout(()=>{const c=el('benefit-'+r.id);c&&c.scrollIntoView({behavior:'smooth',block:'center'});c&&c.classList.add('highlight')},50)}else if(r.type==='가이드'){navigate('guide');setTimeout(()=>{const c=document.querySelector('[data-task="'+r.task+'"]');c&&c.scrollIntoView({behavior:'smooth',block:'center'});c&&c.classList.add('highlight')},50)}else{const f=document.querySelectorAll('.faq')[r.faq];f.classList.add('open');f.scrollIntoView({behavior:'smooth',block:'center'})}}});
el('categoryFilters').addEventListener('click',()=>{});el('resetFilter').onclick=()=>{activeCategory='전체';renderCategories();renderBenefits()};
el('globalSearch').addEventListener('input',e=>search(e.target.value));document.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key==='k'){e.preventDefault();el('globalSearch').focus();navigate('home')}if(e.key==='Escape')el('searchResults').classList.remove('show')});
el('themeToggle').onclick=()=>{document.documentElement.classList.toggle('dark');const dark=document.documentElement.classList.contains('dark');try{localStorage.setItem('unistarter-theme',dark?'dark':'light')}catch(e){}el('themeToggle').innerHTML='<i data-lucide="'+(dark?'sun':'moon')+'" size="19"></i>';document.querySelector('meta[name="theme-color"]').content=dark?'#0d1321':'#f6f8fc';iconRefresh()};
el('universitySelect').addEventListener('change',()=>{profile={university:el('universitySelect').value,major:''};if(store.set('profile',profile)){renderProfile();showToast(profile.university==='순천대학교'?'국립순천대학교 전공 목록을 불러왔어요':'학교 정보가 저장됐어요')}});el('majorSelect').addEventListener('change',()=>{profile.major=el('majorSelect').value;if(store.set('profile',profile)){renderProfile();showToast('전공 정보가 저장됐어요')}});
el('calendarRefresh').onclick=()=>loadOfficialCalendar(true);
el('ddayForm').addEventListener('submit',e=>{e.preventDefault();const name=el('customEvent').value,date=new Date(el('customDate').value+'T00:00:00'),d=daysUntil(date);el('customResult').innerHTML='<article class="dday-row"><div class="date-box"><i data-lucide="flag" size="20"></i></div><div class="dday-info"><b>'+name+'</b><p>'+date.toLocaleDateString('ko-KR')+'</p></div><span class="d-pill">'+(d===0?'D-DAY':d>0?'D-'+d:'D+'+Math.abs(d))+'</span></article>';iconRefresh()});
const reminder=store.get('reminder',{enabled:false,days:3,lastSent:''});
function renderNotificationStatus(){const supported='Notification' in window;el('reminderDays').value=String(reminder.days||3);el('notificationToggle').textContent=reminder.enabled?'알림 끄기':'알림 켜기';el('notificationStatus').textContent=!supported?'이 브라우저는 알림을 지원하지 않아요':reminder.enabled?'앱을 열면 '+reminder.days+'일 이내 일정을 알려드려요':'알림을 켜면 중요한 일정을 놓치지 않아요'}
async function checkReminders(){if(!reminder.enabled||!('Notification' in window)||Notification.permission!=='granted')return;const upcoming=events.map(e=>({...e,days:daysUntil(eventDate(e))})).filter(e=>e.days>=0&&e.days<=reminder.days).sort((a,b)=>a.days-b.days);if(!upcoming.length)return;const today=new Date().toISOString().slice(0,10),key=today+':'+upcoming.map(e=>e.id).join(',');if(reminder.lastSent===key)return;const title=upcoming[0].days===0?'오늘의 학사일정':'다가오는 학사일정 D-'+upcoming[0].days;const options={body:upcoming[0].title+(upcoming.length>1?' 외 '+(upcoming.length-1)+'건':''),icon:'/static/icon-192.png',badge:'/static/icon-192.png',tag:'unistarter-calendar',data:{url:'/?page=calendar'}};try{const reg=await navigator.serviceWorker.ready;await reg.showNotification(title,options)}catch(e){new Notification(title,options)}reminder.lastSent=key;store.set('reminder',reminder)}
el('notificationToggle').onclick=async()=>{if(!('Notification' in window)){showToast('이 브라우저는 알림을 지원하지 않아요');return}if(reminder.enabled){reminder.enabled=false;store.set('reminder',reminder);renderNotificationStatus();showToast('일정 알림을 껐어요');return}const permission=await Notification.requestPermission();if(permission==='granted'){reminder.enabled=true;reminder.lastSent='';store.set('reminder',reminder);renderNotificationStatus();showToast('일정 알림을 켰어요');checkReminders()}else{showToast('브라우저 설정에서 알림을 허용해 주세요')}};
el('reminderDays').onchange=()=>{reminder.days=Number(el('reminderDays').value);reminder.lastSent='';store.set('reminder',reminder);renderNotificationStatus();checkReminders()};
let deferredInstallPrompt=null;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredInstallPrompt=e;el('installBanner').classList.add('show')});window.addEventListener('appinstalled',()=>{el('installBanner').classList.remove('show');showToast('UniStarter가 설치됐어요')});el('installButton').onclick=async()=>{if(deferredInstallPrompt){deferredInstallPrompt.prompt();await deferredInstallPrompt.userChoice;deferredInstallPrompt=null;el('installBanner').classList.remove('show')}else{showToast(/iphone|ipad/i.test(navigator.userAgent)?'공유 버튼에서 홈 화면에 추가를 선택하세요':'브라우저 메뉴에서 앱 설치를 선택하세요')}};
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(e=>console.warn('Service worker registration failed',e)));
renderCategories();renderBenefits();renderTasks();renderFaqs();renderCalendar();renderSaved();renderProfile();renderNotificationStatus();updateStats();loadOfficialCalendar();
const startupPage=new URLSearchParams(location.search).get('page');if(['home','guide','calendar','saved'].includes(startupPage))navigate(startupPage);
const isStandalone=matchMedia('(display-mode: standalone)').matches||navigator.standalone;if(!isStandalone&&/iphone|ipad|ipod/i.test(navigator.userAgent))el('installBanner').classList.add('show');
const isDark=document.documentElement.classList.contains('dark');el('themeToggle').innerHTML='<i data-lucide="'+(isDark?'sun':'moon')+'" size="19"></i>';iconRefresh();
</script>
</body>
</html>`))

export default app
