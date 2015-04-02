/**
 * Created by dhruv.gohil on 2/4/15. from coffee
 */
(function() {
    var baseFrequency, beepLength, char, characters, context, freq, freqCodes, frequencies, i, semitone, _i, _len;

    window.AudioContext || (window.AudioContext = window.webkitAudioContext || window.mozAudioContext || window.msAudioContext || window.oAudioContext);

    semitone = 1.05946311;

    baseFrequency = 1760;

    beepLength = 87.2;

    characters = '0123456789abcdefghijklmnopqrstuv';

    freqCodes = {};

    frequencies = [];

    for (i = _i = 0, _len = characters.length; _i < _len; i = ++_i) {
        char = characters[i];
        freq = +(baseFrequency * Math.pow(semitone, i)).toFixed(3);
        freqCodes[char] = freq;
        frequencies[i] = freq;
    }

    context = new AudioContext();

    window.chirp = function(message, ecc) {
        var chirp, front_door, gainNode, now, oscillator, _j, _len1;
        front_door = 'hj';
        chirp = front_door + message + ecc;
        oscillator = context.createOscillator();
        gainNode = context.createGain();
        gainNode.gain.value = 0.5;
        oscillator.connect(gainNode);
        gainNode.connect(context.destination);
        now = context.currentTime;
        for (i = _j = 0, _len1 = chirp.length; _j < _len1; i = ++_j) {
            char = chirp[i];
            oscillator.frequency.setValueAtTime(freqCodes[char], now + (beepLength / 1000 * i));
        }
        oscillator.start(now);
        return oscillator.stop(now + (beepLength / 1000 * (chirp.length + 1)));
    };

    window.chirp_url = function(url) {
        var body, xhr;
        xhr = new XMLHttpRequest();
        body = JSON.stringify({
            'url': url,
            'mimetype': 'text/x-url'
        });
        xhr.open('POST', '//chirpgw.appspot.com', true);
        xhr.overrideMimeType('application/javascript');
        xhr.onreadystatechange = function() {
            var longcode, response;
            if (this.readyState === 4) {
                response = JSON.parse(xhr.responseText);
                longcode = response['longcode'];
                return window.chirp(longcode);
            }
        };
        return xhr.send(body);
    };

}).call(this);
