import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../app/environments/environment'; // Ajusta la ruta según tu estructura de carpetas

@Injectable({
  providedIn: 'root'
})
export class SupabaseDataService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.apiUrl, environment.publicAnonKey);
  }

  async obtenerContenido(tabla: string): Promise<any[]> {
    const { data, error } = await this.supabase.from(tabla).select('*');
    if (error) throw error;
    return data || [];
  }

  async guardarContenido(tabla: string, datos: any): Promise<void> {
    const insertar = Array.isArray(datos) ? datos : [datos];
    const { error } = await this.supabase.from(tabla).insert(insertar);
    if (error) throw error;
  }

  async obtenerPorCampo(tabla: string, campo: string, valor: any): Promise<any[]> {
    const { data, error } = await this.supabase.from(tabla).select('*').eq(campo, valor);
    if (error) throw error;
    return data || [];
  }
}