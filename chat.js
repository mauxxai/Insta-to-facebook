/**
 * InstaBook – Old Facebook Chat Tab
 * Injects a classic Facebook-style chat sidebar tab in the bottom-right corner
 * Built by mauxx AI (mauxxai.online)
 * GitHub: github.com/mauxxai/Insta-to-Facebook
 */

(function () {
  'use strict';

  // Guard: only run in the top-level frame, not inside Instagram's iframes
  if (window !== window.top) return;
  if (!location.hostname.includes('instagram.com')) return;

  // Sample "friends" for the old Facebook chat list
  const DEMO_FRIENDS = [
    { name: 'Alex Johnson',   initials: 'AJ', online: true,  status: 'Active now' },
    { name: 'Maria Garcia',   initials: 'MG', online: true,  status: 'Active now' },
    { name: 'Chris Lee',      initials: 'CL', online: true,  status: 'Active 2m ago' },
    { name: 'Priya Sharma',   initials: 'PS', online: false, status: 'Active 1h ago' },
    { name: 'Tom Wilson',     initials: 'TW', online: true,  status: 'Active now' },
    { name: 'Sara Kim',       initials: 'SK', online: false, status: 'Active 3h ago' },
    { name: 'James Brown',    initials: 'JB', online: false, status: 'Active yesterday' },
    { name: 'Emily Davis',    initials: 'ED', online: true,  status: 'Active now' },
    { name: 'Ravi Patel',     initials: 'RP', online: false, status: 'Active 45m ago' },
    { name: 'Sophie Turner',  initials: 'ST', online: true,  status: 'Active 5m ago' },
  ];

  // Messages for demo chat windows
  const DEMO_MESSAGES = [
    { user: 'Friend', text: 'Hey! How are you?', mine: false },
    { user: 'You', text: 'Great! Just checking out InstaBook 😄', mine: true },
    { user: 'Friend', text: 'haha looks just like Facebook!', mine: false },
    { user: 'You', text: 'Right?! mauxx AI made it 🔥', mine: true },
  ];

  let isChatOpen = true;
  const openWindows = {};

  function createChatBar() {
    if (document.getElementById('instabook-chat-bar')) return;

    const chatBar = document.createElement('div');
    chatBar.id = 'instabook-chat-bar';

    chatBar.innerHTML = `
      <div class="chat-header" id="instabook-chat-toggle">
        <div class="chat-title">
          <div class="chat-dot"></div>
          <span>Chat</span>
          <span style="font-size:10px;opacity:0.8;">(${DEMO_FRIENDS.filter(f => f.online).length} online)</span>
        </div>
        <div class="chat-controls">
          <span title="Options" id="instabook-chat-options">⚙</span>
          <span title="Collapse" id="instabook-chat-collapse">${isChatOpen ? '▼' : '▲'}</span>
        </div>
      </div>
      <div id="instabook-chat-body">
        <div class="chat-search">
          <input type="text" placeholder="Search friends..." id="instabook-chat-search" />
        </div>
        <div class="chat-section-label">Online Friends</div>
        <div id="instabook-chat-list"></div>
      </div>
    `;

    document.body.appendChild(chatBar);

    // Render friends list
    renderFriendList(DEMO_FRIENDS);

    // Toggle collapse
    document.getElementById('instabook-chat-toggle').addEventListener('click', function (e) {
      if (e.target.id === 'instabook-chat-options') return;
      toggleChatBody();
    });

    // Search filter
    document.getElementById('instabook-chat-search').addEventListener('input', function () {
      const query = this.value.toLowerCase();
      const filtered = DEMO_FRIENDS.filter(f => f.name.toLowerCase().includes(query));
      renderFriendList(filtered);
    });

    // Prevent search click from toggling
    document.getElementById('instabook-chat-body').addEventListener('click', function (e) {
      e.stopPropagation();
    });

    if (!isChatOpen) {
      document.getElementById('instabook-chat-body').style.display = 'none';
    }
  }

  function renderFriendList(friends) {
    const list = document.getElementById('instabook-chat-list');
    if (!list) return;
    list.innerHTML = '';

    // Separate online/offline
    const online = friends.filter(f => f.online);
    const offline = friends.filter(f => !f.online);

    online.forEach(f => list.appendChild(createFriendItem(f)));

    if (offline.length > 0 && online.length > 0) {
      const sep = document.createElement('div');
      sep.className = 'chat-section-label';
      sep.textContent = 'Friends';
      list.appendChild(sep);
    }

    offline.forEach(f => list.appendChild(createFriendItem(f)));
  }

  function createFriendItem(friend) {
    const item = document.createElement('div');
    item.className = 'chat-friend';
    item.innerHTML = `
      <div class="friend-avatar">
        ${friend.initials}
        ${friend.online ? '<div class="online-dot"></div>' : ''}
      </div>
      <div>
        <div class="friend-name">${friend.name}</div>
        <div class="friend-status">${friend.status}</div>
      </div>
    `;
    item.addEventListener('click', () => openChatWindow(friend));
    return item;
  }

  function toggleChatBody() {
    isChatOpen = !isChatOpen;
    const body = document.getElementById('instabook-chat-body');
    const collapseBtn = document.getElementById('instabook-chat-collapse');
    if (body) body.style.display = isChatOpen ? 'block' : 'none';
    if (collapseBtn) collapseBtn.textContent = isChatOpen ? '▼' : '▲';
  }

  function openChatWindow(friend) {
    if (openWindows[friend.name]) {
      // Focus existing window
      openWindows[friend.name].style.display = 'block';
      return;
    }

    // Calculate position offset for multiple windows
    const windowCount = Object.keys(openWindows).length;
    const rightOffset = 240 + windowCount * 240;

    const win = document.createElement('div');
    win.className = 'instabook-chat-window';
    win.style.right = rightOffset + 'px';

    const msgs = DEMO_MESSAGES.map(m => `
      <div class="cw-msg ${m.mine ? 'mine' : ''}">
        <div class="cw-msg-user">${m.mine ? 'You' : friend.name.split(' ')[0]}</div>
        ${m.text}
      </div>
    `).join('');

    win.innerHTML = `
      <div class="cw-header">
        <span>${friend.name}</span>
        <span class="cw-close" data-friend="${friend.name}">✕</span>
      </div>
      <div class="cw-messages" id="cw-msgs-${friend.initials}">
        ${msgs}
      </div>
      <div class="cw-input-area">
        <input type="text" placeholder="Type a message..." id="cw-input-${friend.initials}" />
        <button id="cw-send-${friend.initials}">Send</button>
      </div>
    `;

    document.body.appendChild(win);
    openWindows[friend.name] = win;

    // Scroll to bottom
    const msgArea = document.getElementById(`cw-msgs-${friend.initials}`);
    if (msgArea) msgArea.scrollTop = msgArea.scrollHeight;

    // Close button
    win.querySelector('.cw-close').addEventListener('click', function () {
      win.style.display = 'none';
      delete openWindows[friend.name];
      win.remove();
    });

    // Send message
    const input = document.getElementById(`cw-input-${friend.initials}`);
    const sendBtn = document.getElementById(`cw-send-${friend.initials}`);

    function sendMessage() {
      const text = input.value.trim();
      if (!text) return;
      const msgEl = document.createElement('div');
      msgEl.className = 'cw-msg mine';
      msgEl.innerHTML = `<div class="cw-msg-user">You</div>${escapeHtml(text)}`;
      if (msgArea) {
        msgArea.appendChild(msgEl);
        msgArea.scrollTop = msgArea.scrollHeight;
      }
      input.value = '';

      // Simulate reply after 1.5s
      setTimeout(() => {
        const replies = [
          'haha nice!',
          'that\'s so cool 😄',
          'wait what?? this is wild',
          'lol InstaBook is the best',
          'mauxx AI is genius fr',
          'ok I\'m using this forever',
        ];
        const reply = document.createElement('div');
        reply.className = 'cw-msg';
        reply.innerHTML = `<div class="cw-msg-user">${friend.name.split(' ')[0]}</div>${replies[Math.floor(Math.random() * replies.length)]}`;
        if (msgArea) {
          msgArea.appendChild(reply);
          msgArea.scrollTop = msgArea.scrollHeight;
        }
      }, 1200 + Math.random() * 800);
    }

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') sendMessage();
    });
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  // Init: wait for page to be ready
  function init() {
    // Check if extension is enabled
    chrome.storage.sync.get({ instabook_enabled: true }, function (data) {
      if (!data.instabook_enabled) return;
      createChatBar();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // Small delay to let Instagram's own scripts settle
    setTimeout(init, 500);
  }

  // Re-attach on Instagram's SPA navigation
  let lastUrl = location.href;
  new MutationObserver(function () {
    const currentUrl = location.href;
    if (currentUrl !== lastUrl) {
      lastUrl = currentUrl;
      setTimeout(function () {
        if (!document.getElementById('instabook-chat-bar')) {
          chrome.storage.sync.get({ instabook_enabled: true }, function (data) {
            if (data.instabook_enabled) createChatBar();
          });
        }
      }, 800);
    }
  }).observe(document, { subtree: true, childList: true });

})();
