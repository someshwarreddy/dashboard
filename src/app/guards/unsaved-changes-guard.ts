import { CanDeactivateFn } from '@angular/router';

export interface CanComponentDeactivate {
  canDeactivate: () => boolean | Promise<boolean>;
}

export const unsavedChangesGuard: CanDeactivateFn<CanComponentDeactivate> = (
  component,
) => {
      console.log('🔥🔥 UNSAVED CHANGES GUARD CALLED');
  console.log('Component:', component);
  return component.canDeactivate();
};