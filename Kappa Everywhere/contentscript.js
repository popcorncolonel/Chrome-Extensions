
//TODO: cache emotes, only retrive new emotes from the server when the cached ones are a day(?) old
//      maybe when twitchemotes.com yells at me
//TODO: get an icon that's not copywritten? if twitch mentions it. i'm not making money off this so...

// some default settings
kappa = false;
globals = true;
subs = true;
bttv = false;
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
	filter_text: '',
	site_filter_text: '',
},function(items) {
    kappa = items.kappa;
    globals = items.globals;
    subs = items.subs;
	bttv = items.bttv;

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

/*
//sub "emote" names to ignore
ignorelist = ['Win','Lose','GG','Kill','IMBA','CA','US','Pylon','Gosu','Fighting','Cheese','TW','KR','SG','NL','JP','HK','double','triple','SNIPE','SK','POISON','C9','inverse','Anubis','Fraud','COAST','ICEFROG','Ra','Apollo','Roshan','Demon','Zhong','Thor','Dead','facepalm']

xhr = new XMLHttpRequest();
*/
function do_dfs(evt) {
    // Continue with the search?
    var cont = false; 
    // If the user specified to blacklist this site, don't do the DFS.
    site_filter_list.forEach(function(e) { 
        if (location.hostname.indexOf(e) > -1)
            return;
        cont = true;
    });
    if (cont && loaded1 && loaded2 && loaded3 && loaded4)
        dfs(document.body);
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
	for(dis in disallowedChars)
		if(word.indexOf(dis) > -1)
			return true;
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
    xhr.open('GET', '//twitchemotes.com/global.json');
    xhr.send();
    xhr.onload = function() {
		emote_d = JSON.parse(xhr.responseText);
		for (var key in emote_d) {
            if (filter_list.indexOf(key) == -1) {
                emote_dict[key] = {url:emote_d[key]['url']};
            }
		}
        loaded2 = true;
		document.dispatchEvent(dfsEvent);
    }
}

function get_subs() {
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
}

function get_bttv() {
	var xhr = new XMLHttpRequest();
    xhr.open('GET', '//cdn.betterttv.net/emotes/emotes.json');
    xhr.send();
    xhr.onload = function() {
        emote_d = JSON.parse(xhr.responseText);
		for (var key in emote_d) {
			var word = emote_d[key]['regex'];
			if(!containsDisallowedChar(word) && 
                filter_list.indexOf(key) != -1) {
				emote_dict[emote_d[key]['regex']] = {url:emote_d[key]['url']};
			}
		}
        loaded4 = true;
		document.dispatchEvent(dfsEvent);
	}
}

function dynamically_replace(evt) {
    var element2 = evt.target;
    //twitter hack solution
    if (element2 && element2.tagName && element2.tagName.toLowerCase() == 'div') {
        if (element2.parentElement.className.indexOf('tweet-box') > -1 || 
            element2.parentElement.className.indexOf('normalizer') > -1)
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
                found = true;
                img = document.createElement('img');
                img.src = emote_dict[word]['url'];
                img.title = word;
                img.alt = word;
				img.setAttribute('channel', emote_dict[word]['channel']); // Useful for debug :)
                img.style.display = 'inline';
                txt = document.createTextNode(buffer);
                parent_element.insertBefore(txt, element);
                parent_element.insertBefore(img, element);
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

