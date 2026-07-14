// Per-tab Supabase session isolation.
// By default Supabase persists auth tokens in localStorage, which is shared
// across all tabs of the same origin — meaning only ONE user can be logged in
// per browser. This shim intercepts reads/writes for Supabase auth keys
// (prefix `sb-`) and routes them to sessionStorage instead, so each browser
// tab has its own independent session. A student can be logged in in one tab
// while a teacher/admin is logged in in another tab of the same browser.
//
// Trade-off: closing the tab logs the user out (sessionStorage is per-tab).
// Refreshing the same tab preserves the session.
//
// This file MUST be imported before `@/integrations/supabase/client` so the
// override is in place before the Supabase client reads storage on init.

if (typeof window !== 'undefined') {
  const isSbKey = (key: string) => typeof key === 'string' && key.startsWith('sb-');

  // One-time migration: if a session already lives in localStorage from a
  // previous visit, move it into this tab's sessionStorage so the user isn't
  // suddenly logged out on first load after this change ships.
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && isSbKey(k) && sessionStorage.getItem(k) === null) {
        const v = localStorage.getItem(k);
        if (v !== null) sessionStorage.setItem(k, v);
      }
    }
  } catch { /* storage may be blocked; ignore */ }

  const origGet = Storage.prototype.getItem;
  const origSet = Storage.prototype.setItem;
  const origRemove = Storage.prototype.removeItem;

  Storage.prototype.getItem = function (key: string) {
    if (this === window.localStorage && isSbKey(key)) {
      return origGet.call(window.sessionStorage, key);
    }
    return origGet.call(this, key);
  };
  Storage.prototype.setItem = function (key: string, value: string) {
    if (this === window.localStorage && isSbKey(key)) {
      // Also purge any stale copy in real localStorage so tabs don't diverge.
      origRemove.call(window.localStorage, key);
      return origSet.call(window.sessionStorage, key, value);
    }
    return origSet.call(this, key, value);
  };
  Storage.prototype.removeItem = function (key: string) {
    if (this === window.localStorage && isSbKey(key)) {
      origRemove.call(window.sessionStorage, key);
      return origRemove.call(window.localStorage, key);
    }
    return origRemove.call(this, key);
  };
}

export {};
