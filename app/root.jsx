import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useMatches,
} from '@remix-run/react';

import sharedStyles from '~/styles/shared.css';
import Error from './components/util/Error';

export const meta = () => ({
  charset: 'utf-8',
  title: 'RemixExpenses',
  viewport: 'width=device-width,initial-scale=1',
});

function Document({ title, children }) {
  const matches = useMatches();
  const disableJavaScript = matches.some((match) => match.handle?.disableJavaScript);
  return (
    <html lang="en">
      <head>
        {title && <title>{title}</title>}
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        {!disableJavaScript && <Scripts />}
        <LiveReload />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}

export function CatchBoundary() {
  const caughtResponse = useCatch();

  return (
    <Document title={caughtResponse.statusText}>
      <Error title={caughtResponse.statusText}>
        <p>{caughtResponse.data?.message || 'Something went wrong :('}</p>
        <p>
          Back to <Link to="/">Safety</Link>
        </p>
      </Error>
    </Document>
  );
}

export function ErrorBoundary({ error }) {
  return (
    <Document title="An error occured">
      <Error title="An error occured">
        <p>{error.message || 'Something went wrong :('}</p>
        <p>
          Back to <Link to="/">Safety</Link>
        </p>
      </Error>
    </Document>
  );
}

export function links() {
  return [
    // Fonts
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'true' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Rubik:wght@400;700&display=swap' },

    // Styles
    { rel: 'stylesheet', href: sharedStyles },
  ];
}
