var FlashBag = function () {
    this.all = {};
}

FlashBag.prototype.add = function (label, message) {
    if ( ! this.all[label]) {
        this.all[label] = [];
    }
    this.all[label].push(message);
}


exports = module.exports = function (req, res, next) {
    res.locals.FlashBag = req.session.flashBag || new FlashBag;
    req.session.flashBag = new FlashBag;
    req.flashBag = req.session.flashBag; // shortcut
    next();
}





