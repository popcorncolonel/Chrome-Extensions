
//TODO: cache emotes, only retrive new emotes from the server when the cached ones are a day(?) old
//TODO: recursive screenshot of the extension page as the first screenshot.
//TODO: show screenshots of it working in hitbox chat lol (second screenshot)
//TODO: mention ReChat in the description (screenshot?)
//TODO: get an icon that's not copywritten? if twitch mentions it. i'm not making money off this so

// some default settings
all = true;
only_globals = true;
only_subs = false;
only_kappa = false;

emote_dict = {};

// get settings -> run the program
chrome.storage.sync.get({
        all: false,
        only_globals: true,
        only_subs: false,
        only_kappa: false,
    },function(items) {
        all = items.all;
        only_globals = items.only_globals;
        only_subs = items.only_subs;
        only_kappa = items.only_kappa;
        replace_words();
    }
);

//sub "emote" names to ignore
ignorelist = ['0']

function replace_words() {
    //"if there's no cached data" "or the data is a week old" "or if i goddamn tell you to remotely"
    var xhr = new XMLHttpRequest();
    if (all) {
        xhr.open('GET', 'http://twitchemotes.com/global.json');
        xhr.send();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                emote_dict = JSON.parse(xhr.responseText);
                //get the sub emotes as well as the global emotes
                xhr.open('GET', 'http://twitchemotes.com/subscriber.json');
                xhr.send();
                xhr.onreadystatechange = function() {
                    if (xhr.readyState == 4) {
                        emote_d = JSON.parse(xhr.responseText);
                        for (var key in emote_d) {
                            if (ignorelist.indexOf(key) == -1) {
                                for (var key2 in emote_d[key]['emotes']) {
                                    emote_dict[key2] = {url:emote_d[key]['emotes'][key2]};
                                }
                            }
                        }
                        dfs(document.body);
                        document.addEventListener('DOMNodeInserted', dynamically_replace, false);
                    }
                }
            }
        }
    }

    if (only_globals) {
        xhr.open('GET', 'http://twitchemotes.com/global.json');
        xhr.send();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                emote_dict = JSON.parse(xhr.responseText);
                dfs(document.body);
                document.addEventListener('DOMNodeInserted', dynamically_replace, false);
            }
        }
    }

    if (only_subs) {
        xhr.open('GET', 'http://twitchemotes.com/subscriber.json');
        xhr.send();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                emote_d = JSON.parse(xhr.responseText);
                for (var key in emote_d) {
                    if (ignorelist.indexOf(key) == -1) {
                        for (var key2 in emote_d[key]['emotes']) {
                            emote_dict[key2] = {url:emote_d[key]['emotes'][key2]};
                        }
                    }
                }
                console.log(emote_dict);
                dfs(document.body);
                document.addEventListener('DOMNodeInserted', dynamically_replace, false);
            }
        }
    }

    if (only_kappa) {
        emote_dict = {'Kappa':'//static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-ddc6e3a8732cb50f-25x28.png'};
        dfs(document.body);
        document.addEventListener('DOMNodeInserted', dynamically_replace, false);
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
        //this is actually a p. cool soln. it keeps a buffer of text to save and dynamically inserts and replaces text+emotes
        //For example, This is how this function would work on "Hey Kappa Kappa Hey Kappa Kappa Hey"
        //Read "Hey " -> replace "Kappa" -> read " " -> replace "Kappa" -> 
        //Read "Hey " -> replace "Kappa" -> read " " -> replace "Kappa" -> read " Hey"
        //Write the result to the DOM -> remove "Hey Kappa Kappa Hey Kappa Kappa Hey" from the DOM
        for (var i=0; i < len; i++) {
            word = split[i];
            if (emote_dict.hasOwnProperty(word)) {
                found = true;
                //value = value.replace(word, '<img alt="'+word+'" src="http:'+emote_dict[word]['url']+'">');
                img = document.createElement('img');
                img.src = emote_dict[word]['url'];
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
    } else { //if the node is the empty string or undefined or smth
        return;
    }
    //if we're replacing an emote at the end of a block, delete the text that was previously there
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

