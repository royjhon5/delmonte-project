const Ctrl = require('../../controller/auth/authController');
const UserCtrl = require('../../controller/administrative/UserListController');

module.exports.routes = { 
    post: [
        [ '/login', Ctrl.LogIn ],
        [ '/register', UserCtrl.UserRegistration ],
    ], 
    get: [
    ], 
    remove: [
        [ '/logout', Ctrl.userLogout ],
    ] 
}