
//TODO: cache emotes, only retrive new emotes from the server when the cached ones are a day(?) old
//TODO: recursive screenshot of the extension page as the first screenshot.
//TODO: show screenshots of it working in hitbox chat lol (second screenshot)
//TODO: look up how to concatenate 2 dictionaries easily/quickly

// some default settings
no_global_emotes = false;
only_kappa = false;
no_sub_emotes = true;

emote_dict = {};

// get settings -> run the program
chrome.storage.sync.get({
        no_global_emotes: false,
        only_kappa: false
        no_sub_emotes: true,
    },function(items) {
        no_global_emotes = items.no_sub_emotes;
        only_kappa = items.only_kappa;
        no_sub_emotes = items.no_sub_emotes;
        document.addEventListener('DOMNodeInserted', dynamically_replace, false);
        emote_dict = get_emotes();
        dfs(document.body);
    }
);


//returns a hash table of emotes and paired image URLs (of the form [(string * string), ...]
function get_emotes() {
    //"if there's no cached data" "or the data is a week old" "or if i goddamn tell you to remotely"
    var xhr = new XMLHttpRequest();
    var emote_obj = {};
    //get the global emotes
    if (!no_global_emotes) {
        if (only_kappa) {
            return {'Kappa':'http://TODO.com'}; //TODO: replace http://TODO.com with url to kappa image
        }
        xhr.open('http://twitchemotes.com/global.json');
        xhr.send();
        //TODO: CREATE A HASH TABLE OF {emote_name : url} <- emote_name is very case sensitive.
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                emote_obj = JSON.parse(xhr.responsetext);
                if (!no_sub_emotes) {
                    //get the sub emotes as well as the global emotes
                    xhr.open('http://twitchemotes.com/subscriber.json');
                    xhr.send();
                    xhr.onreadystatechange = function() {
                        if (xhr.readyState == 4) {
                            emote_list = JSON.parse(xhr.responsetext);
                            for (var emote_d in emote_list) { //there's gotta be a one liner for this
                                for (var key in emote_d) {
                                    emote_obj[key] = emote_d[key];
                                }
                            }
                            return emote_obj;
                        }
                    }
                } else {
                    return emote_obj;
                }
            }
        }
    //get the sub emotes
    } else if (!no_sub_emotes) {
        xhr.open('http://twitchemotes.com/subscriber.json');
        xhr.send();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                emote_obj = JSON.parse(xhr.responsetext);
                return emote_obj;
            }
        }
    } else {
        return {};
    }
    //"else, get it from some sort of cache"(?) <- chrome storage api? limits and size
}

function dynamically_replace(evt) {
    var element = evt.target;

    //AKA, ignore twitch chat lines
    if (element && (!element.className || element.className.indexOf('chat-line') == -1)) {
        dfs(element);
    }
}

function replace_text(element) {
    var value = element.nodeValue;
    for (var word in value.split(/\b/)) {
        if (word in emote_dict) {
            value = value.replace(word, '<img src="'+emote_dict[word]+'">');
        }
    }
    element.nodeValue = value;
}

function dfs(element) {
    var child, next;
    switch(element.nodeType) {
        case 1: //switch cases are so readable. heh. i <3 u javascript.
        case 9:
        case 11:
            child = element.firstChild;
            while (child) {
                next = child.nextSibling;
                dfs(child);
                child = next;
            }
        case 3:
            replace_text(element);
            break
    }
}

