module.exports = {
    '/' : {
        get: 'message.list',
        post: 'message.store'
    },
    '/new-message' : {
        get: 'message.create',
    },
    '/delete/:id' : {
        get: 'message.delete'
    },


    '/users': {
        get: 'user.list',
    },
    '/user/:username' : {
        get: 'user.show',
        put: 'user.update'
    },
    '/edit-profile' : { // should be user/:id/edit
        get: 'user.edit', // must be placed before /user/:username !!
    },
    '/user' : {
        post: 'security.store'
    },


    '/sign-in' : {
        get: 'security.signIn',
        post: 'security.signInCheck'
    },
    '/sign-up' : {
        get: 'security.create',
    },
    '/sign-out' : {
        get: 'security.signOut'
    }
}