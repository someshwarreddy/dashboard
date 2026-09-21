import { Component, } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,],
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
