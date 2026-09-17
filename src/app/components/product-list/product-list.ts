import { Component, input, output } from '@angular/core';
import { Product } from '../../models/product';
import { ProductCard } from '../product-card/product-card';
@Component({
  selector: 'app-product-list',
  imports: [ProductCard],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList {
  products = input.required<Product[]>();
productDelete = output<number>();
}
