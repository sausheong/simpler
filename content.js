// sends a message with the selected text to the side panel whenever a ctrl-S is detected
document.addEventListener('keydown', function(event) {
  if (event.ctrlKey && event.key === 's') {
    event.preventDefault();
    let selectedText = window.getSelection().toString();
    if (selectedText.length > 0) {
      chrome.runtime.sendMessage({type: "updateSidePanel", text: selectedText, url: window.location.href});
    }
  }
  });
  