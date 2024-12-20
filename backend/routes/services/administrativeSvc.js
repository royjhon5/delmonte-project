const AdminCtrl = require('../../controller/administrative/EmployeeMasterfileList')

module.exports.routes = { 
    get: [
        [ '/get-employeemasterfile', AdminCtrl.getEmployeeMasterfile ],
        [ '/export-packhouse-employee', AdminCtrl.exportPackhouseEmployee ],
        [ '/get-packhouse-employee', AdminCtrl.getPackhouseEmployees ],
    ], 
    post: [
        [ '/save-employeemasterfile', AdminCtrl.saveEmployeeMasterFile ],
    ] 
}

