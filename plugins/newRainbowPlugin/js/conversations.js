import rainbowSDK from "./rainbow-sdk.min.js";
import {
    options,
    setMissedCounter,
    setNotification
} from './elements.js';

export let currentConversationId;

import {currentCallingContact,newMoreInfos } from './calls.js';

export function displayAllConversations(conversations) {
    const conversationList = document.querySelector('.content-messages-list');
    conversationList.innerHTML = '';
        conversations.sort((a, b) => new Date(b.lastModification) - new Date(a.lastModification));
    conversations.forEach(conversation => {
        const avatarSrc = conversation.room ? conversation.room.avatar : conversation.avatar;
        const conversationItem = document.createElement('li');
        let presenceIconHTML = '';
        if (!conversation.room && conversation.contact.id) {
            const presenceStatus = conversation.contact.status;
            console.log(conversation.contact.status);
            if (presenceStatus !== 'unknown') {
                const iconSrc = getPresenceIconSrc(presenceStatus);
                if (iconSrc) {
                    presenceIconHTML = `<img class="presence-icon" src="${iconSrc}" alt="presence icon">`;
                }
            }
        }
        // Check if lastMessage exists, otherwise get the last message from messages array
        let lastMessageText = conversation.lastMessageText;
        const isMe = conversation.lastMessageSender === rainbowSDK.contacts.getConnectedUser().id;

        if (!lastMessageText) {
            rainbowSDK.im.getMessagesFromConversation(conversation.id, 1)
                .then(conversation => {
                        const lastMessage = conversation.lastMessageText;
                        if (lastMessage.startsWith("activeCallMsg")) {
                            if(isMe){
                              conversationItem.querySelector('.content-message-text').textContent =`${UCalled} ${conversation.name.value}`;
                            }else{
                                conversationItem.querySelector('.content-message-text').textContent =` ${conversation.name.value} ${CalledU} `;
                            }
                        } else if (lastMessage.startsWith("missedCall")) {
                            if(isMe){
                         conversationItem.querySelector('.content-message-text').textContent = outgoingcall;
                    }
                    else{
                         conversationItem.querySelector('.content-message-text').textContent = missedCall;
                    }
        }
        })
        }

        conversationItem.innerHTML = `
            <a href="#" data-conversation-id="${conversation.id}">
                <img class="content-message-image" src="${avatarSrc}" alt="">
                 ${presenceIconHTML}
                <span class="content-message-info">
                    <span class="content-message-name">${conversation.filterName}</span>
                        <span class="content-message-text">${lastMessageText}</span>
                        </span>
                        <span class="content-message-more">
                                ${conversation.missedCounter  > 0 ? `<span class="content-message-unread">${conversation.missedCounter }</span>` : ''}
                        
            </a>
        `;
        conversationList.appendChild(conversationItem);        
    });

    addConversationListeners();
}

function addConversationListeners() {
    document.querySelectorAll('[data-conversation-id]').forEach(function(item) {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const conversationId = this.dataset.conversationId;
            const filterName = this.querySelector('.content-message-name').textContent;
            const avatarSrc = this.querySelector('.content-message-image').src;
            displayConversationMessages(conversationId, filterName, avatarSrc);
        });
    });
}

function displayConversationMessages(conversationId, filterName, avatarSrc) {
    currentConversationId=conversationId;
    const conversationContainer = document.querySelector('.conversation');
    const conversationMain = conversationContainer.querySelector('.conversation-main .conversation-wrapper');
    const conversationPlaceholder = conversationContainer.querySelector('.conversation-main .conversation-placeholder');
    const conversationNameElement = conversationContainer.querySelector('.conversation-top .conversation-user-name');
    const conversationImageElement = conversationContainer.querySelector('.conversation-top .conversation-user-image');
    const conversationTop = conversationContainer.querySelector('.conversation-top');
    const conversationForm = conversationContainer.querySelector('.conversation-form');
    const conversationButtons = conversationContainer.querySelector('.conversation-buttons');
    const callButton = document.getElementById('callButton');
    const videoCallButton = document.getElementById('videoCallButton');
    const moreInfos=document.querySelector('.more-infos');
    let isRoom=false;
    // Update the user info
    conversationNameElement.textContent = filterName;
    conversationImageElement.src = avatarSrc;

    // Hide placeholder and show conversation details
    conversationPlaceholder.style.display = 'none';
    conversationMain.style.display = 'block';
    conversationForm.style.display = 'block';
    conversationTop.style.display = 'flex';
    conversationButtons.style.display = 'flex';
    moreInfos.style.display='none';
    conversationMain.innerHTML = '';
    rainbowSDK.im.getMessagesFromConversation(conversationId, 100)
        .then(conversation => {
            console.log(conversation);
            
             if(conversation.room){
                callButton.style.display="none";
                videoCallButton.style.display="none";
                getRoom(moreInfos,conversation);
                avatarSrc='';
                isRoom=true;
            }else {
                callButton.style.display="block";
                videoCallButton.style.display="block";
                getOneToOneConv(moreInfos,conversation);
            }
            conversation.messages.forEach(message => {            
                    appendMessageToConversation(message,avatarSrc,isRoom);
                   if (message.from.id !== rainbowSDK.contacts.getConnectedUser().id && message.receiptStatus === 4) {
                        rainbowSDK.im.markMessageFromConversationAsRead(conversationId, message.id);
                        const conversationItem = document.querySelector(`[data-conversation-id="${conversationId}"]`);
                        const contentMessageMoreElement = conversationItem.querySelector('.content-message-more');
                        conversation.missedCounter = 0;
                        contentMessageMoreElement.innerHTML = `${conversation.missedCounter > 0 ? `<span class="content-message-unread">${conversation.missedCounter }</span>` : ''}`;
                   }
            });
        })
        .catch(error => {
            console.error('Error getting messages from conversation:', error);
        });

}



