import { Injectable } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfirmleaveService {

  constructor(private confirmation: ConfirmationService) { }

  confirmLeave(message: string): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.confirmation.confirm({
        message,
        header: 'Confirm Navigation',
        icon: 'pi pi-exclamation-triangle',
        acceptButtonProps: { label: 'Yes', severity: 'secondary', outlined: true },
        rejectButtonProps: { label: 'No' },
        accept: () => {
          observer.next(true);
          observer.complete();
        },
        reject: () => {
          observer.next(false);
          observer.complete();
        }
      });
    });
  }
}
