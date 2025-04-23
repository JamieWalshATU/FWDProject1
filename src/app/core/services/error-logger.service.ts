import { ErrorHandler, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ErrorLoggerService implements ErrorHandler {
  private logs: string[] = [];

  handleError(error: any): void {
    const timestamp = new Date().toISOString();
    const entry = `#ERROR: [${timestamp}]  ${error?.message || error.toString()}`;
    this.logs.push(entry);
    alert('An error has occurred!: ' + entry);
    alert('A full detailed error log can be viewed in the about section.');
  }

  log(msg: string): void {
    const timestamp = new Date().toISOString();
    const entry = `#LOG: [${timestamp}] ${msg}`;
    this.logs.push(entry);
  }

  getLogs(): string {
    return this.logs.join('\n');
  }

  clearLogs(): void {
    this.logs = [];
    this.log('LOGS CLEARED');
    this.log('Session Started!');
  }

  downloadLogs(): void {
    const blob = new Blob([this.getLogs()], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'error-log.txt';
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
