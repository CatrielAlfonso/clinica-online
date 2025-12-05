import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'especialidadesArray',
  standalone: false,
})
export class EspecialidadesArrayPipe implements PipeTransform {

  transform(especialidades: string[] | string | undefined): string {
    // Si no hay especialidades, retornar mensaje por defecto
    if (!especialidades) {
      return 'Sin especialidades';
    }

    // Si es un string (formato antiguo), retornarlo directamente
    if (typeof especialidades === 'string') {
      return especialidades;
    }

    // Si es un array, unirlo con comas
    if (Array.isArray(especialidades)) {
      if (especialidades.length === 0) {
        return 'Sin especialidades';
      }
      return especialidades.join(', ');
    }

    return 'Sin especialidades';
  }

}
