//TODO: cache emotes, only retrive new emotes from the server when the cached ones are a day(?) old
//      maybe when twitchemotes.com yells at me
//TODO: get an icon that's not copywritten? if twitch mentions it. i'm not making money off this so...

// some default settings
kappa = false;
globals = true;
subs = true;
bttv = false;
mute = false;
filter_text = '';
filter_list = [];
site_filter_text = '';
site_filter_list = [];

emote_dict = new Array();

// get settings -> run the program
chrome.storage.sync.get({
    kappa: false,
    globals: true,
    subs: true,
	bttv: false,
    mute: false,
	filter_text: '',
	site_filter_text: '',
},function(items) {
    kappa = items.kappa;
    globals = items.globals;
    subs = items.subs;
	bttv = items.bttv;
    mute = items.mute;

    filter_text = items.filter_text;
    filter_list = filter_text.split(/[\.,\s]+/);
    if (filter_list.indexOf('') > -1) {
        filter_list.splice(filter_list.indexOf(''), 1);
    }

    site_filter_text = items.site_filter_text;
    site_filter_list = site_filter_text.split(/[,\s]+/);
    if (site_filter_list.indexOf('') > -1) {
        site_filter_list.splice(site_filter_list.indexOf(''), 1);
    }

    replace_words();
});

// One for each setting; so it doesn't dfs 4 times (dfs is pretty slow for huge webpages)
loaded1 = false;
loaded2 = false;
loaded3 = false;
loaded4 = false;

function replace_words() {
    // "If there's no cached data" "or the data is a week old" "or if i goddamn tell you to remotely"
    if (kappa) {
        get_kappa();
    } else loaded1 = true;

    if (globals) {
        get_globals();
    } else loaded2 = true;

    if (subs) {
        get_subs();
    } else loaded3 = true;

	if (bttv) {
		get_bttv();
    } else loaded4 = true;

    //"else, get it from some sort of cache" <- chrome storage api? limits and size and type (can dicts be values? do i need to json stringify it? Will that fit in chrome storage?)
}

function do_dfs(evt) {
    // If the user specified to blacklist this site, don't do the DFS.
    cont = false;
    for (var i=0; i < site_filter_list.length; i++) {
        if (location.hostname.indexOf(site_filter_list[i]) > -1) {
            cont = false;
            return;
        }
    }
    cont = true;
    if (cont && loaded1 && loaded2 && loaded3 && loaded4) {
        dfs(document.body);
    }
}
document.addEventListener('replaceWords', do_dfs, false);
document.addEventListener('DOMNodeInserted', dynamically_replace, false);

// Ignore unparsable emotes.
disallowedChars = ['\\', ':', '/', '&', "'", '"', '?', '!', '#'];

// Sub-channels to ignore.
ignoredChannels = ['agetv1', 'gsl_standard', 'gsl', 'gomexp_2014_season_two', 'gsl_premium',
                   'canadacup', 'smitegame', 'werster', 'beyondthesummit', 'srkevo1', 'thepremierleague',
                   'lionheartx10', 'starladder1', 'qfmarine', 'worldclasslol', 'quinckgaming', 'ilastpack'];

// please ignore this bad code yes it could have been done via regex but i feld
// like doing something meticulous today and didn't want to change the layout 
// of the program
smilies = new Object();
smilies[':Z'] = '//static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-b9cbb6884788aa62-24x18.png';
smilies[':z'] = '//static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-b9cbb6884788aa62-24x18.png';

smilies[':)'] = '//static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-ebf60cd72f7aa600-24x18.png';
smilies[':-)'] = '//static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-ebf60cd72f7aa600-24x18.png';

smilies[':('] = '//static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-d570c4b3b8d8fc4d-24x18.png';
smilies[':-('] = '//static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-d570c4b3b8d8fc4d-24x18.png';

smilies[':p'] = '//static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-e838e5e34d9f240c-24x18.png';
smilies[':P'] = '//static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-e838e5e34d9f240c-24x18.png';
smilies[':-p'] = '//static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-e838e5e34d9f240c-24x18.png';
smilies[':-P'] = '//static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-e838e5e34d9f240c-24x18.png';

smilies[';p'] = '//static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-3407bf911ad2fd4a-24x18.png';
smilies[';-p'] = '//static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-3407bf911ad2fd4a-24x18.png';
smilies[';P'] = '//static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-3407bf911ad2fd4a-24x18.png';
smilies[';-P'] = '//static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-3407bf911ad2fd4a-24x18.png';

smilies['<3'] = '//static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-577ade91d46d7edc-24x18.png';

smilies[':/'] = '//static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-374120835234cb29-24x18.png';
smilies[':|'] = '//static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-374120835234cb29-24x18.png';
smilies[':\\'] = '//static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-374120835234cb29-24x18.png';

smilies[';)'] = '//static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-cfaf6eac72fe4de6-24x18.png';
smilies[';-)'] = '//static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-cfaf6eac72fe4de6-24x18.png';

