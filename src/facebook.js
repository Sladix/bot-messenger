import config from './../config.js'
import request from 'request'

const apiURL = 'https://graph.facebook.com/v2.8/';

/*
* retrieves the FB user
*/
function getUser(id){
   return new Promise((resolve, reject) => {
    request({
      uri: apiURL+id,
      qs: { access_token: config.pageAccessToken },
      method: 'GET',
    }, (error, response) => {
      if (!error && response.statusCode === 200) {
        console.log('Profile retrieved')
        resolve(response.body)
      } else {
        reject(error)
      }
    })
  })
}


/*
* call to facebbok to send the message
*/

function sendMessage(messageData) {
  return new Promise((resolve, reject) => {
    request({
      uri: apiURL+'me/messages',
      qs: { access_token: config.pageAccessToken },
      method: 'POST',
      json: messageData,
    }, (error, response) => {
      if (!error && response.statusCode === 200) {
        console.log('All good job is done')
        resolve()
      } else {
        reject(error)
      }
    })
  })
}

/*``
* type of message to send back
*/

function replyMessage(recipientId, messageText) {
  return new Promise((resolve, reject) => {

    const messageData = {
      recipient: {
        id: recipientId,
      },
      message: {
        text: messageText,
      },
    }
    sendMessage(messageData).then(() => {
      resolve()
    }).catch( err => {
      reject(err)
    })
  })
}

function startTyping(recipientId){
  return new Promise((resolve, reject) => {
    const seenData = {
      recipient: {
        id: recipientId,
      },
      sender_action: "mark_seen"
    }
    const typingData = {
      recipient: {
        id: recipientId,
      },
      sender_action: "typing_on"
    }
    sendMessage(seenData).then(()=>{
      sendMessage(typingData).then(() => {
        resolve()
      })  
    })
  })
  
}

function endTyping(recipientId){
  return new Promise((resolve, reject) => {
    const typingData = {
      recipient: {
        id: recipientId,
      },
      sender_action: "typing_off"
    }
    sendMessage(typingData).then(() => {
      resolve()
    }).catch( err => {
      reject(err)
    })
  })
}


function replyList(recipientId, list){
  return new Promise((resolve, reject) => {
    const messageData = {
      recipient: {
        id: recipientId,
      },
      message: {
        attachment: {
          type: "template",
          payload: {
              template_type: "list",
              top_element_style: "compact",
              elements: list
            }
          }
        }
    }
    sendMessage(messageData).then(() => {
      resolve()
    }).catch( err => {
      reject(err)
    })
  });
  
}

function replyButton(recipientId, option) {
  const messageData = {
    recipient: {
      id: recipientId,
    },
    message: {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: [{
            title: option.elementsTitle,
            buttons: [{
              type: option.buttonType,
              url: option.buttonUrl,
              title: option.buttonTitle,
            }],
          }],
        },
      },
    },
  }
  sendMessage(messageData)
}


module.exports = {
  replyMessage,
  replyButton,
  replyList,
  getUser,
  startTyping,
  endTyping
}
