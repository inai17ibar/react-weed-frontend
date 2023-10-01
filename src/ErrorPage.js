import React from "react";

function ErrorPage({ onRetry }) {
    return (
      <div>
        <h1>An error occurred!</h1>
        <button onClick={onRetry}>Retry</button>
      </div>
    );
  }

export default ErrorPage;