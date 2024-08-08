import rainbowSDK from "./rainbow-sdk.min.js";
import {
    setMissedCounter
} from './elements.js';
let onLoaded = function onLoaded() {
    rainbowSDK
        .initialize(applicationID, secretKey)
        .then(() => {
            rainbowSDK.connection.signinWithToken(accessToken)
                .then(function() {
                    const User =rainbowSDK.contacts.getConnectedUser();
                    const account = {
                        defaultAvatar: User.defaultAvatar.currentSrc,
                        avatarSrc: User.avatarSrc
                    };                   
                    setAccountRainbow(account);
                    
                    setTimeout(function() {
                         fetchConversationsAndSetMissedCounter();
                        window.location.href = '/jcms/plugins/newRainbowPlugin/jsp/app/index.jsp';
                    }, 1000);
                    })
                .catch(function(error) {
                    console.error('Error signing in with token:', error);
                });
        })
        .catch(err => {
            console.error('[Hello World] :: Something went wrong with the SDK...', err);
        });
   
};

function fetchConversationsAndSetMissedCounter() {
    rainbowSDK.conversations.getAllConversations()
        .then(conversations => {
            let globalMissedCounter = 0;
            conversations.forEach(conversation => {
                globalMissedCounter += conversation.missedCounter+conversation.missedCalls || 0;
            });
            const missedCounter = globalMissedCounter;
            setMissedCounter(missedCounter);
        })
        .catch(error => {
            console.error('Error fetching conversations:', error);
        });
}

function setAccountRainbow(account) {
    var $j = jQuery.noConflict();
    $j.ajax({
        type: 'POST',
        url: '/jcms/plugins/newRainbowPlugin/jsp/app/setAccount.jsp',
        data: { 
             account: JSON.stringify(account)
        },
        success: function(response) {
            console.log(response);
        },
        error: function(xhr, status, error) {
            console.error('Error setting account:', error);
        }
    });
}

// Add event listeners
document.addEventListener(rainbowSDK.RAINBOW_ONLOADED, onLoaded);
// Start and load Rainbow SDK
rainbowSDK.load();

