import { Injectable, LoggerService, LogLevel } from '@nestjs/common';

// ANSI color codes matching NestJS exactly
// bold: colorIfAllowed((text) => `\x1B[1m${text}\x1B[0m`),
//     green: colorIfAllowed((text) => `\x1B[32m${text}\x1B[39m`),
//     yellow: colorIfAllowed((text) => `\x1B[33m${text}\x1B[39m`),
//     red: colorIfAllowed((text) => `\x1B[31m${text}\x1B[39m`),
//     magentaBright: colorIfAllowed((text) => `\x1B[95m${text}\x1B[39m`),
//     cyanBright: colorIfAllowed((text) => `\x1B[96m${text}\x1B[39m`),
const colors = {
  reset: '\x1B[39m',
  cyan: '\x1B[36m',
  green: '\x1B[32m',
  yellow: '\x1B[33m',
  red: '\x1B[31m',
  magenta: '\x1B[35m',
};

@Injectable()
export class CustomLoggerService implements LoggerService {
  private serviceName: string;

  constructor(serviceName: string) {
    this.serviceName = serviceName;
  }

  private formatMessage(
    level: string,
    message: any,
    context?: string,
    levelColor?: string,
  ): string {
    const timestamp = new Date().toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    const contextStr = context ? ` [${context}]` : '';
    const coloredLevel = levelColor
      ? `${levelColor}${level}${colors.reset}`
      : level;

    const selectServiceColor = (serviceName: string) => {
      switch (serviceName) {
        case 'api-gateway':
          return colors.cyan;
        case 'bets':
          return colors.yellow;
        case 'odds':
          return colors.magenta;
        default:
          return colors.reset;
      }
    };

    return `[${selectServiceColor(this.serviceName)}${this.serviceName}${colors.reset}]  - ${colors.green}${timestamp}${colors.reset}     ${coloredLevel}${colors.yellow}${contextStr}${colors.reset} ${levelColor}${message}${colors.reset}`;
  }

  log(message: any, context?: string): void {
    console.log(this.formatMessage('LOG', message, context, colors.green));
  }

  error(message: any, trace?: string, context?: string): void {
    console.error(this.formatMessage('ERROR', message, context, colors.red));
    if (trace) {
      console.error(trace);
    }
  }

  warn(message: any, context?: string): void {
    console.warn(this.formatMessage('WARN', message, context, colors.yellow));
  }

  debug(message: any, context?: string): void {
    console.debug(
      this.formatMessage('DEBUG', message, context, colors.magenta),
    );
  }

  verbose(message: any, context?: string): void {
    console.log(this.formatMessage('VERBOSE', message, context));
  }

  fatal(message: any, context?: string): void {
    console.error(this.formatMessage('FATAL', message, context, colors.red));
  }

  setLogLevels?(levels: LogLevel[]): void {
    // Implementation for setting log levels if needed
  }
}
