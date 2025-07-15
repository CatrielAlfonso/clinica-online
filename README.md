<!--  ──────────────────────────────────────────────────────────────────────────────
     ClinicaOnline · README
──────────────────────────────────────────────────────────────────────────────── -->
<h1 align="center">
  <img src="https://xgmbvbjnuipnpovwzikt.supabase.co/storage/v1/object/public/imagenes//gatito.png" height="80" alt="Logo de la clínica"/>
  <br/>
  ClíniCat&nbsp;Online
</h1>

<p align="center">
  <em>Turnos 100 % web · Pacientes · Especialistas · Administración</em>
</p>

<p align="center">
  <a href="https://angular.dev"><img src="https://img.shields.io/badge/Angular-19.x‑20.x-c3002f?logo=angular&logoColor=white"/></a>
  <a href="https://supabase.com"><img src="https://img.shields.io/badge/Supabase-Edge%20Functions‑Storage‑Realtime‑Auth-3ecf8e?logo=supabase&logoColor=white"/></a>
  <img src="https://img.shields.io/github/license/tu‑usuario/ClinicaOnline"/>
  <img src="https://img.shields.io/github/actions/workflow/status/tu‑usuario/ClinicaOnline/deploy.yml?label=CI/CD"/>
</p>

---

## 📑 Tabla de contenidos
1. [Demo](#demo)
2. [Características](#características)
3. [Instalación rápida](#instalación-rápida)
4. [Estructura de carpetas](#estructura-de-carpetas)
5. [Comandos útiles](#comandos-útiles)
6. [Integración Supabase](#integración-supabase)
7. [Capturas](#capturas)
8. [Contribuir](#contribuir)
9. [Licencia](#licencia)

---

## 🎬 Bienvenida

<div align="center">
  <img src="https://xgmbvbjnuipnpovwzikt.supabase.co/storage/v1/object/public/imagenes//bienvenida.jpg" alt="Bienvenida" width="720"/>
</div>

---

## 🎬 Registros

<div align="center">
  <img src="https://xgmbvbjnuipnpovwzikt.supabase.co/storage/v1/object/public/imagenes//registros.jpg" alt="Registros" width="720"/>
</div>

---
## 🎬 Admin

<div align="center">
  <img src="https://xgmbvbjnuipnpovwzikt.supabase.co/storage/v1/object/public/imagenes//admin.jpg" alt="Admin" width="720"/>
</div>

---



## ✨ Características

| Módulo | Descripción |
|--------|-------------|
| **Pacientes** | Registro, verificación de e‑mail, carga de imágenes, turnos, encuestas, historia clínica PDF. |
| **Especialistas** | Panel “Mis pacientes”, aprobación de turnos, ficha médica, valoración de consultas. |
| **Administrador** | Habilitar/inhabilitar usuarios, ver dashboards de actividad y estadísticas diarias. |
| **Auth** | Supabase Auth · Magic‑Link · Roles (`Paciente`, `Especialista`, `Admin`). |
| **Storage** | Subida/descarga de imágenes a Buckets Supabase (drag & drop + progreso). |
| **Rendimiento** | Lazy‑Loading de módulos, PWA Ready, build optimizado (< 400 kB transfer). |
| **Accesibilidad** | i18n listo, temas claro/oscuro y fuente de alta legibilidad. |

---

## ⚡ Instalación rápida

```bash
git clone https://github.com/tu‑usuario/ClinicaOnline.git
cd ClinicaOnline

# 1️⃣ Instalar dependencias
npm ci        # o npm install --legacy-peer-deps

# 2️⃣ Variables de entorno (API keys Supabase)
cp .env.example .env             # completa url y anonKey

# 3️⃣ Servidor de desarrollo
npm start    # abre http://localhost:4200
