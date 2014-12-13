/* TODO */
//(maybe)
// dynamically create a lot of sub-checkboxes for specific global emotes
// dynamically create a lot of sub-checkboxes for specific sub emotes

// ids of things that, when clicked, will save the settings in chrome storage.
var idlist = [
    'globals',
    'subs',
    'kappa',
	'bttv',
	'masterrace',
];

// startup stuff
document.addEventListener('DOMContentLoaded', restore_options);

for (var i=0; i < idlist.length; i++) {
    document.getElementById(idlist[i]).addEventListener('click', save_options);
}
//document.getElementById('sub_filter').addEventListener('keyup', save_options);

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
    var kappa = document.getElementById('kappa');
    var globals = document.getElementById('globals');
    var subs = document.getElementById('subs');
	var bttv = document.getElementById('bttv');
	var masterrace = document.getElementById('masterrace');

    //var sub_filter = document.getElementById('sub_filter');
    //var filter_text = sub_filter.value;

    chrome.storage.sync.set({
        kappa: kappa.checked,
        globals: globals.checked,
        subs: subs.checked,
		bttv: bttv.checked,
		masterrace: masterrace.checked,
        //filter_text: filter_text,
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
      kappa: false,
      globals: true,
      subs: false,
	  bttv: false,
	  masterrace: false,
      //filter_text: '',
  }, function(items) {
      document.getElementById('kappa').checked = items.kappa;
      document.getElementById('globals').checked = items.globals;
      document.getElementById('subs').checked = items.subs;
	  document.getElementById('bttv').checked = items.bttv;
	  document.getElementById('masterrace').checked = items.masterrace;
      //document.getElementById('sub_filter').value = items.filter_text;
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

