import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router';
import { EnquiryProvider } from '../contexts/EnquiryContext';
import { SiteLayout } from '../layouts/SiteLayout';
import { AboutPage } from '../pages/AboutPage';
import { CatalogPage } from '../pages/CatalogPage';
import { CategoriesPage } from '../pages/CategoriesPage';
import { ContactPage } from '../pages/ContactPage';
import { CustomCurtainsPage } from '../pages/CustomCurtainsPage';
import { FabricsPage } from '../pages/FabricsPage';
import { HomePage } from '../pages/HomePage';
import { NotFoundPage, RouteErrorPage } from '../pages/NotFoundPage';
import { ProductPage } from '../pages/ProductPage';

/** The enquiry provider sits inside the router so dialogs can use router links. */
function Root() {
  return (
    <EnquiryProvider>
      <Outlet />
    </EnquiryProvider>
  );
}

const router = createBrowserRouter([
  {
    element: <Root />,
    errorElement: <RouteErrorPage />,
    children: [
      {
        element: <SiteLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: 'catalog', element: <CatalogPage /> },
          { path: 'products/:slug', element: <ProductPage /> },
          { path: 'categories', element: <CategoriesPage /> },
          { path: 'fabrics', element: <FabricsPage /> },
          { path: 'custom-curtains', element: <CustomCurtainsPage /> },
          { path: 'about', element: <AboutPage /> },
          { path: 'contact', element: <ContactPage /> },
          { path: 'showroom', element: <Navigate to="/contact" replace /> },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
