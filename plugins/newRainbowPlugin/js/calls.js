import rainbowSDK from "./rainbow-sdk.min.js";
import {
        showPopup,
        startCall,
        endCall,
        showCallingPopup,
        showVideoCallingPopup
} from './elements.js';
import { currentConversationId } from './conversations.js';
export let currentCallingContact;
export let newMoreInfos;
let currentCall ;
export  function Call() {
        const moreInfos=document.querySelector('.more-infos');
        let oldMoreInfos;
        const callButton = document.getElementById('callButton');
        const videoCallButton = document.getElementById('videoCallButton');
        let endCallButton;
        const userAvatar = document.querySelector('.calling-interface .user-avatar');
        let waveAnimation;
        let phoneIcon;
        let callTimer;
        let Videos;
        let avatarContainer;
        let callDuration = 0;
        let callInterval;
        let contactId;   
        function startCallTimer() {
            callInterval = setInterval(() => {
                callDuration++;
                const minutes = Math.floor(callDuration / 60);
                const seconds = callDuration % 60;
                callTimer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }, 1000);
        }

        function stopCallTimer() {
            clearInterval(callInterval);
        }

        function resetCallTimer() {
            callDuration = 0;
            callTimer.textContent = '00:00';
        }

        function showCallingInterface() {
            if(currentConversationId){
            let conversation= rainbowSDK.conversations.getConversationById(currentConversationId);                
            moreInfos.innerHTML="";
            moreInfos.style.width="70%";
            moreInfos.innerHTML=`<div class="calling-interface">
                    <video id="globalVideoTag" autoplay style="display:none;"></video>
                    <audio id="globalAudioTag" autoplay style="display:none;"></audio>
                    <div class="call-timer" id="callTimer">00:00</div>
                <div class="avatar-container">
                    <div class="wave-animation"></div>
                    <img class="user-avatar" id="userAvatar" src="${conversation.avatar}" alt="User Avatar">
                    <i class="ri-phone-fill phone-icon"></i>
                </div> 
                <div class="videos">
                    <div class="item_video"><video id="largevideo" autoplay></video></div>
                   <div class="item_video"><video id="minivideo" class="minivideo" autoplay muted></video></div>
                </div>
                    <button class="end-call-button" >${hangUp}</button>
                    </div> </div>`;
                endCallButton= moreInfos.querySelector('.end-call-button');
                waveAnimation = moreInfos.querySelector('.wave-animation');
                phoneIcon = moreInfos.querySelector('.phone-icon');
                Videos = moreInfos.querySelector('.videos');
                callTimer = moreInfos.querySelector('.call-timer');
                avatarContainer=moreInfos.querySelector('.avatar-container');

}
 
}

function attachStreamToVideoElements() {
    rainbowSDK.webRTC.showLocalVideo();
}

        function hideCallingInterface() {
            moreInfos.innerHTML = "";
            moreInfos.style.width ="280px";
            moreInfos.innerHTML +=oldMoreInfos;
            stopCallTimer();
            resetCallTimer();
        }
        function checkData(){
             if (currentConversationId) {
                contactId = rainbowSDK.conversations.getConversationById(currentConversationId).contact.id;
            } else {
                console.error('currentConversationId is not set');
            }

            if (!rainbowSDK.webRTC.canMakeAudioVideoCall()) {
                console.error("Browser is not compliant for audio and video calls.");
                showPopup("Rainbow can't access your camera or microphone.");
                return;
            }
        }

        function callInAudio() {
           checkData();
            if (!rainbowSDK.webRTC.hasAMicrophone()) {
                console.error("No microphone detected.");
                showPopup("Rainbow can't access your camera or microphone.");            
                return;
            }
            startCall(currentConversationId);          
            rainbowSDK.webRTC.callInAudio(contactId).then(res => {
                if (res.label === "OK") {
                    console.log("Audio call initiated successfully.");
                    currentCallingContact = currentConversationId;
                    oldMoreInfos =moreInfos.innerHTML;
                    showCallingInterface();
                    waveAnimation.style.display='none';
                    phoneIcon.style.display = 'block';
                    Videos.style.display = 'none';
                    if (endCallButton) {
                       endCallButton.style.marginTop = '60%';
                        endCallButton.addEventListener('click', function() {
                            rainbowSDK.webRTC.release(currentCall.id).then(() => {
                                hideCallingInterface();
                                console.log("Call ended successfully.");
                            }).catch(err => {
                                console.error("Error ending call:", err);
                            });
                        });
                    } else {
                        console.error('endCallButton not found in the DOM');
                    }
                newMoreInfos = moreInfos.innerHTML;
                } else {
                    console.error("Failed to initiate audio call:", res);
                }
            }).catch(err => {
                console.error("Error initiating audio call:", err);
                if (err.message.includes("getUserMedia failure")) {
                    showPopup("Rainbow can't access your camera or microphone.");
                }
            });
        }
        function callInVideo(){
            checkData();
            if (!rainbowSDK.webRTC.hasACamera()) {
                console.error("No camera detected.");
                showPopup("Rainbow can't access your camera or microphone.");
                return;
            }
            startCall(currentConversationId);  
            rainbowSDK.webRTC.callInVideo(contactId).then(res => {
                if (res.label === "OK") {
                    currentCallingContact = currentConversationId;
                    showCallingInterface();
                waveAnimation.style.display='none';
                phoneIcon.style.display = 'block';
                Videos.style.display = 'none';
                if (endCallButton) {
                   endCallButton.style.marginTop = '60%';
                    endCallButton.addEventListener('click', function() {
                        rainbowSDK.webRTC.release(currentCall.id).then(() => {
                            hideCallingInterface();
                            console.log("Call ended successfully.");
                        }).catch(err => {
                            console.error("Error ending call:", err);
                        });
                    });
                } else {
                    console.error('endCallButton not found in the DOM');
                }
                newMoreInfos = moreInfos.innerHTML;
                } else {
                    console.error("Failed to initiate audio call:", res);
                }
            }).catch(err => {
                console.error("Error initiating audio call:", err);
                if (err.message.includes("getUserMedia failure")) {
                    showPopup("Rainbow can't access your camera or microphone.");
                }
            });
            
        }
        if (callButton) {
            callButton.addEventListener('click', function() {
                console.log("Call button clicked");
                oldMoreInfos = moreInfos.innerHTML; 
                callInAudio();
            });
        } else {
            console.error('callButton not found in the DOM');
        }
        
        if (videoCallButton) {
            videoCallButton.addEventListener('click', function() {
                console.log("video Call button clicked");
                oldMoreInfos = moreInfos.innerHTML; 
                callInVideo();
            });
        } else {
            console.error('videoCallButton not found in the DOM');
        }


        function onWebRTCErrorHandled(event) {
            let errorSDK = event.detail;
            console.log("WebRTC ERROR", errorSDK);
            showPopup("Rainbow can't access your camera or microphone.");
        }

        function webRtCallStatus(event) {
            console.log("onWebRTCCallChanged event", event.detail);
            const call=event.detail;
            currentCall =call;
            const { key, value } = call.status;
            const remoteMedia  = call.remoteMedia; 
            
            if (key === 0 && value === 'Unknown') {                
                hideCallingInterface();
                currentCallingContact = null;
                endCall(currentConversationId);
            } else if (key === 5 && value === 'active') {               
                if(remoteMedia === 1){
                showCallingInterface();
                startCallTimer();               
                waveAnimation.style.display = 'block';
                phoneIcon.style.display = 'none';
                Videos.style.display = 'none';         
               if (endCallButton) {
                    endCallButton.style.marginTop = '60%';
                    endCallButton.style.marginLeft = '49% !important';
                    endCallButton.addEventListener('click', function() {
                        rainbowSDK.webRTC.release(currentCall.id).then(() => {
                            hideCallingInterface();
                            console.log("Call ended successfully.");
                        }).catch(err => {
                            console.error("Error ending call:", err);
                        });
                    });
                } else {
                    console.error('endCallButton not found in the DOM');
                }
                newMoreInfos = moreInfos.innerHTML;
                }
                else if(remoteMedia === 3){
                    showCallingInterface();
                    startCallTimer();
                    avatarContainer.style.display = 'none';
                    Videos.style.display = 'flex';
                    Videos.style.flexDirection = 'column';
                    if (endCallButton) {
                    endCallButton.style.marginTop = '2%';
                    endCallButton.style.marginLeft = '45% !important';
                    newMoreInfos = moreInfos.innerHTML;
                    endCallButton.addEventListener('click', function() {
                        rainbowSDK.webRTC.release(currentCall.id).then(() => {
                            hideCallingInterface();
                            console.log("Call ended successfully.");
                        }).catch(err => {
                            console.error("Error ending call:", err);
                        });
                    });
                } else {
                    console.error('endCallButton not found in the DOM');
                }
                attachStreamToVideoElements();
                }
            } else if(key === 3 && value === 'incommingCall'){
                if(remoteMedia === 1){
                    oldMoreInfos = moreInfos.innerHTML; 
                     showCallingPopup(rainbowSDK,call,currentConversationId,moreInfos);
                }else if(remoteMedia === 3) {
                    oldMoreInfos = moreInfos.innerHTML;
                    showVideoCallingPopup(rainbowSDK,call,currentConversationId,moreInfos);
                }
            }
        }

        document.addEventListener(rainbowSDK.webRTC.RAINBOW_ONWEBRTCERRORHANDLED, onWebRTCErrorHandled);
        document.addEventListener(rainbowSDK.webRTC.RAINBOW_ONWEBRTCCALLSTATECHANGED, webRtCallStatus);
        
    };