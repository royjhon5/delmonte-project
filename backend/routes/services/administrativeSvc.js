const AdminCtrl = require('../../controller/administrative/EmployeeMasterfileList');
const SignatoryCtrl = require('../../controller/administrative/SignatoriesController');
const UserListCtrl = require('../../controller/administrative/UserListController');
module.exports.routes = { 
    get: [
        [ '/get-employeemasterfile', AdminCtrl.getEmployeeMasterfile ],
        [ '/export-packhouse-employee', AdminCtrl.exportPackhouseEmployee ],
        [ '/get-packhouse-employee', AdminCtrl.getPackhouseEmployees ],
        [ '/get-signatory', SignatoryCtrl.getSignatory ],
        [ '/get-users', UserListCtrl.getUsers ],
    ], 
    post: [
        [ '/save-employeemasterfile', AdminCtrl.saveEmployeeMasterFile ],
        [ '/save-signatory', SignatoryCtrl.saveSignatory ],
        [ '/user_registration', UserListCtrl.UserRegistration ],
        [ '/change-password', UserListCtrl.ChangePassword ]
    ] ,
    delete : [
        [ '/delete-signatory', SignatoryCtrl.deleteSignatory ],
        [ '/delete-user', UserListCtrl.deleteUserData]
    ] 
}

