export default function Loading() {
  return (
    <div className="loading-page" aria-live="polite" aria-busy="true">
      <div className="loading-spinner" aria-hidden="true" />
      <p className="sr-only">Loading…</p>
    </div>
  );
}
