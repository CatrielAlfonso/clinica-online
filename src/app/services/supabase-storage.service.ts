import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../app/environments/environment'; // Ajusta la ruta según tu estructura de carpetas

const supabase = createClient(environment.apiUrl, environment.publicAnonKey);


@Injectable({
  providedIn: 'root'
})
export class SupabaseStorageService {

  constructor() { }

   async subirArchivo(bucket: string, ruta: string, archivo: File): Promise<{ publicUrl?: string, error?: string }> {
    const { error: uploadError } = await supabase.storage.from(bucket).upload(ruta, archivo, {
      upsert: true,
    });

    if (uploadError) {
      console.error('❌ Error al subir imagen:', uploadError.message);
      return { error: uploadError.message };
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(ruta);
    return { publicUrl: data.publicUrl };
  }

    // async ObtenerUrlDescarga(bucket: string, ruta: string): Promise<string | null> 
    // {
      
      
    // }

    /**
   * Sube un archivo al bucket indicado y devuelve su URL pública
   */
  async subirElArchivo(
    bucket: string,
    ruta: string,
    archivo: File
  ): Promise<{ publicUrl?: string; error?: string }> {

    /* 1) ‑‑ Subir (upsert = true para sobrescribir si ya existe) */
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(ruta, archivo, { upsert: true });

    if (uploadError) {
      console.error('❌ Error al subir imagen:', uploadError.message);
      return { error: uploadError.message };
    }

    /* 2) ‑‑ Obtener URL pública */
    const { data } = supabase.storage.from(bucket).getPublicUrl(ruta);
    return { publicUrl: data.publicUrl };
  }

}
