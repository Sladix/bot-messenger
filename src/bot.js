import { replyMessage, replyButton, getUser, startTyping, endTyping } from './facebook.js'
import config from './../config.js'
import { Client } from 'recastai'
import { InsultGenerator } from './insults.js'
import { MyLikesApi } from './likedcontent.js'

const client = new Client(config.recastToken, config.language)

let users = {};

function handleMessage(event) {
  const senderID = event.sender.id

  /*Define the main promise*/
  let promise = Promise.resolve()

  if(!users[senderID])
  {

    promise = promise.then(() => getUser(senderID))
    promise.then((response) => {
      /***Store the user somewhere ?**/
      console.log("user fetched");
      users[senderID] = JSON.parse(response);
    }).catch(err => {
      console.log(err)
    })
  }
  promise = promise.then(() => startTyping(senderID))

  const messageText = event.message.text
  const messageAttachments = event.message.attachments
  if (messageText) {
    client.textConverse(messageText, { conversationToken: senderID }).then((res) => {
      const reply = res.reply()               /* To get the first reply of your bot. */
      let replies = res.replies             /* An array of all your replies */
      const action = res.action               /* Get the object action. You can use 'action.done' to trigger a specification action when it's at true. */

      if (!reply) {
          const options = {
            messageText: null,
            buttonTitle: 'Tu m\'a cass\u00e9',    /* Option of your button. */
            buttonUrl: 'https://bigbangalaconspiracy.com/',   /* If you like more option check out ./facebook.js the function replyButton, and look up */
            buttonType: 'web_url',             /* the facebook doc for button https://developers.facebook.com/docs/messenger-platform/send-api-reference#message */
            elementsTitle: 'J\'ai rien \u00e0 r\u00e9pondre :(',
          }
          replyButton(senderID, options)        /* to reply a button */
      } else {
        
        promise.then(() => {
          console.log("message handling");
          if(messageText == "ok1234"){
            let api = new MyLikesApi();
            promise = promise.then(() => api.getMyLikes('9gag'));
            promise.then((data)=>{console.log(data)}).catch((err)=>{console.log(err)})
          }

          if (action && action.done === true) {

            console.log(action.slug+' action is done')
            if(action.slug == 'insult')
            {
                let rep = new InsultsGenerator().generate()
                replies.push(rep)
            }

            if(action.slug == 'greeting'){
              console.log(replies);
              replies[0] = replies[0].replace('##username##',users[senderID].first_name)
            }
          }
          // On balance les réponses
          replies.forEach(rep => {
            promise = promise.then(() => replyMessage(senderID,rep))
          })
          promise = promise.then(() => endTyping(senderID))
          promise.then(() => {
            console.log('ok')
          }).catch(err => {
            console.log(err)
          })
        })
      }
    }).catch(err => {
      console.log(err)
    })
  } else if (messageAttachments) {
    replyMessage(senderID, 'Message with attachment received')
  }
}
module.exports = {
  handleMessage,
}
