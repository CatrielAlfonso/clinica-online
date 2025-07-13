import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatearDni',
  standalone: false,
})
export class FormatearDniPipe implements PipeTransform {

  transform(value: string): string 
  {
    if (value) 
    { 
      let nuevoDni = "";

      if(value.length == 8)
      {
        for (let i = 0; i < value.length; i++) 
        {
          if(i == 2) { nuevoDni = nuevoDni + "." + value.charAt(i); }
          else if(i == 5) { nuevoDni = nuevoDni + "." + value.charAt(i); }
          else { nuevoDni = nuevoDni + value.charAt(i); }
        }
  
        return nuevoDni;
      }
      else if(value.length == 7)
      {
        for (let i = 0; i < value.length; i++) 
        {
          if(i == 1) { nuevoDni = nuevoDni + "." + value.charAt(i); }
          else if(i == 4) { nuevoDni = nuevoDni + "." + value.charAt(i); }
          else { nuevoDni = nuevoDni + value.charAt(i); }
        }
    
        return nuevoDni;
      }
      else if(value.length == 6)
      {
        for (let i = 0; i < value.length; i++) 
        {
          if(i == 3) { nuevoDni = nuevoDni + "." + value.charAt(i); }
          else { nuevoDni = nuevoDni + value.charAt(i); }
        }
    
        return nuevoDni;
      }
    };

    return "Sin datos";
  }

}