smilies['R)'] = '//static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-0536d670860bf733-24x18.png';
smilies['R-)'] = '//static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-0536d670860bf733-24x18.png';

smilies['o_O'] = '//static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-8e128fa8dc1de29c-24x18.png';
smilies['O_O'] = '//static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-8e128fa8dc1de29c-24x18.png';
smilies['o_o'] = '//static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-8e128fa8dc1de29c-24x18.png';
smilies['O_o'] = '//static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-8e128fa8dc1de29c-24x18.png';
smilies['o.O'] = '//static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-8e128fa8dc1de29c-24x18.png';
smilies['O.O'] = '//static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-8e128fa8dc1de29c-24x18.png';
smilies['o.o'] = '//static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-8e128fa8dc1de29c-24x18.png';
smilies['O.o'] = '//static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-8e128fa8dc1de29c-24x18.png';

smilies[':D'] = '//static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-9f2ac5d4b53913d7-24x18.png';
smilies[':-D'] = '//static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-9f2ac5d4b53913d7-24x18.png';

smilies[':o'] = '//static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-ae4e17f5b9624e2f-24x18.png';
smilies[':O'] = '//static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-ae4e17f5b9624e2f-24x18.png';
smilies[':-o'] = '//static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-ae4e17f5b9624e2f-24x18.png';
smilies[':-O'] = '//static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-ae4e17f5b9624e2f-24x18.png';

smilies['>('] = '//static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-d31223e81104544a-24x18.png';

smilies['B)'] = '//static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-2cde79cfe74c6169-24x18.png';
smilies['B-)'] = '//static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-2cde79cfe74c6169-24x18.png';
//this has been put on hold until i can figure out how to split words based on both whitespace and nonwhitespace characters
//end goal: to replace "test :) 'Kappa'" with both the :) and the Kappa and still leave in the spaces.

dfsEvent = document.createEvent("Event");
dfsEvent.initEvent('replaceWords', true, true);
	
function is_valid_sub_emote(emote_text) {
    return !(filter_list.indexOf(emote_text) != -1 || // if the user filters it out
             emote_text[0].match(/[A-Z]/g) || // if it has no prefix (starts with an uppercase letter
             emote_text.match(/^[a-z]+$/g) || // if all lowercase
             emote_text.match(/^\d*$/g) //if just a number
             );
}

function containsDisallowedChar(word) {
	for(c in disallowedChars) {
		if(word.indexOf(c) > -1) {
			return true;
        }
    }
	return false;
}
	
function get_kappa() {
    if (filter_list.indexOf('Kappa') == -1) {
        emote_dict['Kappa'] = {url:'//static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-ddc6e3a8732cb50f-25x28.png'};
        loaded1 = true;
        document.dispatchEvent(dfsEvent);
    }
}

function get_globals() {
	var xhr = new XMLHttpRequest();
    xhr.open('GET', '//twitchemotes.com/api_cache/v2/global.json');
    xhr.send();
    var url_template = "//static-cdn.jtvnw.net/emoticons/v1/" //{image_id}/1.0
    function done_with_loading() {
        loaded2 = true;
		document.dispatchEvent(dfsEvent);
    }
    xhr.ontimeout = function() {
        done_with_loading();
    };
    xhr.onload = function() {
		emote_d = JSON.parse(xhr.responseText)['emotes'];
		for (var emote in emote_d) {
            if (filter_list.indexOf(emote) == -1) {
                emote_dict[emote] = {url: url_template + emote_d[emote]['image_id'] + '/' + '1.0'};
            }
		}
        done_with_loading();
    }
}

function get_subs() {
	var xhr = new XMLHttpRequest();
    xhr.open('GET', '//twitchemotes.com/api_cache/v2/subscriber.json');
    xhr.send();
    var url_template = "//static-cdn.jtvnw.net/emoticons/v1/" //{image_id}/1.0
    function done_with_loading() {
        loaded3 = true;
		document.dispatchEvent(dfsEvent);
    }
    xhr.ontimeout = function() {
        done_with_loading();
    };
    xhr.onload = function() {
		emote_d = JSON.parse(xhr.responseText)['channels'];
		for (var channel in emote_d) {
			for (var i in emote_d[channel]['emotes']) {
                dict = emote_d[channel]['emotes'][i]
                var code = dict['code'];
				if (ignoredChannels.indexOf(channel.toLowerCase()) == -1 &&
                    is_valid_sub_emote(code)) {
                        emote_dict[code] = {
                            url: url_template + dict['image_id'] + '/' + '1.0',
                            channel: channel
                        };
				}
			}
		}
        done_with_loading();
		document.dispatchEvent(dfsEvent);
    }
    /*
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '//twitchemotes.com/subscriber.json');
    xhr.send();
    xhr.onload = function() {
		emote_d = JSON.parse(xhr.responseText);
		for (var key in emote_d) {
			for (var key2 in emote_d[key]['emotes']) {
				if (ignoredChannels.indexOf(key.toLowerCase()) == -1 &&
                    is_valid_sub_emote(key2)) {
                        emote_dict[key2] = {url:emote_d[key]['emotes'][key2], channel:key};
				}
			}
		}
        loaded3 = true;
		document.dispatchEvent(dfsEvent);
    }
    */
}

