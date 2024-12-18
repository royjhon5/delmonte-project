const Ctrl = require('../../controller/auth/authController');
const UserListCtrl = require('../../controller/masterfile/UserListController');

module.exports.routes = { 
    post: [
        [ '/login', Ctrl.LogIn ],
        [ '/user_registration', UserListCtrl.UserRegistration ],
        [ '/change-password', UserListCtrl.ChangePassword ],
    ], 
    get: [
        [ '/get-users', UserListCtrl.getUsers ],
        [ '/get-user-by-id', UserListCtrl.getUserByID ]
    ], 
    remove: [
        [ '/delete-user', UserListCtrl.deleteUserData ],
        [ '/logout', Ctrl.userLogout ],
    ] 
}