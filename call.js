/*
 *  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

'use strict';

const startButton = document.getElementById('startButton');
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
let pc1;
const offerOptions = {
  offerToReceiveAudio: 1,
  offerToReceiveVideo: 1
};



async function grabMedia() {
  console.log('Requesting local stream');
  startButton.disabled = true;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({audio: true, video: true});
    console.log('Received local stream');
    localVideo.srcObject = stream;
    localStream = stream;
    callButton.disabled = false;
  } catch (e) {
    alert(`getUserMedia() error: ${e.name}`);
  }
}


async function call() {
  await grabMedia()
  initiator=true;
  callButton.disabled = true;
  hangupButton.disabled = false;
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

  pc1 = new RTCPeerConnection();
  console.log('Created local peer connection object pc1');
  pc1.addEventListener('icecandidate', e => onIceCandidate(pc1, e));
  //pc1.addEventListener('iceconnectionstatechange', e => onIceStateChange(pc1, e));

  localStream.getTracks().forEach(track => pc1.addTrack(track, localStream));

  pc1.addEventListener('track', gotRemoteStream);

  console.log('Added local stream to pc1');

  try {
    console.log('pc1 createOffer start');
    const offer = await pc1.createOffer(offerOptions);
    await onCreateOfferSuccess(offer);
    } catch (e) {
    console.log(`Failed to create session description: ${error.toString()}`);
  }

}

//local sdp done, send it over
async function onCreateOfferSuccess(desc) {
  console.log(`Offer from pc1\n${desc.sdp}`);
  try {
    await pc1.setLocalDescription(desc);
    sendCallParam(0,desc) //maybe this doesnt work idk
  } catch (e) {
    console.log('failed to set the session description to \n', desc)
  }
}

//got sdp answer
async function sendAnswer(desc) {
  console.log(`Setting remote description to:\n${desc}`);
  try {
    await pc1.setRemoteDescription(new RTCSessionDescription(desc));
    var answer = await pc1.createAnswer();
    await pc1.setLocalDescription(answer);
    sendCallParam(0,answer)
  } catch (e) {
    console.log('failed to set the session description to \n', desc)
  }
}

//when generating a new ice candidate4
// only need to have "send it" in here, need a separate one for adding it
async function onIceCandidate(pc, event) {
  try {
    sendCallParam(0,event.candidate) //maybe this doesnt work id
  } catch (e) {
  }
  console.log(`ICE candidate:\n${event.candidate ? event.candidate.candidate : '(null)'}`);
}

async function onOfferRecieved(signalingMsgs) {
  if(typeof pc1 == "undefined"){
  await grabMedia()
  //if you arent the initiator!!!
  callButton.disabled = true;
  hangupButton.disabled = false;
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

  pc1 = new RTCPeerConnection();
  console.log('Created local peer connection object pc1');
  pc1.addEventListener('icecandidate', e => onIceCandidate(pc1, e));
  //pc1.addEventListener('iceconnectionstatechange', e => onIceStateChange(pc1, e));

  localStream.getTracks().forEach(track => pc1.addTrack(track, localStream));
  console.log('Added local stream to pc1');
  pc1.addEventListener('track', gotRemoteStream);
  }

  var i;
  for(i=0;i<signalingMsgs.length;i++){  //formatting broken
    if (signalingMsgs[i].includes("offer") ){
      sendAnswer(JSON.parse(signalingMsgs[i]));
    } else if (signalingMsgs[i].includes("candidate")) {//doesnt necessarily contain this
      console.log(`CANDIDATE ADDED ${signalingMsgs[i]}`)
      pc1.addIceCandidate(JSON.parse(signalingMsgs[i])) //formatting broken
    } else {
      console.log(`didnt do anything ${signalingMsgs[i]}`)
    } //or something
  }
  //check through list
  //pc- set remote setLocalDescription
  //set ices in the same loop? or after the loop idk
  //pc generate ANSWER
  //pc generate ices
  //send answer and ices

  }

  function gotRemoteStream(e) {
    if (remoteVideo.srcObject !== e.streams[0]) {
      remoteVideo.srcObject = e.streams[0];
      console.log('pc2 dreceived remote stream', e.streams);
    }
  }


async function onAnswerRecived(signalingMsgs) {
  var i;
  for(i=0;i<signalingMsgs.length;i++){  //formatting broken
    if (signalingMsgs[i].includes("answer")){
      console.log('answer recieved', signalingMsgs[i])
      pc1.setRemoteDescription(new RTCSessionDescription(JSON.parse(signalingMsgs[i])))
    } else if (signalingMsgs[i].includes("candidate")) {//doesnt necessarily contain this
      console.log(`CANDIDATE ADDED ${signalingMsgs[i]}`)
      pc1.addIceCandidate(JSON.parse(signalingMsgs[i])) //formatting broken
    } else {
       console.log(`didnt do anything ${signalingMsgs[i]}`)
    } //or something
  }
}

function hangup() {
  console.log('Ending call');
  pc1.close();
  pc1 = null;
  hangupButton.disabled = true;
  callButton.disabled = false;
}
