import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { SupabaseDataService } from '../../../../../../services/supabase-data.service';
import { Subscription } from 'rxjs';
import * as ExcelJS from 'exceljs';
import { AuthService } from '../../../../../../services/auth.service';


@Component({
  selector: 'app-informacion-usuarios',
  templateUrl: './informacion-usuarios.component.html',
  styleUrl: './informacion-usuarios.component.scss',
  standalone: false,
})
export class InformacionUsuariosComponent implements OnInit, OnDestroy{
  supaBaseDataService = inject(AuthService);

  usuarios: any[] = [];
  especialistas: any[] = [];
  administradores: any[] = [];
  pacientes: any[] = [];
  historiasClinicasObtenidas: any[] = [];
  historiaClinicaDetallada: any = {};
  actualizandoDatos: boolean = true;
  subs: Subscription = new Subscription();

  constructor() 
  { 
    this.ObtenerUsuarios(); 
    this.ObtenerHistoriasClinicas();
  }

  ngOnInit(): void 
  {
    setTimeout(() => { 
      this.AsignarUsuarios();
      this.actualizandoDatos = false; 
    }, 2000);
  }


  ngOnDestroy(): void { this.subs.unsubscribe(); }

  async ObtenerHistoriasClinicas(): Promise<void> 
  {
    try {
      const historias = await this.supaBaseDataService.obtenerContenido("historiasclinicas");

      this.historiasClinicasObtenidas = historias.filter(historia =>
        this.usuarios.some(usuario => usuario.dni === historia.dniPaciente)
      );
    } catch (error) {
      console.error("Error al obtener historias clínicas:", error);
      this.historiasClinicasObtenidas = [];
    }
  }

  async ObtenerUsuarios(): Promise<void> 
  {
      this.actualizandoDatos = true;

      try {
        const usuariosObtenidos = await this.supaBaseDataService.obtenerContenido("usuarios");
        this.usuarios = usuariosObtenidos;
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
        this.usuarios = [];
      } finally {
        this.actualizandoDatos = false;
      }
  }

  AsignarUsuarios()
  {
    for(const usuario of this.usuarios)
    {
      if(usuario.rol == "Especialista") { this.especialistas.push(usuario) }
      else if(usuario.rol == "Administrador") { this.administradores.push(usuario) }
      else if(usuario.rol == "Paciente") { this.pacientes.push(usuario) }
    }
  }

  RelacionarHistoriaClinica(dniPaciente: string | number): void
  {
    let historiaAsignada: boolean = false;
    for(const historia of this.historiasClinicasObtenidas)
    {
      if(dniPaciente == historia.dniPaciente) 
      { 
        this.historiaClinicaDetallada = historia;
        historiaAsignada = true; 
      }
    }

    if(!historiaAsignada) { this.historiaClinicaDetallada = {}; }
  }

  async DescargarXlsx(paciente: any)
  {
    const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Datos');

  worksheet.columns = [
    { header: 'Nombre', key: 'nombre', width: 20 },
    { header: 'Apellido', key: 'apellido', width: 20 },
    { header: 'Edad', key: 'edad', width: 10 },
    { header: 'DNI', key: 'dni', width: 20 },
    { header: 'Cantidad de turnos tomados', key: 'cantidadTurnosTomados', width: 30 },
    { header: 'Turnos tomados', key: 'turnosTomados', width: 40 },
    { header: 'Especialistas visitados', key: 'especialistasVisitados', width: 40 }
  ];

  // 🔍 Obtener turnos del paciente
  const turnos = await this.supaBaseDataService.obtenerContenido("turnos");
  const turnosPacienteObtenidos = turnos.filter(t => t.dniPaciente === paciente.dni);

  // 🔍 Obtener todos los usuarios (para buscar los especialistas)
  const usuarios = await this.supaBaseDataService.obtenerContenido("usuarios");

  // 🔁 Relacionar turnos con nombre del especialista
  for (const turno of turnosPacienteObtenidos) {
    const especialista = usuarios.find(u => u.dni === turno.dniEspecialista);
    turno.nombreEspecialista = especialista?.nombre || 'Desconocido';
  }

  // 🧠 Armar strings para el Excel
  let stringFechasTurnosTomados = "";
  let stringEspecialistasVisitados = "";

  for (const turno of turnosPacienteObtenidos) {
    if (!stringFechasTurnosTomados.includes(turno.fecha)) {
      stringFechasTurnosTomados += ` ${turno.fecha},`;
    }

    if (!stringEspecialistasVisitados.includes(turno.nombreEspecialista)) {
      stringEspecialistasVisitados += ` ${turno.nombreEspecialista},`;
    }
  }

  // 📄 Cargar datos
  const data = {
    nombre: paciente.nombre,
    apellido: paciente.apellido,
    edad: paciente.edad,
    dni: paciente.dni,
    cantidadTurnosTomados: turnosPacienteObtenidos.length,
    turnosTomados: stringFechasTurnosTomados,
    especialistasVisitados: stringEspecialistasVisitados
  };

  worksheet.addRow(data);

  worksheet.getRow(1).alignment = { horizontal: "center" };
  worksheet.getRow(2).alignment = { horizontal: "center" };

  // 📥 Descargar el archivo
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `turnos-${paciente.nombre}-${paciente.apellido}.xlsx`;
  a.click();
  window.URL.revokeObjectURL(url);
  }
}
