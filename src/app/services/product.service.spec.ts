import { TestBed } from '@angular/core/testing';
import {
  provideHttpClient
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { CreateProduct, Product } from '../models/product';
import { firstValueFrom } from 'rxjs';

describe('ProductService', () => {
  let service: ProductService;
  let httpTestingController: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ProductService);
    httpTestingController = TestBed.inject(HttpTestingController);
    afterEach(() => {
      httpTestingController.verify();
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should fetch products and map the API response', () => {
    service.getProducts(2, 10, '').subscribe(result => {
      expect(result.total).toBe(25);

      expect(result.products).toEqual([
        {
          id: 11,
          title: 'Test Phone',
          price: 500,
          image: 'phone.jpg'
        }
      ]);
    });

    const request = httpTestingController.expectOne(
      'https://dummyjson.com/products?limit=10&skip=10'
    );

    expect(request.request.method).toBe('GET');

    request.flush({
      products: [
        {
          id: 11,
          title: 'Test Phone',
          price: 500,
          thumbnail: 'phone.jpg'
        }
      ],
      total: 25,
      skip: 10,
      limit: 10
    });
  });
  it('should fetch products sorted by ascending price', () => {
    service.getProducts(1, 10, 'price-asc').subscribe();

    const request = httpTestingController.expectOne(
      'https://dummyjson.com/products?limit=10&skip=0&sortBy=price&order=asc'
    );

    expect(request.request.method).toBe('GET');

    request.flush({
      products: [],
      total: 0,
      skip: 0,
      limit: 10
    });
  });
  it('should fetch products sorted by descending price', () => {
    service.getProducts(1, 10, 'price-desc').subscribe();

    const request = httpTestingController.expectOne(
      'https://dummyjson.com/products?limit=10&skip=0&sortBy=price&order=desc'
    );

    expect(request.request.method).toBe('GET');

    request.flush({
      products: [],
      total: 0,
      skip: 0,
      limit: 10
    });
  });
  it('should search products and map the API response', () => {
    service.searchProducts('smart phone', 2, 10, '').subscribe(result => {
      expect(result.total).toBe(25);

      expect(result.products).toEqual([
        {
          id: 11,
          title: 'Test Phone',
          price: 500,
          image: 'phone.jpg'
        }
      ]);
    });

    const request = httpTestingController.expectOne(
      'https://dummyjson.com/products/search?q=smart%20phone&limit=10&skip=10'
    );

    expect(request.request.method).toBe('GET');

    request.flush({
      products: [
        {
          id: 11,
          title: 'Test Phone',
          price: 500,
          thumbnail: 'phone.jpg'
        }
      ],
      total: 25,
      skip: 10,
      limit: 10
    });
  });
  it('should search products sorted by ascending price', () => {
    service.searchProducts('phone', 1, 10, 'price-asc').subscribe();

    const request = httpTestingController.expectOne(
      'https://dummyjson.com/products/search?q=phone&limit=10&skip=0&sortBy=price&order=asc'
    );

    expect(request.request.method).toBe('GET');

    request.flush({
      products: [],
      total: 0,
      skip: 0,
      limit: 10
    });
  });
  it('should search products sorted by descending price', () => {
    service.searchProducts('phone', 1, 10, 'price-desc').subscribe();

    const request = httpTestingController.expectOne(
      'https://dummyjson.com/products/search?q=phone&limit=10&skip=0&sortBy=price&order=desc'
    );

    expect(request.request.method).toBe('GET');

    request.flush({
      products: [],
      total: 0,
      skip: 0,
      limit: 10
    });
  });
  it('should fetch a product by ID and map the API response', () => {
    service.getProductById(5).subscribe(result => {
      expect(result).toEqual({
        id: 5,
        title: 'Test Phone',
        price: 500,
        image: 'phone.jpg'
      });
    });

    const request = httpTestingController.expectOne(
      'https://dummyjson.com/products/5'
    );

    expect(request.request.method).toBe('GET');

    request.flush({
      id: 5,
      title: 'Test Phone',
      price: 500,
      thumbnail: 'phone.jpg'
    });
  });
  it('should delete a product by ID', () => {
    service.deleteProduct(5).subscribe();

    const request = httpTestingController.expectOne(
      'https://dummyjson.com/products/5'
    );

    expect(request.request.method).toBe('DELETE');

    request.flush(null);
  });
  it('should update a product using PATCH', () => {
    const product: Product = {
      id: 5,
      title: 'Updated Phone',
      price: 800,
      image: 'phone.jpg'
    };

    service.updateProduct(product).subscribe(result => {
      expect(result).toEqual({
        id: 5,
        title: 'Updated Phone',
        price: 800
      });
    });

    const request = httpTestingController.expectOne(
      'https://dummyjson.com/products/5'
    );

    expect(request.request.method).toBe('PATCH');

    expect(request.request.body).toEqual({
      title: 'Updated Phone',
      price: 800
    });

    request.flush({
      id: 5,
      title: 'Updated Phone',
      price: 800
    });
  });
  it('should replace a product using PUT', () => {
    const product: Product = {
      id: 5,
      title: 'Updated Phone',
      price: 800,
      image: 'phone.jpg'
    };

    service.putProduct(product).subscribe(result => {
      expect(result).toEqual(product);
    });

    const request = httpTestingController.expectOne(
      'https://dummyjson.com/products/5'
    );

    expect(request.request.method).toBe('PUT');

    expect(request.request.body).toEqual(product);

    request.flush(product);
  });
  it('should create a product using FormData', () => {
    const imageFile = new File(['fake image content'], 'phone.jpg', {
      type: 'image/jpeg'
    });

    const product: CreateProduct = {
      title: 'New Phone',
      price: 900,
      image: imageFile
    };

    const mockResponse: Product = {
      id: 101,
      title: 'New Phone',
      price: 900,
      image: 'phone.jpg'
    };

    service.createProduct(product).subscribe(result => {
      expect(result).toEqual(mockResponse);
    });

    const request = httpTestingController.expectOne(
      'https://dummyjson.com/products/add'
    );

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toBeInstanceOf(FormData);

    const formData = request.request.body as FormData;

    expect(formData.get('title')).toBe('New Phone');
    expect(formData.get('price')).toBe('900');
    expect(formData.get('image')).toBe(imageFile);

    request.flush(mockResponse);
  });
  it('should propagate an HTTP error when fetching a product', async () => {
    const resultPromise = firstValueFrom(service.getProductById(5));

    const request = httpTestingController.expectOne(
      'https://dummyjson.com/products/5'
    );

    request.flush(
      { message: 'Server error' },
      { status: 500, statusText: 'Internal Server Error' }
    );

    await expect(resultPromise).rejects.toMatchObject({
      status: 500
    });
  });
  it('should propagate a 404 error when a product is not found', async () => {
    const resultPromise = firstValueFrom(service.getProductById(999));

    const request = httpTestingController.expectOne(
      'https://dummyjson.com/products/999'
    );

    request.flush(
      { message: 'Product not found' },
      { status: 404, statusText: 'Not Found' }
    );

    await expect(resultPromise).rejects.toMatchObject({
      status: 404
    });
  });
  it('should propagate an HTTP error when creating a product', async () => {
    const imageFile = new File(['image content'], 'phone.jpg', {
      type: 'image/jpeg'
    });

    const product: CreateProduct = {
      title: 'New Phone',
      price: 900,
      image: imageFile
    };

    const resultPromise = firstValueFrom(
      service.createProduct(product)
    );

    const request = httpTestingController.expectOne(
      'https://dummyjson.com/products/add'
    );

    expect(request.request.method).toBe('POST');

    request.flush(
      { message: 'Internal Server Error' },
      { status: 500, statusText: 'Internal Server Error' }
    );

    await expect(resultPromise).rejects.toMatchObject({
      status: 500
    });
  });
  it('should propagate an HTTP error when updating a product', async () => {
    const product: Product = {
      id: 5,
      title: 'Updated Phone',
      price: 800,
      image: 'phone.jpg'
    };

    const resultPromise = firstValueFrom(
      service.updateProduct(product)
    );

    const request = httpTestingController.expectOne(
      'https://dummyjson.com/products/5'
    );

    expect(request.request.method).toBe('PATCH');

    request.flush(
      { message: 'Internal Server Error' },
      { status: 500, statusText: 'Internal Server Error' }
    );

    await expect(resultPromise).rejects.toMatchObject({
      status: 500
    });
  });
  it('should propagate an HTTP error when replacing a product', async () => {
    const product: Product = {
      id: 5,
      title: 'Replacement Phone',
      price: 1000,
      image: 'phone.jpg'
    };

    const resultPromise = firstValueFrom(
      service.putProduct(product)
    );

    const request = httpTestingController.expectOne(
      'https://dummyjson.com/products/5'
    );

    expect(request.request.method).toBe('PUT');

    request.flush(
      { message: 'Internal Server Error' },
      { status: 500, statusText: 'Internal Server Error' }
    );

    await expect(resultPromise).rejects.toMatchObject({
      status: 500
    });
  });
  it('should propagate an HTTP error when deleting a product', async () => {
    const resultPromise = firstValueFrom(
      service.deleteProduct(5)
    );

    const request = httpTestingController.expectOne(
      'https://dummyjson.com/products/5'
    );

    expect(request.request.method).toBe('DELETE');

    request.flush(
      { message: 'Internal Server Error' },
      { status: 500, statusText: 'Internal Server Error' }
    );

    await expect(resultPromise).rejects.toMatchObject({
      status: 500
    });
  });
  it('should propagate an HTTP error when fetching products', async () => {
    const resultPromise = firstValueFrom(
      service.getProducts(1, 10, '')
    );

    const request = httpTestingController.expectOne(
      'https://dummyjson.com/products?limit=10&skip=0'
    );

    expect(request.request.method).toBe('GET');

    request.flush(
      { message: 'Internal Server Error' },
      { status: 500, statusText: 'Internal Server Error' }
    );

    await expect(resultPromise).rejects.toMatchObject({
      status: 500
    });
  });
  it('should propagate an HTTP error when searching products', async () => {
    const resultPromise = firstValueFrom(
      service.searchProducts('phone', 1, 10, '')
    );

    const request = httpTestingController.expectOne(
      'https://dummyjson.com/products/search?q=phone&limit=10&skip=0'
    );

    expect(request.request.method).toBe('GET');

    request.flush(
      { message: 'Internal Server Error' },
      { status: 500, statusText: 'Internal Server Error' }
    );

    await expect(resultPromise).rejects.toMatchObject({
      status: 500
    });
  });
  it('should propagate an HTTP error when fetching products', async () => {
    const resultPromise = firstValueFrom(
      service.getProducts(1, 10, '')
    );

    const request = httpTestingController.expectOne(
      'https://dummyjson.com/products?limit=10&skip=0'
    );

    expect(request.request.method).toBe('GET');

    request.flush(
      { message: 'Internal Server Error' },
      { status: 500, statusText: 'Internal Server Error' }
    );

    await expect(resultPromise).rejects.toMatchObject({
      status: 500
    });
  });
  it('should propagate an HTTP error when searching products', async () => {
    const resultPromise = firstValueFrom(
      service.searchProducts('phone', 1, 10, '')
    );

    const request = httpTestingController.expectOne(
      'https://dummyjson.com/products/search?q=phone&limit=10&skip=0'
    );

    expect(request.request.method).toBe('GET');

    request.flush(
      { message: 'Internal Server Error' },
      { status: 500, statusText: 'Internal Server Error' }
    );

    await expect(resultPromise).rejects.toMatchObject({
      status: 500
    });
  });
  
});
