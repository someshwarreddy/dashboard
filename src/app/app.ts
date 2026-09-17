import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import * as ProductActions from './store/product.actions';
import * as ProductSelectors from './store/product.selectors';
import { Product } from './models/product';
import { FormBuilder } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductPage } from './pages/product-page/product-page';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet ,ProductPage, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {

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

}
