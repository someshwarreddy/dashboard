import { Routes } from '@angular/router';
import { ProductPage } from './pages/product-page/product-page';
import { ProductDetailsPage } from './pages/product-details-page/product-details-page';
import { ProductFormPage } from './pages/product-form-page/product-form-page';
import { authGuard } from './store/auth.guard';
import { LoginPage } from './pages/login-page/login-page';
import { RegisterPage } from './pages/register-page/register-page';
import { ProductSpecifications } from './components/product-specifications/product-specifications';
import { ProductReviews } from './components/product-reviews/product-reviews';
import { NotFoundPage } from './pages/not-found-page/not-found-page';
import { unsavedChangesGuard } from './guards/unsaved-changes-guard';
import { authChildGuard } from './guards/auth-child-guard';
import { adminMatchGuard } from './guards/admin-match-guard';
import { productResolver } from './resolvers/product.resolver';
import { NotificationSidebar } from './components/notification-sidebar/notification-sidebar';
import { DashboardLayout } from './layout/dashboard-layout/dashboard-layout';
import { OrdersPage } from './features/orders/orders-page/orders-page';
// export const routes: Routes = [
//   {
//     path: '',
//     redirectTo: 'products',
//     pathMatch: 'full'
//   },
//   {
//     path: 'login',
//     component: LoginPage
//   },
//   {
//     path: 'register',
//     component: RegisterPage
//   },
//   {
//     path: 'products',
//     component: ProductPage,
//     canActivate: [authGuard],
//     data: {
//       title: 'Products',
//       section: 'Product Management'
//     }
//   },
//   {
//     path: 'products/new',
//     component: ProductFormPage,
//     canActivate: [authGuard],
//     canDeactivate: [unsavedChangesGuard]
//   },
//   {
//     path: 'products/:id/edit',
//     component: ProductFormPage,
//     canActivate: [authGuard],
//     canDeactivate: [unsavedChangesGuard]
//   },
//   {
//     path: 'products/:id',
//     component: ProductDetailsPage,
//     canActivate: [authGuard],
//     canActivateChild: [authChildGuard],
//     resolve: {
//       product: productResolver
//     },
//     data: {
//       title: 'Product Details'
//     },
//     children: [
//       {
//         path: 'reviews',
//         component: ProductReviews
//       },
//       {
//         path: 'specifications',
//         component: ProductSpecifications
//       }
//     ],

//   },
//   // {
//   //   path: 'admin',
//   //   canMatch: [adminMatchGuard],
//   //     canActivate: [authGuard],
//   //   loadChildren: () =>
//   //     import('./admin/admin.routes')
//   //       .then(m => m.ADMIN_ROUTES)
//   // },
//   {
//     path: 'admin',
//     canActivate: [authGuard],
//     children: [
//       {
//         path: '',
//         canMatch: [adminMatchGuard],
//         loadChildren: () =>
//           import('./admin/admin.routes')
//             .then(m => m.ADMIN_ROUTES)
//       }
//     ]
//   },
//   {
//     path: 'notifications',
//     component: NotificationSidebar,
//     outlet: 'sidebar'
//   },
//   {
//     path: '**',
//     component: NotFoundPage
//   }
// ];
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full'
  },

  // Authentication pages remain outside the dashboard layout.
  {
    path: 'login',
    component: LoginPage
  },
  {
    path: 'register',
    component: RegisterPage
  },

  // Shared dashboard shell.
  {
    path: '',
    component: DashboardLayout,
    children: [
      {
        path: 'products',
        component: ProductPage,
        canActivate: [authGuard],
        data: {
          title: 'Products',
          section: 'Product Management'
        }
      },
      {
        path: 'products/new',
        component: ProductFormPage,
        canActivate: [authGuard],
        canDeactivate: [unsavedChangesGuard]
      },
      {
        path: 'products/:id/edit',
        component: ProductFormPage,
        canActivate: [authGuard],
        canDeactivate: [unsavedChangesGuard]
      },
      {
        path: 'products/:id',
        component: ProductDetailsPage,
        canActivate: [authGuard],
        canActivateChild: [authChildGuard],
        resolve: {
          product: productResolver
        },
        data: {
          title: 'Product Details'
        },
        children: [
          {
            path: 'reviews',
            component: ProductReviews
          },
          {
            path: 'specifications',
            component: ProductSpecifications
          }
        ]
      },
      {
        path: 'orders',
        component: OrdersPage
      },
      {
        path: 'admin',
        canActivate: [authGuard],
        children: [
          {
            path: '',
            canMatch: [adminMatchGuard],
            loadChildren: () =>
              import('./admin/admin.routes')
                .then(m => m.ADMIN_ROUTES)
          }
        ]
      },

    ]
  },

  // Keep the named outlet at the application root.
  {
    path: 'notifications',
    component: NotificationSidebar,
    outlet: 'sidebar'
  },

  {
    path: '**',
    component: NotFoundPage
  }
];