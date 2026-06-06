# NoLimit Backend Engineer Test - REST API

Halo! Ini adalah *source code* hasil pengerjaan *technical test* saya untuk posisi **Backend Engineer** di NoLimit. Di sini saya membangun sebuah REST API sederhana untuk memanajemen *Blog Post*, yang sudah dilengkapi dengan sistem autentikasi pengguna menggunakan JWT (JSON Web Token).

## 🛠️ Tech Stack yang Digunakan

* **Runtime & Framework:** Node.js + Express.js
* **Database & ORM:** MySQL + Sequelize
* **Keamanan:** JSON Web Token (JWT) & bcryptjs (untuk *hashing password*)
* **Testing:** Jest & Supertest

---

## 🏛️ Gimana Sih Cara Kerja Aplikasinya?

Secara garis besar, aplikasi ini memisahkan antara *routing*, *middleware* (untuk keamanan), dan interaksi database agar kodenya lebih rapi dan mudah di-*maintain*.

1. **Relasi Database:** Ada dua entitas utama di sini, yaitu `User` dan `Post`. Relasinya adalah **One-to-Many**. Artinya, satu *User* bisa menulis banyak *Post*, dan setiap *Post* akan menyimpan `authorId` sebagai penanda siapa penulis aslinya.
2. **Alur Keamanan (Auth Flow):** Kalau ada *request* masuk ke *endpoint* yang sensitif (seperti bikin artikel, edit, atau hapus), *middleware* akan mencegat *request* tersebut untuk mengecek token JWT-nya. 
3. **Validasi Ekstra:** Khusus untuk fitur *Update* dan *Delete*, sistem tidak hanya mengecek apakah *user* sudah login, tapi juga memastikan apakah *user* tersebut adalah pembuat asli dari artikel yang ingin diedit/dihapus. Kalau bukan, akses otomatis ditolak!.

---

## 🚀 Cara Menjalankan Project di Komputer Lokal

Pastikan komputer kamu sudah terinstal **Node.js** dan **MySQL** ya. Setelah itu, ikuti langkah-langkah simpel ini:

1. Dapatkan Source Code
Silakan *clone* (atau *pull* jika sudah ada) repositori ini ke komputer lokal kamu:
```bash
git clone <url-repo-kamu>
cd nolimit-backend-test

2. WAJIB: Install Dependencies
Apakah bisa langsung di-run setelah di-pull? Belum bisa. Karena ukuran library sangat besar, folder node_modules tidak ikut di-upload ke GitHub. Jadi, kamu harus mengunduh library-nya terlebih dahulu dengan menjalankan perintah ini di terminal:

Bash
npm install
3. Siapkan Database
Buka MySQL (bisa lewat CLI atau tools seperti phpMyAdmin), lalu buat satu database baru bernama nolimit_blog:

SQL
CREATE DATABASE nolimit_blog;
4. Setup Environment Variables
Buat satu file baru bernama .env di dalam folder project ini (sejajar dengan file server.js). Lalu, copy-paste konfigurasi berikut ke dalamnya:

Cuplikan kode
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=nolimit_blog
JWT_SECRET=rahasia_super_aman_untuk_nolimit_123
(Catatan: Kosongkan DB_PASS jika MySQL kamu tidak memakai password. Sesuaikan dengan settingan lokalmu).

5. Jalankan Server!
Sekarang aplikasinya sudah siap dijalankan. Ketik perintah ini di terminal:

Bash
node server.js

Cara 2: Automated Unit Test (Poin Plus)
Saya juga menyiapkan Unit Test otomatis untuk menguji fitur autentikasi (Register dan Login) menggunakan Jest. Kamu nggak perlu buka Postman, cukup jalankan perintah ini di terminal baru:

Bash
npm run test
