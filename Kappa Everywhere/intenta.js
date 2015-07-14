function injectIntentaCode(){
    var token = 'f-mquvqUrwJ84ds6mf6-qQ';
    var intentaSnippet = '(' + function(token) {
        document.getElementsByTagName('body')[0].setAttribute('data-int_token', token);
        (function() {
        var inScript = document.createElement('script');
        inScript.type = 'text/javascript';
        inScript.async = true;
        inScript.src = '//snippet.intenta.io/snippet.js';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(inScript, s);
        })();
    } + ')("'+token+'");';

    var intentaScript = document.createElement('script');
    intentaScript.textContent = intentaSnippet;
    (document.head||document.documentElement).appendChild(intentaScript);
    intentaScript.parentNode.removeChild(intentaScript);
}
injectIntentaCode();
