const requiredEnvVars = ['VITE_API_URL'] as const;

export function validateEnv(): void {
  const missing = requiredEnvVars.filter(key => !import.meta.env[key]);
  if (missing.length > 0) {
    console.error(`[Env] Missing required environment variables: ${missing.join(', ')}`);
    throw new Error(`Missing environment variables: ${missing.join(', ')}`);
  }
}

export function getEnv(key: string): string {
  return import.meta.env[key] as string;
}

export function getEnvOptional(key: string): string | undefined {
  return import.meta.env[key] as string | undefined;
}