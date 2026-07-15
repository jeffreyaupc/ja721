# 個人網站

觀察、創作、作品的個人筆記網站。Next.js（App Router）+ Supabase（Postgres + Storage + Auth）。

## 內容模型

- **分類（categories）**：開放式，作者可自行新增／改名／排序／刪除。每個分類套用 6 種呈現樣式（display style）之一：小碎片（teaser_reveal）、筆記（note_page）、小句（full_text）、畫（image_caption）、歌（audio_player）、Portfolio（tag_list）。
- **內容（items）**：所有內容共用一張表，欄位依所屬分類的 display style 決定用途。
- **筆記（notes）**：`note_page` 樣式的 item 會多一筆對應資料，支援 `custom`（自訂 HTML/CSS，完全獨立視覺）與 `standard`（Markdown，套用全站宣紙配色）兩種模板，各自有獨立路由 `/notes/[slug]`。
- **site_settings**：單例資料列，存 header 的 eyebrow／標題／motto／介紹文字／印章文字，以及 footer 文字。

## 本機開發

1. 到 [supabase.com](https://supabase.com) 建一個新專案（需要你自己的帳號，這個 repo 本身不含任何雲端帳號）。
2. 在 Supabase Studio 的 SQL editor 依序執行：
   - `supabase/migrations/0001_init.sql`
   - `supabase/seed.sql`
3. 在 Supabase Studio → Authentication → Providers，關閉 Email 的「Allow new users to sign up」。
4. 在 Authentication → Users，手動新增你自己的帳號（email + password）——這就是唯一的作者帳號。
5. 複製 `.env.local.example` 為 `.env.local`，從 Supabase 專案的 Settings → API 填入：
   ```
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   ```
   （`SUPABASE_SERVICE_ROLE_KEY` 目前程式碼中沒有用到，留空即可。）
6. `npm install`
7. `npm run dev`，開啟 http://localhost:3000

用步驟 4 建立的帳密到 `/login` 登入，即可看到「+新增」「管理分類」與每張卡片上的編輯／刪除控制項；登出或無痕視窗開啟則是純讀者畫面。

## 部署

在 [Vercel](https://vercel.com) 連結這個 repo（同樣需要你自己的帳號），在專案設定的 Environment Variables 填入與 `.env.local` 相同的變數即可。

## 專案結構

```
proxy.ts                        # 每個請求刷新 Supabase session（Next.js 16 將 middleware 更名為 proxy）
src/app/layout.tsx               # 真正的 root layout：只有 <html>/<body> 與設計 token 變數，無 Tailwind
src/app/(site)/                  # 首頁：Tailwind、紙感視覺、Header/Footer、卡片牆
src/app/notes/[slug]/            # 筆記獨立頁面，不繼承首頁 chrome，可完全自訂視覺
src/lib/                         # Supabase client、auth 檢查、資料讀取
src/actions/                     # Server Actions（每個都會重新驗證登入狀態）
src/components/site|cards|notes|editor/
supabase/migrations, supabase/seed.sql
```
