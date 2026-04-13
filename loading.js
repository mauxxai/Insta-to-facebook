/**
 * InstaBook – Loading Screen (runs at document_start)
 * Covers the raw Instagram DOM with a branded Facebook-style splash
 * until content.js fires 'instabook-ready'. Zero flash guaranteed.
 * Built by mauxx AI (mauxxai.online)
 */
(function () {
  'use strict';

  if (window !== window.top) return;
  if (!location.hostname.includes('instagram.com')) return;

  /* ── 1. INJECT CRITICAL CSS into <html> immediately ── */
  const criticalStyle = document.createElement('style');
  criticalStyle.id = 'ib-critical';
  criticalStyle.textContent = `
    /* Splash overlay — covers everything, max z-index */
    #ib-splash {
      position: fixed;
      inset: 0;
      width: 100%;
      height: 100%;
      background: #3b5998;
      background-image: linear-gradient(160deg, #4a69ad 0%, #3b5998 50%, #2d4373 100%);
      z-index: 2147483647;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-family: "Lucida Grande", "Lucida Sans Unicode", Arial, sans-serif;
      transition: opacity 0.55s ease, visibility 0.55s ease;
      opacity: 1;
      visibility: visible;
      overflow: hidden;
    }

    #ib-splash.ib-fade-out {
      opacity: 0;
      visibility: hidden;
    }

    /* Subtle pattern overlay (old Facebook texture feel) */
    #ib-splash::before {
      content: '';
      position: absolute;
      inset: 0;
      background-image: repeating-linear-gradient(
        45deg,
        rgba(255,255,255,0.015) 0px,
        rgba(255,255,255,0.015) 1px,
        transparent 1px,
        transparent 12px
      );
      pointer-events: none;
    }

    /* Logo area */
    #ib-splash .ib-logo-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      margin-bottom: 32px;
      animation: ib-pop-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
    }

    #ib-splash .ib-logo-f {
      font-family: Georgia, "Times New Roman", serif;
      font-size: 96px;
      font-weight: bold;
      color: white;
      line-height: 1;
      text-shadow: 0 4px 20px rgba(0,0,0,0.35);
      letter-spacing: -4px;
    }

    #ib-splash .ib-logo-name {
      font-family: Georgia, "Times New Roman", serif;
      font-size: 28px;
      font-weight: bold;
      color: white;
      letter-spacing: -0.5px;
      text-shadow: 0 2px 8px rgba(0,0,0,0.3);
    }

    #ib-splash .ib-tagline {
      font-size: 13px;
      color: rgba(255,255,255,0.65);
      letter-spacing: 0.5px;
      margin-top: -4px;
    }

    /* Loading bar container */
    #ib-splash .ib-bar-wrap {
      width: 220px;
      height: 4px;
      background: rgba(255,255,255,0.18);
      border-radius: 2px;
      overflow: hidden;
      margin-bottom: 18px;
      animation: ib-fade-in 0.4s 0.3s ease both;
    }

    #ib-splash .ib-bar-fill {
      height: 100%;
      width: 0%;
      background: white;
      border-radius: 2px;
      box-shadow: 0 0 8px rgba(255,255,255,0.6);
      animation: ib-bar-grow 2.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s forwards;
    }

    /* Status text */
    #ib-splash .ib-status {
      font-size: 12px;
      color: rgba(255,255,255,0.6);
      letter-spacing: 0.3px;
      animation: ib-fade-in 0.4s 0.5s ease both;
    }

    /* Bottom branding */
    #ib-splash .ib-bottom {
      position: absolute;
      bottom: 28px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      animation: ib-fade-in 0.4s 0.6s ease both;
    }

    #ib-splash .ib-bottom .ib-made-by {
      font-size: 11px;
      color: rgba(255,255,255,0.45);
    }

    #ib-splash .ib-bottom .ib-brand {
      font-size: 12px;
      font-weight: bold;
      color: rgba(255,255,255,0.75);
      letter-spacing: 0.5px;
    }

    #ib-splash .ib-mask-badge {
      margin-bottom: 8px;
      font-size: 40px;
      animation: ib-bounce 1.8s 0.8s ease-in-out infinite;
    }

    /* Keyframes */
    @keyframes ib-pop-in {
      from { transform: scale(0.7); opacity: 0; }
      to   { transform: scale(1);   opacity: 1; }
    }

    @keyframes ib-fade-in {
      from { opacity: 0; transform: translateY(6px); }
      to   { opacity: 1; transform: translateY(0);   }
    }

    @keyframes ib-bar-grow {
      0%   { width: 0%; }
      30%  { width: 45%; }
      60%  { width: 72%; }
      85%  { width: 88%; }
      100% { width: 95%; } /* stops just before 100 — completes on ready signal */
    }

    @keyframes ib-bounce {
      0%, 100% { transform: translateY(0);    }
      50%       { transform: translateY(-6px); }
    }

    /* When ready signal fires, snap bar to 100% */
    #ib-splash.ib-completing .ib-bar-fill {
      animation: none !important;
      width: 100% !important;
      transition: width 0.25s ease !important;
    }
  `;
  document.documentElement.appendChild(criticalStyle);

  /* ── 2. STATUS MESSAGES that cycle while loading ── */
  const STATUSES = [
    'Connecting to InstaBook…',
    'Loading your feed…',
    'Fetching friends…',
    'Almost there…',
    'Applying Facebook vibes…',
  ];
  let statusIdx = 0;
  let statusInterval = null;

  /* ── 3. BUILD THE SPLASH ELEMENT ── */
  function buildSplash() {
    const splash = document.createElement('div');
    splash.id = 'ib-splash';
    splash.innerHTML = `
      <div class="ib-logo-wrap">
        <div class="ib-logo-f">f</div>
        <div class="ib-logo-name">InstaBook</div>
        <div class="ib-tagline">Instagram · wearing a Facebook mask 🎭</div>
      </div>
      <div class="ib-bar-wrap">
        <div class="ib-bar-fill" id="ib-bar"></div>
      </div>
      <div class="ib-status" id="ib-status">${STATUSES[0]}</div>
      <div class="ib-bottom">
        <div class="ib-made-by">Built by</div>
        <div class="ib-brand">mauxx AI · mauxxai.online</div>
      </div>
    `;
    return splash;
  }

  /* ── 4. ATTACH SPLASH (as soon as body is available) ── */
  let splash = null;

  function attachSplash() {
    if (splash) return; // already attached
    if (!document.body) return;

    splash = buildSplash();
    document.body.appendChild(splash);

    // Cycle status text
    statusInterval = setInterval(function () {
      statusIdx = (statusIdx + 1) % STATUSES.length;
      const el = document.getElementById('ib-status');
      if (el) el.textContent = STATUSES[statusIdx];
    }, 900);
  }

  // Body might already exist (rare at document_start, but handle it)
  if (document.body) {
    attachSplash();
  } else {
    // Watch for body creation
    const bodyWatcher = new MutationObserver(function () {
      if (document.body) {
        bodyWatcher.disconnect();
        attachSplash();
      }
    });
    bodyWatcher.observe(document.documentElement, { childList: true });
  }

  /* ── 5. DISMISS LOGIC — triggered by content.js ── */
  function dismissSplash() {
    if (statusInterval) clearInterval(statusInterval);

    const el = document.getElementById('ib-splash');
    if (!el) return;

    // Snap bar to 100%
    el.classList.add('ib-completing');
    const statusEl = document.getElementById('ib-status');
    if (statusEl) statusEl.textContent = 'InstaBook ready! 🎉';

    // Short pause then fade out
    setTimeout(function () {
      el.classList.add('ib-fade-out');
      setTimeout(function () {
        el.remove();
        const style = document.getElementById('ib-critical');
        if (style) style.remove();
      }, 580);
    }, 380);
  }

  // Listen for ready signal from content.js
  window.addEventListener('instabook-ready', dismissSplash, { once: true });

  // Absolute fallback — dismiss after 10s no matter what
  setTimeout(function () {
    window.dispatchEvent(new CustomEvent('instabook-ready'));
  }, 10000);

  // Also listen to Instagram's own load events as secondary signal
  window.addEventListener('load', function () {
    // Give content.js 1.5s to fire its signal, then dismiss anyway
    setTimeout(function () {
      window.dispatchEvent(new CustomEvent('instabook-ready'));
    }, 1500);
  });

})();
