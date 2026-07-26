import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { filter, map } from 'rxjs';
import { AuthService } from '../../../features/auth/services/authService/auth.service';

export const authGuard: CanActivateFn = () => {

  const authService = inject(AuthService);
  const router = inject(Router);


  return authService.authReady$.pipe(

    filter(ready => ready),

    map(() => {

      const user = authService.getCurrentUser;


      if (user) {
        return true;
      }
      return router.createUrlTree(['/auth/login']);

    })

  );

};
