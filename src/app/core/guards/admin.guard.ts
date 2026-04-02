import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth2Service } from '../services/fire/auth2.service';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(Auth2Service);
  const router = inject(Router);

  const user = auth.user();
  const role = auth.role();

  if (!user) return false; // not logged

  if (!role) return false; // wait until loaded

  if (role !== 'admin') {
    router.navigate(['/unauthorized']);
    return false;
  }

  return true;
};
