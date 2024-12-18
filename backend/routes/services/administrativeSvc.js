const AdminCtrl = require('../../controller/administrative/EmployeeMasterfileList')

module.exports.routes = { 
    get: [
        [ '/get-employeemasterfile', AdminCtrl.getEmployeeMasterfile ],
    ], 
    post: [
        [ '/save-employeemasterfile', AdminCtrl.saveEmployeeMasterFile ],
    ] 
}