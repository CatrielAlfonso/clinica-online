import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class SupabaseService {

  supabase = inject(AuthService);

  constructor() { }

//   async obtenerUsuarioPorEmail(email: string): Promise<any | null> {
//   const { data, error } = await this.supabase.
//     .from('users')      // tu tabla personalizada, no la auth integrada
//     .select('*')
//     .eq('email', email)
//     .single(); // porque esperás solo un resultado

//   if (error) {
//     console.error(`❌ Error al obtener usuario con email ${email}:`, error.message);
//     return null;
//   }

//   return data;
// }
  

}
