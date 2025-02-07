const Ctrl = require('../../controller/auth/authController');
const UserCtrl = require('../../controller/administrative/UserListController');

module.exports.routes = {
    post: [
        ['/login', Ctrl.LogIn],
        ['/register', UserCtrl.UserRegistration],
        ['/upload-profile', UserCtrl.uploadProfilePicture],
        ['/upload-esignature', UserCtrl.getForConfirmation],
        ['/post-changestatus', UserCtrl.changeStatusSOA],
        ['/verify-personalkey', UserCtrl.VerifyPersonalKey],
    ],
    get: [
        ['/get-users', UserCtrl.getUsers],
        ['/get-forconfirmation', UserCtrl.getForConfirmation],
        ['/get-forapproval', UserCtrl.getForApproval],
        ['/count-forconfirmation', UserCtrl.countForConfirmation],
        ['/count-forapproval', UserCtrl.countForApproval],
        ['/get-printdardetails', UserCtrl.PrintDARDetails],
        ['/get-printsoadetails', UserCtrl.PrintSOADetails],
        ['/get-displayimage', UserCtrl.displayImage],
    ],
    remove: [
        ['/logout', Ctrl.userLogout],
    ]
}