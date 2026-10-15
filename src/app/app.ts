import { Component, effect, inject, OnInit, } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {  AuthService } from './services/auth';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Store } from '@ngrx/store';
import * as AuthActions from './store/auth.actions';
import * as AuthSelectors from './store/auth.selectors';
import { Navbar } from './components/navbar/navbar';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
//  private authService = inject(AuthService);
//   constructor() {
//   effect(() => {
//     console.log(
//       'Component auth changed:',
//       this.isAuthenticated()
//     );
//   });
// }
private router = inject(Router);
private store = inject(Store);
ngOnInit() {
  this.store.dispatch(AuthActions.restoreAuth());
}
constructor() {
  this.router.events.subscribe(event => {
    // console.log('ROUTER EVENT:', event);
  });
}
// createFormData() {
//   const formData = new FormData();

//   formData.append(
//     'title',
//     this.productForm.value.title ?? ''
//   );

//   formData.append(
//     'price',
//     String(this.productForm.value.price ?? '')
//   );

//   if (this.selectedFile) {
//     formData.append('image', this.selectedFile);
//   }

//   formData.forEach((value, key) => {
//     console.log(key, value);
//   });
// }
//  checkEmail() {
//     this.authService
//       .checkEmail('test@example.com')
//       .subscribe(response => {
//         console.log(response);
//       });
//   }
//   register() {
//   this.authService.register({
//     name: 'John',
//     email: 'john@example.com',
//     password: '123456'
//   }).subscribe(response => {
//     console.log(response);
//   });
// }
// login() {
//   this.authService
//     .login({
//       email: 'john@example.com',
//       password: '123456'
//     })
//     .subscribe(response => {
//       console.log(response);
//        localStorage.setItem('token', response.token);
    
//     });
// }
// isAuthenticated = this.store.selectSignal(
//   AuthSelectors.selectIsAuthenticated
  
// );
// logout() {
//   this.store.dispatch(AuthActions.logout());
// }

// login() {
//   this.store.dispatch(
//     AuthActions.login({
//       email: 'john@example.com',
//       password: '123456'
//     })
//   );
  
// }
  // private http = inject(HttpClient);
// getLoggedInUser() {
//   const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhYjE1NjUwMDRiNGM3Mjg4ODU0ZGE0NSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzkwMDY5NTA3LCJleHAiOjE3OTAxNTU5MDd9.KSw6rPcQOyjH4oIbdSJJ4_QbjwEb0-d-S-eagraIdTQ';

//   const headers = new HttpHeaders({
//     Authorization: `Bearer ${token}`
//   });

//   this.http.get(
//     'http://localhost:5000/api/users/loggedin-user',
//     { headers }
//   ).subscribe(response => {
//     console.log(response);
//   });
// }
onActivate(component: unknown) {
  console.log('🟢 ROUTE ACTIVATED:', component);
}

onDeactivate(component: unknown) {
  console.log('🔴 ROUTE DEACTIVATED:', component);
}
}
