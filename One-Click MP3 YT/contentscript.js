
var newtab = true;
var autodl = true;
var show_related = true;
var show_results = true;
var playlists = true;
var otherpages = true;
var thumbnails = true;

function containsVideo(element) {
    if (!(element.firstChild)) 
        return false;
    var current = element.firstChild;
    while (current) {
        if (current.className && typeof current.className == "string" &&
            current.title == "Watch Later")
            //current.className.indexOf("addto-button video-actions") > -1)
        {
            return true;
        }
        if (containsVideo(current)) {
            return true;
        }
        current = current.nextSibling;
    }
    return false;
}

function checkIfNewVideo(event) { 
    var head = event.target;
    if (containsVideo(head)) {
        add_buttons();
    }
}
document.addEventListener('DOMNodeInserted', checkIfNewVideo, false);
/*
worked:
http://www.dirpy.com/download/Nujabes%20-%20Aruarian%20Dance.mp3?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DTUwRGPxCG_Y&format_id=0&audio_format=256K&start_time=00:00:00&end_time=21:00:00&type=audio&ID3%5Btitle%5D=Aruarian+Dance&ID3%5Bartist%5D=Nujabes&ID3%5Bcomment%5D=&ID3%5Bgenre%5D=&ID3%5Balbum%5D=&ID3%5Btrack%5D=0&ID3%5Byear%5D=&downloadToken=1403641945278

did not work:
http://www.dirpy.com/download/Nujabes%20-%20Aruarian%20Dance.mp3?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DTUwRGPxCG_Y&format_id=0&audio_format=256K&start_time=00:00:00&end_time=21:00:00&type=audio&ID3%5Btitle%5D=Aruarian+Dance&ID3%5Bartist%5D=Nujabes&ID3%5Bcomment%5D=&ID3%5Bgenre%5D=&ID3%5Balbum%5D=&ID3%5Btrack%5D=0&ID3%5Byear%5D=&downloadToken=1403641979397
*/

function get_dl_url(youtube_id, youtube_title) {  
        var title, artist = '';
        var temp = youtube_title, temp2 = youtube_title;
        title = temp2.split('-');
        if (title[0] != youtube_title) {
            a = temp.split('-');
            artist = a.shift();
            title = a.join('-');
        }
        if (typeof title != "string") {
            title = temp2.split(':');
            if (title[0] != youtube_title) {
                a = temp.split(':');
                artist = a.shift();
                title = a.join(':');
            }
        }
        if (typeof title != "string") {
            title = title[0];
        }
        var url = "http://www.dirpy.com/download/" +encodeURIComponent(youtube_title.trim())+".mp3"
        + "?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D" + encodeURIComponent(youtube_id)
        + "&format_id=0"
        + "&audio_format=256K"
        + "&start_time=00:00:00"
        + "&end_time=21:00:00"
        + "&type=audio"
        + "&ID3%5Btitle%5D=" +   ((title.trim()).replace(" ", "+"))
        + "&ID3%5Bartist%5D=" + ((artist.trim()).replace(" ", "+"))
        + "&ID3%5Bcomment%5D=&ID3%5Bgenre%5D=&ID3%5Balbum%5D=&ID3%5Btrack%5D=0&ID3%5Byear%5D="
        + "&downloadToken=" + (new Date().getTime());
        console.log(url);
        return url;
 }

/*
function clearOldButtons(num) {
    var child;
    for (var i=0; i<num; i++) {
        child = document.getElementById("mybutton" + i);
        if (child) {
            child.parentNode.removeChild(child);
        }
    }
}
*/

