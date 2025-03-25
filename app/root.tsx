import {
  data,
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./root.css";
import { Desktop } from "./ui/desktop";
import { WindowProvider } from "./ui/window-provider";
import { mux } from "~/lib/mux.server";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export const loader = async ({}: Route.LoaderArgs) => {
  const CORS_ORIGIN = process.env.CORS_ORIGIN;
  if (!CORS_ORIGIN) {
    console.error("CORS_ORIGIN is required");
    throw Response.json("Server error", {
      status: 500,
    });
  }

  // Create an endpoint for MuxUploader to upload to
  const [upload, videos] = await Promise.all([
    mux.video.uploads.create({
      new_asset_settings: {
        playback_policy: ["public"],
        video_quality: "basic",
      },
      // in production, you'll want to change this origin to your-domain.com
      cors_origin: CORS_ORIGIN,
    }),
    mux.video.assets.list(),
  ]);
  console.log(videos.data);
  return data(
    {
      mux: { id: upload.id, url: upload.url, videos: Array.from(videos.data) },
    },
    { status: 200 }
  );
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <WindowProvider>
          <Desktop>{children}</Desktop>
        </WindowProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main>
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre>
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
