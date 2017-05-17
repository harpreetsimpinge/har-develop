'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Times = require('mongoose').model('Times'),
  User = mongoose.model('User'),
  Workstatus = mongoose.model('Workstatus'),
  Workfaces = mongoose.model('Workfaces'),
  randomstring = require("randomstring"),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Show the current user
 */
exports.read = function (req, res) {
  res.json(req.model);
};

/**
 * Update a User
 */
exports.update = function (req, res) {
  var user = req.model;
  //For security purposes only merge these parameters
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.displayName = user.firstName + ' ' + user.lastName;
  user.email = req.body.email;
  user.roles = req.body.roles;
  user.valid = req.body.valid;

  User.findOne({
        _id: req.body._id
      }, function (err, user) {
        if (err) {
          return done(err);
        }

        if(req.body.block == "false") {
          if(user.block == true) {
            User.update({_id: user._id}, {block: false, openCode: ""} , function(errUpdate, doc){
              if(errUpdate){
                return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                      });
              } else {
                Times.remove({user: user.username},function(err){
                  if (err) {
                      return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                      });
                    }
                });
              }
            });
          }
        }

        // if(req.body.block == "true") {
        //   User.update({_id: user._id}, {block: true, openCode: randomstring} , function(errUpdate, doc){
        //     if(errUpdate){
        //       return res.status(400).send({
        //               message: errorHandler.getErrorMessage(err)
        //             });
        //     } else {
        //       for(var i=0; i<=4; i++) {
        //         Times({user: req.body.username, ip: "test"}).save(function(err, doc){});
        //       }
        //     }
        //   });
        // }
  });


  user.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(user);
  });
};

/**
* Unblock user
**/
exports.unblock = function (req, res) {
    console.log("code : " , req.params.code);
    User.find({openCode: req.params.code}, function(errFind, user){
      console.log(user);
      if(user.length < 1)
        return res.send("error");
      if(errFind){
        return res.send("Error");
      }
      User.update({openCode: req.params.code}, {block: false, openCode: ""} , function(errUpdate, doc){
        if(errUpdate){
          console.log(errUpdate);
          return res.send("Error");
        } else {
          Times.remove({user: user[0].username},function(err){
            console.log(err);
            res.send("Account Unlocked. <a href='http://iclouddev.herokuapp.com'>Log in</a>");
          });
        }
      });
    });

  };

/**
 * Delete a user
 */
exports.delete = function (req, res) {
  var user = req.model;

  user.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(user);
  });
};

/**
 * List of Users
 */
exports.list = function (req, res) {
  User.find({}, '-salt -password').sort('-created').populate('user', 'displayName').exec(function (err, users) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(users);
  });
};

/**
 * User middleware
 */
exports.userByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'User is invalid'
    });
  }

  User.findById(id, '-salt -password').exec(function (err, user) {
    if (err) {
      return next(err);
    } else if (!user) {
      return next(new Error('Failed to load user ' + id));
    }

    req.model = user;
    next();
  });
};


/******************CREATE COLLECTIONS******************************/

/*var schemas = new mongoose.Schema({ workStatus: 'string', price: 'string', description: 'string' });
var Workstatus = mongoose.model('Workstatus', schemas);

var WorkfacesSchemas = new mongoose.Schema({ workstatusid: 'string', workface: 'string', price: 'string' });
var Workfaces = mongoose.model('Workfaces', WorkfacesSchemas);*/

/*var Workstatus = new mongoose.Schema({ 
                workStatus: String,
                price: String,
                description: String,
              });


var Workstatus = mongoose.model('Workstatus', Workstatus);

var Workfaces = new mongoose.Schema({
                workstatusid: {
                  type: String,
                  ref: 'Workstatus'
                },
                workface: String,
                price: String,
              });

var Workfaces = mongoose.model('Workfaces', Workfaces);*/


/******************WORK STATUS CODE******************************/

exports.allworkstatus = function (req, res) {

	Workstatus.find(function (err, data) {
		res.json(data);
	});
};

exports.saveworkstatus = function (req, res) {
	Workstatus.create({
		workStatus: req.body.workStatus,
		price: req.body.price,
		description: req.body.description
	}, function(err, workstatus){
		if(err) {
			res.json({
				"errorMsg": err
			});
		}

		res.json({
			"msg": "success"
		});
	});
};

