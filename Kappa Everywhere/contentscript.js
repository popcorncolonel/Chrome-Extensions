
//TODO: cache emotes, only retrive new emotes from the server when the cached ones are a day(?) old
//TODO: get settings working!
//TODO: recursive screenshot of the extension page as the first screenshot.
//TODO: show screenshots of it working in hitbox chat lol (second screenshot)
//TODO: look up how to concatenate 2 dictionaries easily/quickly
//TODO: get an icon that's not copywritten

// some default settings
no_global_emotes = false;
only_kappa = false;
no_sub_emotes = true;

emote_dict = {};

// get settings -> run the program
chrome.storage.sync.get({
        no_global_emotes: false,
        no_sub_emotes: true,
        only_kappa: false,
    },function(items) {
        no_global_emotes = items.no_sub_emotes;
        no_sub_emotes = items.no_sub_emotes;
        only_kappa = items.only_kappa;
        no_global_emotes = false;
        no_sub_emotes = true;
        only_kappa = false;
        emote_dict = get_emotes();
    }
);


//returns a hash table of emotes and paired image URLs (of the form [(string * {'url', ...}), ...]
function get_emotes() {
    //"if there's no cached data" "or the data is a week old" "or if i goddamn tell you to remotely"
    var xhr = new XMLHttpRequest();
    var emote_obj = {};
    //get the global emotes
    if (!no_global_emotes) {
        if (only_kappa) {
            return {'Kappa':'http://static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-ddc6e3a8732cb50f-25x28.png'};
        }
        xhr.open('GET', 'http://twitchemotes.com/global.json');
        xhr.send();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                emote_obj = JSON.parse(xhr.responseText);
                if (!no_sub_emotes) {
                    //get the sub emotes as well as the global emotes
                    xhr.open('GET', 'http://twitchemotes.com/subscriber.json');
                    xhr.send();
                    xhr.onreadystatechange = function() {
                        if (xhr.readyState == 4) {
                            emote_d = JSON.parse(xhr.responseText);
                            for (var key in emote_d) {
                                emote_obj[key] = emote_d[key];
                            }
                            return emote_obj;
                        }
                    }
                } else {
                    emote_dict = emote_obj;
                    dfs(document.body);
                    document.addEventListener('DOMNodeInserted', dynamically_replace, false);
                    return emote_obj;
                }
            }
        }
    //get the sub emotes
    } else if (!no_sub_emotes) {
        xhr.open('GET','http://twitchemotes.com/subscriber.json');
        xhr.send();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                emote_obj = JSON.parse(xhr.responseText);
                return emote_obj;
            }
        }
    } else {
        console.log('returning nothing.');
        return {};
    }
    //"else, get it from some sort of cache" <- chrome storage api? limits and size and type (can dicts be values? do i need to json string it?)
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
    if (value) {
        var parent_element = element.parentElement;
        var split = value.split(/\b/);
        var len = split.length;
        var buffer = '';
        var found = false;
        for (var i=0; i < len; i++) {
            word = split[i];
            if (emote_dict.hasOwnProperty(word)) {
                found = true;
                console.log(word);
                value = value.replace(word, '<img alt="'+word+'" src="http:'+emote_dict[word]['url']+'">');
                img = document.createElement('img');
                img.src = 'http:'+emote_dict[word]['url'];
                txt = document.createTextNode(buffer);
                parent_element.insertBefore(txt, element);
                buffer = '';
                parent_element.insertBefore(img, element);
            } else {
                buffer += word;
                if (i == len-1) {
                    if (buffer != element.nodeValue) {
                        txt = document.createTextNode(buffer);
                        parent_element.insertBefore(txt, element);
                        element.nodeValue = '';
                    }
                }
            }
        }
    } else {
        return;
    }
    //if we're at the end
    if (buffer == '') {
        element.nodeValue = '';
    }
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

