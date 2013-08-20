/******************************************************************************/
/******************************************************************************/
/******************************************************************************/
var UserModel  = require('./models/UserModel')
  , pass       = require('./lib/pass')
  , savedUsers = {};


// I set users'ids since we use them for the avatar.
var usersSeed = [
    {
        _id     : '5207c19765598c8c22000001',
        username: 'Abraham_Lincoln',
        password: 'pass',
        salt    : '',
        avatar  : 'jpg',
        bio    : '16th President of the United States'
    },
    {
        _id     : '5207c19765598c8c22000002',
        username: 'Albert_Einstein',
        password: 'pass',
        salt    : '',
        avatar  : 'jpg',
        bio     : 'Theoretical physicist who developed the general theory of relativity'
    },
    {
        _id     : '5207c19765598c8c22000003',
        username: 'Edgar_Allan_Poe',
        password: 'pass',
        salt    : '',
        avatar  : 'jpg',
        bio     : 'Author, poet, editor, and literary critic, considered part of the American Romantic Movement'
    },
    {
        _id     : '5207c19765598c8c22000004',
        username: 'Emily_Dickinson',
        password: 'pass',
        salt    : '',
        avatar  : 'jpg',
        bio     : 'American poet'
    }
];

/*-----------*/

var messagesSeed = {
    'Abraham_Lincoln': [
        {
            message: 'Give me six hours to chop down a tree and I will spend the first four sharpening the axe',
            created_at: '2013-05-24 11:00:00'
        },
        {
            message: 'The best thing about the future is that it comes one day at a time',
            created_at: '2013-08-02 16:38:00'
        },
    ],
    'Albert_Einstein': [
        {
            message: "When you are courting a nice girl an hour seems like a second.When you sit on a red-hot cinder a second seems like an hour.That's relativity",
            created_at: '2013-07-07 21:30:00'
        },
        {
            message: 'A question that sometimes drives me hazy: am I or are the others crazy?',
            created_at: '2013-01-18 15:00:00'
        },
    ],
    'Edgar_Allan_Poe': [
        {
            message: 'I became insane, with long intervals of horrible sanity',
            created_at: '2013-05-28 20:00:00'
        },
        {
            message: 'All that we see or seem is but a dream within a dream',
            created_at: '2013-02-21 19:00:00'
        },
    ],
    'Emily_Dickinson': [
        {
            message: 'Forever is composed of nows.',
            created_at: '2013-04-23 12:00:00'
        },
        {
            message: "I'm nobody, who are you?",
            created_at: '2013-05-02 17:00:00'
        },
    ]
};
/******************************************************************************/
/******************************************************************************/
/******************************************************************************/



var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/microblog_express');
var db = mongoose.connection;


/*----------------------------------------*/
var nb_users = usersSeed.length;

function createUsers(cb) {

    if ( !! nb_users) {
        nb_users--;
        var user = usersSeed.shift();
        pass.hash(user.password, function (err, salt, hash) {
            user.salt = salt;
            user.password = hash;

            UserModel.create(user, function (err, user) {
                if (err) {
                    console.log('An error occured when creating users:');
                    console.log(err.toString());
                    process.exit();
                }
                else {
                    savedUsers[user.username] = user._id;
                    createUsers(cb);
                }
            })
        });
    }
    else cb();
};

/*----------------------------------------*/

function createMessages() {
    console.log('Create messages...');

    var MessageModel = require('./models/MessageModel')
    , messagesList = [];

    MessageModel.remove({}, function (err){/**/});

    for (var author in messagesSeed) {
        var authorMessages = messagesSeed[author]
        , authorId = savedUsers[author];

        for (var i = 0, l = authorMessages.length; i < l; i++) {
            var message = authorMessages[i];
            messagesList.push({
                author: authorId,
                message: message.message,
                created_at: new Date(message.created_at)
            });
        }
    }

    // save all messages
    MessageModel.create(messagesList, function (err){
        console.log('Messages created');
        console.log('Database seeded!');
        process.exit();
    });
};




console.log('Create users...');
UserModel.remove({}, function (err){/**/});
createUsers(createMessages);