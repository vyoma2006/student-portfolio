import { lazy } from "react";

// React.lazy() plus a minimum delay (supplementary problem).
// On a fast connection the chunk can arrive in ~20ms, which makes the fallback
// flash on screen for a split second. Holding it for at least `delay` ms
// makes the loading state feel deliberate instead of glitchy.
// (Only affects the FIRST visit to a page; after that the chunk is cached.)
export function lazyWithDelay(importFn, delay = 300) {
    return lazy(() =>
        Promise.all([importFn(), new Promise((resolve) => setTimeout(resolve, delay))]).then(
            ([module]) => module
        )
    );
}