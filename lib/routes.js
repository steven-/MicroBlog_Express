module.exports = {
    '/' : {
        get: 'message.list',
        post: 'message.store'
    },
    '/new' : {
        get: 'message.create',
    },
    '/:id' : {
        delete: 'message.delete'
    },


    '/user': {
        get: 'user.list',
        post: 'security.store'
    },
    '/user/:username' : {
        get: 'user.show',
        put: 'user.update'
    },
    '/edit-profile' : { // should be user/:id/edit
        get: 'user.edit',
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