function getRoom(moreInfos,conversation){
        const currentUserId = rainbowSDK.contacts.getConnectedUser().id;
                moreInfos.style.display='block';
                moreInfos.style.width='280px';
                let membersHTML = `
                    <div class="group-avatar">
                        <img src="${conversation.room.avatar}" alt="Group Avatar" width="100%">
                    </div>
                    <div class="members-list">                  
                        <div> <h5>${org}: </h5>
                        <ul class="content-messages-list">
                `;
                 conversation.room.organizers.forEach(organizer => {
            const OrgavatarSrc = organizer.contact.defaultAvatar?.currentSrc ?? organizer.contact.avatarSrc;
            const organizerId = organizer.contact.id; 
            membersHTML += `
                <li>
                    <a class="user ${organizerId === currentUserId ? 'disabled' : ''}" ${organizerId === currentUserId ? 'style="pointer-events: none;"' : ''} href="#" data-conversation-id="${organizerId}">
                        <img class="content-message-image" src="${OrgavatarSrc}" alt="">
                        <span class="content-message-info">
                            <span class="content-message-name">${organizer.contact.name.value}</span>
                            <p class="content-message-text">${organizer.contact.company.filterName}</p>
                        </span>
                        <span><i class="ri-vip-crown-fill" style="font-size: 2.3rem;color: black;"></i></span>
                    </a>
                </li>
            `;
        });

        membersHTML += `
                    </ul>
                </div>
                <h5>${Mem}(${conversation.room.members.length}) :</h5>
                <ul class="content-messages-list">
        `;
        
                conversation.room.members.forEach(member => {
                   const avatarSrc = member.contact.defaultAvatar?.currentSrc ?? member.contact.avatarSrc;                 
                    membersHTML += `<li>                   
                        <a class="user ${member.contact.id === currentUserId ? 'disabled' : ''}" ${member.contact.id === currentUserId ? 'style="pointer-events: none;"' : ''} href="#" data-conversation-id="${member.contact.id}">
                        <img class="content-message-image" src="${avatarSrc}" alt="">
                        <span class="content-message-info">
                        <span class="content-message-name">${member.contact.name.value}</span>
                        <p class="content-message-text"> ${member.contact.company.filterName}</p>
                        </span>
                        </a>   
                    </li>`;
                });
                membersHTML += `</ul></div>`;
                moreInfos.innerHTML = membersHTML;
                const memberElements = moreInfos.querySelectorAll('.user');
                    memberElements.forEach(memberElement => {
                        memberElement.addEventListener('click', function () {                           
                           const conversationId = this.dataset.conversationId;
                            const filterName = this.querySelector('.content-message-name').textContent;
                            const avatarSrc = this.querySelector('.content-message-image').src;
                            displayConversationMessages(conversationId, filterName, avatarSrc);
                        });
                    });    
                //addConversationListeners();    
}

