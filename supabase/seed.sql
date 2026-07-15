-- Seed data: site header text, the 6 builtin categories, the first 筆記
-- ("內在公司") carried over from the reference mock, and one placeholder
-- item per remaining category so the wall isn't empty on first run.

insert into site_settings (id) values (true) on conflict (id) do nothing;

insert into categories (slug, label, display_style, is_builtin, sort_order) values
  ('fragment', '小碎片', 'teaser_reveal', true, 0),
  ('note', '筆記', 'note_page', true, 1),
  ('verse', '小句', 'full_text', true, 2),
  ('painting', '畫', 'image_caption', true, 3),
  ('song', '歌', 'audio_player', true, 4),
  ('portfolio', 'Portfolio', 'tag_list', true, 5)
on conflict (slug) do nothing;

-- 筆記：內在公司（做自己的 CEO）— custom template, seeded from the reference HTML.
with note_item as (
  insert into items (category_id, title, teaser)
  select id, '內在公司', '當老板是一種技能，得先對自己練過一遍，才能對別人用。'
  from categories where slug = 'note'
  returning id
)
insert into notes (item_id, slug, template, custom_html, custom_css)
select
  note_item.id,
  'inner-company',
  'custom',
  $html$<div class="wrap">

  <header>
    <p class="eyebrow">觀察筆記 · 內在系統</p>
    <h1>內在公司</h1>
    <p class="lede">當老板是一種技能,得先對自己練過一遍,才能對別人用。<br>
    這是一間<strong>只有一個員工的公司</strong>——你既是 CEO,也是 manager,也是 employee。</p>
  </header>

  <div class="loop-diagram">
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <marker id="arrowGold" markerWidth="7" markerHeight="7" refX="4.5" refY="3.5" orient="auto">
          <path d="M0,0 L7,3.5 L0,7 Z" fill="var(--gold)"/>
        </marker>
        <marker id="arrowVerm" markerWidth="7" markerHeight="7" refX="4.5" refY="3.5" orient="auto">
          <path d="M0,0 L7,3.5 L0,7 Z" fill="var(--vermillion)"/>
        </marker>
      </defs>
      <!-- CEO → Manager : 拆解 -->
      <path d="M 61 17 C 82 30, 90 48, 87 64"
            fill="none" stroke="var(--gold)" stroke-width="1.6"
            stroke-linecap="round" marker-end="url(#arrowGold)"/>
      <!-- Manager → Employee : 執行 -->
      <path d="M 79 80 C 55 92, 45 92, 21 80"
            fill="none" stroke="var(--gold)" stroke-width="1.6"
            stroke-linecap="round" marker-end="url(#arrowGold)"/>
      <!-- Employee → CEO : 自我覺察（回頭診斷，closes the loop） -->
      <path d="M 13 64 C 10 48, 18 30, 39 17"
            fill="none" stroke="var(--vermillion)" stroke-width="1.6"
            stroke-dasharray="0.5 6" stroke-linecap="round" marker-end="url(#arrowVerm)"/>
    </svg>

    <span class="edge-label forward el-1">拆解</span>
    <span class="edge-label forward el-2">執行</span>
    <span class="edge-label feedback el-3">自我覺察</span>

    <div class="loop-node n-ceo" data-role="ceo">
      <div class="ring">CEO</div>
      <span class="tag">方向層</span>
    </div>
    <div class="loop-node n-manager" data-role="manager">
      <div class="ring">M</div>
      <span class="tag">管理層</span>
    </div>
    <div class="loop-node n-employee" data-role="employee">
      <div class="ring">E</div>
      <span class="tag">執行層</span>
    </div>
  </div>

  <div class="diagram">
    <div class="cards">

      <div class="card" data-role="ceo" tabindex="0" role="button" aria-expanded="false">
        <div class="card-head">
          <div>
            <p class="role-tag">01 · 方向層 / CEO</p>
            <h2>方向</h2>
          </div>
          <span class="toggle-icon">+</span>
        </div>
        <p class="body">決定往哪走,不做具體的事——這需要判斷力,需要願意為結果負責。沒有方向的時候也不用慌:觀望也是一種方向,休整也是一種調整。允許迷茫發生,去面對、去調整,比慌亂地硬找方向更有益,雖然迷茫的時候還是會迷茫。</p>
        <div class="diagnostic">
          <div class="diagnostic-inner">
            <div class="diagnostic-content">
              <span class="label">若這層出錯</span>
              目標本身已經不符合現在的自己——這才需要 CEO 重新審視方向,這是三層裡最貴、最不該常動的一層。
            </div>
          </div>
        </div>
      </div>

      <div class="connector">
        <span class="txt">↓ 拆解</span>
      </div>

      <div class="card" data-role="manager" tabindex="0" role="button" aria-expanded="false">
        <div class="card-head">
          <div>
            <p class="role-tag">02 · 管理層 / Manager</p>
            <h2>管理</h2>
          </div>
          <span class="toggle-icon">+</span>
        </div>
        <p class="body">把抽象目標拆解成具體任務。也負責一道最難的題——「應該」與「想」打架的時候,像員工向 manager 請假,批不批?這不能靠當下心情決定,得看習慣建立起來了嗎、請假的頻率如何。沒有標準答案,考的就是自律。</p>
        <div class="diagnostic">
          <div class="diagnostic-inner">
            <div class="diagnostic-content">
              <span class="label">若這層出錯</span>
              任務拆得不合理,根本排不進生活——該調整的是任務設計,不是怪自己不自律。
            </div>
          </div>
        </div>
      </div>

      <div class="connector">
        <span class="txt">↓ 執行</span>
      </div>

      <div class="card" data-role="employee" tabindex="0" role="button" aria-expanded="false">
        <div class="card-head">
          <div>
            <p class="role-tag">03 · 執行層 / Employee</p>
            <h2>執行</h2>
          </div>
          <span class="toggle-icon">+</span>
        </div>
        <p class="body">不想那麼多,今天該做什麼就去做。</p>
        <div class="diagnostic">
          <div class="diagnostic-inner">
            <div class="diagnostic-content">
              <span class="label">若這層出錯</span>
              某天沒做到,可能只是狀態不好——不用大驚小怪,明天繼續。
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>

  <div class="closing">
    <p>盡人事,聽天命。內在系統要不要調、怎麼調,看的是自己有沒有誠實地轉起來,而不是外在世界給不給你打分。</p>
    <div class="seal"><span>如此可爾</span></div>
  </div>

