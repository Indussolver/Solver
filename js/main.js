// main.js — shared helpers + request notification permission
(function(){
  // small helper
  window.$ = selector => document.querySelector(selector);
  window.$$ = selector => Array.from(document.querySelectorAll(selector));

  // request notifications when user interacts first time
  function initNotifications(){
    if (!('Notification' in window)) return;
    if (Notification.permission === 'default') {
      // request later on user action; we provide a gentle request on pages where needed
      // For now, request once when index or alarm loaded and user clicks Save Alarm we'll request.
    }
  }

  document.addEventListener('DOMContentLoaded', initNotifications);
})();