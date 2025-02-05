const Ctrl = require('../../controller/auth/authController');
const UserCtrl = require('../../controller/administrative/UserListController');

module.exports.routes = { 
    post: [
        [ '/login', Ctrl.LogIn ],
        [ '/register', UserCtrl.UserRegistration ],
        [ '/upload-profile', UserCtrl.uploadProfilePicture ],
        [ '/upload-esignature', UserCtrl.getForConfirmation ],
        [ '/post-changestatus', UserCtrl.changeStatusSOA ],
    ], 
    get: [
        [ '/get-users', UserCtrl.getUsers ],
        [ '/get-forconfirmation', UserCtrl.getForConfirmation ],
        [ '/get-forapproval', UserCtrl.getForApproval ],
    ], 
    remove: [
        [ '/logout', Ctrl.userLogout ],
    ] 
}