function getOneToOneConv(moreInfos,conversation){
                moreInfos.style.display='block';
                if(!currentCallingContact ||currentCallingContact !==conversation.id ){
                moreInfos.style.width='280px';               
                let membersHTML = `
                    <div class="group-avatar">
                        <img src="${conversation.avatar}" alt="Group Avatar" width="100%" height:"30vh">
                    </div>
                    <h4 class="user-infos__name">${conversation.name.value}</h4>
                   <div class="user-infos__company"> ${conversation.contact.company.filterName}</div>
                   
                   <div style="padding: 14px; margin-top: 2px;" >
                   <h5  class="contact">${infos}</h5>
                    <ul class="content-messages-list"> `;
                    if(conversation.contact.loginEmail){
                    membersHTML+=`
                   <li class="user-infos_data">
                        <div class="content-message-image" style="font-size: 24px; color: #6b7280;">
                            <i class="ri-mail-line"></i>
                        </div>
                        <span class="content-message-info">
                        <span class="content-message-name" style="font-size:1.2rem">${email}</span>
                        <a class="content-message-text" rel="noopener noreferrer external" target="_blank" href="mailto:${conversation.contact.loginEmail}">${conversation.contact.loginEmail}</a>
                       </span>
                       
                    </li>`;}
                    
                    if(conversation.contact.country){
                    membersHTML+=`
                    <li class="user-infos_data">
                        <div class="content-message-image" style="font-size: 24px; color: #6b7280;">
                            <i class="ri-map-pin-line"></i>                        
                        </div>
                        <span class="content-message-info">
                        <span class="content-message-name" style="font-size:1.2rem">${country}</span>
                        <p class="content-message-text">${conversation.contact.country}</p>
                       </span>
                    </li>
                `;
                }
                membersHTML+=`
                     </ul>
                    </div>
                `;
                
                moreInfos.innerHTML = membersHTML;
                }else{
                    moreInfos.style.width= "70%";
                    moreInfos.innerHTML =newMoreInfos;
                }
}


function appendMessageToConversation(message,avatarSrc,isRoom){
                const isMe = message.from.id === rainbowSDK.contacts.getConnectedUser().id;
                const name = rainbowSDK.conversations.getConversationById(currentConversationId).name.value;
                let fullName;
                if(isRoom){
                    avatarSrc= message.from.defaultAvatar?.currentSrc ?? message.from.avatarSrc;
                    fullName =message.from.name.value;
                }

                let MessageText="";
                let isCall =false;
                if(message.data.startsWith("activeCallMsg")){
                    const parts = message.data.split("||");
                    if(isMe){         
                       MessageText=`${UCalled} ${name} ${parts[2]}`
                    }else{
                        MessageText=`${message.from.name.value } ${CalledU}  ${parts[2]} `
               }
               isCall=true;
                }else if(message.data.startsWith("missedCall")) {
                    if(isMe){
                        MessageText = outgoingcall;
                    }
                    else{
                        MessageText = missedCall;
                    }
                     isCall=true;
                }
                else{
                    MessageText=message.data;
                }
                const conversationMain = document.querySelector('.conversation-main .conversation-wrapper');
                const messageClass = isMe || isCall ? 'me' : 'them';
                const senderAvatar = isMe || isCall  ? '' : `<img class="conversation-item-image" src="${avatarSrc}" alt="">`;
                const receiptStatusIcons = {
                    0: 'icon0.png', 
                    1: 'icon1.png', 
                    2: 'icon2.png', 
                    3: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M9.9997 15.1709L19.1921 5.97852L20.6063 7.39273L9.9997 17.9993L3.63574 11.6354L5.04996 10.2212L9.9997 15.1709Z'%3E%3C/path%3E%3C/svg%3E", 
                    4: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M11.602 13.7599L13.014 15.1719L21.4795 6.7063L22.8938 8.12051L13.014 18.0003L6.65 11.6363L8.06421 10.2221L10.189 12.3469L11.6025 13.7594L11.602 13.7599ZM11.6037 10.9322L16.5563 5.97949L17.9666 7.38977L13.014 12.3424L11.6037 10.9322ZM8.77698 16.5873L7.36396 18.0003L1 11.6363L2.41421 10.2221L3.82723 11.6352L3.82604 11.6363L8.77698 16.5873Z'%3E%3C/path%3E%3C/svg%3E", 
                    5:"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='rgba(70,146,221,1)'%3E%3Cpath d='M11.602 13.7599L13.014 15.1719L21.4795 6.7063L22.8938 8.12051L13.014 18.0003L6.65 11.6363L8.06421 10.2221L10.189 12.3469L11.6025 13.7594L11.602 13.7599ZM11.6037 10.9322L16.5563 5.97949L17.9666 7.38977L13.014 12.3424L11.6037 10.9322ZM8.77698 16.5873L7.36396 18.0003L1 11.6363L2.41421 10.2221L3.82723 11.6352L3.82604 11.6363L8.77698 16.5873Z'%3E%3C/path%3E%3C/svg%3E"
                   };
                
                const receiptIcon = receiptStatusIcons[message.receiptStatus];
                const messageItem = document.createElement('li');
                messageItem.className = `conversation-item ${messageClass} ${isCall ? 'call-message' : ''}`;
                messageItem.setAttribute('data-message-id', message.id);
                messageItem.innerHTML = `
                    <div class="conversation-item-side">
                        ${senderAvatar}
                    </div>
                    
                    <div class="conversation-item-main">   
                     ${isRoom && !isMe ? `<p class="fullName">${fullName}</p>` : ''}               
                        <div class="conversation-item-text  ${isCall ? 'call-Text' : ''}">${MessageText}</div>
                        <div class="conversation-item-meta">
                        <div class="conversation-item-date">${ new Date(message.date).toLocaleString(options)}</div>
                         ${!isRoom && isMe && !isCall ? `<img class="receipt-icon" src="${receiptIcon}" alt="Receipt Icon">` :'' }
                        </div>
                    </div>
                `;
                 
                conversationMain.appendChild(messageItem);
}

