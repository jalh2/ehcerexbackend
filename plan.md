# Ehcerex Group of Companies – Project Plan

## Context
- **Organization:** Ehcerex – a group of companies business website.
- **Current Phase:** Backend architecture is complete. Next phase is building the frontend (public website + CMS/admin) on top of the existing backend API.
- **End Goal:** A public-facing website (Home, About, Companies dropdown, Team, Contact) plus a CMS at `/admin` where admins log in and edit the content shown on each of those pages, including uploading images (stored as Base64 in Firestore).
- **Reference Project:** `actsfellowship/backend` – we are replicating its folder structure, Firebase setup, libraries, session auth, middleware, models/controllers/routes separation, and Base64 image storage pattern.
- **Storage Rule:** Images are converted to Base64 strings and stored directly in Firestore documents (same approach used in `actsfellowship/backend`).
- **Source of truth for seed content:** `ehcerex/ehcerex.md` (About page sections, services list, contact details, initial company list).

## Current Project Status

### Already in place
- [x] `ehcerex/backend` folder created.
- [x] `package.json` present with Firebase Admin, Express, express-session, cors, dotenv, nodemon installed.
- [x] `node_modules` installed.

### Completed in this session
- [x] Updated `package.json` with `type: commonjs`, `main: server.js`, and `start` / `dev` / `seed` / `seed:content` / `seed:all` scripts (mirrors `actsfellowship/backend/package.json`).
- [x] Created `.gitignore` (ignores `node_modules/`, `.env`, service account JSON) and `.env.example` template.
- [x] Created `config.js` initializing Firebase Admin + Firestore (`db`) using local JSON file by default, with a production `FIREBASE_SERVICE_ACCOUNT_JSON` env-var path documented.
- [x] Created `server.js` mirroring `actsfellowship/backend/server.js` (CORS with credentials, session, JSON 50mb limit, route mounting, error middleware, `/api/users`, `/api/home`, `/api/about`, `/api/companies`, `/api/team`, `/api/contact`).
- [x] Created `middleware/auth.js` (`requireAuth`, `requireRole`) and `middleware/errorMiddleware.js` (`notFound`, `errorHandler`).
- [x] Created `utils/encryption.js` (pbkdf2 hash/compare, same as Acts Fellowship).
- [x] Created `models/`: `userModel.js`, `homeModel.js`, `aboutModel.js`, `companyModel.js`, `teamModel.js`, `contactModel.js`.
- [x] Created `controllers/`: `userController.js`, `homeController.js`, `aboutController.js`, `companyController.js`, `teamController.js`, `contactController.js`.
- [x] Created `routes/`: `userRoutes.js`, `homeRoutes.js`, `aboutRoutes.js`, `companyRoutes.js`, `teamRoutes.js`, `contactRoutes.js`.
- [x] Created `seeds/seedAdmin.js` (super admin: `admin` / `admin123`).
- [x] Created `seeds/seedContent.js` seeding Home, About (About/Mission/Vision/Services sections with the 13 services as items), three starter Companies (Cera Business Enterprise, Excel Forex Bureau, Ehnuteh Sales and Marketing Corporation), empty Team page, and Contact page (address, email, phones from `ehcerex.md`).

### Pending (requires user action / manual verification)
- [ ] Place the Firebase service account JSON at `ehcerex/backend/ehcerex-service-account.json` (referenced by `GOOGLE_APPLICATION_CREDENTIALS` in `.env`).
- [ ] Copy `.env.example` to `.env` and set `SESSION_SECRET` and `GOOGLE_APPLICATION_CREDENTIALS`.
- [ ] Run `npm run seed:all` to populate Firestore.
- [ ] Run `npm run dev` and manually verify each endpoint.

## Folder Structure (to replicate)
```
ehcerex/backend/
  .env
  .gitignore
  config.js
  server.js
  package.json
  ehcerex-service-account.json        (git-ignored)
  middleware/
    authMiddleware.js
    errorMiddleware.js
  models/
    userModel.js
    homeModel.js
    aboutModel.js
    companyModel.js
    teamModel.js
    contactModel.js
  controllers/
    userController.js
    homeController.js
    aboutController.js
    companyController.js
    teamController.js
    contactController.js
  routes/
    userRoutes.js
    homeRoutes.js
    aboutRoutes.js
    companyRoutes.js
    teamRoutes.js
    contactRoutes.js
  seeds/
    seedAdmin.js
    seedContent.js
  utils/
```

