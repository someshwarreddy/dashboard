import { CanMatchFn } from '@angular/router';

export const newReportsMatchGuard: CanMatchFn = (route, segments) => {
  const newReportsEnabled = true; // Replace with your actual logic to determine if new reports are enabled
 console.log('NEW REPORTS FEATURE FLAG:', newReportsEnabled);
  return newReportsEnabled;
};