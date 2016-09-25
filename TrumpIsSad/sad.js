/*
 * Notes:
 * - data-reaction="7" is the "sad" index (as of Aug 2016)
 */

var style = document.createElement('style');
style.type = 'text/css';
style.id = 'sad';
style.textContent = '' + 
'._2p7a._3j7r, /* www */ ' + 
'._9--._3j7r, /* www */ ' + 
'.sp_Jnt3vJul-6Q.sx_608018, /* touch */ ' + 
'.sp_Jnt3vJul-6Q_2x.sx_369a07 /* touch */ ' + 
'{' +
'    background-image: url(http://i.imgur.com/ezT25HW.png) !important;'+
'    background-size: 16px 128px !important;'+
'    background-position: 0 -87px !important;'+
'}'+

'._9-y._3j7r /* www: when you click on Sad! */ ' + 
'{' +
'    background-image: url(http://i.imgur.com/ezT25HW.png) !important;'+
'    background-size: 13px 126px !important;'+
'    background-position: 0 -87px !important;'+
'}'+

'._iuz {'+
    'background-image: url(http://i.imgur.com/ezT25HW.png) !important;'+
'}'+
'._39m[data-reaction="7"] ._39n i {'+
'   background-image: url(http://i.imgur.com/ezT25HW.png) !important;'+
'}'+

// Gets rid of the original "Sad" text
'._39m[data-reaction="7"] ._39n div div {'+
'    display: none;'+
'    height: 0 !important;'+
'    width: 0 !important;'+
'}'+

'._39m[data-reaction="7"] ._39n div div:after {'+
'    display: none;'+
'    visibility: hidden;'+
'}'+

// Displays the new "Sad!" text
'._iuy ._39m[data-reaction="7"] ._39n div:after'+
'{'+
'    opacity: 1 !important;'+
'}'+

'._39m[data-reaction="7"] ._39n div:after'+
'{'+
'    content: \'Sad!\';'+
'    display: block;'+
'    visibility: visible;'+
'    background-color: rgba(0, 0, 0, .75);'+
'    border-radius: 10px;'+
'    box-sizing: border-box;'+
'    color: #fff;'+
'    font-size: 12px;'+
'    font-weight: bold;'+
'    line-height: 20px;'+
'    opacity: 0;'+
'    overflow: hidden;'+
'    padding: 0 8px;'+
'    text-decoration: none;'+
'    text-overflow: ellipsis;'+
'    transition: opacity 50ms ease;'+
'    -webkit-user-select: none;'+
'}'


document.getElementsByTagName('head')[0].appendChild(style);

