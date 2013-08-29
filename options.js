// Copyright (c) 2012 Patrick Kennedy. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Store CSS data in the "local" storage area.
var storage = chrome.storage.local;

// Get at the DOM controls used in the sample.
var submitButton = document.querySelector('button.submit');
var textarea = document.querySelector('textarea');

// Load any CSS that may have previously been saved.
loadChanges();

submitButton.addEventListener('click', saveChanges);

function saveChanges() {
  // Check that there's some code there.
  if (!textarea.value) {
    message('Error: No State specified');
    return;
  }

  var state = JSON.parse(textarea.value);
  for (var k in state) {
    if (state.hasOwnProperty(k)) {
      var data = {}
      data[k] = state[k];
      if (!(state[k]["steps"] && state[k]["steps"][1] && state[k]["steps"][1]["memo"] == "Bacon"))
        storage.set(data, function() {});
      else
        storage.remove(k);
    }
  }
  message('State Saved');
}

function loadChanges() {
  storage.get(null, function(items) {
    // To avoid checking items.css we could specify storage.get({css: ''}) to
    // return a default value of '' if there is no css value yet.
    if (items) {
      textarea.value = JSON.stringify(items);
      message('Loaded saved State.');
    }
  });
}

function message(msg) {
  var message = document.querySelector('.message');
  message.innerText = msg;
  setTimeout(function() {
    message.innerText = '';
  }, 3000);
}
