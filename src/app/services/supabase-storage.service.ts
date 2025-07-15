import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../app/environments/environment'; // Ajusta la ruta según tu estructura de carpetas

const supabase = createClient(environment.apiUrl, environment.publicAnonKey);


@Injectable({
  providedIn: 'root'
})
export class SupabaseStorageService {

  constructor() { }


   /**
   * Devuelve la URL de descarga de un archivo existente.
   * @param bucket Bucket donde está almacenado el archivo.
   * @param path   Ruta interna dentro del bucket.
   * @param privado  `true` ⇒ genera signed‑URL (bucket privado).
   */
  async obtenerUrlDescarga(
      bucket: string,
      path: string,
  ): Promise<string | null> {

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);

    // if () {
    //   console.error("Error al obtener URL pública:", error.message);
    //   return null;
    // }

    return data.publicUrl;
  }

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


   /**
   * Sube un archivo a un bucket y devuelve la URL pública (si el bucket es público).
   *
   * @param bucket       Nombre del bucket (ej. 'usuarios') – se crea
   *                     automáticamente la primera vez si no existe y
   *                     tienes los permisos adecuados.
   * @param path         Ruta interna dentro del bucket (ej. `Pacientes/foo@bar.com/imagen1.jpg`)
   * @param file         Archivo a subir (File o Blob)
   * @param upsert       true ⇒ sobreescribe si ya existe; false ⇒ error si existe.
   */
  async guardarImagen(bucket: string,path: string, file: File,upsert = false ): Promise<void> {

    /* ---------- 1. SUBIR ---------- */
    const { error } = await supabase
      .storage
      .from(bucket)
      .upload(path, file, {
        upsert,                     // sobrescribir si ya existe
        cacheControl: '3600',       // 1 h en caché (opcional)
        contentType: file.type || 'application/octet-stream'
      });

    if (error) {
      console.error('❌ Error al subir archivo:', error.message);
      throw new Error(`Error al subir archivo: ${error.message}`);
    }

    /* ---------- 2. OBTENER URL PÚBLICA ---------- */
    // Si tu bucket está configurado como PRIVATE, en vez de publicUrl
    // tendrás que firmar la URL (signed URL) — ver comentario más abajo.
    // const { publicUrl } = supabase
    //   .storage
    //   .from(bucket)
    //   .getPublicUrl(path);

    // console.log('✅ Archivo subido:', publicUrl);
   
  }

  /* Si tu bucket es privado y quieres una URL temporal: */
  async getSignedUrl(bucket: string, path: string, expiresIn = 60): Promise<string | null> {
    const { data, error } = await supabase
      .storage
      .from(bucket)
      .createSignedUrl(path, expiresIn); // segundos

    if (error) {
      console.error('❌ Error generando signed URL:', error.message);
      return null;
    }
    return data.signedUrl;
  }



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
