// Runs in <head> before first paint. Lives outside any "use client" module so the
// server layout receives the actual string, not a client reference.

export const THEME_KEY = "theme";
export const BOOT_SEEN_KEY = "boot-seen";

// A stored theme choice wins over the OS, so the other theme never flashes.
const theme = `try{var t=localStorage.getItem("${THEME_KEY}");if(t==="light"||t==="dark")d.dataset.theme=t}catch(e){}`;

// "js" lets entrance animations hide their targets early. The boot preloader
// only opens the site from the home page: it is skipped when the visit starts
// anywhere else (so clicking through to Home later never plays it), when it
// already ran this session, or when the Visitor asked for less motion.
const boot = `d.classList.add("js");try{if(location.pathname!=="/"||sessionStorage.getItem("${BOOT_SEEN_KEY}")||matchMedia("(prefers-reduced-motion: reduce)").matches)d.dataset.boot="skip"}catch(e){}`;

export const initScript = `(function(){var d=document.documentElement;${theme}${boot}})()`;
