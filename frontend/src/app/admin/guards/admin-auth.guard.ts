import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AdminAuthService } from '../services/admin-auth.service';

export const adminAuthGuard: CanActivateFn = () => {
  const auth = inject(AdminAuthService);
  if (auth.hasValidSession()) return true;
  auth.expireSession();
  return false;
};
