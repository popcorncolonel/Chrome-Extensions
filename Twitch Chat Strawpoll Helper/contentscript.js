/* jshint futurehostile: true, latedef: nofunc, maxerr: 200, noarg: true */
/* globals JSON: false, chrome: false */
(function _strawpoll(window, document, undefined) {
  'use strict';
  var show_title = true, show_id = true, show_strawpoll = true,
    strawReplaceRegex = /strawpo(?:i|l)(?:i|l).me/gi,
    //regexplanation: strawpoll followed by >= 1 digit then maybe a /
    //would match: strawpoll.me/1510000 https://strawpoll.me/1510000/
    //would not match: strawpoll.me strawpoll.me/ http://strawpoll/123asdf
    strawMatchRegex = /\b(?:https?:\/\/)?strawpoll\.me\/\d+[\/]?\b/gi,
    strawResultRegex = /\b(?:https?:\/\/)?strawpoll\.me\/\d+\/r\b/gi,
    straw = 'strawpoll.me', observer, chatLines, r;

  function replace_strawpoii(link) {
    link.innerHTML = link.innerHTML.replace(strawReplaceRegex, straw);
    link.href = link.href.replace(strawReplaceRegex, straw);
  }

  function format(link) {
    var url = link.innerHTML.match(strawMatchRegex), linkHTML = link.innerHTML,
      resultstr = '', resulturl, title, xhttp, id;
    if (url) url = url[0];
    //console.log(url);
    //console.log(linkHTML);
    //console.log(linkHTML.slice(0, -1));
    if (url !== linkHTML && url !== linkHTML.slice(0, -1)) return;
    resulturl = linkHTML.match(strawResultRegex); // for results
    if (resulturl) {
      url = resulturl = resulturl[0];
      resultstr = ' Result';
    }
    if (url) {
      if (show_title) {
        id = url.split('.me/')[1].split('/')[0];
        title = '';
        xhttp = new XMLHttpRequest();
        xhttp.open('GET', 'http://strawpoll.me/api/polls/' + id, false);
        xhttp.send();
        if (xhttp.status == 404) return;
        title = JSON.parse(xhttp.responseText).title;
        if (show_id) {
          id = url.split('.me')[1].split('/')[1];
          link.innerHTML = 'Strawpoll ' + id + resultstr + ': ' + title;
        } else {
          if (show_strawpoll) link.innerHTML = 'Strawpoll' + resultstr + ': ' + title;
          else link.innerHTML = title;
        }
      } else {
        if (show_id) {
          id = url.split('.me')[1].split('/')[1];
          link.innerHTML = 'Strawpoll' + resultstr + ' ' + id;
        } else if (show_strawpoll) link.innerHTML = 'Strawpoll' + resultstr;
      }
    }// if it's a normal strawpoll or vote result
  }

  function fixChatMsg(element) {
    var chats, links, link, i, j;
    if (!element || element.nodeType !== Node.ELEMENT_NODE || (typeof element.className !== 'string')) return;
    chats = element.getElementsByClassName('chat-line');
    i = chats.length;
    if (!i) return; // if the dom node has no messages
    while (i--) {
      links = chats[i].getElementsByClassName('message')[0].getElementsByTagName('a');
      j = links.length;
      while (j--) {
        link = links[j];
        replace_strawpoii(link);
        format(link);
      }
    } // for each link in the messages
  }

  function onMutation(mutations) {
    observer.stop();
    var i = mutations.length, nodes, j;
    while (i--) {
      nodes = mutations[i].addedNodes;
      j = nodes.length;
      while (j--) fixChatMsg(nodes[j]);
    }
    observer.start();
  }

  function init(/*e*/) {
    document.removeEventListener('DOMContentLoaded', init, false);
    chatLines = document.getElementsByClassName('chat-lines')[0];
    if (!chatLines) return;
    chrome.storage.sync.get({
      show_strawpoll: true,
      show_id: false,
      show_title: true
    }, function _sync(items) {
      show_strawpoll = items.show_strawpoll;
      show_id = items.show_id;
      show_title = items.show_title;
    });
    observer.start();
  }

  observer = new MutationObserver(onMutation);
  observer.start = function () {
    observer.start = observer.observe.bind(observer, chatLines, {
      attributes: false,
      characterData: false,
      childList: true,
      subtree: true
    });
    observer.start();
  };
  observer.stop = observer.disconnect.bind(observer);
  r = document.readyState;
  if (r === 'complete' || r === 'loaded' || r === 'interactive') init();
  else document.addEventListener('DOMContentLoaded', init, false);
})(window, document);
