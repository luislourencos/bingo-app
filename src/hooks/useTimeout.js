import { useEffect } from 'react';

// Runs `callback` once, `ms` milliseconds after `active` becomes truthy.
// Re-arms whenever `active` toggles and clears any pending timer on cleanup.
// Used for the auto-dismissing overlays (winner banners, flip, hide...).
export function useTimeout(active, ms, callback) {
  useEffect(() => {
    if (!active) return;
    const timer = setTimeout(callback, ms);
    return () => clearTimeout(timer);
    // Only the trigger matters; the callback is a stable setter call.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, ms]);
}
