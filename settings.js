// set the option
document.getElementById('settingsForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const selectedOption = document.querySelector('input[name="option"]:checked').value;
  chrome.storage.sync.set({selectedOption: selectedOption}, function() {
    console.log('Option saved: ' + selectedOption);
  });
});
// restore the option
function restoreOptions() {
  chrome.storage.sync.get({selectedOption: 'L2'}, function(items) {
    document.querySelector(`input[name="option"][value="${items.selectedOption}"]`).checked = true;
  });
}
  
document.addEventListener('DOMContentLoaded', restoreOptions);
  