exports.geteditworkstatus = function (req, res) {
	Workstatus.findOne({_id: req.params.workstatusId}, function(err, data){
		res.json(data);
	});
};


exports.geteditworkstatus_ss = function (id) {
  Workstatus.findOne({_id: id}, function(err, data){
    return res.json(data);
  });
};


exports.updateworkstatus = function (req, res) {

	Workstatus.find({_id: req.params.workstatusId}, function(errFind, user){
      if(user.length < 1)
        return res.send("error");
      if(errFind){
        return res.send("Error");
      }
      Workstatus.update({_id: req.params.workstatusId}, {workStatus: req.body.workStatus, price: req.body.price, description: req.body.description} , function(errUpdate, doc){

		if(errUpdate) {
			res.json({
				"errorMsg": err
			});
		}
		res.json({
			"msg": "success"
		});

      });
    });

};

exports.removeworkstatus = function (req, res) {
	Workstatus.remove({_id: req.params.workstatusId}, function(err, data){
		if(err) {
			res.json({
				"errorMsg": err
			});
		}

		Workfaces.remove({workstatusid: req.params.workstatusId}, function(err, data){
			if(err) {
				res.json({
					"errorMsg": err
				});
			}
			res.json({
				"msg": "success"
			});
		});

		/*res.json({
			"msg": "success"
		});*/

	});
};


/******************WORK FACES CODE******************************/
/*var workStatusHerlper = {};
var promise = require("q");
workStatusHerlper._getWorkPhaseTitle = function (_workstatusid, workStatus) {
  var response = [];
  var deferred = promise.defer();
   Workfaces.find({workstatusid: _workstatusid}, function(err, data){
       for(var k=0; k < data.length; k++) {
          response.push( { "workface": data[k].workface,"_id":data[k]._id, "workstatus": workStatus} );
       }
      deferred.resolve(response);
   });
   return deferred.promise;
};*/

exports.allworkfaces = function (req, res) {
	var customData = [];

  /*Workfaces.find(function (err, data) {
    res.json(data);
  });*/
  var workPhases = [];
  var WorkfacesQuery = Workfaces.find();
  WorkfacesQuery.populate('workstatusid').exec(function (err, data) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      //console.log(data);
      for(var k = 0; k < data.length; k++) {
        workPhases.push({ '_id':data[k]._id, 'workface':data[k].workface, 'price':data[k].price, 'workstatus':data[k].workstatusid.workStatus, 'workstatusprice':data[k].workstatusid.price })
      }
      res.json(workPhases);
    }
  });


	/*Workstatus.find(function (err, data) {

    for(var k=0; k < data.length; k++) {
      workStatusHerlper._getWorkPhaseTitle(data[k]._id, data[k].workStatus).then(function (resWP) {
        customData.push(resWP);

        res.json(customData);
      });
    }

   // console.log(customData);
		//res.json(customData);
	}); */
};

exports.saveworkface = function (req, res) {
	Workfaces.create({
		workstatusid: req.body.workstatusid,
		workface: req.body.workface,
		price: req.body.price,
	}, function(err, workfaces){
		if(err) {
			res.json({
				"errorMsg": err
			});
		}

		res.json({
			"msg": "success"
		});
	});
};

exports.geteditworkface = function (req, res) {
	Workfaces.findOne({_id: req.params.workfaceId}, function(err, data){
		res.json(data);
	});
};

exports.updateworkface = function (req, res) {

	Workfaces.find({_id: req.params.workfaceId}, function(errFind, user){
      if(user.length < 1)
        return res.send("error");
      if(errFind){
        return res.send("Error");
      }
      Workfaces.update({_id: req.params.workfaceId}, {workstatusid: req.body.workstatusid, workface: req.body.workface, price: req.body.price} , function(errUpdate, doc){

		if(errUpdate) {
			res.json({
				"errorMsg": err
			});
		}
		res.json({
			"msg": "success"
		});

      });
    });

};

exports.removeworkface = function (req, res) {
	Workfaces.remove({_id: req.params.workfaceId}, function(err, data){
		if(err) {
			res.json({
				"errorMsg": err
			});
		}
		res.json({
			"msg": "success"
		});
	});
};
