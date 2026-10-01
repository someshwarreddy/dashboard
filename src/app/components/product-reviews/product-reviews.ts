import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-reviews',
  imports: [],
  templateUrl: './product-reviews.html',
  styleUrl: './product-reviews.scss',
})
export class ProductReviews implements OnInit {
  private route = inject(ActivatedRoute);
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('Product ID:', id);
  }
}
