# WEB_PLAN.md — Rencana Website Neraca (Landing + Privacy Policy + Terms)

> Dokumen rencana pembuatan website statis untuk aplikasi **Neraca**.
> Tujuan utama: **verifikasi ke Google** (Google Play Console → production & Google Cloud OAuth consent screen) sambil menjadi halaman publik yang menampilkan review/preview aplikasi.
> Hosting: **GitHub Pages (gratis)** — di-push manual ke repo baru oleh pemilik project.

---

## 1. Tujuan & Persyaratan Google (Requirements)

Website ini harus memenuhi syarat teknis Google sejak awal:

| Kebutuhan Google | Sumber | Konsekuensi untuk website |
|---|---|---|
| URL privacy policy **publik, HTTPS, tanpa login** | [Play Console — App content](https://support.google.com/googleplay/android-developer/answer/9859455) | Hosting GitHub Pages (HTTPS otomatis); tanpa halaman login/members only |
| Privacy policy & homepage **satu domain** | [OAuth sensitive scope verification](https://developers.google.com/identity/protocols/oauth2/production-readiness/sensitive-scope-verification) | Landing + privacy policy + terms berada di website/domain yang sama |
| Privacy policy **konsisten dengan formulir Data safety** di Play Console | Google Play Policy | Konten policy dibuat dari **data flow nyata codebase** (lihat §6), plus tabel pemetaan (§8) |
| Halaman mudah di-crawl reviewer & bot Google | Best practice | HTML statis murni, tanpa SPA framework, tanpa build step |

**Kesimpulan requirements:** website statis HTML + CSS, 6 halaman, tanpa framework, tanpa backend.

---

## 2. Keputusan Teknis (Sudah Dikunci)

- **Teknologi**: HTML + CSS statis murni. **Tanpa** React/Next/Vite/Tailwind build. Alasan: zero-build, tidak ada yang bisa gagal saat deploy, mudah dirawat siapa pun.
- **Bahasa**: **Bilingual EN + ID.**
  - Landing tersedia dua versi (`index.html` = ID, `en/index.html` = EN).
  - Privacy Policy: **EN sebagai versi utama untuk reviewer Google** (`privacy-policy.html`) + versi ID (`privacy-policy-id.html`).
  - Terms: EN (`terms.html`) + ID (`terms-id.html`).
- **Hosting**: pemilik project membuat **repo public baru** (mis. `neraca-web`) secara manual dan push isi folder website ke root repo. (Repo source code app bersifat proprietary — jangan dicampur.)
- **Halaman**: Landing + Privacy Policy + Terms (3 jenis halaman, 6 file HTML).
- **Font**: **Plus Jakarta Sans** via Google Fonts — font yang sama dengan app ([app_colors.dart](../lib/common/app_colors.dart) memakai `GoogleFonts.plusJakartaSansTextTheme`).

---

## 3. Struktur File Website

Target layout **di dalam repo `neraca-web`** (folder website dari repo app ini dipindahkan/salin ke root repo baru):

```text
neraca-web/                     # root repo GitHub Pages
├── index.html                  # Landing page (Bahasa Indonesia)
├── privacy-policy.html         # Privacy Policy (English — untuk reviewer Google)
├── privacy-policy-id.html      # Privacy Policy (Bahasa Indonesia)
├── terms.html                  # Terms of Use (English)
├── terms-id.html               # Terms of Use (Bahasa Indonesia)
├── en/
│   └── index.html              # Landing page (English)
├──404.html                     # Halaman 404 sederhana (opsional, direkomendasikan)
├── styles.css                  # Design system tunggal untuk semua halaman
├── lang-switch.js              # Skrip kecil pemilih bahasa (localStorage, ~15 baris)
└── assets/
    ├── neraca_logo.png         # disalin dari assets/images/ app
    ├── acha_avatar.png         # disalin dari assets/images/ app
    └── screenshots/            # placeholder + slot screenshot asli (lihat §5)
        ├── placeholder-home.svg
        ├── placeholder-statistics.svg
        ├── placeholder-wallets.svg
        ├── placeholder-acha-ai.svg
        ├── placeholder-login.svg
        ├── placeholder-batch-tx.svg
        └── (home.png, statistics.png, dst. — ditaruh pemilik saat sudah ada screenshot asli)
```

**Aturan path (penting untuk GitHub Pages):** semua `href`/`src` harus **relatif** (`styles.css`, `assets/...`, `../styles.css` dari folder `en/`) — bukan absolut (`/styles.css`) — karena situs disajikan di subpath `https://<user>.github.io/<repo>/`, bukan di root domain.

---

## 4. Design System — Satu Tema dengan App

Diambil **persis** dari [`lib/common/app_colors.dart`](../lib/common/app_colors.dart) ("Dark Elegance with Vibrant Accents").

### 4.1 Palet Warna (CSS Variables)

```css
:root {
  /* Core backgrounds & surfaces */
  --bg-dark:            #0B1914;  /* AppColors.bgDark — background utama */
  --surface-dark:       #132720;  /* AppColors.surfaceDark — kartu */
  --surface-highlight:  #1C382E;  /* AppColors.surfaceHighlight — border, chip */
  --surface-light:      #24473B;  /* AppColors.surfaceLight — hover/elevated */

  /* Brand accents */
  --primary:            #A3E635;  /* Neon Lime — aksen utama, link aktif */
  --secondary:          #FACC15;  /* Gold — tombol CTA */
  --emerald:            #10B981;  /* Income / positif */
  --rose:               #F43F5E;  /* Expense / peringatan */
  --cyan:               #38BDF8;  /* AI badge, info */
  --orange:             #FF7A00;  /* Accent, alert */

  /* Typography */
  --text-primary:       #F8FAFC;
  --text-secondary:     #94A3B8;
  --text-muted:         #64748B;
  --text-dark:          #0B1914;  /* teks di atas tombol lime/gold */

  --radius-card: 16px;
  --radius-button: 12px;
  --border-subtle: 1px solid var(--surface-highlight);
}
```

### 4.2 Komponen UI

| Komponen | Spesifikasi |
|---|---|
| Tombol CTA utama | background `--secondary` (#FACC15), teks `--text-dark`, radius 12px |
| Tombol sekunder | background transparan, border `--surface-light`, teks `--text-primary` |
| Kartu fitur | background `--surface-dark`, border subtle, radius 16px, padding 24px |
| Header/nav | sticky, background `--bg-dark` dengan `backdrop-filter: blur`, border-bottom subtle |
| Badge "AI" | background `--cyan` dengan teks gelap, atau outline cyan |
| Footer | background `--surface-dark`, teks `--text-muted` |

### 4.3 Tipografi & Layout

- Font: **Plus Jakarta Sans** (400/600/700/800) via Google Fonts `<link>`.
- Heading hero: 40–56px (mobile → desktop), font-weight 800, `--text-primary`.
- Body: 16–18px, `--text-secondary`, line-height 1.6.
- Container maksimal `1080px`, padding 20–24px.
- Responsive: **mobile-first**; breakpoint 640px (tablet) dan 1024px (desktop).
- Wajib tag `<meta name="viewport" content="width=device-width, initial-scale=1">`.
- Dark mode only (konsisten dengan app yang dark-first) — tidak perlu toggle tema.
- Aksesibilitas: kontras teks putih di atas `#0B1914` lolos WCAG AA; semua `<img>` wajib `alt`; struktur heading berurutan (satu `h1` per halaman).

---

## 5. Placeholder Gambar Screenshot (Kontrak Penamaan)

User meminta **placeholder gambar untuk menampilkan screenshot aplikasi**. Strategi:

1. Setiap slot screenshot diberi **SVG placeholder phone-frame** (rasio **9:19.5**, seperti layar HP) berlatar `--surface-dark` dengan border lime tipis dan tulisan nama layar, sehingga tampilan galeri sudah benar meski screenshot asli belum ada.
2. Di `index.html` / `en/index.html`, tag `<img>` menunjuk ke **PNG dengan nama final**; fallback ke SVG placeholder jika PNG belum ada:

```html
<img src="assets/screenshots/home.png"
     onerror="this.onerror=null; this.src='assets/screenshots/placeholder-home.svg';"
     alt="Tampilan Beranda Neraca" loading="lazy" width="260" height="565">
```

3. **Kontrak penamaan** — saat screenshot asli sudah diambil (resolusi disarankan **1080×2340 PNG**, tanpa watermark), cukup taruh file dengan nama berikut tanpa mengubah HTML:

| File PNG (slot) | Layar app | Placeholder SVG |
|---|---|---|
| `assets/screenshots/home.png` | Beranda (saldo, mutasi) | `placeholder-home.svg` |
| `assets/screenshots/statistics.png` | Statistik + budget kategori | `placeholder-statistics.svg` |
| `assets/screenshots/wallets.png` | Dompet + integrasi Spreadsheet | `placeholder-wallets.svg` |
| `assets/screenshots/acha-ai.png` | Acha AI chat / batch transaction | `placeholder-acha-ai.svg` |
| `assets/screenshots/login.png` | Login / Get Started | `placeholder-login.svg` |
| `assets/screenshots/batch-tx.png` | Batch transaction (hasil parser AI) | `placeholder-batch-tx.svg` |

4. Aset branding yang **sudah ada** di app dan tinggal disalin: `assets/images/neraca_logo.png`, `assets/images/acha_avatar.png` (juga opsional `splash_hero.png` untuk ilustrasi hero/footer).

---

## 6. Struktur Konten Halaman

### 6.1 Landing Page (`index.html` / `en/index.html`)

1. **Header (sticky)** — logo `neraca_logo.png` + wordmark "Neraca", nav: Fitur · Screenshot · Review · Privacy · Terms, tombol bahasa **ID | EN**.
2. **Hero** — logo besar, headline **"Know Where You Stand"**, subheadline: asisten keuangan pribadi dengan Dual-Wallet & AI (Acha AI); CTA "Lihat Fitur" + "Unduh di Google Play" (tautan `#` dulu sampai app live); ilustrasi `splash_hero.png` opsional.
3. **3 Highlight fitur** (kartu ikon): **Harmoni Dua Dompet** (Kas Harian vs Tabungan Impian), **Sync Google Sheets real-time dua arah**, **Acha AI Copilot** (natural language + OCR struk).
4. **Galeri screenshot** — 6 slot phone-frame (§5), grid 2–6 kolom responsif, dengan nama & deskripsi singkat tiap layar.
5. **Review / testimoni** — 3–4 kartu placeholder (bintang 5, kutipan singkat, nama & peran) yang ditandai jelas sebagai contoh — pemilik mengganti dengan review asli. Catatan kecil: jangan memalsukan testimoni jika nanti app dipublikasikan di Play Store (risiko kebijakan Google); opsi aman = tampilkan ringkasan fitur alih-alih testimoni fiktif, atau minta izin tester sungguhan.
6. **Footer** — logo mini, tautan: Privacy Policy (EN), Kebijakan Privasi (ID), Terms, Contact email, © 2026 Dalvero.

### 6.2 Privacy Policy (`privacy-policy.html` EN / `privacy-policy-id.html` ID)

Dibuat dari **data flow nyata codebase Neraca** (bukan template generik) — poin yang **wajib** tercantum:

1. **Intro & identitas app** — nama Neraca, pengembang (Dalvero), tanggal berlaku (*Effective date*), kontak email.
2. **Data yang dikumpulkan**:
   - **Akun**: email, nama, foto profil, UID via **Firebase Authentication** (Google Sign-In / email-password / anonymous untuk Mode Tamu).
   - **Data keuangan**: transaksi, saldo dompet, anggaran kategori, target tabungan — disimpan **lokal di perangkat** (SharedPreferences) dan, untuk pengguna yang mengaktifkan sync, disalin ke **Google Spreadsheet milik pengguna** via Google Sheets API.
   - **Konten AI**: teks transaksi & **foto struk/mutasi** yang diproses **Google Gemini API** untuk parsing & OCR.
   - **Foto profil**: diunggah ke **Cloudinary** (unsigned upload preset `neraca_presets`).
3. **Tujuan pemakaian data** — menjalankan fitur (pembukuan, sinkronisasi, notifikasi budget, AI copilot); tidak untuk iklan.
4. **Pihak ketiga** — tabel: Google (Authentication, Sheets API, Drive API, Gemini API), Firebase (Google LLC), Cloudinary, Google Fonts. Tautkan ke kebijakan masing-masing.
5. **Penyimpanan & keamanan** — data lokal terpartisi per `userId`; sync hanya ke dokumen Google milik pengguna sendiri; token OAuth ditangani oleh SDK Google resmi.
6. **Mode Tamu** — bekerja tanpa akun; data tidak terkirim ke cloud/Sheets kecuali pengguna menautkan akun.
7. **Hak pengguna & penghapusan data** — menghubungi Google Spreadsheet sendiri untuk menghapus data tersinkron; menghapus akun & data lokal via logout/reset aplikasi; kontak pengembang untuk permintaan penghapusan.
8. **Data anak** — aplikasi tidak ditujukan untuk anak di bawah umur.
9. **Perubahan kebijakan** — tanggal pembaruan akan dicantumkan di halaman ini.
10. **Kontak** — email dukungan (diisi pemilik project sebelum launch).

### 6.3 Terms of Use (`terms.html` EN / `terms-id.html` ID)

Ketentuan singkat (±10 pasal): penerimaan ketentuan; deskripsi layanan; **akurasi data keuangan sepenuhnya tanggung jawab pengguna** (app adalah alat pencatat, bukan penasihat finansial berlisensi); akun & keamanan (termasuk Mode Tamu); larangan (reverse-engineering, penyalahgunaan); kepemilikan konten pengguna (transaksi milik pengguna; app & brand milik developer); AI disclaimer (output Acha AI bersifat informatif, verifikasi manual); batas tanggung jawab (*as-is*); perubahan ketentuan; hukum yang berlaku & kontak.

---

## 7. Langkah Deploy GitHub Pages (Checklist untuk Pemilik Project)

1. Buat **repo public baru** di GitHub (mis. `neraca-web`) — jangan pakai repo source app yang proprietary.
2. Salin isi folder website (hasil implementasi rencana ini) ke root repo baru; pastikan `index.html` ada di root.
3. `git add . && git commit -m "Initial website" && git push`.
4. GitHub → **Settings → Pages** → Source: *Deploy from a branch* → Branch: `main` / `(root)` → Save.
5. Tunggu 1–2 menit; situs live di `https://<username>.github.io/<repo>/`.
6. Cek manual: buka URL di incognito (pastikan publik tanpa login), uji tampilan mobile, klik semua tautan nav & footer, cek `privacy-policy.html` terbuka langsung via URL.
7. (Opsional, direkomendasikan) Custom domain (mis. `neraca.dalvero.com`) → tambah file `CNAME` + setting DNS; **disarankan sebelum verifikasi Google** agar URL permanen di Play Console/OAuth tidak perlu diganti nanti.
8. Catatan: jangan pernah menaruh API key (Gemini, dll.) apa pun di file website ini.

---

## 8. Pemetaan ke Formulir Google (Setelah Website Live)

Isi **setelah** URL live & konten final:

| Formulir Google | Isi dengan | Catatan |
|---|---|---|
| Play Console → **App content → Privacy Policy** | URL `.../privacy-policy.html` (opsional: versi ID `.../privacy-policy-id.html`) | HTTPS, publik, tanpa login |
| Play Console → **Data safety** | Ikuti tabel §6.2 (jenis data, tujuan, apakah di-encrypt, bisa minta hapus) | **Wajib konsisten** dengan policy |
| Play Console → Store listing | URL screenshot boleh memakai aset galeri | Setelah app diterima production |
| Google Cloud → **OAuth consent screen** → App homepage | URL landing (`.../` atau `.../en/index.html`) | Domain sama dengan privacy policy |
| Google Cloud → **OAuth consent screen** → Privacy policy link | URL `.../privacy-policy.html` | Domain sama dengan homepage |
| Verifikasi sensitive scope (Drive/Sheets) | Justifikasi per scope + video demo consent screen | Estimasi review 2–6 minggu |

---

## 9. Urutan Implementasi (untuk Agent/Pengembang Berikutnya)

1. Buat `styles.css` dengan design system §4 (CSS variables, reset, komponen dasar).
2. Bangun `index.html` (landing ID) mengikuti struktur §6.1 + placeholder §5.
3. Salin ke `en/index.html` dan terjemahkan konten (tautan lang-switch antar versi).
4. Buat `privacy-policy.html` (EN) mengikuti §6.2 → salin/terjemahkan ke `privacy-policy-id.html`.
5. Buat `terms.html` (EN) mengikuti §6.3 → salin/terjemahkan ke `terms-id.html`.
6. Tambah `lang-switch.js` (opsional, localStorage) + `404.html`.
7. Salin aset branding (`neraca_logo.png`, `acha_avatar.png`) & buat 6 SVG placeholder phone-frame.
8. Self-check: validasi semua link relatif, tampilan 360px/768px/1280px, alt text gambar, tautan Privacy & Terms ada di header/footer setiap halaman.

## 10. Acceptance Criteria

- [ ] `docs/WEB_PLAN.md` ini menjadi satu-satunya artefak dari tahap perencanaan; implementasi website dilakukan di repo terpisah sesuai §3.
- [ ] Website = HTML + CSS statis, **tanpa build step**, path relatif, bisa dibuka langsung via file maupun GitHub Pages.
- [ ] Palet warna memakai hex persis dari `app_colors.dart` (§4.1) — terasa satu tema dengan app.
- [ ] 6 slot screenshot tersedia dengan placeholder phone-frame + kontrak penamaan PNG (§5).
- [ ] Halaman Privacy Policy & Terms tersedia dalam EN dan ID; tautan dari semua halaman.
- [ ] Konten Privacy Policy mencakup seluruh poin data flow nyata (§6.2) tanpa menyertakan kredensial/API key apa pun.
