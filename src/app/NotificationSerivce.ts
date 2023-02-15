import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  
  constructor(public snackBar: MatSnackBar) { }

  showSuccess(message: string): void {
    this.snackBar.open(message, 'X', { panelClass: ['success'], duration: 5000 });
  }

  showError(message: string): void {
    this.snackBar.open(message, 'X', { panelClass: ['error'], duration: 5000 });
  }
}
