import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { filter, map } from 'rxjs';
import { AuthService } from '../../../features/auth/services/authService/auth.service';

export const emailVerificationGuard: CanActivateFn = () => {

  const authService = inject(AuthService);
  const router = inject(Router);


  return authService.authReady$.pipe(

    filter(ready => ready),

    map(() => {

      const user = authService.getCurrentUser;


      if (!user) {
        // Not logged in
        return router.createUrlTree(['/auth/login']);
      }


      if (user.emailVerified) {
        // Already verified
        return router.createUrlTree(['/']);
      }

      // Logged in but email not verified
      return true;

    })

  );

};
