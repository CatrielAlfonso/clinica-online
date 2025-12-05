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

## 🏥 Acerca de la Clínica

**La Clínica OnLine**, especialista en salud, cuenta actualmente con **6 consultorios**, **2 laboratorios físicos** y una **sala de espera general**.

🕒 **Horarios de atención**:
- Lunes a viernes: 08:00 a 19:00
- Sábados: 08:00 a 14:00

👩‍⚕️ En ella trabajan profesionales de **diversas especialidades**, que:
- Ocupan los consultorios según su **disponibilidad**.
- Atienden a pacientes **con turno para consulta o tratamiento**.
- Pueden tener **más de una especialidad**.
- Pueden configurar la **duración mínima del turno** (desde 30 minutos).

📅 Los **turnos se solicitan desde la web**, eligiendo un profesional o una especialidad.

🏢 Además, contamos con un **sector administrativo** responsable de la organización y gestión de la clínica.
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

## 🎬 Turnos - Paciente

<div align="center">
  <img src="https://xgmbvbjnuipnpovwzikt.supabase.co/storage/v1/object/public/imagenes//turnos.jpg" alt="PacientesTurnos" width="720"/>
</div>

---

## 🎬 Turnos - Especialistas

<div align="center">
  <img src="https://xgmbvbjnuipnpovwzikt.supabase.co/storage/v1/object/public/imagenes//turnosE.jpg" alt="EspecialistasTurnos" width="720"/>
</div>

---
## 🎬 Graficos

<div align="center">
  <img src="https://xgmbvbjnuipnpovwzikt.supabase.co/storage/v1/object/public/imagenes//graficos.jpg" alt="EspecialistasTurnos" width="720"/>
</div>

---

## ➕ Agregados 

## SPRINT 1 (31/10/25)

* Botones de Acceso rápido
- Deben ser botones cuadrados con bordes redondeados
- Deben tener la imagen de perfil del usuario
- Deben estar a la derecha del login, uno abajo del otro, 6 usuarios (3 pacientes, 2 especialistas, 1 admin)

* Registro de usuarios
- Al ingresar a la página solo se deben ver 2 imágenes que represente a un paciente o especialista, según esa elección mostrará un formulario correspondiente.
- Estas imágenes deben estar en botones cuadrados con bordes redondeados


## SPRINT 2 (07/11/25)
* Sacar un turno
- Comienza mostrando los PROFESIONALES en botones cuadrados con la imagen del mismo
- Una vez seleccionado mostrará las ESPECIALIDADES, en botones rectangulares, con la imagen de la especialidad. En caso de no tener muestra imagen por default. También debe mostrar el nombre de la especialidad arriba del botón.

- Una vez seleccionada la especialidad, aparecerán los días y horarios con turnos disponibles para ese PROFESIONAL. Estos botones deben ser cuadrados. Formato (2021-09-09 1:15 PM)

## SPRINT 3 (14/11/25)


* Sección Pacientes,
para los especialistas. Solo deberá mostrar los usuarios que el especialista haya atendido al menos 1 vez.
mostrar los usuarios con CARD , con un detalle de CUANDO FUERON LOS ULTIMOS 3 TURNOS de ese paciente, junto con un acceso a su historia clinica

* Sección usuarios
solamente para el perfil Administrador, poder dedscargar un excel general con los datos de todos los
usuarios.
mostrar los usuarios con CARD y al seleccionar un paciente me descarga los datos de que turnos tomo y con quien los tomó, también en excel
Mi perfil
Para los usuarios paciente, poder descargar un pdf con toda su historia clínica. El PDF tiene que tener
logo de la clínica, título del informe y fecha de emisión.
Poder bajar Todas las atenciones que realice segun una ESPECIALIDAD seleccionada

* Animaciones
Se debe agregar al menos 2, como mínimo, animaciones de transición entre componentes al navegar
la aplicación.
Una debe ser de izquierda a derecha

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


