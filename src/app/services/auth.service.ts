import { Injectable,inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { createClient, User } from '@supabase/supabase-js';
import { environment } from '../environments/environment';
import { SweetAlertService } from '../services/sweet-alert.service';
import {from, Observable} from 'rxjs';
// import { SupabaseAuthClient} from '@supabase/supabase-js/dist/module/lib/SupabaseAuthClient';
import { UserSupabase } from '../models/users';
import { AuthError } from '@supabase/supabase-js';



export interface authResponse
{
  huboError : boolean;
	mensajeError? : string;
	mensajeExito? : string; 
}

const supabase = createClient(environment.apiUrl, environment.publicAnonKey);

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private router = inject(Router);
  private sweetAlertService = inject(SweetAlertService);

  mensajeError: string = '';
  userLogueado: boolean = false;
  emailUsuario:string= '';


   constructor() {
    supabase.auth.onAuthStateChange((_event, session) => {
    this.userLogueado = !!session;
    console.log('🔄 Cambio de sesión:', session);

    // ver si es administrador
    // this.esAdmin().then(isAdmin => {
    //   this.usuarioAdministrador = isAdmin;
    //   console.log('Usuario es administrador:', this.usuarioAdministrador);
    // });
    // if (!session) {
    //   this.router.navigate(['/login']);
    // }
  });
  }

   // ✅ Guardar datos (uno o varios)
  async guardarContenido(tabla: string, datos: any): Promise<void> {
    const payload = Array.isArray(datos) ? datos : [datos];
    const { error } = await supabase.from(tabla).insert(payload);

    if (error) {
      console.error(`❌ Error guardando datos en ${tabla}:`, error.message);
    } else {
      console.log(`✅ Datos guardados en ${tabla}:`, payload);
    }
  }

  // ✅ Obtener todos los registros
  async obtenerContenido(tabla: string): Promise<any[]> {
    const { data, error } = await supabase.from(tabla).select('*');

    if (error) {
      console.error(`❌ Error obteniendo datos de ${tabla}:`, error.message);
      return [];
    }

    return data;
  }

  obtenerContenidoAsObservable(tabla: string): Observable<any[]> {
  return from(
    supabase
      .from(tabla)
      .select('*')
      .then(({ data, error }) => {
        if (error) throw error;
        return data ?? [];
      })
  );
  }

  // ✅ Obtener ordenado
  async obtenerContenidoOrdenado(tabla: string, campo: string, orden: 'asc' | 'desc'): Promise<any[]> {
    const { data, error } = await supabase.from(tabla).select('*').order(campo, { ascending: orden === 'asc' });

    if (error) {
      console.error(`❌ Error en ordenamiento:`, error.message);
      return [];
    }

    return data;
  }

  // ✅ Obtener usuario por email (tabla: user-data)
  async obtenerUsuarioPorMail(email: string): Promise<any | null> {
    const { data, error } = await supabase
      .from('user-data')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      console.error(`❌ No se encontró usuario con mail ${email}:`, error.message);
      return null;
    }

    return data;
  }

  // ✅ Modificar registro por ID
  async modificarContenido(tabla: string, id: string, nuevosDatos: any): Promise<void> {
    const { error } = await supabase.from(tabla).update(nuevosDatos).eq('id', id);

    if (error) {
      console.error(`❌ Error actualizando registro en ${tabla}:`, error.message);
    } else {
      console.log(`✅ Registro actualizado en ${tabla} con ID ${id}`);
    }
  }

  async GuardarContenido(tabla: string, datos: any): Promise<void> {
    try {
      const registros = Array.isArray(datos) ? datos : [datos];

      const { error } = await supabase.from(tabla).insert(registros);

      if (error) {
        console.error(`❌ Error al guardar datos en la tabla ${tabla}:`, error.message);
      } else {
        console.log(`✅ Datos guardados en la tabla '${tabla}':`, registros);
      }
    } catch (error: any) {
      console.error(`❌ Excepción al guardar en ${tabla}:`, error.message);
    } 
}

  async IniciarSesion(email:string, password:string) : Promise<authResponse>
	{
		const authResponse: authResponse = { huboError: false };

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) 
      {
        authResponse.huboError = true;

        // ⚠️ Manejo de errores por código y nombre
        switch (error.name) {
          case 'AuthApiError':
            if (error.code === 'invalid_login_credentials') {
              authResponse.mensajeError = 'Correo o contraseña incorrectos.';
            } else if (error.code === 'email_not_confirmed') {
              authResponse.mensajeError = 'Debés verificar tu email antes de iniciar sesión.';
            } else {
              authResponse.mensajeError = 'Ocurrió un error de autenticación.';
            }
            break;
          default:
            authResponse.mensajeError = 'Error inesperado: ' + error.message;
        }

        return authResponse;
      }

      // ✅ Usuario logueado con éxito
      console.log('Usuario logueado:', data.user?.email);

      // No uses emailVerified directamente (ya no está disponible como propiedad)
      // Mejor, verificá si el usuario está confirmado en tu lógica de negocio
      authResponse.mensajeExito = 'Inicio de sesión exitoso. Redirigiendo...';
      localStorage.setItem('usuarioLogueado', email);

      return authResponse;
    } catch (error: any) {
      authResponse.huboError = true;
      authResponse.mensajeError = 'Excepción al iniciar sesión: ' + error.message;
      return authResponse;
    }
	}


  async iniciarSesion(email: string, password: string):Promise<{user: User | null, error?: string}>
  {
    
    try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('Error al iniciar sesión:', error.message);
      return { user: null, error: error.message };
    }

    this.userLogueado = true;
    console.log('Usuario logueado:', data.user);

    return { user: data.user, error: undefined };

  } catch (e: any) {
    console.error('Excepción:', e.message);
    return { user: null, error: e.message };
  }

  }

 async registrarUsuario(email: string, password: string, name?: string):Promise<authResponse> {
    await supabase.auth
      .signUp({
        email: email,
        password: password,
        options: {
          data: {
            name: name || '',
            // avatarUrl: avatarUrl || '', // Puedes agregar un avatar si lo tienes
          }}
      })
      .then(({ data, error }) => {
        if (error) {
          //this.mensajeError = error.message;
          //this.sweetAlertService.showAlert('Error', error.message, 'error');
          console.error('Error:', error.message);

          return { huboError: true, mensajeError: error.message };
        }

        const user = data.user;
        if (user) 
        {
          this.sweetAlertService.showAlert(
            'Registro exitoso',
            'Revisá tu correo para confirmar tu cuenta',
            'success'
          );
          this.saveUserData(user, user.user_metadata["name"]); 
        }
        this.mensajeError = '';

        //console.log('Usuario registrado:', data.user);
        //this.sweetAlertService.showAlert ('Éxito', 'Usuario registrado correctamente', 'success');

        

        this.router.navigate(['/login']);
        return { huboError: false, mensajeExito: 'Usuario registrado correctamente' };


      });

    return { huboError: false, mensajeExito: 'Usuario registrado correctamente' };
  }

  async LogOut() {
    supabase.auth.signOut().then(() => {
      this.userLogueado = false;
      //this.avatarUrl = '';
      // Redireccionar o mostrar un mensaje
      //console.log('Usuario deslogueado');
      this.sweetAlertService.showTemporaryAlert('Bye bye!', 'Has cerrado sesión correctamente :)', 'success');
    });
  }

  async cerrarSesion(): Promise<void> 
  {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Error al cerrar sesión:', error.message);
      this.sweetAlertService.showAlert('Error', 'No se pudo cerrar sesión', 'error');
      return;
    }

    this.userLogueado = false;
    this.sweetAlertService.showAlert('Sesión cerrada', 'Has cerrado sesión correctamente', 'success');
    this.router.navigate(['/login']);
  }

  // metodo ppara verificar si el usurio es admin, mail:admin@admin.com
  async esAdmin(): Promise<boolean> {
    const { data } = await supabase.auth.getUser();
    const user = data.user;

    if (!user) {
      return false; // No hay usuario logueado
    }

    // Verificar si el email del usuario es el del admin
    return user.email === 'catrielalfonso77@gmail.com';
  }


  //obtener nombre usuario actual en string
  async getMailUsuario(): Promise<string> {
    

    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) 
    {
      console.warn('⚠️ No hay usuario logueado o hubo un error al obtenerlo.');
      return 'desconocido';
    }

    const email = data.user.email ?? 'desconocido';
    this.emailUsuario = email;

    console.log('📧 Email del usuario:', email);

    return email;
  }

  async getUsuarioActual(): Promise<User | null> {
    const { data } = await supabase.auth.getUser();
    return data.user ?? null;
  }

  // Alternativa reactiva:
  async ObtenerNombreUsuario(): Promise<string> {
    const { data } = await supabase.auth.getUser();
    return data.user?.email || 'desconocido';
  }

  async obtenerSesionActual(): Promise<{ user: User | null }> {
    const { data, error } = await supabase.auth.getSession();

    if (error || !data.session) {
      return { user: null };
    }

    return { user: data.session.user };
  }

  async getUser(userId: string) 
  {
    const { data, error } = await supabase
      .from('user-data')
      .select('*')
      .eq('authId', userId)
      .single();

    if (error) {
      console.error('Error al obtener el usuario:', error.message);
      return null;
    }

    return data;
  }

   async saveUserData(user: any, name?: string) {

      const userData = {
        authId: user.id,
        email: user.email,
        name: name ?? '',
        //avatarUrl: avatarUrl,
      };

      console.log('Intentando guardar en user-data:', userData);
    
      const { data, error } = await supabase.from('user-data').insert([userData]);
      
      if (error) {
        this.mensajeError = 'Error al guardar los datos del usuario: ' + error.message;
        this.sweetAlertService.showAlert('Error', error.message, 'error');
        //console.error('Error:', error.message);
        return;
      }

      this.sweetAlertService.showAlert('Éxito', 'Datos del usuario guardados correctamente', 'success');
      console.log('✅ Datos del usuario guardados correctamente:', data);
      this.router.navigate(['/home']);


      // supabase.from('user-data').insert([userData]).then(({ data, error }) => {
      //   if (error) {
      //     this.mensajeError = 'Error al guardar los datos del usuario: ' + error;
      //     this.sweetAlertService.showAlert('Error', error.message, 'error');
      //     //console.error('Error:', error.message);
      //   } else {
      //     // this.mensajeError = '';
      //     this.sweetAlertService.showAlert('Éxito', 'Datos del usuario guardados correctamente', 'success');
      //     console.log('✅ Datos del usuario guardados correctamente:', data);
      //     this.router.navigate(['/home']);
      //   }
      // });
    }
}
