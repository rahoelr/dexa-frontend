# Dexa Frontend Monorepo Microservice

Dexa Frontend Monorepo adalah repository frontend yang menerapkan
arsitektur **microservice**, di mana setiap aplikasi frontend dikelola
dalam satu monorepo.

## ▶️ Running Application

### 1. Run with NPM (Local Development)

Pastikan Node.js dan NPM sudah terinstall.

``` bash
npm install
npm run dev
```

Aplikasi dapat diakses melalui:

    http://localhost:<port>

------------------------------------------------------------------------

### 2. Run with Docker

Pastikan Docker dan Docker Compose sudah terinstall.

``` bash
docker compose up --build
```

Atau tanpa build ulang:

``` bash
docker compose up
```

Akses aplikasi melalui:

    http://localhost:<port>

------------------------------------------------------------------------

## 🔐 Akun Seeder (Auth Service)

### Admin (Default -- dapat diubah via Environment Variable)

-   Email: `ADMIN_EMAIL` (default: `admin@example.com`)
-   Nama: `ADMIN_NAME` (default: `Admin`)
-   Password: `ADMIN_PASSWORD` (default: `password`)

### Karyawan (EMPLOYEE) Bawaan

-   `employee1@example.com` / password: `password`
-   `employee2@example.com` / password: `password`
-   `employee3@example.com` / password: `password`

> Akun ini hanya digunakan untuk keperluan **development dan testing**.

------------------------------------------------------------------------

## ⏹ Stop Application

``` bash
docker compose down
```
