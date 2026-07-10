import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@/index.css";
import App from "@/App";

// Refreshing with a section anchor in the URL (#signup, #pricing...) makes
// the browser scroll deep into the page once that section renders. Strip
// plain section anchors before React mounts so every page load starts at
// the top. Route-like hashes (#resources, #dashboard, #worksheets?... )
// are left untouched.
const SECTION_ANCHORS = ["top", "features", "how", "try", "faq", "pricing", "signup", "subjects", "testimonials"];
if (SECTION_ANCHORS.includes(window.location.hash.slice(1))) {
  window.history.replaceState(null, "", window.location.pathname + window.location.search);
}
if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
);
