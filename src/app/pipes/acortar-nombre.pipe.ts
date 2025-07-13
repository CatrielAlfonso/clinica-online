import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'acortarNombre',
  standalone: false,
})
export class AcortarNombrePipe implements PipeTransform {
  transform(value: string): string 
  {
    if (!value) return '';

    if(value.split(" ").length == 2)
    {
      let nombreSeparado = value.split(" ");
      const segundoNombre = nombreSeparado[1];

      return nombreSeparado[0] + " " + segundoNombre.charAt(0).toUpperCase() + ".";
    }
    else { return value; }
  }
}
