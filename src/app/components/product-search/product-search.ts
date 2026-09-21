import { Component, output } from '@angular/core';

@Component({
  selector: 'app-product-search',
  imports: [],
  templateUrl: './product-search.html',
  styleUrl: './product-search.scss',
})
export class ProductSearch {
  search = output<string>();
}
