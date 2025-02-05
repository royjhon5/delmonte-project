const Ctrl = require('../../controller/auth/authController');
const UserCtrl = require('../../controller/administrative/UserListController');

module.exports.routes = { 
    post: [
        [ '/login', Ctrl.LogIn ],
        [ '/register', UserCtrl.UserRegistration ],
        [ '/upload-profile', UserCtrl.uploadProfilePicture ],
        [ '/upload-esignature', UserCtrl.uploadESignature ],
    ], 
    get: [
        [ '/get-users', UserCtrl.getUsers ],
    ], 
    remove: [
        [ '/logout', Ctrl.userLogout ],
    ] 
}