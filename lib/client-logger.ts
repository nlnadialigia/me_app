type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export function logClient(level: LogLevel, message: string, meta?: any) {
  try {
    // fire-and-forget to server-side logs
    fetch('/api/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ level, message, meta }),
    }).catch(() => { });
  } catch (e) {
    // ignore
  }

  // Local console output for developer UX
  if (level === 'error') console.error(message, meta);
  else if (level === 'warn') console.warn(message, meta);
  else console.log(message, meta);
}

export const clientLogger = {
  debug: (m: string, meta?: any) => logClient('debug', m, meta),
  info: (m: string, meta?: any) => logClient('info', m, meta),
  warn: (m: string, meta?: any) => logClient('warn', m, meta),
  error: (m: string, meta?: any) => logClient('error', m, meta),
};
