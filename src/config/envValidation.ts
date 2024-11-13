import { z } from 'zod';
import { FileHelper } from 'src/common/file/file.helper';

// Esquema de validación para las variables de entorno
const envSchema = z.object({
  // Variables de Postgres
  POSTGRES_HOST: z.string().min(4),
  POSTGRES_PORT: z.string().transform(Number).pipe(z.number().int().positive()),
  POSTGRES_USERNAME: z.string().min(4),
  POSTGRES_PASSWORD: z.string().min(4),
  POSTGRES_DATABASE: z.string().min(4),

  // Puerto de la aplicación
  PORT: z.string().transform(Number).pipe(z.number().int().positive()),

  // Clave secreta
  SECRET_KEY: z.string().min(6),

  // Rutas de archivos
  FILES_PATH: z.string().refine((path) => FileHelper.existFolder(path), {
    message: 'La ruta FILES_PATH no existe',
  }),
  FILES_LOGS_PATH: z.string().refine((path) => FileHelper.existFolder(path), {
    message: 'La ruta FILES_LOGS_PATH no existe',
  }),
  FILES_PROCESSED_PATH: z
    .string()
    .refine((path) => FileHelper.existFolder(path), {
      message: 'La ruta FILES_PROCESSED_PATH no existe',
    }),
  FILES_UNPROCESSED_PATH: z
    .string()
    .refine((path) => FileHelper.existFolder(path), {
      message: 'La ruta FILES_UNPROCESSED_PATH no existe',
    }),
  TEMP_FILE: z.string().refine((path) => FileHelper.existFolder(path), {
    message: 'La ruta TEMP_FILE no existe',
  }),

  // URL del frontend
  APP_VUE_FRONTEND: z.string().url(),

  // Datos del admin por defecto
  DEFAULT_ADMIN_USER: z.string().min(4),
  DEFAULT_ADMIN_EMAIL: z.string().email(),
  DEFAULT_ADMIN_PASSW: z.string().min(6),

  // Conexión SQLite
  SQLITECONNECT: z.string().min(4),
});

// Tipo inferido de las variables de entorno
type EnvConfig = z.infer<typeof envSchema>;

export function validateEnv(): EnvConfig {
  try {
    // Validar todas las variables de entorno
    const envConfig = envSchema.parse(process.env);

    console.log('✅ Variables de entorno validadas correctamente');
    return envConfig;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Error en la validación de variables de entorno:');
      error.errors.forEach((err) => {
        console.error(`- ${err.path.join('.')}: ${err.message}`);
      });
      process.exit(4);
    }
    throw error;
  }
}
