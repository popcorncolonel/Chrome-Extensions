
//TODO: cache emotes, only retrive new emotes from the server when the cached ones are a day(?) old
//TODO: look up cloud_to_butt on github. would it be that easy?

//returns a list of emotes and their image URLs (in the form [(string * string), ...]
function get_emotes() {
    //"if the data is a day old"
    xhr = new XMLHttpRequest();
    //is this in the twitch api as well? is it faster?
    xhr.open('http://twitchemotes.com/global.json');
    xhr.send();
    emote_obj = new Object();
    //TODO: CREATE A HASH TABLE OF {emote_name : url} <- emote_name is very case sensitive.
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            emote_obj += JSON.parse(xhr.responsetext);
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
    text = document.innerText;
    console.log(text);
    emote_dict = get_emotes();
    for (var word in text.split(/\b/)) {
        if (word in emote_dict) {
            word = '<img src="'+emote_dict[word]+'">'; //this is probsies just a local change (to this function)
        }
    }
}

draw_emotes();

