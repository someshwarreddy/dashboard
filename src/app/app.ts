import { Component, inject, OnInit, } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import * as AuthActions from './store/auth.actions';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
private store = inject(Store);
ngOnInit() {
  this.store.dispatch(AuthActions.restoreAuth());
}

onActivate(component: unknown) {
  console.log('🟢 ROUTE ACTIVATED:', component);
}

onDeactivate(component: unknown) {
  console.log('🔴 ROUTE DEACTIVATED:', component);
}
}
