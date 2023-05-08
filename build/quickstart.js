$(function () {
  // var speakerDevices = document.getElementById('speaker-devices');
  // var ringtoneDevices = document.getElementById('ringtone-devices');
  // var outputVolumeBar = document.getElementById('output-volume');
  // var inputVolumeBar = document.getElementById('input-volume');
  // var volumeIndicators = document.getElementById('volume-indicators');

  
  let urlParams;
  /*(window.onpopstate = function () {
      var match,
          pl     = /\+/g,  // Regex for replacing addition symbol with a space
          search = /([^&=]+)=?([^&]*)/g,
          decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
          query  = window.location.search.substring(1);
    
      urlParams = {};
      while (match = search.exec(query))
        urlParams[decode(match[1])] = decode(match[2]);
  })();
*/
  //document.getElementById('phone-number').innerText = name;


  log('Initializing call environment...');
  // https://straw-chipmunk-2135.twil.io/capability-token
  $.getJSON('https://pumpkin-hawk-8365.twil.io/capability-token')
  //Paste URL HERE
    .done(function (data) {
      log('Initialization completed.');
      // console.log('Token: ' + data.token);

      // Setup Twilio.Device
      Twilio.Device.setup(data.token);

      Twilio.Device.ready(function (device) {
        log('Device is ready!');
        //document.getElementById('call-controls').style.display = 'block';
      });

      Twilio.Device.error(function (error) {
        log('Twilio.Device Error: ' + error.message);
      });

      Twilio.Device.connect(function (conn) {
        bindVolumeIndicators(conn);
      });

      Twilio.Device.disconnect(function (conn) {
      });

      Twilio.Device.incoming(function (conn) {
        var archEnemyPhoneNumber = '+12099517118';

        if (conn.parameters.From === archEnemyPhoneNumber) {
          conn.reject();
          log('It\'s your nemesis. Rejected call.');
        } else {
          // accept the incoming connection and start two-way audio
          conn.accept();
        }
      });

      setClientNameUI(data.identity);

      Twilio.Device.audio.on('deviceChange', updateAllDevices);

      // Show audio selection UI if it is supported by the browser.
      if (Twilio.Device.audio.isSelectionSupported) {
        document.getElementById('output-selection').style.display = 'block';
      }
    })
    .fail(function () {
      log('Could not get a token from server!');
    });

  function bindVolumeIndicators(connection) {
    log("calling:",connection)
    connection.volume(function(inputVolume, outputVolume) {
      var inputColor = 'red';
      if (inputVolume < .50) {
        inputColor = 'green';
      } else if (inputVolume < .75) {
        inputColor = 'yellow';
      }

      var outputColor = 'red';
      if (outputVolume < .50) {
        outputColor = 'green';
      } else if (outputVolume < .75) {
        outputColor = 'yellow';
      }

    });
  }

  function updateAllDevices() {
  }
});

function updateDevices(selectEl, selectedDevices) {
}

// Activity log
function log(message) {/*
  var logDiv = document.getElementById('log');
  logDiv.innerHTML += '<p>&gt;&nbsp;' + message + '</p>';
  logDiv.scrollTop = logDiv.scrollHeight;*/
  console.log(message);
}

// Set the client name in the UI
function setClientNameUI(clientName) {
  /*var div = document.getElementById('client-name');
  div.innerHTML = 'Your client name: <strong>' + clientName +
    '</strong>';*/
}
