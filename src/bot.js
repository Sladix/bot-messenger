import { replyMessage, replyButton, getUser } from './facebook.js'
import config from './../config.js'
import { Client } from 'recastai'

const client = new Client(config.recastToken, config.language)

var Utils = {
  pick : function(myArray){
    return myArray[Math.floor(Math.random() * myArray.length)];
  }
};

function handleMessage(event) {
  const senderID = event.sender.id

  let promise = Promise.resolve()
  console.log(senderID);
  promise = promise.then(() => getUser(senderID))
  promise.then((response) => {
    console.log(response)
  }).catch(err => {
    console.log(err)
  })

  const messageText = event.message.text
  const messageAttachments = event.message.attachments
  if (messageText) {
    client.textConverse(messageText, { conversationToken: senderID }).then((res) => {
      const reply = res.reply()               /* To get the first reply of your bot. */
      const replies = res.replies             /* An array of all your replies */
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
        if (action && action.done === true) {

          console.log(action.slug+' action is done')
          if(action.slug == 'insult')
          {
              let rep = new InsultsGenerator().generate()
              console.log(rep)
              replies.push(rep)
          }
        }

        
        let promise = Promise.resolve()
        replies.forEach(rep => {
          promise = promise.then(() => replyMessage(senderID,rep))
        })
        promise.then(() => {
          console.log('ok')
        }).catch(err => {
          console.log(err)
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

function InsultsGenerator(){
      var gendras = ['M','F'];
      var starters = ['Sous race','Chiure','Saloperie','Salet\u00e9','Maudite marde','Raclure','Esp\u00e8ce','Regarde moi ta face','Mais quelle tronche','Guette moi le facies'];
      var preadjectifs = {
        'M':['sale','petit','gros','vieux'],
        'F':['sale','petite','grosse','vieille']
      };
      this.stack = '';
      var qualif = {
        'M':['biteux de premier cul','rince-crevette','con','cul','cassos','d\u00e9visse-burne','racle-merde','balais \u00e0 chiotte','bouffe-merde'],
        'F':['pine d\'hu\u00eetre','couille','burne','bite sida\u00efque','micro-verge']
      }

      var postadjectifs = {
        'M':['rachitique','moisi','flasque','mou','boutonneux','tout laid'],
        'F':['tordue','molle','tordue','visqueuse','râpeuse','laide']
      };
      
      var noms = ['fesses','nibards','clochards','slip sales','glaires','vieilles dames','chibres','queues','MST'];
      
      var actions = ['suceur','bouffeur','branleur','enculeur','l\u00e9cheur','violeur'];
      
      this.pickGendra = function(){
        return Utils.pick(gendras);
      }
      this.pickAction = function(gendra){
        var a = Utils.pick(actions);
        if(gendra == 'F')
          a = a.substr(0,a.length-1)+'se';
        return a;
      }
      this.generate = function(){
        var g = this.pickGendra();
        this.stack = Utils.pick(starters)+' de '+Utils.pick(preadjectifs[g])+' '+Utils.pick(qualif[g])+' '+Utils.pick(postadjectifs[g])+' '+this.pickAction(g)+' de '+Utils.pick(noms);

        return this.stack;
      }

      return this;
    }
