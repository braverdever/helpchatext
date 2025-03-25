let isPanelOpen = false;

// Initialize side panel behavior
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

// Add action listener to handle icon clicks
chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ windowId: tab.windowId });
});

// Listen for panel state changes
chrome.sidePanel.onOpened.addListener(() => {
  isPanelOpen = true;
});

chrome.sidePanel.onClosed.addListener(() => {
  isPanelOpen = false;
});

// Initialize the side panel behavior when the extension loads
chrome.runtime.onInstalled.addListener(async () => {
  isPanelOpen = false;
  chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error));
}); 