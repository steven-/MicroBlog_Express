exports = module.exports = function (req, res, next)  {

    // Trim post inputs
    if (req.body) { // <--  bodyParser required
        for (var input in req.body) {
            req.body[input] = req.body[input]
                                    .replace(/^\s+/g,'')
                                    .replace(/\s+$/g,'');
        }
    }

    next();
}