function add_buttons() {
chrome.storage.sync.get(
{
    newtab: true,
    autodl: true,
    show_on_search: true,
    show_on_related: true,
    playlists: true,
    otherpages: true,
    thumbnails: true
},  function(items) {
    window.newtab = items.newtab;
    window.autodl = items.autodl;
    window.show_results = items.show_on_search;
    window.show_related = items.show_on_related;
    window.playlists = items.playlists;
    window.otherpages = items.otherpages;
    window.thumbnails = items.thumbnails;

//This is the core functionality of the app. Adds a download link to the Youtube page.
if (window.location.pathname === "/watch" && !(document.getElementById("watchpage-dl-btn"))) {
        var youtube_id = window.location.search.split('v=')[1].split('&')[0];
        var div = document.getElementById("watch7-secondary-actions");
        var span = document.createElement("span");
        var imgURL = chrome.extension.getURL("images/yt-dl-icon.png");
        var title = document.getElementById("eow-title").title;
        var output = '';
        if (window.autodl) {
            output += '<form style="display:inline;marchin:0;padding:0;">';
            output += '<button id="watchpage-dl-btn" type="submit" class="yt-uix-button yt-uix-button-size-default yt-uix-button-text action-panel-trigger yt-uix-tooltip" type="submit" title="Download">';
            output += '<span><img src="'+imgURL+'"></span></button></form>';
            title = document.getElementById('eow-title').title;
            var mainvidurl = get_dl_url(youtube_id, title);
            var dl_mainvid = function () {
                    chrome.runtime.sendMessage({
                        method:"POST",
                        url:mainvidurl
                    }, function() {
                        window.location.assign(mainvidurl);
                    });
            }
        }
        else {
            output += '<form action="https://www.dirpy.com/studio" ';
            if (window.newtab) output += 'target="_blank" ';
            output += 'style="display: inline; margin: 0; padding: 0;">';
            output += '<input type="hidden" name="url" value=https://www.youtube.com/watch?v='+youtube_id+'></input>';
            output +=   '<button class="yt-uix-button yt-uix-button-size-default yt-uix-button-text action-panel-trigger yt-uix-tooltip" type="submit" title="Download ">';
            output +=   '<span><img src="'+imgURL+'"></span></button></form>';
        }
        span.innerHTML = output;
        div.insertBefore(span, div.firstChild);
        div.appendChild(span);
        if (window.autodl) {
            document.getElementById('watchpage-dl-btn').addEventListener('click', dl_mainvid);
        }
}

function form_action() {
    if (window.autodl) {
        return "http://www.dirpy.com/studio/download";
    }
    else {
        return "http://www.dirpy.com/studio";
    }
}

function make_button(i) {
    newButton = document.createElement("button");
    newButton.id = "mybutton" + i;
    newButton.type = "submit";
    newButton.className = "yt-uix-button yt-uix-button-size-small yt-uix-button-default video-actions spf-nolink hide-until-delayloaded addto-watch-later-button yt-uix-tooltip";
    newButton.title = "Download";
    newButton.style.left = "2px";
    newButton.innerHTML += '<span><img src="'+imgURL+'"></span>';
    return newButton;
}

var loc = window.location.pathname;
if (window.thumbnails && (
       (window.show_results && loc == "/results") ||
       (window.show_related && loc == "/watch") ||
       (window.playlists && loc == "/playlist") ||
       (window.otherpages && loc != "/results" && loc != "/watch" && loc != "/playlist")
   ))
{
    //List of all elements that are 'watch later' buttons
    var urls = [];
    var buttons = Array.prototype.filter.call(
        document.getElementsByTagName("button"),
        function(element) {
            return (element.title == 'Watch Later');
            //return ((element.className).indexOf("button-default addto-button video-actions") > -1);
        });
    var len = buttons.length;
    //clearOldButtons(len);
    var imgURL = chrome.extension.getURL("images/yt-thumb-dl-button.png");
    var youtube_id, newForm, newButton, title, master;
    var i = 0, j = 0;
    for (i=0; i<len; i++) {
        if (document.getElementById("mybutton"+i)) {
            continue;
        }
        newForm = document.createElement("form");
        newButton = make_button(i);
        youtube_id = buttons[i].getAttribute('data-video-ids');
        if (window.autodl) {
            //get the video's title to send to the download page
            if (window.location.pathname === "/watch") 
                title = buttons[i].parentNode.parentNode.getElementsByClassName("title")[0].innerHTML;
            else if (window.location.pathname == "/playlist") {
                title = document.getElementsByClassName("pl-video-title")[i].getElementsByTagName("a")[0].innerHTML;
            }
            else {
                master = buttons[i].parentNode.parentNode.parentNode;
                try {
                    title = master.getElementsByClassName('yt-lockup-title')[0].firstChild.title;
                } catch(err) {
                    try {
                        title = master.getElementsByTagName('B')[j].firstChild.innerHTML;
                        j++;
                    } catch (err2) {
                        var xhttp = new XMLHttpRequest();
                        xhttp.open("GET","https://gdata.youtube.com/feeds/api/videos/" + youtube_id, false);
                        xhttp.send();
                        var theXML = xhttp.responseXML;
                        title = theXML.getElementsByTagName("title")[0].innerHTML;
                    }
                }
            }
            var url = get_dl_url(youtube_id, title);
            urls.push(url);
            var download = function (x) {
                return function() {
                    chrome.runtime.sendMessage({
                        method:"POST",
                        url:urls[x]
                    }, function() { //this is what downloads the mp3 (if autodl) 
                        /*
                        var xhttp = new XMLHttpRequest();
                        xhttp.open("POST",urls[x], false);
                        //xhttp.setRequestHeader('Accept', 'text/plain');
                        xhttp.setRequestHeader('Content-Type', 'application/octet-stream');
                        xhttp.send();
                        */
                        window.location.assign(urls[x]);
                    });
                }
            }
            newButton.addEventListener('click', download(i));
        }
        else {
            newForm.action = "http://www.dirpy.com/studio";
            if (window.newtab) newForm.target = "_blank";
            newForm.innerHTML = '<input type="hidden" name="url" value=https://www.youtube.com/watch?v='+youtube_id+'></input>';
        }

        newForm.appendChild(newButton);
        buttons[i].parentNode.appendChild(newForm);

        var deleteThisButton = function(x) {
            return function () { // closures are the best
                var btn_to_delete = document.getElementById("mybutton"+x);
                btn_to_delete.style.left = "50000px";
                if (autodl) {
                    var parent_form = btn_to_delete.parentNode;
                    parent_form.submit();
                }
                //parent_form.removeChild(btn_to_delete); //This breaks it. For some reason.
            }
        }
        document.getElementById("mybutton"+i).addEventListener('click', deleteThisButton(i));
    }
}
});
}

add_buttons(); //initially add the buttons to the now-loaded page
               //if more video thumbnails are loaded, then more buttons will be added, dynamically!

