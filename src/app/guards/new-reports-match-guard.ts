import { CanMatchFn } from '@angular/router';
import { environment } from '../../environments/environment';

export const newReportsMatchGuard: CanMatchFn = () => {
  return environment.features.newReports;
};