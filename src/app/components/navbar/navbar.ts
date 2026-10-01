import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import * as AuthSelectors from '../../store/auth.selectors';
import { RouterLink, RouterLinkActive } from '@angular/router';
import * as AuthActions from '../../store/auth.actions';
@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
   private store = inject(Store);

  isAuthenticated = this.store.selectSignal(
    AuthSelectors.selectIsAuthenticated
  );
  user = this.store.selectSignal(
  AuthSelectors.selectUser
);
    logout() {
    this.store.dispatch(
      AuthActions.logout()
    );
  }
}
