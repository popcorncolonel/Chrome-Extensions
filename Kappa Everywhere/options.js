/* TODO */
//dynamically create a lot of sub-checkboxes for specific global emotes
//dynamically create a lot of sub-checkboxes for specific sub emotes

var idlist = [
    'no_global_emotes',
    'no_sub_emotes',
    'only_kappa',
]

// startup stuff
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('no_global_emotes').addEventListener('click', reset_buttons);
for (var i=0; i < idlist.length; i++) {
    document.getElementById(idlist[i]).addEventListener('click', save_options);
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

//handles dependant checkbox interaction
//i.e.: if someone clicks "do not replace global emotes", it unchecks and disables the "only filter kappa" option
function reset_buttons() {
  var no_global_emotes = document.getElementById('no_global_emotes');
  var only_kappa = document.getElementById('only_kappa');
  var no_sub_emotes = document.getElementById('no_sub_emotes');
  if (no_global_emotes.checked) {
    only_kappa.checked = false;
    document.getElementById('globaldiv').style.setProperty("text-decoration", "line-through");
    document.getElementById('globaldiv').style.setProperty("color", "#777");
  }
  else {
    document.getElementById('globaldiv').style.setProperty("text-decoration", "none");
    document.getElementById('globaldiv').style.setProperty("color", "#000");
  }
}

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
  var only_kappa = document.getElementById('only_kappa');
  var no_global_emotes = document.getElementById('no_global_emotes');
  var no_sub_emotes = document.getElementById('no_sub_emotes');

  chrome.storage.sync.set({
    no_global_emotes: no_global_emotes.checked,
    only_kappa: only_kappa.checked,
    no_sub_emotes: no_sub_emotes.checked,
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
    no_global_emotes: false, //defaults
    only_kappa: false,
    no_sub_emotes: true,
  }, function(items) {
      document.getElementById('no_global_emotes').checked = items.no_global_emotes;
      document.getElementById('only_kappa').checked = items.only_kappa;
      document.getElementById('no_sub_emotes').checked = items.no_sub_emotes;
  });
}