</div>$html$,
  $css$
  :root{
    --ink-bg: #1c1a17;
    --ink-bg-2: #26221d;
    --paper: #ece4d3;
    --paper-hi: #f4ede0;
    --text-ink: #2a2620;
    --text-onDark: #ece4d3;
    --text-onDark-dim: #a89f8d;
    --gold: #ab8641;
    --stone: #7d7869;
    --stone-line: #4a463c;
    --vermillion: #b23a2c;
    --vermillion-dim: #8c2e23;
  }

  #custom-note-root *{ box-sizing: border-box; }

  #custom-note-root{
    min-height: 100vh;
    background: var(--ink-bg);
    color: var(--text-onDark);
    font-family: 'Noto Serif TC', serif;
    -webkit-font-smoothing: antialiased;
    background-image:
      radial-gradient(ellipse 900px 500px at 15% -5%, rgba(171,134,65,0.08), transparent 60%),
      radial-gradient(ellipse 700px 600px at 90% 100%, rgba(178,58,44,0.06), transparent 60%);
  }

  #custom-note-root .wrap{
    max-width: 720px;
    margin: 0 auto;
    padding: 72px 24px 96px;
  }

  #custom-note-root header{
    margin-bottom: 56px;
  }

  #custom-note-root .eyebrow{
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    letter-spacing: 0.22em;
    color: var(--gold);
    text-transform: uppercase;
    margin: 0 0 18px;
  }

  #custom-note-root h1{
    font-size: clamp(34px, 7vw, 48px);
    font-weight: 900;
    margin: 0 0 20px;
    letter-spacing: 0.02em;
    color: var(--paper-hi);
    line-height: 1.25;
  }

  #custom-note-root .lede{
    font-size: 16px;
    line-height: 2;
    color: var(--text-onDark-dim);
    max-width: 56ch;
    margin: 0;
  }

  #custom-note-root .lede strong{
    color: var(--text-onDark);
    font-weight: 500;
  }

  #custom-note-root .diagram{
    margin: 4px 0 40px;
  }

  #custom-note-root .loop-diagram{
    position: relative;
    width: 100%;
    max-width: 380px;
    aspect-ratio: 1 / 0.92;
    margin: 0 auto 12px;
  }

  #custom-note-root .loop-diagram svg{
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow: visible;
  }

  #custom-note-root .loop-node{
    position: absolute;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    text-align: center;
  }

  #custom-note-root .loop-node .ring{
    width: 58px;
    height: 58px;
    border-radius: 50%;
    background: var(--paper);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 19px;
    font-weight: 700;
    color: var(--text-ink);
    box-shadow: 0 6px 20px rgba(0,0,0,0.35);
    border: 2px solid transparent;
  }

  @media (min-width: 480px){
    #custom-note-root .loop-node .ring{ width: 68px; height: 68px; font-size: 21px; }
  }

  #custom-note-root .loop-node[data-role="ceo"] .ring{ border-color: var(--gold); }
  #custom-note-root .loop-node[data-role="manager"] .ring{ border-color: var(--stone); }
  #custom-note-root .loop-node[data-role="employee"] .ring{ border-color: var(--vermillion-dim); }

  #custom-note-root .loop-node .tag{
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--text-onDark-dim);
  }

  #custom-note-root .loop-node.n-ceo{ left: 50%; top: 12%; }
  #custom-note-root .loop-node.n-manager{ left: 87%; top: 76%; }
  #custom-note-root .loop-node.n-employee{ left: 13%; top: 76%; }

  #custom-note-root .edge-label{
    position: absolute;
    font-family: 'JetBrains Mono', monospace;
    font-size: 10.5px;
    letter-spacing: 0.1em;
    white-space: nowrap;
    pointer-events: none;
  }

  @media (min-width: 480px){
    #custom-note-root .edge-label{ font-size: 11.5px; }
  }

  #custom-note-root .edge-label.forward{ color: var(--gold); }
  #custom-note-root .edge-label.feedback{ color: var(--vermillion); font-weight: 500; }

  #custom-note-root .el-1{ left: 76%; top: 38%; }
  #custom-note-root .el-2{ left: 50%; top: 91%; transform: translateX(-50%); }
  #custom-note-root .el-3{ left: 12%; top: 38%; transform: translateX(-100%); }

  #custom-note-root .cards{
    position: relative;
    display: flex;
    flex-direction: column;
  }

  #custom-note-root .connector{
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px 0;
    color: var(--stone);
  }

  #custom-note-root .connector .txt{
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.12em;
    color: var(--stone);
  }

  #custom-note-root .card{
    background: var(--paper);
    color: var(--text-ink);
    border-radius: 2px;
    padding: 26px 26px 24px;
    cursor: pointer;
    position: relative;
    transition: background 0.2s ease, transform 0.15s ease;
    border-left: 3px solid transparent;
  }

  #custom-note-root .card:hover{ background: var(--paper-hi); }

  #custom-note-root .card:focus-visible{
    outline: 2px solid var(--vermillion);
    outline-offset: -2px;
  }

  #custom-note-root .card[data-role="ceo"]{ border-left-color: var(--gold); }
  #custom-note-root .card[data-role="manager"]{ border-left-color: var(--stone); }
  #custom-note-root .card[data-role="employee"]{ border-left-color: var(--vermillion-dim); }

  #custom-note-root .card-head{
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;
  }

  #custom-note-root .role-tag{
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--stone);
    margin: 0 0 8px;
  }

  #custom-note-root .card[data-role="ceo"] .role-tag{ color: var(--gold); }
  #custom-note-root .card[data-role="employee"] .role-tag{ color: var(--vermillion-dim); }

  #custom-note-root .card h2{
    font-size: 21px;
    font-weight: 700;
    margin: 0 0 14px;
    letter-spacing: 0.03em;
  }

  #custom-note-root .toggle-icon{
    font-family: 'JetBrains Mono', monospace;
    font-size: 18px;
    color: var(--stone);
    line-height: 1;
    flex-shrink: 0;
    transition: transform 0.25s ease;
  }

  #custom-note-root .card[aria-expanded="true"] .toggle-icon{ transform: rotate(45deg); }

  #custom-note-root .card p.body{
    font-size: 15.5px;
    line-height: 1.95;
    margin: 0;
    max-width: 54ch;
  }

  #custom-note-root .diagnostic{
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.3s ease;
  }

  #custom-note-root .card[aria-expanded="true"] .diagnostic{
    grid-template-rows: 1fr;
  }

  #custom-note-root .diagnostic-inner{
    overflow: hidden;
  }

  #custom-note-root .diagnostic-content{
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid rgba(42,38,32,0.16);
    font-size: 14.5px;
    line-height: 1.9;
    color: #4a4438;
  }

  #custom-note-root .diagnostic-content .label{
    font-family: 'JetBrains Mono', monospace;
    font-size: 10.5px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--vermillion);
    display: block;
    margin-bottom: 8px;
  }

  #custom-note-root .closing{
    margin-top: 56px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 24px;
    flex-wrap: wrap;
  }

  #custom-note-root .closing p{
    font-size: 15px;
    line-height: 2;
    color: var(--text-onDark-dim);
    max-width: 48ch;
    margin: 0;
  }

  #custom-note-root .seal{
    flex-shrink: 0;
    width: 54px;
    height: 54px;
    background: var(--vermillion);
    color: #f4ede0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 3px 6px 4px 7px;
    transform: rotate(-4deg);
    box-shadow: 0 6px 18px rgba(178,58,44,0.25);
  }

  #custom-note-root .seal span{
    writing-mode: vertical-rl;
    font-family: 'Noto Serif TC', serif;
    font-weight: 700;
    font-size: 13px;
    letter-spacing: 0.14em;
  }

  @media (prefers-reduced-motion: reduce){
    #custom-note-root *{ transition: none !important; animation: none !important; }
  }

  @media (max-width: 400px){
    #custom-note-root .wrap{ padding: 48px 16px 72px; }
    #custom-note-root .card{ padding: 20px 18px 20px; }
  }
  $css$
