import { Component, inject, input, OnInit, output } from '@angular/core';
import { Product } from '../../models/product';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-details',
  imports: [],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss',
})
export class ProductDetails  {
  product = input.required<Product>();
  clear = output<void>();
  edit = output<Product>();


}
