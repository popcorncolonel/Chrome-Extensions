/* jshint futurehostile: true, latedef: nofunc, maxerr: 200, noarg: true */
/* globals chrome: false */
(function _setup(window, document, undefined) {
  'use strict';
  function fade(element) {
    var op = 1, // initial opacity
      timer = setInterval(function _fade() {
        if (op <= 0.1) {
          clearInterval(timer);
          element.style.display = 'none';
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ')';
        op -= op * 0.3;
      }, 50);
  }

  function update_example() {
    var example = document.getElementById('example');
    chrome.storage.sync.get({
      show_strawpoll: true,
      show_id: false,
      show_title: true
    }, function _update(items) {
      example.innerHTML = '';
      if (items.show_strawpoll) example.innerHTML = 'Strawpoll';
      if (items.show_id) {
        if (example.innerHTML !== '') example.innerHTML += ' ';
        example.innerHTML += '1510000';
      }
      if (items.show_title) {
        if (example.innerHTML !== '') example.innerHTML += ': ';
        example.innerHTML += 'Should I Play G-Mod?';
      }
      var why = document.getElementById('why');
      if (example.innerHTML === '') {
        example.innerHTML = 'http://www.strawpoll.me/1510000';
        why.innerHTML = '(why did you even download this extension then...)';
      } else why.innerHTML = '';
    });
  }

  function save_options() {
    var show_strawpoll = document.getElementById('show_strawpoll'),
      show_id = document.getElementById('show_id'),
      show_title = document.getElementById('show_title');
    chrome.storage.sync.set({
      show_strawpoll: show_strawpoll.checked,
      show_id: show_id.checked,
      show_title: show_title.checked
    }, function _save() {
      var stats = document.getElementById('status');
      stats.style.opacity = 1;
      stats.style.display = 'inline';
      setTimeout(fade.bind(null, stats), 400);
    });
  }

  // Restores select box and checkbox state using the preferences
  // stored in chrome.storage.
  function restore_options() {
    document.removeEventListener('DOMContentLoaded', restore_options, false);
    chrome.storage.sync.get({
      show_strawpoll: true,
      show_id: false,
      show_title: true
    }, function _restore(items) {
      document.getElementById('show_strawpoll').checked = items.show_strawpoll;
      document.getElementById('show_id').checked = items.show_id;
      document.getElementById('show_title').checked = items.show_title;
    });
  }

  function init() {
    document.removeEventListener('DOMContentLoaded', init, false);
    var idlist = ['show_strawpoll', 'show_id', 'show_title'], i = idlist.length,
    email = document.getElementById('email'), doge = document.getElementById('doge'),
    sendbutton = document.getElementById('sendbutton'),
    donationaddress = document.getElementById('donationaddress');

    while (i--) {
      document.getElementById(idlist[i]).addEventListener('click', save_options, false);
      document.getElementById(idlist[i]).addEventListener('click', update_example, false);
    }

    sendbutton.addEventListener('mouseover', function _annoy() {email.style.visibility = 'visible';}, false);
    sendbutton.addEventListener('mouseout', function _noannoyance() {email.style.visibility = 'hidden';}, false);

    donationaddress.addEventListener('mouseover', function _doge() {doge.style.visibility = 'visible';}, false);
    donationaddress.addEventListener('mouseout', function _nodoge() {doge.style.visibility = 'hidden';}, false);
  }

  var r = document.readyState;
  if (r === 'complete' || r === 'loaded' || r === 'interactive') {
    restore_options();
    update_example();
    init();
  } else {
    document.addEventListener('DOMContentLoaded', restore_options, false);
    document.addEventListener('DOMContentLoaded', update_example, false);
    document.addEventListener('DOMContentLoaded', init, false);
  }
})(window, document);
