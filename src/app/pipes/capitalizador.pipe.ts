import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalizador',
  standalone: false,
})
export class CapitalizadorPipe implements PipeTransform {
  transform(value: string): string 
  {
    if (!value) return '';

    return value.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }
}