function updateConversationList(conversationId) {
    const conversationItem = document.querySelector(`[data-conversation-id="${conversationId}"]`);
    if (conversationItem) {
        const conversationList = document.querySelector('.content-messages-list');
          const listItem = document.createElement('li');
        listItem.appendChild(conversationItem);
        conversationList.prepend(listItem);
    }
}



export function recieveNewMessageListner(event){
    const conversation=event.detail.conversation;
    const message=event.detail.message;
    const conversationItem = document.querySelector(`[data-conversation-id="${conversation.id}"]`);
    conversationItem.querySelector('.content-message-text').textContent = message.data;
     updateConversationList(conversation.id);
    if (conversation.id === currentConversationId) {
        const avatarSrc = conversation.room ?conversation.room.avatar : conversation.avatar;
        appendMessageToConversation(message,avatarSrc);
        rainbowSDK.im.markMessageFromConversationAsRead(conversation.id, message.id);        
    }else{
        if (conversationItem) {         
            // Update unread message count
            let missedCounter = conversation.missedCounter;
            let missedCalls = conversation.missedCalls
            console.log("missedCounter",missedCounter)
            let unreadMessagesElement = conversationItem.querySelector('.content-message-unread');
               if (!unreadMessagesElement) {
                    unreadMessagesElement = document.createElement('span');
                    unreadMessagesElement.className = 'content-message-unread';
                    unreadMessagesElement.textContent = missedCounter;
                    conversationItem.querySelector('.content-message-more').appendChild(unreadMessagesElement);
                    missedCounter=0;
                    setMissedCounter(missedCounter); 
                } else {
                    unreadMessagesElement.textContent = missedCounter;
                }
                unreadMessagesElement.style.display = 'inline';
                missedCounter =missedCounter+missedCalls
               setMissedCounter(missedCounter);
               const notificationMessage=`${message.from.name.value} vous envoyé un message`;
               setNotification(notificationMessage);           
        }
}

}


export function sendMessage() {
    const sendButton = document.querySelector('.conversation-form-submit');
    const messageInput = document.querySelector('.conversation-form-input');
    sendButton.addEventListener('click', function() {
        const message = messageInput.value.trim();
        if (message && currentConversationId) {
            // Send the message
            const sentMessage = rainbowSDK.im.sendMessageToConversation(currentConversationId, message);

            if (sentMessage) {
                appendMessageToConversation(sentMessage, rainbowSDK.contacts.getConnectedUser().avatar);
                messageInput.value = '';
            } else {
                console.error('Error sending message: message not sent');
            }
        }
    });
    messageInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendButton.click();
        }
    });
};


