import { Signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { AuthService } from '../../services/auth';


export function createEmailAvailabilityResource(authService: AuthService) {
  return (email: Signal<string | undefined>) =>
    rxResource({
      params: () => email(),

      stream: ({ params }) =>
        authService.checkEmail(params)
    });
}