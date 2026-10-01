import { CanDeactivateFn } from '@angular/router';

export interface CanComponentDeactivate {
  canDeactivate(): boolean;
}

export const unsavedChangesGuard: CanDeactivateFn<CanComponentDeactivate> = (
  component,
  currentRoute,
  currentState,
  nextState,
) => {
    console.log('GUARD CALLED');
  return component.canDeactivate();
};