// background.js
// 1. Captures Bearer JWT from game-log requests automatically
// 2. Proxies DDB API calls from the popup (bypasses CORS)
// 3. Can force-refresh the token by poking a DDB tab

chrome.webRequest.onBeforeSendHeaders.addListener(
  (details) => {
    const authHeader = details.requestHeaders?.find(
      h => h.name.toLowerCase() === 'authorization'
    );
    if (authHeader && authHeader.value.startsWith('Bearer eyJ')) {
      const token = authHeader.value.slice(7);
      chrome.storage.local.set({
        ddb_bearer_token: token,
        ddb_token_captured_at: Date.now(),
      });
    }
  },
  { urls: ['https://game-log-rest-live.dndbeyond.com/*'] },
  ['requestHeaders', 'extraHeaders']
);

// Force a fresh token by injecting a tiny game-log request into an open DDB tab
async function refreshToken() {
  const tabs = await chrome.tabs.query({ url: 'https://www.dndbeyond.com/*' });
  if (tabs.length === 0) {
    throw new Error('No D&D Beyond tab open. Open any DDB page first.');
  }

  // Inject a fetch into the DDB tab — this triggers a game-log request
  // which the webRequest listener above will intercept for the fresh token
  await chrome.scripting.executeScript({
    target: { tabId: tabs[0].id },
    func: () => {
      return fetch(
        'https://game-log-rest-live.dndbeyond.com/v1/game-log/6907990/rolls?userId=107965379&limit=1',
        { credentials: 'include' }
      ).then(() => true).catch(() => false);
    },
  });

  // Wait for the webRequest listener to capture the token
  await new Promise(r => setTimeout(r, 1500));

  const result = await chrome.storage.local.get(['ddb_bearer_token', 'ddb_token_captured_at']);
  return result;
}

// Handle messages from popup
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'refreshToken') {
    refreshToken()
      .then(result => sendResponse(result))
      .catch(err => sendResponse({ error: err.message }));
    return true;
  }

  // Proxy a DDB API fetch through the service worker (no CORS here)
  if (msg.type === 'fetchDDB') {
    fetch(msg.url, {
      headers: { 'Authorization': `Bearer ${msg.token}` },
    })
      .then(async res => {
        if (!res.ok) {
          const errText = await res.text();
          sendResponse({ error: `${res.status} ${errText}` });
        } else {
          const data = await res.json();
          sendResponse({ data });
        }
      })
      .catch(err => sendResponse({ error: err.message }));
    return true;
  }
});
