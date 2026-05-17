// Simple demo loader for CapyConnect demo page
// This file intentionally small — the real overlay comes from the extension bundle.
console.log("capy-demo loader initialized");

// If desired, dispatch a message to auto-start captions after a short delay
setTimeout(() => {
  if (window && typeof window === 'object') {
    const ev = { type: 'START_CAPTION_DEMO' };
    window.dispatchEvent(new Event('START_CAPTION_DEMO'));
    console.log('dispatched START_CAPTION_DEMO');
  }
}, 600);
