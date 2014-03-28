var _ = require('underscore'),
    fitters = require('../db').collections.fitters,
    wods = require('../db').collections.fitterwods,
    ObjectId = require('../db').ObjectId;

exports.index = function(req, res) {
  fitters.find().toArray(function(err, fitter) {
    if(err) return res.status(500).send({ status: 'Failed to find fitters!'});
        console.log('fitters~~')
        fitter.forEach(function(item, i, list){
            
            wods.find({ 'userid': item._id.toString()}).toArray(function(err, docs) {    
                if(err) return res.status(500).send({ status: 'Failed to find tweets!'});
                
                // fitterwod collection add wodcnt field
                fitters.update({ _id: new ObjectId(item._id.toString())}, {
                        /*$setOnInsert: { 
                            wodcnt : docs.length
                        },*/
                        $set: { 
                            wodcnt : docs.length
                        }
                    }, {
                        upsert:true
                    }, function(err, obj) {
                        if (err) throw err;
                        //res.json(200, params);
                });
                
            });
            
            
        });
        
    res.send(fitter);
  });
};

exports.show = function(req, res) {
    var id = req.params.id;

    fitters.findOne({ _id: new ObjectId(id)}, function(err, fitter) {
        if(err) return res.status(500).send({status: "Failed to find fitter due to database error " + id});
        if(!fitter) return res.status(404).send({status: "Cannot find fitter with id=" + id});
        
        res.send(fitter);
    });
};

exports.login = function(req, res){
    
    var useremail = req.body.email;
    var pw = req.body.password;

    fitters.find({ 'useremail':useremail, 'pw':pw}).toArray(function(err, fitter){
        if(err) return res.status(500).send({status: "Failed to find wod due to database error " + useremail});        
        if(!fitter) return res.status(404).send({status: "Cannot find wod with id=" + useremail});        
        
        if (fitter) {
            
            if(fitter.length > 0){
                req.session.auth = true;
                req.session.userId = fitter[0]._id;//.toHexString();
                req.session.userName = fitter[0].username;//.toHexString();
                req.session.user = fitter;
                req.session.pic = fitter[0].pic;
                
                //if (fitter.admin) {
                //    req.session.admin = true;
                //}
                
                console.info('Login USER: ' + req.session.userId);
                res.json(200, {
                    msg: 'Authorized'
                });
            }
            else
            {
                res.json(200, {msg:'Login failed!'})
            }
        }
        
        //res.send(fitter);
    });
};

exports.checkUser = function(req, res, next) {
    
    console.log('checkuser');
    
  //if (req.session && req.session.auth && req.session.userId && (req.session.user.approved || req.session.admin)) {
  if (req.session && req.session.auth && req.session.userId ) {
    console.info('Access USER: ' + req.session.userId);
    return next();
  } else {
    next('User is not logged in.');
  }
};

exports.logout = function(req, res) {
  console.info('Logout USER: ' + req.session.userId);
  req.session.destroy(function(error) {
    if (!error) {
      res.send({
        msg: 'Logged out'
      });
    }
  });
};

exports.profile = function(req, res, next){
    var oid = req.session.userId;

    fitters.findOne({ _id: new ObjectId(oid)}, function(err, fitter) {
        //if (err) next(err);
        if(err) return res.status(500).send({status: "Failed to find fitter due to database error " + oid});
        if(!fitter) return res.status(404).send({status: "Cannot find fitter with id=" + oid});
        
        //if(!fitter) next(new Error('User is not found'));

        //res.send(fitter);
        res.json(200, fitter);
    });
};

exports.create = function(req, res) {
  var params = req.body;
  
  fitters.insert(params, function(err) {
    if(err) return res.status(500).send({status: "Failed to write to the server"});
    res.send(params);
  });
};

exports.destroy = function(req, res) {
  var id = req.params.id;
  fitters.remove({ _id: new ObjectId(id)}, function(err, numRemoved) {
    if (err || numRemoved !== 1) return res.status(500).send({status: "Failed to remove delete fitter " + id + " from server"});
    res.send({_id: id});
  });
};

exports.update = function(req, res) {
    var id = req.params.id,
        params = req.body;

    fitters.update({ _id: new ObjectId(params._id)}, sanitize(params), function(err, numUpdated) {
        if(err || numUpdated !== 1) return res.status(500).send({status: "Failed to updated fitter " + id});
        res.send(params);
    });
};

function sanitize(fitter) {
    var fitter = _.clone(fitter);
    delete fitter._id;
    return fitter;
}