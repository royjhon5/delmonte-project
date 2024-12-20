const Ctrl = require('../../controller/auth/authController');

module.exports.routes = { 
    post: [
        [ '/login', Ctrl.LogIn ],
    ], 
    get: [
    ], 
    remove: [
        [ '/logout', Ctrl.userLogout ],
    ] 
}