interface Env {
  DB_HOST: string;
  DB_PORT: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
}

export function loadEnv(): Env {
  const env = import.meta.env;

  return {
    DB_HOST: env.VITE_DB_HOST || '',
    DB_PORT: env.VITE_DB_PORT || '3306',
    DB_USER: env.VITE_DB_USER || '',
    DB_PASSWORD: env.VITE_DB_PASSWORD || '',
    DB_NAME: env.VITE_DB_NAME || ''
  };
}