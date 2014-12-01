/* TODO */
//(maybe)
// dynamically create a lot of sub-checkboxes for specific global emotes
// dynamically create a lot of sub-checkboxes for specific sub emotes

// ids of things that, when clicked, will save the settings in chrome storage.
var idlist = [
    'all',
    'only_globals',
    'only_subs',
    'only_kappa',
];

// startup stuff
document.addEventListener('DOMContentLoaded', restore_options);

for (var i=0; i < idlist.length; i++) {
    document.getElementById(idlist[i]).addEventListener('click', save_options);
}
document.getElementById('sub_filter').addEventListener('keyup', save_options);

//styling function
function fade(element) {
    var op = 1;  
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

//saves the options using the chrome storage API - happens each click
function save_options() {
    var all = document.getElementById('all');
    var only_globals = document.getElementById('only_globals');
    var only_subs = document.getElementById('only_subs');
    var only_kappa = document.getElementById('only_kappa');

    var sub_filter = document.getElementById('sub_filter');
    var filter_text = sub_filter.value;

    chrome.storage.sync.set({
        all: all.checked,
        only_globals: only_globals.checked,
        only_subs: only_subs.checked,
        only_kappa: only_kappa.checked,
        filter_text: filter_text,
    }, function() {
        // Draw "Saved!" to let user know options were saved.
        var stats = document.getElementById('saved');
        stats.style.opacity = 1;
        stats.style.display = "inline";
        setTimeout(function() { fade(stats); }, 400);
    });
}

// Restores checkbox state using the preferences stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get({
      all: false,
      only_globals: true,
      only_kappa: false,
      only_subs: false,
      filter_text: '',
  }, function(items) {
      document.getElementById('all').checked = items.all;
      document.getElementById('only_globals').checked = items.only_globals;
      document.getElementById('only_subs').checked = items.only_subs;
      document.getElementById('only_kappa').checked = items.only_kappa;
      document.getElementById('sub_filter').value = items.filter_text;
  });
}

// footer stuff
document.getElementById('begging').addEventListener('mouseover', function() {
    var p = document.createElement('P');
    p.id = "annoyingtext";
    p.style = "font-size:80%;color:444444;";
    p.innerHTML = "Dogecoin donation address:";
    document.getElementById('begging').insertBefore(p, document.getElementById('begging').firstChild);
});
document.getElementById('begging').addEventListener('mouseout', function () {
    var p = document.getElementById('annoyingtext')
    p.parentNode.removeChild(p);
});