## Backend Content Model

### Home (`homeContent` singleton, doc id `main`)
- `heroTitle`
- `heroDescription`
- `heroImage` (Base64 string)
- `bannerImage` (Base64 string) — shared page banner treatment
- `title`
- `description`
- `createdAt`, `updatedAt`

### About (`aboutContent` singleton, doc id `main`)
- `title`
- `description`
- `bannerImage` (Base64 string)
- `sections[]`
  - `key` (stable identifier, e.g. `mission`, `vision`, `ownership`, `services`)
  - `title` (editable section heading)
  - `description` (editable text body)
  - `items[]` (for sections that are lists, e.g. Services)
  - `images[]` (Base64 strings; optional per section)
- `createdAt`, `updatedAt`

Initial sections to seed from `ehcerex.md`:
- `about` / ownership – "100% ownership Josephus Robert Johnson".
- `services` – list with all 13 services from `ehcerex.md` as `items[]`.
- Additional sections (Mission, Vision, etc.) can be added through the CMS; the model supports arbitrary sections.

### Companies (`companies` collection)
Each company = one page accessible via a dropdown menu on the public site.
- `slug`
- `title`
- `description`
- `services[]` (string items)
- `images[]` (Base64 strings)
- `bannerImage` (Base64 string)
- `menuLabel` (defaults to `title` if empty)
- `isPublished`
- `sortOrder`
- `createdAt`, `updatedAt`

Initial companies to seed from `ehcerex.md`:
1. Cera Business Enterprise
2. Excel Forex Bureau
3. Ehnuteh Sales and Marketing Corporation

### Team (`teamContent` singleton + `teamMembers` subcollection or embedded)
Page-level fields:
- `title`
- `description`
- `bannerImage` (Base64 string)
- `members[]`
  - `name`
  - `role`
  - `bio`
  - `image` (Base64 string)
- `createdAt`, `updatedAt`

Decision: start with `members[]` embedded on the singleton to match the About sections pattern; split into a subcollection later only if document size nears Firestore's 1 MB limit.

### Contact (`contactPage` singleton + `contactMessages` collection)
Page-level fields:
- `title`
- `description`
- `bannerImage` (Base64 string)
- `address` (seed: "directly opposite Jacob Town market, Paynesville Japan freeway")
- `email` (seed: `josephusrj@gmail.com`)
- `phones[]` (seed: `0777227888`, `0886888227`)
- `socialLinks[]` (`{ platform, url }`)
- `createdAt`, `updatedAt`

`contactMessages` collection (public form submissions):
- `name`
- `email`
- `subject`
- `message`
- `createdAt`

### Users (`users` collection)
- `username`
- `password` (hashed, same approach as `actsfellowship/backend`)
- `role`
- `isActive`
- `createdAt`, `updatedAt`

## Backend API Surface

### Auth / Users `/api/users`
- `POST /login`
- `POST /logout`
- `GET /me`
- `POST /`
- `GET /`
- `PUT /:id`
- `DELETE /:id`

### Home `/api/home`
- `GET /`
- `PUT /`

### About `/api/about`
- `GET /`
- `PUT /`
- `POST /sections`
- `PUT /sections/:key`
- `DELETE /sections/:key`

### Companies `/api/companies`
- `GET /`
- `POST /`
- `GET /:idOrSlug`
- `PUT /:id`
- `DELETE /:id`
- `DELETE /:id/image/:idx`

### Team `/api/team`
- `GET /`
- `PUT /`
- `POST /members`
- `PUT /members/:id`
- `DELETE /members/:id`

### Contact `/api/contact`
- `GET /`
- `PUT /`
- `POST /messages`
- `GET /messages`

## Public Site Pages (scope reference only — not built in this phase)
- Home (hero section + page banner, title, description)
- About (banner + sections from `aboutContent`)
- Companies dropdown → per-company page (banner, title, description, services, images)
- Team (banner + members)
- Contact (banner + contact info + public form)

Every page has a banner image field. The Home page additionally has a hero image field.

## Constraints / Rules
- Firestore document size limit is **1 MB**; keep Base64 images reasonably sized and cap `images[]` length where practical.
- Mirror `actsfellowship/backend` behavior for session auth, CORS with credentials, and 50 MB JSON body limit to accommodate Base64 uploads.
- Keep route/controller/model separation — no business logic in routes, no direct Firestore access in controllers.
- No frontend work in this phase.

