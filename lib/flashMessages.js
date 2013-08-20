var FlashBag = function () {
    this.all = {};
    // this.oldInput = {};
}

FlashBag.prototype.add = function (label, message) {
    if ( ! this.all[label]) {
        this.all[label] = [];
    }
    this.all[label].push(message);
}

// FlashBag.prototype.flashInput = function () {
//     this.oldInput = req.body;
// }

// FlashBag.prototype.old = function (fieldName) {
//     return this.oldInput[fieldName]
//             ? this.oldInput[fieldName]
//             : '';
// }

// FlashBag.prototype.flushInput = function () {
//     this.oldInput = {};
// }

// FlashBag.prototype.flushMessages = function () {
//     this.all = {};
// }

// FlashBag.prototype.flush = function () {
//     this.flushInput();
//     this.flushMessages();
// }


exports = module.exports = function (req, res, next) {
    res.locals.FlashBag = req.session.flashBag || new FlashBag;
    req.session.flashBag = new FlashBag;
    req.flashBag = req.session.flashBag;
    next();
}





