exports.index = function(req, res){  
    res.render('index');
};

exports.pages = function(req, res){  
    res.render('wodcal');
};

exports.fittercal = function(req, res){  
    res.render('fittercal');
};

exports.crossfit = function(req, res){  
    res.render('fitters');
};

exports.boxes = function(req, res){  
    res.render('boxes');
};