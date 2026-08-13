import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

export interface ToastData {
  message: string;
  description: string;
  type: 'success' | 'error';
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  private toastSubject = new ReplaySubject<ToastData>(1);

  toast$ = this.toastSubject.asObservable();

  show(message: string, type: 'success' | 'error' = 'success') {
    this.toastSubject.next({ message, type, description: '' });
  }

}
