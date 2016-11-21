import { replyMessage, replyButton, getUser, startTyping, endTyping, replyList } from './facebook.js'
import config from './../config.js'
import { Client } from 'recastai'
import { InsultsGenerator } from './insults.js'
import { MyLikesApi } from './likedcontent.js'
import { qr } from './quickreplies.js'


const client = new Client(config.recastToken, config.language)
const websiteButton = {
  messageText: null,
  buttonTitle: 'BBC Official Website',    /* Option of your button. */
  buttonUrl: 'https://bigbangalaconspiracy.com/',   /* If you like more option check out ./facebook.js the function replyButton, and look up */
  buttonType: 'web_url',             /* the facebook doc for button https://developers.facebook.com/docs/messenger-platform/send-api-reference#message */
  elementsTitle: 'Notre magnifique site web',
}


const services = ['9gag','imgur'];

let users = {}
let messagePool = []

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
  promise.then(()=>{
    console.log("started typing");
  })

  const messageText = event.message.text
  const messageAttachments = event.message.attachments
  if (messageText) {
    client.textConverse(messageText, { conversationToken: senderID }).then((res) => {
      const reply = res.reply()               /* To get the first reply of your bot. */
      let replies = res.replies             /* An array of all your replies */
      const action = res.action               /* Get the object action. You can use 'action.done' to trigger a specification action when it's at true. */
      let quickReplies = []

      if (!reply) {
          replyButton(senderID, websiteButton)        /* to reply a button */
      } else {
        
        promise.then(() => {
          console.log("message handling");
          if(users[senderID].isMessaging){
            messagePool.push({message:messageText,sender:users[senderID].first_name});
            users[senderID].isMessaging = false;
            replies.length = 0;
            replies.push('C\'est dans la teuboi !');
          }

          if (action && action.done === true) {

            console.log(action.slug+' action is done')
            if(action.slug == 'insult')
            {
                let rep = new InsultsGenerator().generate()
                replies.push(rep)
            }

            if(action.slug == 'bored'){
              replies = ['Tiens regardes les derniers trucs qui nous ont fait rire :']
              let api = new MyLikesApi();
              promise = promise.then(() => api.getLikedContent());
              promise.then((items)=>{
                promise = promise.then(() => startTyping(senderID))
                promise = promise.then(() => replyList(senderID,items))
                promise = promise.then(() => replyMessage(senderID,'Et maintenant ?',qr.bored))
                promise = promise.then(() => endTyping(senderID))
                promise.then(()=>{
                  console.log("list sent")
                }).catch((err)=>{
                  console.log(err)
                });
                
              }).catch((err)=>{
                console.log(err)
              })
            }

            if(action.slug == 'message'){
              users[senderID].isMessaging = true;
            }
            if(action.slug == 'messagebox'){
              if(messagePool.length > 0){
                messagePool.forEach((message) => {
                  replies.push('Message de '+message.sender+' : '+message.message);
                })
                messagePool.length = 0;
              }else{
                replies.length = 0;
                replies.push('Il n\'y a pas de messages dans la boite pour le moment');
              }
            }
            if(action.slug == 'greeting'){
              replies[0] = replies[0].replace('##username##',users[senderID].first_name)
            }

            if(action.slug == 'combien'){
              replies.push('Ces derni\u00e8res 24h il y a '+users.length+' personnes qui m\'ont parl\u00e9');
            }

            if(action.slug != 'bored' && action.slug != 'message'){
                if(qr[action.slug])
                  quickReplies = qr[action.slug]
                else
                  quickReplies = qr.default
            }

            if(action.slug == 'website'){
              promise = promise.then(() => replyButton(senderID,websiteButton))
            }
          }
          
          // On balance les réponses
          replies.forEach(rep => {
            promise = promise.then(() => replyMessage(senderID,rep,quickReplies))
          })

          promise = promise.then(() => endTyping(senderID))
          promise.then(()=>{
            console.log("ended typing");
          })
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