from note_item
on conflict (slug) do nothing;

-- Placeholder items so the wall isn't empty on first run.
insert into items (category_id, title, teaser, body)
select id, '週三的觀察', '地鐵上有人在讀一本沒有書衣的書。', '地鐵上有人在讀一本沒有書衣的書，封面朝下，像是不想被誰認出來在讀什麼。忽然覺得，很多堅持某種形象的時刻，其實只是怕被看穿在意。'
from categories where slug = 'fragment'
union all
select id, '關於等待', '等待不是浪費時間，是時間在等你準備好。', '等待不是浪費時間，是時間在等你準備好。'
from categories where slug = 'fragment';

insert into items (category_id, title, body)
select id, '無題', '風過去了╱樹還在搖╱像是捨不得那陣風╱其實只是還沒站穩'
from categories where slug = 'verse';

-- No image_url seeded here on purpose: painting images only ever come from
-- the app's own Supabase Storage bucket (uploaded via the author's editor),
-- and next/image throws for any host not in next.config.ts's remotePatterns.
insert into items (category_id, title, teaser)
select id, '無題水墨', '一筆濃墨，留白比落墨多。上傳作品後即可看到圖片。'
from categories where slug = 'painting';

insert into items (category_id, title, teaser, audio_url, song_kind)
select id, '如此可爾', '一首寫給自己的原創小品。', 'https://example.com/placeholder-audio.mp3', 'original'
from categories where slug = 'song';

insert into items (category_id, title, teaser, tags)
select id, 'Crescendo', '一個幫音樂人管理創作進度的小工具。', array['SaaS','Data','AI']
from categories where slug = 'portfolio';
