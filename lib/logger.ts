/**
 * Centralized Logging Utility
 * 
 * Provides environment-aware logging that:
 * - Logs everything in development
 * - Only logs errors/warnings in production
 * - Supports structured logging for better debugging
 * - Ready for integration with external services (Sentry, LogRocket, etc.)
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

interface LoggerConfig {
  isDevelopment: boolean;
  serviceName: string;
  enabledLevels: LogLevel[];
}

const config: LoggerConfig = {
  isDevelopment: process.env.NODE_ENV !== 'production',
  serviceName: 'legacy-guardians',
  enabledLevels: process.env.NODE_ENV === 'production' 
    ? ['warn', 'error'] 
    : ['debug', 'info', 'warn', 'error'],
};

const levelPriority: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const levelEmojis: Record<LogLevel, string> = {
  debug: '🔍',
  info: '📘',
  warn: '⚠️',
  error: '❌',
};

function shouldLog(level: LogLevel): boolean {
  return config.enabledLevels.includes(level);
}

function formatMessage(level: LogLevel, message: string, context?: LogContext): string {
  const timestamp = new Date().toISOString();
  const emoji = levelEmojis[level];
  
  let formatted = `${emoji} [${timestamp}] [${level.toUpperCase()}] ${message}`;
  
  if (context && Object.keys(context).length > 0) {
    formatted += ` | ${JSON.stringify(context)}`;
  }
  
  return formatted;
}

/**
 * Main logger object with methods for each log level
 */
export const logger = {
  /**
   * Debug level - verbose information for development
   */
  debug(message: string, context?: LogContext): void {
    if (shouldLog('debug')) {
      console.log(formatMessage('debug', message, context));
    }
  },

  /**
   * Info level - general information about application flow
   */
  info(message: string, context?: LogContext): void {
    if (shouldLog('info')) {
      console.log(formatMessage('info', message, context));
    }
  },

  /**
   * Warning level - potential issues that don't break functionality
   */
  warn(message: string, context?: LogContext): void {
    if (shouldLog('warn')) {
      console.warn(formatMessage('warn', message, context));
    }
  },

  /**
   * Error level - errors that need attention
   */
  error(message: string, error?: Error | unknown, context?: LogContext): void {
    if (shouldLog('error')) {
      const errorContext = {
        ...context,
        ...(error instanceof Error ? {
          errorName: error.name,
          errorMessage: error.message,
          stack: config.isDevelopment ? error.stack : undefined,
        } : { error }),
      };
      console.error(formatMessage('error', message, errorContext));
      
      // TODO: Send to external error tracking service in production
      // Example: Sentry.captureException(error);
    }
  },

  /**
   * API logging helper - logs API requests/responses
   */
  api: {
    request(endpoint: string, method: string, context?: LogContext): void {
      logger.debug(`API Request: ${method} ${endpoint}`, context);
    },
    
    response(endpoint: string, status: number, duration?: number, context?: LogContext): void {
      const level: LogLevel = status >= 400 ? 'error' : status >= 300 ? 'warn' : 'debug';
      logger[level](`API Response: ${endpoint} - ${status}`, { ...context, duration });
    },
    
    error(endpoint: string, error: Error | unknown, context?: LogContext): void {
      logger.error(`API Error: ${endpoint}`, error, context);
    },
  },

  /**
   * User action logging helper
   */
  action(action: string, context?: LogContext): void {
    logger.info(`User Action: ${action}`, context);
  },

  /**
   * Performance logging helper
   */
  perf: {
    start(label: string): () => void {
      const startTime = performance.now();
      return () => {
        const duration = performance.now() - startTime;
        logger.debug(`Performance: ${label}`, { durationMs: duration.toFixed(2) });
      };
    },
  },
};

/**
 * Server-side only logger (for API routes)
 * Adds request context automatically
 */
export const serverLogger = {
  ...logger,
  
  withRequest(requestId?: string) {
    return {
      debug: (message: string, context?: LogContext) => 
        logger.debug(message, { ...context, requestId }),
      info: (message: string, context?: LogContext) => 
        logger.info(message, { ...context, requestId }),
      warn: (message: string, context?: LogContext) => 
        logger.warn(message, { ...context, requestId }),
      error: (message: string, error?: Error | unknown, context?: LogContext) => 
        logger.error(message, error, { ...context, requestId }),
    };
  },
};

export default logger;