export function messageStatu(event) {
        const conversation = event.detail.conversation;

        const receivedMessage = event.detail.message;
        const messageType = event.detail.evt;
        const messageElement = document.querySelector(`[data-message-id="${receivedMessage.id}"]`);
        console.log(messageElement);
        console.log(messageType);
        const iconElement = messageElement.querySelector('.receipt-icon');
            switch (messageType) {
                case "server":
                    iconElement.src ="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M9.9997 15.1709L19.1921 5.97852L20.6063 7.39273L9.9997 17.9993L3.63574 11.6354L5.04996 10.2212L9.9997 15.1709Z'%3E%3C/path%3E%3C/svg%3E"; 
                    break;
                case "received":
                    iconElement.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M11.602 13.7599L13.014 15.1719L21.4795 6.7063L22.8938 8.12051L13.014 18.0003L6.65 11.6363L8.06421 10.2221L10.189 12.3469L11.6025 13.7594L11.602 13.7599ZM11.6037 10.9322L16.5563 5.97949L17.9666 7.38977L13.014 12.3424L11.6037 10.9322ZM8.77698 16.5873L7.36396 18.0003L1 11.6363L2.41421 10.2221L3.82723 11.6352L3.82604 11.6363L8.77698 16.5873Z'%3E%3C/path%3E%3C/svg%3E"; 
                    break;
                case "read":
                    iconElement.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='rgba(70,146,221,1)'%3E%3Cpath d='M11.602 13.7599L13.014 15.1719L21.4795 6.7063L22.8938 8.12051L13.014 18.0003L6.65 11.6363L8.06421 10.2221L10.189 12.3469L11.6025 13.7594L11.602 13.7599ZM11.6037 10.9322L16.5563 5.97949L17.9666 7.38977L13.014 12.3424L11.6037 10.9322ZM8.77698 16.5873L7.36396 18.0003L1 11.6363L2.41421 10.2221L3.82723 11.6352L3.82604 11.6363L8.77698 16.5873Z'%3E%3C/path%3E%3C/svg%3E";
                    break;
                default:
                    break;
            }   
                const conversationItem = document.querySelector(`[data-conversation-id="${conversation.id}"]`);
                const conversationList = document.querySelector('.content-messages-list');
                const listItem = document.createElement('li');
                listItem.appendChild(conversationItem);
                conversationList.prepend(listItem);
                const lastMessageElement = conversationItem.querySelector('.content-message-text');
                lastMessageElement.textContent = receivedMessage.data;
};


function getPresenceIconSrc(presenceStatus) {
    switch (presenceStatus) {
        case 'online':
            return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='rgba(53,186,101,1)'%3E%3Cpath d='M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z'%3E%3C/path%3E%3C/svg%3E";
        case 'dnd':
            return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='rgba(224,44,44,1)'%3E%3Cpath d='M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM7 11V13H17V11H7Z'%3E%3C/path%3E%3C/svg%3E";
        case 'away':
            return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='rgba(242,183,45,1)'%3E%3Cpath d='M11.3807 2.01886C9.91573 3.38768 9 5.3369 9 7.49999C9 11.6421 12.3579 15 16.5 15C18.6631 15 20.6123 14.0843 21.9811 12.6193C21.6613 17.8537 17.3149 22 12 22C6.47715 22 2 17.5228 2 12C2 6.68514 6.14629 2.33869 11.3807 2.01886Z'%3E%3C/path%3E%3C/svg%3E";
        case 'wait':
            return "";
        case 'offline':
            return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z'%3E%3C/path%3E%3C/svg%3E";
        case 'unknown':
        default:
            return '';
    }
}

export async function presenceStatu(event) {
    console.log(event.detail);
    const contactId = event.detail.id;
    const newPresenceStatus = event.detail.status;
        try {
            const contact = await rainbowSDK.contacts.getContactById(contactId);
            if(contact.conversation){
            const conversationItem = document.querySelector(`[data-conversation-id="${contact.conversation.id}"]`);
             if (conversationItem) {
                const presenceIcon = conversationItem.querySelector('.presence-icon');
                if (presenceIcon) {
                    const iconSrc = getPresenceIconSrc(newPresenceStatus);
                    if (iconSrc) {
                        presenceIcon.src = iconSrc;
                    }
                }
                }
            }
           else{
               const presenceIcon = document.getElementById('presence-icon');
                if (presenceIcon) {
                    const iconSrc = getPresenceIconSrc(newPresenceStatus);
                    if (iconSrc) {
                        presenceIcon.src = iconSrc;
                    }
                  }
            }
        } catch (error) {
            console.error('Error fetching conversation:', error);
        }
    }


document.addEventListener("DOMContentLoaded", function(event) {
    const moreInfos = document.querySelector('.more-infos');
    const moreInfosDisplay = document.getElementById('more-infos-display');
    const moreInfosIcon = moreInfosDisplay.querySelector('i');

    moreInfosDisplay.addEventListener('click', function() {
        if (moreInfos.style.display === 'none' || !moreInfos.style.display) {
            moreInfos.style.display = 'block';
            moreInfosIcon.classList.remove('ri-arrow-left-double-fill');
            moreInfosIcon.classList.add('ri-arrow-right-double-fill');
        } else {
            moreInfos.style.display = 'none';
            moreInfosIcon.classList.remove('ri-arrow-right-double-fill');
            moreInfosIcon.classList.add('ri-arrow-left-double-fill');
        }
    });
});





