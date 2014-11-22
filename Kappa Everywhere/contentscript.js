
//TODO: cache emotes, only retrive new emotes from the server when the cached ones are a day(?) old
//TODO: look up cloud_to_butt on github. would it be that easy?

no_global_emotes = false;
only_kappa = false;
no_sub_emotes = true;

//returns a hash table of emotes and paired image URLs (of the form [(string * string), ...]
function get_emotes() {
    //"if the data is a day old"
    xhr = new XMLHttpRequest();
    emote_obj = new Object();
    if (!no_global_emotes) {
        if (only_kappa) {
            return {'Kappa' : 'TODO'}; //TODO: replace TODO with url to kappa image
        }
        xhr.open('http://twitchemotes.com/global.json');
        xhr.send();
        //TODO: CREATE A HASH TABLE OF {emote_name : url} <- emote_name is very case sensitive.
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                emote_obj += JSON.parse(xhr.responsetext);
                if (!no_sub_emotes) {
                    xhr.open('http://twitchemotes.com/subscriber.json');
                    xhr.send();
                    xhr.onreadystatechange = function() {
                        if (xhr.readyState == 4) {
                            emote_obj += JSON.parse(xhr.responsetext);
                            return emote_obj;
                        }
                    }
                } else {
                    return emote_obj;
                }
            }
        }
    } else {
        if (!no_sub_emotes) {
            xhr.open('http://twitchemotes.com/subscriber.json');
            xhr.send();
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    emote_obj += JSON.parse(xhr.responsetext);
                    return emote_obj;
                }
            }
        }
    }
    //"else, get it from some sort of cache"(?) <- chrome storage api? LOCALSTORAGE???? limits and size
}

function draw_emotes() {
    var text = document.innerText;
    console.log(text);
    var emote_dict = get_emotes();
    for (var word in text.split(/\b/)) {
        if (word in emote_dict) {
            word = '<img src="'+emote_dict[word]+'">'; //this is probsies just a local change (to this function)
        }
    }
}

function dynamically_replace(evt) {
    var element = 
}

chrome.storage.sync.get({
  no_global_emotes: false,
  only_kappa: false
  no_sub_emotes: true,
}, function(items) {
  no_global_emotes = items.no_sub_emotes;
  only_kappa = items.only_kappa;
  no_sub_emotes = items.no_sub_emotes;
  document.addEventListener('DOMNodeInserted', dynamically_replace, false);
  get_emotes();
  draw_emotes();
});