## Next Implementation Steps
1. [x] Update `ehcerex/backend/package.json` scripts and `type` to match `actsfellowship/backend`.
2. [x] Add `.gitignore` and `.env.example` (service account JSON + real `.env` supplied by user).
3. [x] Create `config.js` and `server.js`.
4. [x] Create `middleware/` (error + auth) and `utils/encryption.js`.
5. [x] Create `models/` for Users, Home, About, Companies, Team, Contact.
6. [x] Create matching `controllers/` and `routes/`.
7. [x] Create `seeds/seedAdmin.js` and `seeds/seedContent.js` (seeding About sections, Services list, Contact info, and the three initial companies from `ehcerex.md`).
8. [ ] Manually verify all endpoints before any frontend/CMS work begins.

---

# Frontend Plan

## Frontend Context
- **Location:** `ehcerex/frontend` (Create React App project already scaffolded).
- **Dependencies already installed:** React 19, React Router DOM v7, styled-components, react-icons, react-lazy-load-image-component, react-loader-spinner, testing libraries, react-scripts.
- **Reference Project:** `actsfellowship/frontend` – replicate its folder structure, routing pattern, auth context, API utility, hooks, layouts, and the styled-components + separate style files convention.
- **Design Rule:** Styles must live in separate files from page/component logic using `styled-components`.

## Color Scheme
- **Primary (dominant):** White `#FFFFFF` – most of the site is white backgrounds / cards / surfaces.
- **Secondary (accents):** Gold – used for highlights, buttons, underlines, icon accents, hover states, decorative dividers, section labels. Suggested tokens:
  - `gold: '#C8A951'` (base)
  - `goldLight: '#E6C96A'`
  - `goldDark: '#9C8033'`
- **Tertiary (depth):** Black `#000000` (and soft blacks like `#111111`, `#1A1A1A`) – used for headings, select dark feature bands, footer, navigation text.
- **Supporting neutrals:** `#F7F7F5` (off-white section), `#E9E9E6` (borders), `#555555` (body text muted), `#222222` (body text primary).

## Visual / Styling Direction
- Modern, professional, detailed – "corporate group of companies" feel with flashy-but-tasteful accents.
- Within a single section, vary styling intentionally: headings use a display serif or bold sans at a larger size; subheadings use the gold accent color and smaller tracking-wide uppercase; body text in a different weight/color; eyebrow labels in gold small-caps above titles.
- Use mixed typographic scale within one card: eyebrow + title + subtitle + body + CTA each styled distinctly.
- Use layered visual treatments: subtle gold underlines under headings, gold vertical accent bars, thin gold top-borders on feature cards, numbered bullets with gold circles, offset image blocks with gold frame offsets.
- Use generous whitespace on white surfaces, then punctuate with one dark (near-black) feature band per long page for contrast.
- Hover states: gold underlines, subtle lift shadows, gold-fill transitions on buttons.
- Buttons: primary = black background, white text, gold underline on hover; secondary = transparent with gold border and gold text, fills gold on hover; ghost = underline-only gold text.
- Cards: white background, hairline border `#E9E9E6`, soft shadow on hover, optional 2px top-border in gold for featured cards.
- Images: always rendered from Base64 strings returned by the backend.
- Typography suggestion: headings `Playfair Display` (or `Cormorant Garamond`) serif for flair; body `Inter` or `Segoe UI` sans-serif for clarity.

## Folder Structure (to replicate from `actsfellowship/frontend/src`)
```
ehcerex/frontend/src/
  App.js
  index.js
  App.css / index.css (minimal; reset + font imports)
  components/
    Header.js          (+ styles/Header.styles.js)
    Footer.js
    LoadingSpinner.js
    ImageUploader.js   (base64 file reader for CMS forms)
  contexts/
    AuthContext.js     (session-based auth state via /api/users/me)
  hooks/
    useFetchWithCache.js
  layouts/
    MainLayout.js      (public: Header + <Outlet/> + Footer)
    AdminLayout.js     (admin: sidebar + topbar + <Outlet/>, auth-guarded)
  pages/
    Home.js
    About.js
    CompanyPage.js     (dynamic :slug)
    Team.js
    Contact.js
    styles/            (one .styles.js per page)
      Home.styles.js
      About.styles.js
      CompanyPage.styles.js
      Team.styles.js
      Contact.styles.js
    Admin/
      Login.js
      Dashboard.js
      EditHome.js
      EditAbout.js
      ManageCompanies.js
      EditTeam.js
      EditContact.js
      ManageUsers.js
      styles/          (one .styles.js per admin page)
  styles/
    Theme.js           (color tokens, fonts, breakpoints, shadows, radii)
    GlobalStyles.js    (createGlobalStyle: reset, html/body, fonts, focus)
  utils/
    api.js             (fetch wrapper with credentials: 'include' and JSON handling)
```

