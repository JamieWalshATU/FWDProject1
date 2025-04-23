import { ErrorHandler, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
// Custom error handler service to log errors and provide a download option, overriding the default Angular error handler.
// Format: TYPE: [TIMESTAMP] MESSAGE
export class ErrorLoggerService implements ErrorHandler {
  private logs: string[] = [];

  handleError(error: any): void {
    // Creates a timestamp for the error log
    const timestamp = new Date().toISOString();
  
    // Handles both object and string errors, which indicate custom and runtime console-thrown errors
    const entry = `#ERROR: [${timestamp}]  ${error?.message || error.toString()}`;
    this.logs.push(entry);
    alert('An error has occurred!: ' + entry);
    alert('A full detailed error log can be viewed in the about section.');
  }

  // Logs a message
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

  // Downloads the logs as a text file
  downloadLogs(): void {
    // Creates a blob from the logs
    const blob = new Blob([this.getLogs()], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'error-log.txt';
    a.click();
    
    // Revokes the object URL to free up memory
    window.URL.revokeObjectURL(url);
  }
}
