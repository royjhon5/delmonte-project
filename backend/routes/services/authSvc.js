const Ctrl = require('../../controller/auth/authController');
const UserListCtrl = require('../../controller/masterfile/UserListController');
const post = [
    [ '/login', Ctrl.LogIn ],
    [ '/user_registration', UserListCtrl.UserRegistration ],
    [ '/change-password', UserListCtrl.ChangePassword ],
]
const get = [
    [ '/get-users', UserListCtrl.getUsers ],
    [ '/get-user-by-id', UserListCtrl.getUserByID ]
]

const remove = [
    [ '/delete-user', UserListCtrl.deleteUserData ],
    [ '/logout', Ctrl.userLogout ],
]

module.exports.routes = { post: post, get: get, remove: remove }