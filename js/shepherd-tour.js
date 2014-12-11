(function() {
  var uniqueCookieId = "hyperaudio-cleaner-hint=true";
  var init, setupShepherd;

  init = function() {
    return setupShepherd();
  };

  setupShepherd = function() {
    var shepherd;

    // set the cookie

    document.cookie = uniqueCookieId;

    shepherd = new Shepherd.Tour({
      defaults: {
        classes: 'shepherd-element shepherd-open shepherd-theme-arrows',
        showCancelLink: true
      }
    });
    shepherd.addStep('welcome', {
      text: ['The Hyperaudio Cleaner allows you to correct incorrect timings or text in a Hyperaudio compatible timed-transcript (hypertranscript).'],
      attachTo: '#source-video',
      classes: 'shepherd shepherd-open shepherd-theme-arrows shepherd-transparent-text',
      buttons: [
        {
          text: 'Exit',
          classes: 'shepherd-button-secondary',
          action: shepherd.cancel
        }, {
          text: 'Next',
          action: shepherd.next,
          classes: 'shepherd-button-example-primary'
        }
      ]
    });
    shepherd.addStep('one', {
      text: 'Press play to see the transcript played back in time with the audio or video. ',
      attachTo: '.hyperaudio-player-play',
      buttons: [
        {
          text: 'Back',
          classes: 'shepherd-button-secondary',
          action: shepherd.back
        }, {
          text: 'Next',
          action: shepherd.next
        }
      ]
    });
    shepherd.addStep('two', {
      text: 'Click on the text to skip directly to the relevant piece of the media.',
      attachTo: '#source-transcript',
      buttons: [
        {
          text: 'Back',
          classes: 'shepherd-button-secondary',
          action: shepherd.back
        }, {
          text: 'Next',
          action: shepherd.next
        }
      ]
    });
    shepherd.addStep('three', {
      text: 'Once selected you can alter the text ...',
      attachTo: '#selected-word',
      buttons: [
        {
          text: 'Back',
          classes: 'shepherd-button-secondary',
          action: shepherd.back
        }, {
          text: 'Next',
          action: shepherd.next
        }
      ]
    });
    shepherd.addStep('four', {
      text: '... or the timing.',
      attachTo: '#selected-word-time',
      buttons: [
        {
          text: 'Back',
          classes: 'shepherd-button-secondary',
          action: shepherd.back
        }, {
          text: 'Next',
          action: shepherd.next
        }
      ]
    });
    shepherd.addStep('five', {
      text: 'Fine tune the timing by scrubbing to the appropriate point with the slider.',
      attachTo: '#tweak-time',
      buttons: [
        {
          text: 'Back',
          classes: 'shepherd-button-secondary',
          action: shepherd.back
        }, {
          text: 'Next',
          action: shepherd.next
        }
      ]
    });
    shepherd.addStep('six', {
      text: 'Split the transcript into paragraphs by highlighting the text you want to format and pressing the paragraph button.',
      attachTo: '#format-para',
      buttons: [
        {
          text: 'Back',
          classes: 'shepherd-button-secondary',
          action: shepherd.back
        }, {
          text: 'Next',
          action: shepherd.next
        }
      ]
    });
    shepherd.addStep('seven', {
      text: 'Remember to save your work before moving on!',
      attachTo: '#save-button',
      buttons: [
        {
          text: 'Back',
          classes: 'shepherd-button-secondary',
          action: shepherd.back
        }, {
          text: 'Done',
          action: shepherd.next
        }
      ]
    });
    return shepherd.start();
  };

  if (document.cookie.indexOf(uniqueCookieId) < 0) {
    $(init);
  }

}).call(this);
