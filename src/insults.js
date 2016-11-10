var Utils = {
  pick : function(myArray){
    return myArray[Math.floor(Math.random() * myArray.length)];
  }
};
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
        'F':['tordue','molle','tordue','visqueuse','r\u00e2peuse','laide']
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
    
    module.exports = { InsultsGenerator }
