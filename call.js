/*
 *  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

'use strict';

const callButton = document.getElementById('callButton');
const hangupButton = document.getElementById('hangupButton');
hangupButton.disabled = true;
callButton.addEventListener('click', call);
hangupButton.addEventListener('click', hangup);
var initiator = false;


let startTime;
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');

localVideo.addEventListener('loadedmetadata', function() {
  console.log(`Local video videoWidth: ${this.videoWidth}px,  videoHeight: ${this.videoHeight}px`);
});

remoteVideo.addEventListener('loadedmetadata', function() {
  console.log(`Remote video videoWidth: ${this.videoWidth}px,  videoHeight: ${this.videoHeight}px`);
});

remoteVideo.addEventListener('resize', () => {
  console.log(`Remote video size changed to ${remoteVideo.videoWidth}x${remoteVideo.videoHeight}`);
  // We'll use the first onsize callback as an indication that video has started
  // playing out.
  if (startTime) {
    const elapsedTime = window.performance.now() - startTime;
    console.log('Setup time: ' + elapsedTime.toFixed(3) + 'ms');
    startTime = null;
  }
});

let localStream;
let pc;
const offerOptions = {
  offerToReceiveAudio: 1,
  offerToReceiveVideo: 1
};

const configuration = {iceServers: [{urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19305']}]};
//basically getUserMedia call
async function grabMedia() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({audio: true, video: true});
    localVideo.srcObject = stream;
    localStream = stream;
    callButton.disabled = false;
  } catch (e) {
    alert(`getUserMedia() error: ${e.name}`);
  }
}

//create PC and add local tracks
async function initPC() {
  callButton.disabled = true;
  hangupButton.disabled = false;

  //get local media
  await grabMedia()
  console.log('Starting call');
  startTime = window.performance.now();
  const videoTracks = localStream.getVideoTracks();
  const audioTracks = localStream.getAudioTracks();

  if (videoTracks.length > 0) {
    console.log(`Using video device: ${videoTracks[0].label}`);
  }
  if (audioTracks.length > 0) {
    console.log(`Using audio device: ${audioTracks[0].label}`);
  }

  //create pc
  pc = new RTCPeerConnection(configuration);
  pc.addEventListener('icecandidate', e => onIceCandidate(pc, e));

  //add local stram  tracks to pc
  localStream.getTracks().forEach(track => pc.addTrack(track, localStream));
  pc.addEventListener('track', gotRemoteStream);

  pc.onconnectionstatechange = function(event) {
    console.log("Connection state: ", pc.connectionState)
    if (pc.connectionState == "closed" || pc.connectionState == "failed" || pc.connectionState == "disconnected")
    {
      hangup();
    }
  }
}

// initiate a call
async function call() {
  initiator=true;

  await initPC();

  try {
    const offer = await pc.createOffer(offerOptions);
    await onCreateOfferSuccess(offer);
    } catch (e) {
    console.log(`Failed to create session description: ${error.toString()}`);
  }

}

//local sdp created, send it over
async function onCreateOfferSuccess(desc) {
  try {
    await pc.setLocalDescription(desc);
    sendSignal(desc)
  } catch (e) {
    console.log('failed to set the session description to \n', desc.sdp)
  }
}

// when generating a new ice candidate
async function onIceCandidate(pc, event) {
  try {
    sendSignal(event.candidate) //maybe this doesnt work id
  } catch (e) {
    console.log(`failed to send ICE candidate:\n${event.candidate ? event.candidate.candidate : '(null)'}`);
  }

}


async function onOfferRecieved(signalingMsgs) {
  //only do this once per call
  if(typeof pc == "undefined" || pc == null){
    await initPC();
  }

  var i;
  for(i=0;i<signalingMsgs.length;i++){

    if (signalingMsgs[i].includes("offer")  && pc.remoteDescription == null ){ // and connection status is not yet stable
      await sendAnswer(JSON.parse(signalingMsgs[i]));
    } else if (signalingMsgs[i].includes("candidate") && pc.remoteDescription !== null) { // and remote sdp is already set
      console.log(signalingMsgs[i])//or something
      await pc.addIceCandidate(JSON.parse(signalingMsgs[i]))
    }

   }
  }

  // Set remote offer and send answer
  async function sendAnswer(desc) {
    try {
      await pc.setRemoteDescription(new RTCSessionDescription(desc));
      var answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      sendSignal(answer)
    } catch (e) {
      console.log('failed to set the remote description to \n', desc.sdp)
    }
  }

  // when stream is recieved display it
  function gotRemoteStream(e) {
    if (remoteVideo.srcObject !== e.streams[0]) {
      remoteVideo.srcObject = e.streams[0];
      console.log('received remote stream', e.streams);
    }
  }

// if peer sent an answer
async function onAnswerRecived(signalingMsgs) {
  var i;
  for(i=0;i<signalingMsgs.length;i++){
    if (signalingMsgs[i].includes("answer") && pc.remoteDescription == null){ // and conn status is not yet stable
      await pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(signalingMsgs[i])))
    } else if (signalingMsgs[i].includes("candidate") && pc.remoteDescription !== null) { // and remote sdp is already set
      await pc.addIceCandidate(JSON.parse(signalingMsgs[i]))
    }
  }
}

// for ending calls
function hangup() {
  console.log('Ending call');
  pc.close();
  pc = null;
  initiator=false;
  hangupButton.disabled = true;
  callButton.disabled = false;
}