## Routing
- **Public (`MainLayout`):**
  - `/` → Home
  - `/about` → About
  - `/companies/:slug` → CompanyPage (data from `GET /api/companies/:idOrSlug`)
  - `/team` → Team
  - `/contact` → Contact
- **Admin (`AdminLayout`, protected):**
  - `/admin/login` → Login (public within admin tree)
  - `/admin` → Dashboard
  - `/admin/home` → EditHome
  - `/admin/about` → EditAbout (manage sections, items, images)
  - `/admin/companies` → ManageCompanies (list + create/edit/delete + per-company images/services)
  - `/admin/team` → EditTeam (members list with per-member image)
  - `/admin/contact` → EditContact (+ view submitted messages)
  - `/admin/users` → ManageUsers (superAdmin only)

## Page Content Mapping (backend → frontend)
- **Home** ← `GET /api/home` → hero section (heroImage, heroTitle, heroDescription), page banner (bannerImage), intro (title, description), companies preview strip (from `/api/companies`), contact CTA band.
- **About** ← `GET /api/about` → banner, title, description, then each `sections[]` entry rendered as its own block with heading, optional items list, optional images. Services section renders the 13 items as a styled numbered/gold-bulleted grid.
- **CompanyPage** ← `GET /api/companies/:slug` → banner, title, description, services list, image gallery.
- **Team** ← `GET /api/team` → banner, title, description, members grid (name, role, bio, image).
- **Contact** ← `GET /api/contact` → banner, title, description, address/email/phones block, form posting to `POST /api/contact/messages`.
- **Header navigation** ← `GET /api/companies` populates the Companies dropdown (published only).

## CMS / Admin Requirements
- Login posts to `POST /api/users/login`; `AuthContext` loads current user via `GET /api/users/me` on mount; logout via `POST /api/users/logout`.
- Admin routes gated by `AuthContext` (redirect to `/admin/login` if unauthenticated).
- Forms provide create/update/delete UIs that map 1:1 to backend endpoints.
- `ImageUploader` component reads files as Base64 data URLs and submits them as strings in JSON payloads (matches backend expectation).
- Support adding/removing images per company, per about-section, per team-member image, and hero/banner images per page.
- Show success / error / loading states consistently (reusable styled form primitives).

## Styling Infrastructure
- `styles/Theme.js` exposes:
  - `colors`: `white`, `offWhite`, `black`, `nearBlack`, `gold`, `goldLight`, `goldDark`, `textPrimary`, `textMuted`, `border`, `danger`, `success`.
  - `fonts`: `heading` (serif display), `body` (sans).
  - `fontSizes`, `fontWeights`, `lineHeights`.
  - `breakpoints`: mobile / tablet / desktop / large.
  - `shadows`: `card`, `cardHover`, `feature`.
  - `radii`: `sm`, `md`, `lg`, `pill`.
  - `spacing` scale.
- `styles/GlobalStyles.js`: CSS reset, body font, link defaults, focus outlines (gold), smooth scroll, selection color.
- Each page has a matching `*.styles.js` file exporting styled components (`PageWrapper`, `Section`, `SectionInner`, `Eyebrow`, `Title`, `Subtitle`, `Body`, `Card`, `Grid`, `CTAButton`, etc.).
- Reusable primitives (Button, Card, SectionHeader, Eyebrow, GoldDivider) live in `components/` with their own styles files.

## Data Flow / API Client
- `utils/api.js` centralizes `fetch` calls: base URL from `REACT_APP_API_URL` (default `http://localhost:5000`), `credentials: 'include'`, JSON headers, throws on non-2xx with parsed message.
- `useFetchWithCache` caches GETs for public pages to avoid refetch on navigation.

