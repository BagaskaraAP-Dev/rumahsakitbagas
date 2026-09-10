# Rumah Sakit Bagas (RS Bagas) — Website Rumah Sakit 3D Interaktif

[![CI](https://github.com/BagaskaraAP-Dev/rumahsakitbagas/actions/workflows/ci.yml/badge.svg)](https://github.com/BagaskaraAP-Dev/rumahsakitbagas/actions/workflows/ci.yml)

Website konsep modern untuk **Rumah Sakit Bagas** yang menggabungkan visualisasi arsitektur gedung 3D interaktif menggunakan Three.js, katalog dokter spesialis, serta alur simulasi pendaftaran janji temu medis secara online.

Dibuat & dikembangkan oleh: **Bagaskara Amukti Palapa** ([@BagaskaraAP-Dev](https://github.com/BagaskaraAP-Dev))

---

## ✨ Fitur Utama

- **🏢 Model Gedung Rumah Sakit 3D**:
  - Dibuat secara prosedural dengan **Three.js** (WebGL).
  - Dilengkapi fitur *orbit controls* (klik & geser dengan mouse / sentuhan), tombol *auto-rotate*, serta tombol *reset view*.
  - Menampilkan gedung utama rawat inap, sayap klinis, taman rooftop, pepohonan, jalan akses, serta miniatur ambulans.
- **👨‍⚕️ Profil Dokter & Poliklinik**:
  - Dokter umum, spesialis jantung, spesialis anak, dan spesialis kandungan.
  - Tab navigasi interaktif untuk melihat jadwal dan profil masing-masing dokter.
- **📅 Simulasi Janji Temu Online**:
  - Pilihan dokter, tanggal kunjungan (hingga 30 hari ke depan), dan slot jam konsultasi (WIB).
  - Validasi input formulir otomatis dan ringkasan konfirmasi reservasi.
- **📱 Desain Modern & Responsif**:
  - Tampilan elegan dengan tema kesehatan yang bersih dan nyaman diakses melalui Desktop maupun smartphone.

---

## 🛠️ Teknologi & Stack

- **Framework**: [Next.js](https://nextjs.org/) & [Vinext](https://github.com/vinext)
- **UI & Styling**: [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/), Lucide Icons
- **3D Graphics**: [Three.js](https://threejs.org/) (OrbitControls, ShadowMap, Procedural Meshes)
- **Language & Tooling**: TypeScript, Oxlint, Oxfmt

---

## 🚀 Cara Menjalankan di Komputer Lokal

1. **Clone repositori**:
   ```bash
   git clone https://github.com/BagaskaraAP-Dev/rumahsakitbagas.git
   cd rumahsakitbagas
   ```

2. **Install dependensi**:
   ```bash
   npm install
   ```

3. **Jalankan server development**:
   ```bash
   npm run dev
   ```

4. **Buka di browser**:
   Kunjungi [http://localhost:3000](http://localhost:3000) untuk melihat website.

---

## 🧪 Pemeriksaan & Testing

GitHub Actions menjalankan tes validasi booking, build produksi, dan pemeriksaan TypeScript pada setiap push atau pull request ke `main`. Hasilnya bisa dilihat lewat badge CI di atas atau tab **Actions**. Workflow menggunakan Node.js 22 dan `npm ci` agar versi dependensi mengikuti lockfile.

`npm run lint` tersedia sebagai pemeriksaan terpisah. Lint belum menjadi syarat CI karena masih ada temuan pada kode yang sudah ada, termasuk komponen UI starter.

- **Cek tipe TypeScript**:
  ```bash
  npm run typecheck
  ```
- **Jalankan Unit Test Simulasi Booking**:
  ```bash
  npm test
  ```
- **Build versi produksi**:
  ```bash
  npm run build
  ```

---

## 📂 Struktur Folder

```text
├── app/
│   ├── layout.tsx         # Metadata & Root Layout
│   ├── page.tsx           # Halaman utama (Hero, Services, 3D Tour)
│   ├── hospital-scene.tsx # Canvas Three.js & Model 3D Gedung
│   ├── care-journey.tsx   # Komponen profil dokter & dialog booking
│   └── globals.css        # Variabel warna & styling global
├── lib/
│   ├── booking.ts         # Data dokter, slot jam, & logika validasi
│   └── utils.ts           # Helper kelas styling
└── tests/
    └── booking.test.ts    # Unit test alur validasi janji temu
```

---

## 📄 Lisensi & Catatan

Proyek ini merupakan purwarupa (konsep website) untuk tujuan pembelajaran dan eksplorasi *vibe coding* 3D web development. Seluruh profil dokter dan jadwal yang ditampilkan merupakan data simulasi.
