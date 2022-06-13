chrome.browserAction.onClicked.addListener(function() {
  var newURL = "dashboard.html";
  chrome.tabs.create({ url: newURL });
});
