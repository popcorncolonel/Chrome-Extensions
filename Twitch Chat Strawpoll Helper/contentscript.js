window.show_title = true;
window.show_id = true;
window.show_strawpoll = true;
var id;

function replace_strawpoii(link) {
  link.innerHTML = link.innerHTML.replace(/strawpo(i|l)(i|l).me/gi, "strawpoll.me");
  link.href = link.href.replace(/strawpo(i|l)(i|l).me/gi, "strawpoll.me");
}

function format(link) {
      //regexplanation: strawpoll followed by >= 1 int then maybe a /
      //would match: strawpoll.me/1510000 https://strawpoll.me/1510000/
      //would not match: strawpoll.me strawpoll.me/ http://strawpoll/123asdf
      url = link.innerHTML.match(/(http(s|):\/\/|)strawpoll\.me\/\d+([\/]|(?!.+))/gi); 
      if (url) url = url[0];
      resulturl = link.innerHTML.match(/(http(s|):\/\/|)strawpoll\.me\/\d+\/r/gi); //for results
      if (resulturl) resulturl = resulturl[0];
      if (url && !(resulturl)) {
        if (show_title) {
          id = url.split('.me/')[1].split('/')[0];
          title = "";
          var xhttp = new XMLHttpRequest();
          xhttp.open("GET", "http://strawpoll.me/api/polls/"+id, false);
          xhttp.send();
          if (xhttp.status == 404) return;
          title = JSON.parse(xhttp.responseText)['title'];
          if (window.show_id) {
            id = url.split('.me')[1].split('/')[1];
            link.innerHTML = "Strawpoll " + id + ": " + title;
          } else {
            if (window.show_strawpoll) {
              link.innerHTML = "Strawpoll: " + title;
            } else {
              link.innerHTML = title;
            }
          }
        } else {
          if (window.show_id) {
            id = url.split('.me')[1].split('/')[1];
            link.innerHTML = "Strawpoll " + id;
          } else {
            if (window.show_strawpoll) {
              link.innerHTML = "Strawpoll";
            }
          }
        }
      }
      else if (resulturl) {
       if (show_title) {
          var id = resulturl.split('.me/')[1].split('/')[0];
          title = "";
          var xhttp = new XMLHttpRequest();
          xhttp.open("GET", "http://strawpoll.me/api/polls/"+id, false);
          xhttp.send();
          if (xhttp.status == 404) return;
          title = JSON.parse(xhttp.responseText)['title'];
          if (window.show_id) {
            link.innerHTML = "Strawpoll " + id + " Result: " + title;
          } else {
            if (window.show_strawpoll) {
              link.innerHTML = "Strawpoll Result: " + title;
            } else {
              link.innerHTML = '"' + title + '" Result';
            }
          }
        } else {
          if (window.show_id) {
            id = url.split('.me')[1].split('/')[1];
            link.innerHTML = "Strawpoll Result " + id;
          } else {
            if (window.show_strawpoll) {
              link.innerHTML = "Strawpoll Result";
            }
          }
        }
      } //if it's a normal strawpoll or vote result
 }

function fixChatMsg(event) {
  var element = event.target;
  var message, link, links, title, xhttp, id;
  if (element && element.className && (element.className).indexOf('chat-line') > -1) {
    message = element.getElementsByClassName('message')[0];
    links = message.getElementsByTagName('A');
    var len = links.length;
    for (var i=0; i<len; i++) {
      link = links[i];
      replace_strawpoii(link);
      format(link);
    } //for each link in the message
  } //if the dom node is a chat message
}

chrome.storage.sync.get({
  show_strawpoll: true,
  show_id: true,
  show_title: true
}, function(items) {
  window.show_strawpoll = items.show_strawpoll;
  window.show_id = items.show_id;
  window.show_title = items.show_title;
  document.addEventListener('DOMNodeInserted', fixChatMsg, false);
});

