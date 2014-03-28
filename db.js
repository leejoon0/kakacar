var Mongolian = require("mongolian")
    ObjectId = Mongolian.ObjectId;
    
ObjectId.prototype.toJSON = function toJSON() {return this.toString();};

var db = new Mongolian("mongodb://leejoon0:1035wnsduddl@ds035438.mongolab.com:35438/fitterlifedb");

module.exports.ObjectId = ObjectId;

module.exports.collections = {
    tweets : db.collection('tweets'),
    fitterwods : db.collection('fitterwod-collection'),
    fitters : db.collection('fitter-collection'),
    boxes : db.collection('box-collection'),
    wods : db.collection('wod-collection'),
    todos : db.collection('todo-collection')
};