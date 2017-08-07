var hark = require('hark');
var getUserMedia = require('getusermedia');
var INITIAL_VOLUME = -100;
var maxVolume = INITIAL_VOLUME;

const scoreElem = document.querySelector('.score');
const output = document.querySelector('.output');

function resetMaxVolume() {
  maxVolume = INITIAL_VOLUME;
}

function showScore() {
  const niceScore = Math.abs(Math.floor(maxVolume));

  output.className = 'output';
  output.classList.add('output--finished-speaking');

  if (niceScore <= 10) {
    output.classList.add('output--holy-shit');
    scoreElem.innerHTML = 'HOLY SHIT';
  } else if(niceScore <= 15) {
    output.classList.add('output--wtf');
    scoreElem.innerHTML = 'WTF??';
  } else if(niceScore <= 20) {
    output.classList.add('output--woah');
    scoreElem.innerHTML = 'woah nice';
  } else if(niceScore <= 25) {
    output.classList.add('output--not-bad');
    scoreElem.innerHTML = 'not bad';
  } else if(niceScore <= 30) {
    output.classList.add('output--ok');
    scoreElem.innerHTML = 'ok...';
  }
}

getUserMedia(function(error, stream) {
  if (error) {
    console.error(error);
  }

  var options = { threshold: -30 };
  var speechEvents = hark(stream, options);

  speechEvents.on('volume_change', function(volume) {
    // console.log('volume change', volume);
    if (volume > maxVolume) {
      maxVolume = volume;
    }
  });

  speechEvents.on('speaking', function() {
    // console.log('speaking');

    output.className = 'output';
    output.classList.add('output--speaking');
  });

  speechEvents.on('stopped_speaking', function(data) {
    // console.log('stopped_speaking', maxVolume);

    output.classList.remove('output--speaking');

    showScore();
    resetMaxVolume();
  });
});
