import { CanActivateChildFn } from '@angular/router';

export const authChildGuard: CanActivateChildFn = (childRoute, state) => {
  //  console.log('AUTH CHILD GUARD CALLED');
  // console.log('Child route:', childRoute.routeConfig?.path);
  // console.log('URL:', state.url);
  // return true;
   console.log('AUTH CHILD GUARD CALLED');
  console.log('Child route:', childRoute.routeConfig?.path);

  return false;
};