function get_bttv() {
	var xhr = new XMLHttpRequest();
    xhr.open('GET', '//api.betterttv.net/2/emotes');
    xhr.send();
    var url_template = "//cdn.betterttv.net/emote/"; // {{id}}/1x
    function done_with_loading() {
        loaded4 = true;
		document.dispatchEvent(dfsEvent);
    }
    xhr.ontimeout = function() {
        done_with_loading();
    };
    xhr.onload = function() {
        emote_list = JSON.parse(xhr.responseText)['emotes'];
		for (var i in emote_list) {
            var dict = emote_list[i];
			if(!containsDisallowedChar(dict['code']) && 
                filter_list.indexOf(dict['code']) == -1) {
				emote_dict[dict['code']] = {url:url_template+dict['id']+'/'+'1x'};
			}
		}
        done_with_loading();
	}
}

function get_all_parents(elt) {
    var a = elt;
    var parents = [a];
    while (a) {
        parents.unshift(a);
        a = a.parentNode;
    }
    return parents;
}

function do_not_replace(element2) {
    //twitter hack solution. lol it's getting hackier and hackier by the second.
    if (element2 && element2.tagName && element2.tagName.toLowerCase() == 'div') {
        if (element2.parentElement && element2.parentElement.parentElement) {
            if (element2.parentElement.parentElement.className.indexOf('tweet-') > -1 || 
                element2.parentElement.parentElement.className.indexOf('normalizer') > -1)
                return true;
        }
        if (element2.parentElement && element2.parentElement.parentElement && element2.parentElement.parentElement.parentElement) {
            if (element2.parentElement.parentElement.parentElement.className.indexOf('tweet-') > -1 || 
                element2.parentElement.parentElement.parentElement.className.indexOf('normalizer') > -1)
                return true;
        }
    }
    var want_to_exit = false;
    get_all_parents(element2).forEach(function(elt) {
        if (elt && elt.className && elt.className.indexOf &&
              (elt.className.indexOf('opentip') > -1)
            ) {
            want_to_exit = true;
        }
    });
    if (want_to_exit) {
        return true;
    }
    return false;
}

function dynamically_replace(evt) {
    var element2 = evt.target;
    //console.log(element2);
    // if this site isn't being blacklisted
    for (var i=0; i < site_filter_list.length; i++) {
        if (location.hostname.indexOf(site_filter_list[i]) > -1) {
            return;
        }
    }

    if (do_not_replace(element2)) {
        return;
    }

    //OH GOD HOW DO I MAKE BOOLEAN LOGIC READABLE ON JAVASCRIPT PLEASE TO HELP
    if (element2 && (!element2.className || 
                    // if it's not a popup bubble on twitch chat (BTTV)
                    //maybe the worst code i've ever written? yah. oh well it works lol
                    ((element2.className && element2.className.indexOf && element2.className.indexOf('tipsy') == -1 || 
                      (location && location.hostname && location.hostname.indexOf && location.hostname.indexOf('twitch.tv') == -1)) &&
                    //ignore twitch chat lines
                     element2.className.indexOf && element2.className.indexOf('chat-line') == -1)
                )) {
        dfs(element2);
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
            if (word in emote_dict && emote_dict[word]['url'] != undefined) {
                var url = emote_dict[word]['url'];
                found = true;
                img = document.createElement('img');
                img.src = url;
                //img.title = word;
                //img.alt = word;
				img.setAttribute('channel', emote_dict[word]['channel']); // Useful for debug :)
                img.style.display = 'inline';
                img.style.width = 'auto';
                img.style.overflow = 'hidden';

                var channel_name = emote_dict[word]['channel'];
                if (channel_name) {
                    channel_name = "Channel: " + channel_name;
                }
                var tooltip = new Opentip(img, channel_name, word, {
                    background: [[0, "rgba(255,255,255,0.95)"], [1, "rgba(210,210,210,0.95)"]],
                    borderColor: "rgba(120,120,120,0.97)",
                    offset: [0, 0],
                    showEffectDuration: 0.0,
                    hideEffectDuration: 0.0,
                    delay: 0.0,
                    hideDelay: 0.0,
                    tipJoint: "bottom",
                    target: img,
                });

                txt = document.createTextNode(buffer);
                parent_element.insertBefore(txt, element);
                if (!mute) {
                    parent_element.insertBefore(img, element);
                }
                buffer = '';
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
    if (do_not_replace(element)) {
        return;
    }
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

