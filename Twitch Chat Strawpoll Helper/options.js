var idlist = [
  "show_strawpoll",
  "show_id",
  "show_title"
]
var len = idlist.length;

function fade(element) {
    var op = 1;  // initial opacity
    var timer = setInterval(function () {
        if (op <= 0.1){
            clearInterval(timer);
            element.style.display = 'none';
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= op * 0.3;
    }, 50);
}

function update_example() {
  var example = document.getElementById('example');
  chrome.storage.sync.get({
    show_strawpoll: true,
    show_id: false,
    show_title: true
  }, function(items) {
    example.innerHTML = "";
    if (items.show_strawpoll) {
      example.innerHTML = "Strawpoll";
    }
    if (items.show_id) {
      if (example.innerHTML != "")
        example.innerHTML += " ";
      example.innerHTML += "1510000";
    }
    if (items.show_title) {
      if (example.innerHTML != "")
        example.innerHTML += ": ";
      example.innerHTML += "Should I Play G-Mod?";
    }
    var why = document.getElementById("why");
    if (example.innerHTML == "") {
      example.innerHTML = "http://www.strawpoll.me/1510000";
      why.innerHTML = "(why did you even download this extension then...)";
    } else {
      why.innerHTML = "";
    }
  });
}

function save_options() {
  var show_strawpoll = document.getElementById('show_strawpoll');
  var show_id = document.getElementById('show_id');
  var show_title = document.getElementById('show_title');
  chrome.storage.sync.set({
    show_strawpoll: show_strawpoll.checked,
    show_id: show_id.checked,
    show_title: show_title.checked,
  }, function() {
    var stats = document.getElementById('status');
    stats.style.opacity = 1;
    stats.style.display = "inline";
    setTimeout(function(){fade(stats)}, 400);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get({
    show_strawpoll: true,
    show_id: false,
    show_title: true
  }, function(items) {
      document.getElementById('show_strawpoll').checked = items.show_strawpoll;
      document.getElementById('show_id').checked = items.show_id;
      document.getElementById('show_title').checked = items.show_title;
  });
  var imgURL = chrome.extension.getURL("images/sendemail.png");
  document.getElementById('emailimg').src = imgURL;
}

document.getElementById('sendbutton').addEventListener('mouseover', function() {
    var p = document.createElement('P');
    p.id = "annoyingtext";
    p.style.textAlign = 'left';
    p.innerHTML = "Found a bug? Have a suggestion? Email me.";
    document.getElementById('emailbutton').insertBefore(p, document.getElementById('emailbutton').firstChild);
});
document.getElementById('sendbutton').addEventListener('mouseout', function () {
    var p = document.getElementById('annoyingtext')
    p.parentNode.removeChild(p);
});

document.getElementById('donationaddress').addEventListener('mouseover', function() {
    var p = document.createElement('P');
    p.id = "annoyingtext";
    p.style.textAlign = 'right';
    p.innerHTML = "Dogecoin donation address";
    document.getElementById('donationaddress').insertBefore(p, document.getElementById('donationaddress').firstChild);
});
document.getElementById('donationaddress').addEventListener('mouseout', function () {
    var p = document.getElementById('annoyingtext')
    p.parentNode.removeChild(p);
});

document.addEventListener('DOMContentLoaded', restore_options);
document.addEventListener('DOMContentLoaded', update_example);

for (var i=0; i < len; i++) {
    document.getElementById(idlist[i]).addEventListener('click', save_options);
    document.getElementById(idlist[i]).addEventListener('click', update_example);
}