## Frontend Implementation Phases

### Phase F1: Foundation
- [x] Create `src/` folder structure (components, contexts, hooks, layouts, pages, pages/styles, pages/Admin, pages/Admin/styles, styles, utils).
- [x] Add `styles/Theme.js` with the white/gold/black palette.
- [x] Add `styles/GlobalStyles.js` (reset, typography, focus, gold selection/focus).
- [x] Wrap app in `ThemeProvider` + `GlobalStyles` in `App.js`.
- [x] Add `utils/api.js` with credentialed fetch helper (in-memory cache instead of localforage).
- [x] Add `contexts/AuthContext.js` (login, logout, me, loading, isAdmin, isSuperAdmin).
- [x] Add `hooks/useFetchWithCache.js`.
- [x] Add `.env` with `REACT_APP_API_URL=http://localhost:5000/api`.

### Phase F2: Layouts + Shared Components
- [x] `components/Header.js` with logo, nav links (Home, About, Companies dropdown from API, Team, Contact), admin CTA. Separate `components/styles/Header.styles.js`.
- [x] `components/Footer.js` with grouped links, contact snippet, gold accents. Separate `components/styles/Footer.styles.js`.
- [x] `components/LoadingSpinner.js` (gold accent).
- [x] `components/ImageUploader.js` (base64, gold hover states).
- [x] `layouts/MainLayout.js` (public shell).
- [x] `layouts/AdminLayout.js` (admin sidebar with gold accent bar, auth-guarded).
- [x] Router setup in `App.js`.

### Phase F3: Public Pages
- [x] `Home.js` consuming `/api/home` + `/api/companies` preview + services grid from `/api/about` services section.
- [x] `About.js` consuming `/api/about` (renders all sections with items and images, alternating light/alt/dark bands).
- [x] `CompanyPage.js` dynamic by slug consuming `/api/companies/:slug` with banner, overview, services grid and image gallery.
- [x] `Team.js` consuming `/api/team` with members grid.
- [x] `Contact.js` consuming `/api/contact` + posting messages to `/api/contact/messages`.
- [x] Responsive layouts handled throughout via theme breakpoints.
- [x] Shared page primitives in `pages/styles/Shared.styles.js` (`PageBanner`, `Eyebrow`, `SectionTitle`, `GoldDivider`, `PrimaryButton`).

### Phase F4: CMS / Admin
- [x] `Admin/Login.js` with gold-accented dark login card.
- [x] `Admin/Dashboard.js` overview with quick-link cards to each editor.
- [x] `Admin/EditHome.js` (hero title/description/image + banner + intro title/description).
- [x] `Admin/EditAbout.js` (page banner + intro + sections CRUD with items and images per section).
- [x] `Admin/ManageCompanies.js` (list + create/edit/delete; slug auto-generation, services, images, banner, publish toggle, sort order).
- [x] `Admin/EditTeam.js` (banner + intro + members CRUD with per-member photo).
- [x] `Admin/EditContact.js` (banner + intro + address/email/phones[] + socialLinks[] + messages table).
- [x] `Admin/ManageUsers.js` (superAdmin only: list, create, activate/deactivate, delete).
- [x] Shared admin form primitives in `pages/Admin/styles/AdminStyles.js` (Panel, FormGrid, FormGroup, SaveBtn, SecondaryBtn, DangerBtn, Toast, Table, SectionCard, ItemPill, ImageStrip, ImageThumb, LoginWrapper, LoginCard).

### Phase F5: Polish & QA
- [ ] Verify every public page against its backend endpoint (manual).
- [ ] Verify every admin CRUD round-trip updates the public site (manual).
- [x] Responsive breakpoints applied across header/footer/layouts and all pages.
- [ ] Accessibility pass (manual check recommended for gold-on-white contrast).
- [ ] Performance: cap per-image size before upload in `ImageUploader` to stay within Firestore 1 MB doc limit (future enhancement).

## Immediate Next Build Priority
1. Scaffold `src/` folder structure and add `Theme.js` + `GlobalStyles.js` with the white/gold/black palette.
2. Wire `ThemeProvider`, `AuthContext`, `api.js`, and router in `App.js`.
3. Build `Header` + `Footer` + `MainLayout` + `AdminLayout`.
4. Implement the public pages against the existing backend endpoints.
5. Implement the CMS editors.
