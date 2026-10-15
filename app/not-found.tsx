import Link from "next/link";

export default function NotFound() {
  return (
    <div className="error-page">
      <div className="error-content">
        <p className="error-kicker">404</p>
        <h1>Page not found</h1>
        <p className="error-message">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link className="button button-primary" href="/">
          Back to home
        </Link>
      </div>
    </div>
  );
}
