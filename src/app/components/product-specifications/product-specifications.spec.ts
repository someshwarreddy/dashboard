import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSpecifications } from './product-specifications';

describe('ProductSpecifications', () => {
  let component: ProductSpecifications;
  let fixture: ComponentFixture<ProductSpecifications>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductSpecifications],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductSpecifications);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
