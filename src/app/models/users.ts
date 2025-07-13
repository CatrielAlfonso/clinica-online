export interface UserSupabase {

    id?: string;
    nombre: string;
    apellido: string;
    edad: number;
    email: string;
    password: string;    
    dni: number;
    rol: string;

    // Campos Paciente
    obraSocial?: string;
    aprobado?: boolean;
    imagen1?: string;
    imagen2?: string;

    // Campos por si es un profesional
    especialidades?: string[];
    imagenEspecialista?: string;

    // Campos por si es un administrador
    imagenAdmin?: string;
}
