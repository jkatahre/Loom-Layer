import { Link, isRouteErrorResponse, useRouteError } from 'react-router';
import { store } from '../config/store';
import { usePageMeta } from '../hooks/usePageMeta';

export function NotFoundPage() {
  usePageMeta('Page not found');
  return (
    <section className="container-page flex flex-col items-center py-24 text-center">
      <p className="font-display text-[6rem] leading-none text-brand/25">404</p>
      <h1 className="mt-4 text-[2.25rem]">This page has been drawn closed</h1>
      <p className="mt-3 max-w-md text-muted">The page you are looking for doesn’t exist or has moved. Try the catalogue, or search for a fabric or colour.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/catalog" className="btn btn-primary">Browse curtains</Link>
        <Link to="/" className="btn btn-outline">Back to home</Link>
      </div>
      <ul className="mt-10 flex flex-wrap justify-center gap-2">
        {store.navigation.popularSearches.map((s) => (
          <li key={s}><Link to={`/catalog?q=${encodeURIComponent(s)}`} className="chip">{s}</Link></li>
        ))}
      </ul>
    </section>
  );
}

/** Shown if rendering a route throws. Kept dependency-free so it works outside the layout. */
export function RouteErrorPage() {
  const error = useRouteError();
  const message = isRouteErrorResponse(error) ? `${error.status} ${error.statusText}` : error instanceof Error ? error.message : 'Unexpected error';
  return (
    <main className="container-page flex min-h-dvh flex-col items-center justify-center text-center">
      <h1 className="text-[2rem]">Something went wrong</h1>
      <p className="mt-2 max-w-md text-sm text-muted">{message}</p>
      <div className="mt-6 flex gap-3">
        <button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>Reload</button>
        <a href="/" className="btn btn-outline">Home</a>
      </div>
    </main>
  );
}
