$(document).ready(function() {
  var namespace = null;
  if (document.location.hostname.indexOf('hyperaud') > 0) {
    namespace = document.location.hostname.substring(
      0,
      document.location.hostname.indexOf('hyperaud') - 1
    );
  }

  var prefix = '';
  if (namespace) prefix = namespace + '.';

  var domain;
  if (document.location.hostname.indexOf('hyperaud.io') > -1) {
    domain = 'hyperaud.io';
  } else {
    domain = 'hyperaudio.net';
  }

  // Init the API utility
  HA.api.init({
    org: namespace, // The organisations namespace / sub-domain. EG. 'chattanooga'
    domain: domain,
    protocol: 'https://',
    bgm: 'media?tag=bgm',
    whoami: 'auth/whoami/',
    signin: 'accounts/token',
    withCredentials: false
  });

  var API = 'https://' + prefix + 'api.' + domain + '/v1';

  $.ajaxPrefilter(function(options, originalOptions, jqXHR) {
    if (options.url.indexOf(API) == 0) {
      if (window.localStorage.getItem('token')) {
        jqXHR.setRequestHeader('Authorization', 'Bearer ' + window.localStorage.getItem('token'));
      }
    }
  });

  var mediaObject;
  var mediaID = purl(window.top.document.location.href).param('m');
  var transcriptID = purl(window.top.document.location.href).param('t');
  var transcriptObject;
  var user;

  var transcriptEl = document.getElementById('source-transcript');

  var savingAnim = document.querySelector('#save-button-saving');

  transcriptEl.addEventListener('mouseup', getSelection, false);
  transcriptEl.addEventListener('touchend', getSelection, false);

  function getSelection() {
    $('#format-para').removeAttr('disabled');
  }

  $('#format-para').click(function() {
    console.log('--- getting selection ---');
    var selection = transcriptObject.getSelection();

    //console.dir($("a[data-m='"+selection.start+"']"));

    var $start = $("a[data-m='" + selection.start + "']");
    var $end = $("a[data-m='" + selection.end + "']");

    $start
      .nextUntil($end.next())
      .andSelf()
      .wrapAll('<p/>');

    //console.log("prev length :"+$start.prev().length);
    /*if ($start.prev().length == 0) {
      console.log("already at start of para");
    }

    if ($end.next().length == 0) {
      console.log("already at end of para");
    }*/

    /*if($start.prev().length > 0) {
      $("</p><p>").insertBefore($start);
    }

    if($end.next().length > 0) {
      $("</p><p>").insertAfter($end);
    }*/

    /*$("<br>").insertBefore($start);
    $("<br>").insertAfter($end);*/

    console.log(selection.text);
    console.log(selection.start);
    console.log(selection.end);
  });

  function whoami(callback) {
    $.ajax(API + '/auth/whoami/' + window.localStorage.getItem('token'), {
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      success: function(whoami) {
        if (whoami.user) {
          // logged in
          //alert('logged in');
          user = whoami.user;

          var event = new CustomEvent('ga', {
            detail: { origin: 'HA-Cleaner', type: 'XHR', action: 'User logged in (whoami)' }
          });
          document.dispatchEvent(event);
        } else {
          // not logged in
          //alert('NOT logged in');
          user = null;

          var event = new CustomEvent('ga', {
            detail: { origin: 'HA-Cleaner', type: 'XHR', action: 'User NOT logged in (whoami)' }
          });
          document.dispatchEvent(event);
        }
        if (callback) callback();
      },
      xhrFields: {
        withCredentials: true
      },
      crossDomain: true
    });
  }

  /*----------------*/

  var selectWordTime = 0;

  var player = HA.Player({
    target: '#source-video',
    gui: {
      navigation: false,
      fullscreen: false
    }
  });

  var transcriptEl = document.getElementById('source-transcript');

  transcriptEl.addEventListener(HA.event.ready, setListeners, false);

  if (transcriptID) {
    transcriptObject = HA.Transcript({
      target: '#source-transcript',
      id: transcriptID,
      player: player
    });
    console.dir(transcriptObject);
  }

  function setListeners() {
    var words = document.getElementsByTagName('a');
    var selectedWord = document.getElementById('selected-word');
    var selectedWordTime = document.getElementById('selected-word-time');
    var tweakTime = document.getElementById('tweak-time');
    var timeChange;

    tweakTime.value = 0;
    selectedWord.value = '';
    selectedWordTime.value = '';

    for (var i = 0; i < words.length; i++) {
      words[i].onclick = function() {
        //console.dir(this.getAttribute("data-m"));
        selectWordTime = this.getAttribute('data-m');
        selectedWord.value = this.innerHTML; //.replace(" ","");
        selectedWordTime.value = selectWordTime;
        tweakTime.value = 0;
      };
    }

    selectedWord.oninput = function() {
      var theWord = document.querySelectorAll("a[data-m='" + selectWordTime + "']");
      theWord[0].innerHTML = selectedWord.value;
    };

    selectedWordTime.oninput = function() {
      var theWord = document.querySelectorAll("a[data-m='" + selectWordTime + "']");
      //console.log(ht.selectWordTime);
      theWord[0].setAttribute('data-m', selectedWordTime.value);
      selectWordTime = selectedWordTime.value;

      console.log('swt on ' + selectedWordTime.value);
    };

    selectedWordTime.onkeyup = function(e) {
      if (e.keyCode == 13) {
        player.play(parseInt(selectWordTime) / 1000);
        console.log(selectWordTime);
      }
    };

    $('#tweak-time').on('input', function() {
      timeChange = parseInt(this.value);
      player.play((parseInt(selectWordTime) + timeChange) / 1000);
      //selectedWordTime.value = parseInt(selectWordTime)+timeChange;
      console.log('timeChange on ' + timeChange);
      console.log('selectWordTime on ' + selectWordTime);
      //return false;
    });

    //tweakTime.onkeyup = setWordTime;
    //tweakTime.onmouseup = setWordTime;

    $('#tweak-time').mouseup(function(e) {
      setWordTime();
      /*e.preventDefault();*/
      /*return false;*/
    });

    $('#tweak-time').keyup(function(e) {
      setWordTime();
      /*e.preventDefault();*/
      /*return false;*/
    });

    function setWordTime() {
      var theWord = document.querySelectorAll("a[data-m='" + selectWordTime + "']");
      selectWordTime = parseInt(selectWordTime) + timeChange;
      theWord[0].setAttribute('data-m', selectWordTime);
      selectedWordTime.value = selectWordTime;
      console.log('timeChange up ' + timeChange);
      console.log('selectWordTime up ' + selectWordTime);
      timeChange = 0;
    }

    //setInterval(function(){console.log("tc="+timeChange);$('#selected-word-time').val(parseInt(selectWordTime)+parseInt(timeChange))},500);
  }

  function updateTranscript(user) {
    var $copy = $('#source-transcript').clone();
    $copy.find('a').removeClass('transcript-grey');
    $copy.find('a').removeClass('selected');

    console.log('user:' + user);
    console.log('owner:' + HA.api.transcript.owner);
    console.dir(HA.api.transcript);

    savingAnim.style.display = 'block';

    if (user != HA.api.transcript.owner) {
      $.ajax(API + '/transcripts/', {
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify({
          label: HA.api.transcript.label,
          type: 'html',
          sort: 0,
          owner: user,
          content: $copy.html(),
          media: HA.api.transcript.media._id
        }),
        success: function(data) {
          transcriptObject = data;
          console.log(data);
          console.log('Saved!');
          savingAnim.style.display = 'none';
          //console.log("label : "+HA.api.transcript.label);
          //console.log("mediaId : "+HA.api.transcript.media);
          //console.dir(HA.api);
        },
        error: function() {
          alert('Save Error');
          savingAnim.style.display = 'none';
        },
        xhrFields: {
          withCredentials: true
        },
        crossDomain: true
      });
    } else {
      $.ajax(API + '/transcripts/' + transcriptID, {
        type: 'PUT',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify({
          _id: transcriptID,
          label: HA.api.transcript.label,
          type: 'html',
          sort: 0,
          owner: user,
          content: $copy.html(),
          media: HA.api.transcript.media._id
        }),
        success: function(data) {
          transcriptObject = data;
          console.log(data);
          console.log('Saved!');
          savingAnim.style.display = 'none';
          //console.log("label : "+HA.api.transcript.label);
          //console.log("mediaId : "+HA.api.transcript.media);
          //console.dir(HA.api);
        },
        error: function() {
          alert('Save Error');
          savingAnim.style.display = 'none';
        },
        xhrFields: {
          withCredentials: true
        },
        crossDomain: true
      });
    }
  }

  function save() {
    whoami(function() {
      if (user) {
        //
        if (transcriptObject) {
          updateTranscript(user);
        } else {
          alert('error no transcriptObject');
        }
        //
      } else {
        alert('not logged in');
      }
    });
  }

  $('#save-button').click(function() {
    save();
  });
});
