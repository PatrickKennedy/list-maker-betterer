// Copyright (c) 2012 Patrick Kennedy. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var storage = chrome.storage.local,
    active = false,
    message = document.querySelector('#message');

chrome.tabs.getSelected(null, function(tab) {
  chrome.tabs.sendMessage(tab.id, {action: "popup"});
});

message.innerText = '';


