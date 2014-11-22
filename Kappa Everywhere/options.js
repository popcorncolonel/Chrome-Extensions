/* TODO */
//dynamically create a lot of sub-checkboxes for specific global emotes
//dynamically create a lot of sub-checkboxes for specific sub emotes

var idlist = [
    'no_global_emotes',
    'no_sub_emotes',
    'only_kappa',
]

document.getElementById('donationaddress').addEventListener('mouseover', function() {
    var p = document.createElement('P');
    p.id = "annoyingtext";
    p.style = "font-size:80%;color:444444;";
    p.innerHTML = "Dogecoin donation address:";
    document.getElementById('donationaddress').insertBefore(p, document.getElementById('donationaddress').firstChild);
});
document.getElementById('donationaddress').addEventListener('mouseout', function () {
    var p = document.getElementById('annoyingtext')
    p.parentNode.removeChild(p);
});

document.addEventListener('DOMContentLoaded', restore_options);

document.getElementById('no_global_emotes').addEventListener('click', reset_buttons);

for (var i=0; i < idlist.length; i++) {
    document.getElementById(idlist[i]).addEventListener('click', save_options);
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

//handles dependant checkbox interaction
//i.e.: if someone clicks "do not replace global emotes", it unchecks and disables the "only filter kappa" option
function reset_buttons() {
  var no_global_emotes = document.getElementById('no_global_emotes');
  var only_kappa = document.getElementById('only_kappa');
  var no_sub_emotes = document.getElementById('no_sub_emotes');
  if (!no_global_emotes.checked) {
    only_kappa.checked = false;
    document.getElementById('globaldiv').style.setProperty("text-decoration", "line-through");
  }
  else {
    only_kappa.checked = true;
    document.getElementById('globaldiv').style.setProperty("text-decoration", "none");
  }
}

//saves the options using the chrome storage API - happens each click
function save_options() {
  var newtab = document.getElementById('newtab');
  var autodl = document.getElementById('autodl');
  var showsearch = document.getElementById('showonsearch');
  var showrelated = document.getElementById('showonrelated');
  var playlists = document.getElementById('playlists');
  var otherpages = document.getElementById('otherpages');
  var thumbnail = document.getElementById('thumbnail');
  if (showsearch.checked || showrelated.checked || playlists.checked || otherpages.checked) {
    thumbnail.checked = true;
    document.getElementById('thumbnaildiv').style.setProperty("text-decoration", "none");
  } else {
    thumbnail.checked = false;
    document.getElementById('thumbnaildiv').style.setProperty("text-decoration", "line-through");
  }
    if (document.getElementById('autodl').checked) {
      document.getElementById('newtab').parentNode.style.display = "none";
      document.getElementById('autodlnote').style.display = "inline";
    } else {
      document.getElementById('newtab').parentNode.style.display = "inline";
      document.getElementById('autodlnote').style.display = "none";
    }
  chrome.storage.sync.set({
    newtab: newtab.checked,
    autodl: autodl.checked,
    show_on_search: showsearch.checked,
    show_on_related: showrelated.checked,
    playlists: playlists.checked,
    otherpages: otherpages.checked,
    thumbnails: thumbnail.checked
  }, function() {
    // Update status to let user know options were saved.
    var stats = document.getElementById('status');
    stats.style.opacity = 1;
    stats.style.display = "inline";
    setTimeout(function()
            { fade(stats) }
    , 400);
  });
}

// Restores checkbox state using the preferences stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get({
    newtab: true, //defaults
    autodl: true,
    show_on_search: true,
    show_on_related: true,
    playlists: true,
    otherpages: true,
    thumbnails: true
  }, function(items) {
      document.getElementById('newtab').checked = items.newtab;
      document.getElementById('autodl').checked = items.autodl;
      document.getElementById('showonsearch').checked = items.show_on_search;
      document.getElementById('showonrelated').checked = items.show_on_related;
      document.getElementById('playlists').checked = items.playlists;
      document.getElementById('otherpages').checked = items.otherpages;
      document.getElementById('thumbnail').checked = items.thumbnails;
      if (document.getElementById('autodl').checked) {
        document.getElementById('newtab').parentNode.style.display = "none";
        document.getElementById('autodlnote').style.display = "inline";
      } else {
        document.getElementById('newtab').parentNode.style.display = "inline";
        document.getElementById('autodlnote').style.display = "none";
      }
  });
}

