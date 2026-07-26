import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../../features/auth/services/authService/auth.service';
import {filter, map} from 'rxjs';


export const guestGuard: CanActivateFn = () => {

  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.authReady$.pipe(

    filter(ready => {
      return ready;
    }),
    map(() => {
      if (authService.getCurrentUser) {
        return router.createUrlTree(['/']);
      }
      return true;
    })
  );

};
