"use client";

export default function Error({error,reset}:{error:Error&{digest?:string};reset:()=>void}) {
  return (
    <div className="error-page">
      <div className="error-content">
        <p className="error-kicker">SYSTEM ERROR</p>
        <h1>Something went wrong</h1>
        <p className="error-message">
          {error.message||"An unexpected error occurred while rendering this page."}
        </p>
        <button className="button button-primary" onClick={reset}>
          Try again
        </button>
      </div>
    </div>
  );
}
