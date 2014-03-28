var home = require('./controllers/home_controller'),
  members = require('./controllers/users_controller');

module.exports = function(app){  
    
    checkUser = members.checkUser;

    app.get('/', home.index);
    
    app.get('/member', members.index); 
    app.post('/member/login', members.login); 
    app.post('/member/logout', members.logout); 
    
    app.get('/member/profile', members.profile); 
    // CRUD  
    app.post('/member', members.create);  
    app.get('/member/:id', members.show);  
    app.put('/member/:id', members.update);  
    app.delete('/member/:id', members.destroy);

};

