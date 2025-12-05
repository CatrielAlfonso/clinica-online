import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsignarEstadoPipe } from '../../../pipes/asignar-estado.pipe';
import { CapitalizadorPipe } from '../../../pipes/capitalizador.pipe';
import { FormatearDniPipe } from '../../../pipes/formatear-dni.pipe';
import { AcortarNombrePipe } from '../../../pipes/acortar-nombre.pipe';
import { EspecialidadesArrayPipe } from '../../../pipes/especialidades-array.pipe';
import { ShortEmailPipe } from '../../../pipes/short-email.pipe';
import { CaptchaComponent } from '../administrador/panel-administracion-usuarios/components/captcha/captcha.component';
import { EstadisticasComponent } from '../administrador/panel-administracion-usuarios/components/estadisticas/estadisticas.component';



@NgModule({
  declarations: [
    AsignarEstadoPipe,
    CapitalizadorPipe,
    FormatearDniPipe,
    AcortarNombrePipe,
    EspecialidadesArrayPipe,
    ShortEmailPipe,
  ],
  imports: [
    CommonModule,

  ]
  ,
  exports: [
    CommonModule,
    AsignarEstadoPipe,
    CapitalizadorPipe,
    FormatearDniPipe,
    AcortarNombrePipe,
    EspecialidadesArrayPipe,
    ShortEmailPipe,
  ]
})
export class PipesModule { }
