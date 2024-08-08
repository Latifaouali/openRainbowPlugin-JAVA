import rainbowSDK from "./rainbow-sdk.min.js";
import {displayAllConversations , recieveNewMessageListner, sendMessage,messageStatu,currentConversationId , presenceStatu } from './conversations.js';
import {Call } from './calls.js';
import "./jquery-2.1.3.min.js";
const $ = jQuery;
 function onLoaded() {
    rainbowSDK
        .initialize(applicationID,secretKey)
        .then(() => {
             console.log('[Hello World] :: Rainbow SDK is initialized!');
        })
        .catch(err => {
            console.error('[Hello World] :: Something went wrong with the SDK...', err);
        });
}

let onReady = function() {
    rainbowSDK.connection.signinWithToken(token)
        .then(function() {
                    rainbowSDK.conversations.getAllConversations()
                        .then(conversations => {
                            document.addEventListener('DOMContentLoaded', displayAllConversations(conversations));
                        })
                        .catch(error => {
                            console.error('Error getting conversations', error);
                        }); 
        })
        .catch(err => {
            console.error('[Hello World] :: Something went wrong with the SDK...', err);
        });
};


document.addEventListener('DOMContentLoaded',Call);
document.addEventListener(rainbowSDK.RAINBOW_ONLOADED, onLoaded);
document.addEventListener(rainbowSDK.RAINBOW_ONREADY, onReady);

//start conversation listners //
//receive a new  message Listner 
document.addEventListener(rainbowSDK.im.RAINBOW_ONNEWIMMESSAGERECEIVED, recieveNewMessageListner);
//send a message listner
document.addEventListener("DOMContentLoaded",sendMessage)
//watch sent messages statu
document.addEventListener(rainbowSDK.im.RAINBOW_ONNEWIMRECEIPTRECEIVED, messageStatu);

//presence statu listner
document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener(rainbowSDK.presence.RAINBOW_ONCONTACTRICHPRESENCECHANGED, presenceStatu);
});
//end conversation listners //
rainbowSDK.load();