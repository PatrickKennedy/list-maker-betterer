var storage = chrome.storage.local;

function copy_to_clipboard( text ){
  var copyDiv = document.createElement('div');
  document.body.appendChild(copyDiv);
  copyDiv.contentEditable = true;
  copyDiv.innerHTML = text;
  copyDiv.unselectable = "off";
  copyDiv.focus();
  document.execCommand('SelectAll');
  document.execCommand("Copy", false, null);
  document.body.removeChild(copyDiv);
}

chrome.runtime.onMessage.addListener(
  function(request, sender, respond) {
    if (request.action == "copy") {
      copy_to_clipboard(request.data);
    }
  }
);