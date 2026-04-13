/**
 * InstaBook – Instagram to Facebook UI Transformer (v2 – clean build)
 * No double logos. Fires 'instabook-ready' to dismiss loading screen.
 * Built by mauxx AI (mauxxai.online)
 * GitHub: github.com/mauxxai/Insta-to-Facebook
 */
(function () {
  'use strict';

  // ── Guards ──
  if (window !== window.top) return;
  if (!location.hostname.includes('instagram.com')) return;

  /* ══════════════════════════════════════════════════════════
     HELPERS
  ══════════════════════════════════════════════════════════ */
  const q  = (s) => document.querySelector(s);
  const qa = (s) => [...document.querySelectorAll(s)];

  /* ══════════════════════════════════════════════════════════
     1. INJECT FACEBOOK-STYLE TOP NAVIGATION BAR
     (single source of truth – CSS hides Instagram's own header)
  ══════════════════════════════════════════════════════════ */
  function injectFBTopBar() {
    if (document.getElementById('instabook-topbar')) return;

    const bar = document.createElement('div');
    bar.id = 'instabook-topbar';
    bar.innerHTML = `
      <div id="instabook-topbar-inner">

        <!-- Left: logo + search -->
        <div class="ib-nav-left">
          <a href="/" class="ib-logo" title="InstaBook Home">
            <span class="ib-logo-f">f</span>
            <span class="ib-logo-name">InstaBook</span>
          </a>
          <div class="ib-search-wrap">
            <span class="ib-search-icon">🔍</span>
            <input type="text" class="ib-search-input" placeholder="Search InstaBook" />
          </div>
        </div>

        <!-- Center: nav links -->
        <div class="ib-nav-center">
          <a href="/"              class="ib-nav-link" data-path="/">🏠 Home</a>
          <a href="/explore/"      class="ib-nav-link" data-path="/explore/">👥 Friends</a>
          <a href="/reels/"        class="ib-nav-link" data-path="/reels/">📺 Videos</a>
          <a href="/direct/inbox/" class="ib-nav-link" data-path="/direct/">✉️ Messages</a>
          <a href="#"              class="ib-nav-link" id="ib-notif-btn">
            🔔 <span class="ib-notif-badge" id="ib-notif-count">3</span>
          </a>
        </div>

        <!-- Right: user + settings -->
        <div class="ib-nav-right">
          <span class="ib-username" id="ib-display-name">👤 …</span>
          <span class="ib-nav-sep">|</span>
          <a href="/accounts/edit/" class="ib-nav-right-link">Settings</a>
          <span class="ib-nav-sep">|</span>
          <a href="#" class="ib-nav-right-link" id="ib-logout-btn">Log Out</a>
          <button class="ib-poke-btn" id="ib-nav-poke" style="margin-left:8px;" onclick="alert('👉 You poked someone!')">👉 Poke</button>
          <div class="ib-powered">
            by <a href="https://mauxxai.online" target="_blank">mauxx AI</a>
          </div>
        </div>

      </div>
    `;

    document.body.insertBefore(bar, document.body.firstChild);
    highlightActiveNavLink();
  }

  /* ══════════════════════════════════════════════════════════
     1.5 INJECT 3-COLUMN LAYOUT WRAPPER
  ══════════════════════════════════════════════════════════ */
  function setupThreeColumnLayout() {
    if (document.getElementById('ib-main-wrap')) return;

    // Target the Instagram main container
    const nativeMain = q('main[role="main"]') || q('main');
    if (!nativeMain) return;

    // Create our wrapper
    const wrap = document.createElement('div');
    wrap.id = 'ib-main-wrap';

    // Column 1: Left Nav
    const leftCol = document.createElement('div');
    leftCol.id = 'ib-sidebar-left';
    leftCol.innerHTML = `
      <div class="ib-side-menu">
        <a href="/" class="ib-side-item active">
          <span class="ib-side-icon">🌐</span>
          <span class="ib-side-label">News Feed</span>
        </a>
        <a href="/direct/inbox/" class="ib-side-item">
          <span class="ib-side-icon">✉️</span>
          <span class="ib-side-label">Messages</span>
        </a>
        <a href="/explore/" class="ib-side-item">
          <span class="ib-side-icon">👥</span>
          <span class="ib-side-label">Friends</span>
        </a>
        <a href="/reels/" class="ib-side-item">
          <span class="ib-side-icon">📺</span>
          <span class="ib-side-label">Videos</span>
        </a>
      </div>
      <div style="margin-top:20px; font-size:11px; color:#9197a3;">
        Explore · More · Apps
      </div>
    `;

    // Column 2: Feed (We will move Instagram's feed here)
    const feedCol = document.createElement('div');
    feedCol.id = 'ib-feed-col';

    // Move Instagram's internal content into our feed column
    const internal = nativeMain.querySelector('div') || nativeMain;
    if (internal && internal !== nativeMain) {
       // We'll leave it for now and just use CSS to position it,
       // but a full move is safer for layout.
    }

    // Column 3: Widgets (Move Instagram's aside here if it exists)
    const widgetCol = document.createElement('div');
    widgetCol.id = 'ib-widget-col';
    widgetCol.innerHTML = `
      <!-- Birthdays -->
      <div class="ib-widget">
        <div class="ib-widget-header">🎁 Birthdays</div>
        <div class="ib-widget-body">
          <div class="ib-bday-item">
            <span class="ib-bday-icon">🎂</span>
            <span><b>Alex Johnson</b> has a birthday today.</span>
          </div>
        </div>
      </div>

      <!-- Ticker -->
      <div class="ib-widget">
        <div class="ib-widget-header">
           <span>Ticker</span>
           <span style="cursor:pointer">⚙️</span>
        </div>
        <div class="ib-widget-body">
          <div class="ib-ticker-item">
            <div class="ib-ticker-avatar"></div>
            <div class="ib-ticker-text"><b>Maria Garcia</b> liked a post from <b>InstaBook</b>.</div>
          </div>
          <div class="ib-ticker-item">
            <div class="ib-ticker-avatar"></div>
            <div class="ib-ticker-text"><b>Chris Lee</b> commented on a status update.</div>
          </div>
          <div class="ib-ticker-item">
            <div class="ib-ticker-avatar"></div>
            <div class="ib-ticker-text"><b>Tom Wilson</b> is now friends with <b>Mauxx AI</b>.</div>
          </div>
        </div>
      </div>

      <!-- Sponsored -->
      <div class="ib-widget">
        <div class="ib-widget-header">Sponsored</div>
        <div class="ib-widget-body">
          <div style="font-size:11px; color:#3b5998; font-weight:bold; margin-bottom:2px;">mauxx AI Solutions</div>
          <div style="font-size:11px; color:#777;">Secure your AI sponsorship today. Professional kits for students.</div>
          <a href="https://mauxxai.online" style="font-size:10px; color:#3b5998; text-decoration:none;">mauxxai.online</a>
        </div>
      </div>
    `;

    wrap.appendChild(leftCol);
    wrap.appendChild(feedCol);
    wrap.appendChild(widgetCol);

    nativeMain.prepend(wrap);

    // Reposition Instagram's native feed container into our Column 2
    const instaFeed = nativeMain.querySelector('section') || nativeMain.querySelector('div > div > div');
    if (instaFeed && feedCol) {
       feedCol.appendChild(instaFeed);
    }
  }

  /* Mark current-page link as active */
  function highlightActiveNavLink() {
    const path = location.pathname;
    qa('#instabook-topbar .ib-nav-link[data-path]').forEach(link => {
      const lp = link.getAttribute('data-path');
      link.classList.toggle(
        'ib-active',
        lp === '/' ? path === '/' : path.startsWith(lp)
      );
    });
  }

  /* ══════════════════════════════════════════════════════════
     2. DETECT & DISPLAY USERNAME
  ══════════════════════════════════════════════════════════ */
  function updateUsername() {
    let username = null;

    // Strategy A: meta og:url tag  e.g. https://www.instagram.com/mauxxai/
    const ogUrl = q('meta[property="og:url"]');
    if (ogUrl) {
      const m = ogUrl.content.match(/instagram\.com\/([^/?#]+)/);
      if (m && m[1] && m[1] !== 'www') username = m[1];
    }

    // Strategy B: canonical link
    if (!username) {
      const canonical = q('link[rel="canonical"]');
      if (canonical) {
        const m = canonical.href.match(/instagram\.com\/([^/?#]+)/);
        if (m && m[1] && !['explore','reels','direct','accounts','stories'].includes(m[1])) {
          username = m[1];
        }
      }
    }

    // Strategy C: profile nav link aria-label
    if (!username) {
      const profileEl = q('[aria-label*="Profile"]') || q('a[href*="/"][aria-label]');
      if (profileEl) {
        const href = profileEl.getAttribute('href') || '';
        const parts = href.split('/').filter(Boolean);
        if (parts.length === 1) username = parts[0];
      }
    }

    const nameEl = document.getElementById('ib-display-name');
    if (nameEl && username) {
      nameEl.textContent = '👤 ' + username;
    }
  }

  /* ══════════════════════════════════════════════════════════
     3. INJECT "WHAT'S ON YOUR MIND?" STATUS BOX
  ══════════════════════════════════════════════════════════ */
  function injectStatusBox() {
    if (document.getElementById('instabook-status-box')) return;

    // Only inject on home feed, not profile or explore pages
    if (location.pathname !== '/' && !location.pathname.startsWith('/direct')) {
      // Still inject on home
    }
    if (location.pathname !== '/') return;

    // Find the feed container
    const feed = q('main > div') || q('[role="main"] > div') || q('main');
    if (!feed) return;

    const box = document.createElement('div');
    box.id = 'instabook-status-box';
    box.style.cssText = `
      background: white;
      border: 1px solid #c4ccd8;
      border-radius: 3px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.08);
      padding: 10px 12px;
      margin-bottom: 12px;
      font-family: "Lucida Grande", Arial, sans-serif;
    `;
    box.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
        <div style="
          width:38px;height:38px;border-radius:50%;
          background:#8b9dc3;display:flex;align-items:center;
          justify-content:center;color:white;font-size:17px;flex-shrink:0;
        ">👤</div>
        <input type="text"
          placeholder="What's on your mind?"
          style="
            flex:1;border:1px solid #c4ccd8;border-radius:30px;
            padding:8px 14px;font-size:13px;color:#555;
            font-family:'Lucida Grande',Arial,sans-serif;
            outline:none;background:#f0f2f5;cursor:pointer;
          "
          onfocus="this.style.background='white';this.style.cursor='text';"
          onblur="this.style.background='#f0f2f5';"
        />
      </div>
      <div style="border-top:1px solid #e5e5e5;padding-top:8px;display:flex;gap:6px;">
        <button onclick="alert('📷 Share a photo on InstaBook!')"
          style="flex:1;background:none;border:none;border-radius:6px;padding:6px 4px;
            font-size:12px;font-family:'Lucida Grande',Arial;cursor:pointer;
            color:#45619d;font-weight:bold;display:flex;align-items:center;
            justify-content:center;gap:4px;"
          onmouseover="this.style.background='#f0f2f5'"
          onmouseout="this.style.background='none'">
          📷 Photo / Video
        </button>
        <button onclick="alert('📍 Check in to a location!')"
          style="flex:1;background:none;border:none;border-radius:6px;padding:6px 4px;
            font-size:12px;font-family:'Lucida Grande',Arial;cursor:pointer;
            color:#f3425f;font-weight:bold;display:flex;align-items:center;
            justify-content:center;gap:4px;"
          onmouseover="this.style.background='#f0f2f5'"
          onmouseout="this.style.background='none'">
          📍 Check In
        </button>
        <button onclick="alert('😊 I am feeling Happy!')"
          style="flex:1;background:none;border:none;border-radius:6px;padding:6px 4px;
            font-size:12px;font-family:'Lucida Grande',Arial;cursor:pointer;
            color:#f7b928;font-weight:bold;display:flex;align-items:center;
            justify-content:center;gap:4px;"
          onmouseover="this.style.background='#f0f2f5'"
          onmouseout="this.style.background='none'">
          😊 Feeling / Activity
        </button>
      </div>
    `;

    feed.insertBefore(box, feed.firstChild);
  }

  /* ══════════════════════════════════════════════════════════
     4. TRANSFORM POSTS (add FB Like·Comment·Share bar)
  ══════════════════════════════════════════════════════════ */
  function transformPosts() {
    qa('article, div[role="article"]').forEach(post => {
      if (post.dataset.ibDone) return;
      post.dataset.ibDone = 'true';

      // Hide native buttons and add text links
      const actionSection = post.querySelector('section[role="group"]');
      if (actionSection) {
        // Hide original SVG icons
        qa('section[role="group"] svg, section[role="group"] .x1i10hfl').forEach(el => {
           if (!el.closest('.fb-action-bar')) el.style.display = 'none';
        });

        if (!actionSection.querySelector('.fb-action-bar')) {
          const bar = document.createElement('div');
          bar.className = 'fb-action-bar';
          bar.innerHTML = `
            <span class="fb-action-btn" onclick="this.classList.toggle('liked');">👍 Like</span>
            <span class="fb-action-btn" onclick="alert('Comment focus coming soon!')">💬 Comment</span>
            <span class="fb-action-btn" onclick="alert('Shared to your Wall!')">↗ Share</span>
          `;
          actionSection.appendChild(bar);
        }
      }

      // Restyle header
      const header = post.querySelector('header');
      if (header) {
        header.style.background = 'white';
        header.style.borderBottom = '1px solid #e5e5e5';
      }

      // Timestamp suffix
      const ts = post.querySelector('time');
      if (ts && !ts.dataset.ibTagged) {
        ts.dataset.ibTagged = 'true';
        const tag = document.createElement('span');
        tag.style.cssText = 'font-size:10px;color:#aaa;margin-left:4px;';
        tag.textContent = '· via InstaBook';
        ts.parentNode.insertBefore(tag, ts.nextSibling);
      }
    });
  }

  /* ══════════════════════════════════════════════════════════
     5. VOCABULARY REPLACEMENT (Instagram → Facebook terms)
  ══════════════════════════════════════════════════════════ */
  const VOCAB = {
    'Reels':      'Videos',
    'Reel':       'Video',
    'Stories':    'Updates',
    'Story':      'Update',
    'Explore':    'Discover',
    'Highlights': 'Featured',
    'Add Story':  'Update Status',
    'Your story': 'Post Update',
    'Tagged':     'Tagged Photos',
    'POSTS':      'WALL',
    'REELS':      'VIDEOS',
  };

  function swapVocabNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const trimmed = node.textContent.trim();
      if (VOCAB[trimmed]) node.textContent = node.textContent.replace(trimmed, VOCAB[trimmed]);
    } else if (
      node.nodeType === Node.ELEMENT_NODE &&
      !['SCRIPT','STYLE','INPUT','TEXTAREA','CODE','PRE'].includes(node.tagName) &&
      !node.closest('#instabook-topbar, #instabook-chat-bar, #instabook-status-box')
    ) {
      node.childNodes.forEach(swapVocabNode);
    }
  }

  function replaceVocab() { swapVocabNode(document.body); }

  /* ══════════════════════════════════════════════════════════
     6. ARIA-LABEL FIXES
  ══════════════════════════════════════════════════════════ */
  function fixAriaLabels() {
    qa('[placeholder*="Add a comment…"]').forEach(el => {
      el.setAttribute('placeholder', 'Write a comment…');
    });
  }

  /* ══════════════════════════════════════════════════════════
     7. REWRITE PAGE TITLE  (tab title)
  ══════════════════════════════════════════════════════════ */
  function rewriteTitle() {
    if (!document.title.includes('InstaBook')) {
      document.title = document.title
        .replace(/Instagram/gi, 'InstaBook')
        .replace(/^$/, 'InstaBook');
    }
  }

  /* ══════════════════════════════════════════════════════════
     8. SIGNAL: dismiss the loading screen
  ══════════════════════════════════════════════════════════ */
  function signalReady() {
    window.dispatchEvent(new CustomEvent('instabook-ready'));
  }

  /* ══════════════════════════════════════════════════════════
     INIT (runs once after DOM is ready)
  ══════════════════════════════════════════════════════════ */
  function init() {
    chrome.storage.sync.get(
      { instabook_enabled: true, instabook_navbar: true, instabook_status: true },
      function (cfg) {
        if (!cfg.instabook_enabled) {
          signalReady(); // still dismiss splash even if disabled
          return;
        }

        // 1. Top bar (single logo, hides Instagram's own header via CSS :has())
        if (cfg.instabook_navbar) injectFBTopBar();

        // 2. Transform posts (may be empty on first load – observer will catch the rest)
        transformPosts();

        // 3. Vocab swap
        replaceVocab();

        // 4. Fix inputs
        fixAriaLabels();

        // 5. Title
        rewriteTitle();

        // 5.5. Layout
        setTimeout(setupThreeColumnLayout, 100);

        // 6. Deferred: username detection & status box
        //    (Instagram's meta tags load slightly after document_end)
        setTimeout(updateUsername, 400);
        if (cfg.instabook_status) setTimeout(injectStatusBox, 500);

        // 7. Dismiss the loading splash
        setTimeout(signalReady, 200);

        console.log('%c[InstaBook] ✅ Ready — old Facebook vibes activated', 'color:#3b5998;font-weight:bold;');
      }
    );
  }

  /* ══════════════════════════════════════════════════════════
     MUTATION OBSERVER (Instagram is a SPA — re-apply on changes)
  ══════════════════════════════════════════════════════════ */
  let mThrottle = null;
  const observer = new MutationObserver(function () {
    if (mThrottle) return;
    mThrottle = setTimeout(function () {
      mThrottle = null;
      transformPosts();
      fixAriaLabels();
      rewriteTitle();
    }, 350);
  });

  /* ══════════════════════════════════════════════════════════
     SPA NAVIGATION WATCHER
  ══════════════════════════════════════════════════════════ */
  let lastPath = location.pathname;
  const navObserver = new MutationObserver(function () {
    if (location.pathname !== lastPath) {
      lastPath = location.pathname;
      highlightActiveNavLink();
      rewriteTitle();
      // Re-inject status box on home
      setTimeout(function () {
        if (!document.getElementById('instabook-topbar')) injectFBTopBar();
        injectStatusBox();
        updateUsername();
      }, 600);
    }
  });

  /* ══════════════════════════════════════════════════════════
     STARTUP
  ══════════════════════════════════════════════════════════ */
  function startup() {
    init();
    observer.observe(document.body, { childList: true, subtree: true });
    navObserver.observe(document, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startup);
  } else {
    startup();
  }

})();
