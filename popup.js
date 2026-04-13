/**
 * InstaBook – Popup Script
 * Handles toggle states and UI updates for the extension popup
 * Built by mauxx AI (mauxxai.online)
 */

(function () {
  'use strict';

  const DEFAULTS = {
    instabook_enabled: true,
    instabook_chat: true,
    instabook_navbar: true,
    instabook_status: true,
  };

  // Elements
  const toggleMain   = document.getElementById('toggle-main');
  const toggleChat   = document.getElementById('toggle-chat');
  const toggleNavbar = document.getElementById('toggle-navbar');
  const toggleStatus = document.getElementById('toggle-status');
  const statusDot    = document.getElementById('statusDot');
  const statusText   = document.getElementById('statusText');
  const statusSubtext = document.getElementById('statusSubtext');

  // Load saved preferences
  chrome.storage.sync.get(DEFAULTS, function (data) {
    toggleMain.checked   = data.instabook_enabled;
    toggleChat.checked   = data.instabook_chat;
    toggleNavbar.checked = data.instabook_navbar;
    toggleStatus.checked = data.instabook_status;
    updateStatus(data.instabook_enabled);
    updateSubToggles(data.instabook_enabled);
  });

  function updateStatus(enabled) {
    if (enabled) {
      statusDot.classList.remove('off');
      statusText.textContent = 'InstaBook Active';
      statusSubtext.textContent = 'Instagram is now wearing its Facebook mask 🎭';
    } else {
      statusDot.classList.add('off');
      statusText.textContent = 'InstaBook Disabled';
      statusSubtext.textContent = 'Toggle on to activate the Facebook experience';
    }
  }

  function updateSubToggles(mainEnabled) {
    const opacity = mainEnabled ? '1' : '0.4';
    [toggleChat, toggleNavbar, toggleStatus].forEach(t => {
      t.disabled = !mainEnabled;
      t.closest('.toggle-row').style.opacity = opacity;
    });
  }

  // Master toggle
  toggleMain.addEventListener('change', function () {
    const enabled = this.checked;
    chrome.storage.sync.set({ instabook_enabled: enabled });
    updateStatus(enabled);
    updateSubToggles(enabled);

    // Notify active tab to apply/remove
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs[0]) {
        chrome.tabs.reload(tabs[0].id);
      }
    });
  });

  toggleChat.addEventListener('change', function () {
    chrome.storage.sync.set({ instabook_chat: this.checked });
    notifyTab();
  });

  toggleNavbar.addEventListener('change', function () {
    chrome.storage.sync.set({ instabook_navbar: this.checked });
    notifyTab();
  });

  toggleStatus.addEventListener('change', function () {
    chrome.storage.sync.set({ instabook_status: this.checked });
    notifyTab();
  });

  function notifyTab() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs[0] && tabs[0].url && tabs[0].url.includes('instagram.com')) {
        chrome.tabs.reload(tabs[0].id);
      }
    });
  }

  // Open Instagram button feedback
  const openBtn = document.getElementById('openInstaBtn');
  if (openBtn) {
    openBtn.addEventListener('click', function () {
      this.textContent = 'Opening… 🎭';
      setTimeout(() => window.close(), 600);
    });
  }

})();
