const options = {
    day: 'numeric',
    month: 'long', 
    hour: 'numeric',
    minute: 'numeric',
    hour12: false 
};

function showPopup(message) {
    const popup = document.createElement('div');
    popup.className = 'popup';
    const messageContainer = document.createElement('div');
    messageContainer.className = 'message-container';
    const imageElement = document.createElement('img');
    imageElement.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='rgba(30,104,214,1)'%3E%3Cpath d='M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 9.5C12.8284 9.5 13.5 8.82843 13.5 8C13.5 7.17157 12.8284 6.5 12 6.5C11.1716 6.5 10.5 7.17157 10.5 8C10.5 8.82843 11.1716 9.5 12 9.5ZM14 15H13V10.5H10V12.5H11V15H10V17H14V15Z'%3E%3C/path%3E%3C/svg%3E";
    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    const closeButton = document.createElement('button');
    closeButton.className = 'close-button';
    closeButton.textContent = 'Close';
    closeButton.addEventListener('click', function() {
        document.body.removeChild(popup);
    });
    messageContainer.appendChild(imageElement);
    messageContainer.appendChild(messageElement);
    popup.appendChild(messageContainer);
    popup.appendChild(closeButton);

    document.body.appendChild(popup);
}

function showCallingPopup(rainbowSDK,call,currentConversationId,moreInfos) {
    const popup = document.createElement('div');
    popup.className = 'calling-popup';

    const avatar = document.createElement('img');
    avatar.src = call.contact.defaultAvatar?.currentSrc ?? call.contact.avatarSrc;
    avatar.className = 'contact-avatar';
    
    const nameElement = document.createElement('p');
    nameElement.textContent = call.contact.name.value;
    nameElement.className = 'contact-name';

    const callTypeElement = document.createElement('p');
    callTypeElement.textContent = 'Incoming audio call';
    callTypeElement.className = 'call-type';
    
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'buttons-container';

    const acceptButton = document.createElement('button');
    acceptButton.className = 'accept-button';
    acceptButton.innerHTML = '<i class="ri-mic-fill" style="margin-right: 10px;"></i> Accept';
    acceptButton.addEventListener('click', () => {
        console.log('Call accepted');
        rainbowSDK.webRTC.answerInAudio(call.id); 
        document.body.removeChild(popup);
    });

    const declineButton = document.createElement('button');
    declineButton.textContent = 'Decline';
    declineButton.className = 'decline-button';
    declineButton.addEventListener('click', () => {
        console.log('Call declined');
        rainbowSDK.webRTC.release(call.id);
        if(!currentConversationId){
            moreInfos.style.display="none";
        }
        document.body.removeChild(popup);
    });

    buttonsContainer.appendChild(acceptButton);
    buttonsContainer.appendChild(declineButton);

    popup.appendChild(avatar);
    popup.appendChild(nameElement);
    popup.appendChild(callTypeElement);
    popup.appendChild(buttonsContainer);

    document.body.appendChild(popup);
}

function showVideoCallingPopup(rainbowSDK,call,currentConversationId,moreInfos) {
    const popup = document.createElement('div');
    popup.className = 'calling-popup';

    const avatar = document.createElement('img');
    avatar.src = call.contact.defaultAvatar?.currentSrc ?? call.contact.avatarSrc;
    avatar.className = 'contact-avatar';
    
    const nameElement = document.createElement('p');
    nameElement.textContent = call.contact.name.value;
    nameElement.className = 'contact-name';

    const callTypeElement = document.createElement('p');
    callTypeElement.textContent = 'Incoming audio call';
    callTypeElement.className = 'call-type';
    
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'buttons-container';

        const acceptVideoButton = document.createElement('button');
    acceptVideoButton.className = 'accept-button';
    acceptVideoButton.innerHTML = '<i class="ri-video-chat-fill" style="margin-right: 10px;"></i> Answer in video';
    acceptVideoButton.addEventListener('click', () => {
        console.log('Call accepted');
        rainbowSDK.webRTC.answerInVideo(call.id); 
        document.body.removeChild(popup);
    });
    
    const acceptButton = document.createElement('button');
    acceptButton.className = 'accept-button';
    acceptButton.innerHTML = '<i class="ri-mic-fill" style="margin-right: 10px;"></i> Answer in audio';
    acceptButton.addEventListener('click', () => {
        console.log('Call accepted');
        rainbowSDK.webRTC.answerInAudio(call.id); 
        document.body.removeChild(popup);
    });

    const declineButton = document.createElement('button');
    declineButton.textContent = 'Decline';
    declineButton.className = 'decline-button';
    declineButton.addEventListener('click', () => {
        console.log('Call declined');
        rainbowSDK.webRTC.release(call.id);
        if(!currentConversationId){
            moreInfos.style.display="none";
        }
        document.body.removeChild(popup);
    });
    
    buttonsContainer.appendChild(acceptVideoButton);
    buttonsContainer.appendChild(acceptButton);
    buttonsContainer.appendChild(declineButton);

    popup.appendChild(avatar);
    popup.appendChild(nameElement);
    popup.appendChild(callTypeElement);
    popup.appendChild(buttonsContainer);

    document.body.appendChild(popup);
}


function startCall(conversationId) {
    const conversationItem = document.querySelector(`[data-conversation-id="${conversationId}"]`);
    if (conversationItem) {
        const messageText = conversationItem.querySelector('.content-message-text');
        messageText.textContent = 'In Call';
        messageText.style.color = 'red';
        messageText.style.fontWeight = 'bold';
    }
    
}

function endCall(conversationId, lastMessageText) {
    const conversationItem = document.querySelector(`[data-conversation-id="${conversationId}"]`);
    if (conversationItem) {
        const messageText = conversationItem.querySelector('.content-message-text');
        messageText.textContent = lastMessageText;
        messageText.style.color = ''; 
        messageText.style.fontWeight = ''; 
    }
}


// update shortcut 
function setMissedCounter(missedCounter) {
    var $js = jQuery.noConflict();
    $js.ajax({
        type: 'POST',
        url: '/jcms/plugins/newRainbowPlugin/jsp/app/setMissedCounter.jsp',
        data: {
            missedCounter: missedCounter
        },
        success: function(response) {
            console.log(response);
        },
        error: function(xhr, status, error) {
            console.error('Error updating missed counter:', error);
        }
    });
}

//send notification
function setNotification(notificationMessage, recipient) {
    var $js = jQuery.noConflict();
    $js.ajax({
        type: 'POST',
        url: '/jcms/plugins/newRainbowPlugin/jsp/app/setNotification.jsp',
        data: {
            notificationMessage: notificationMessage
        },
        success: function(response) {
            console.log('Notification sent:', response);
        },
        error: function(xhr, status, error) {
            console.error('Error sending notification:', error);
        }
    });
}



// Export the elements
export {
    showPopup,
    startCall,
    endCall,
    options,
    showCallingPopup,
    showVideoCallingPopup,
    setMissedCounter,
    setNotification
};
