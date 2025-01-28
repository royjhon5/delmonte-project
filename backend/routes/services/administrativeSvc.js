const AdminCtrl = require('../../controller/administrative/EmployeeMasterfileList')
const SignatoryCtrl = require('../../controller/administrative/SignatoriesController')
module.exports.routes = { 
    get: [
        [ '/get-employeemasterfile', AdminCtrl.getEmployeeMasterfile ],
        [ '/export-packhouse-employee', AdminCtrl.exportPackhouseEmployee ],
        [ '/get-packhouse-employee', AdminCtrl.getPackhouseEmployees ],
        [ '/get-signatory', SignatoryCtrl.getSignatory ],
    ], 
    post: [
        [ '/save-employeemasterfile', AdminCtrl.saveEmployeeMasterFile ],
        [ '/save-signatory', SignatoryCtrl.saveSignatory ],
    ] ,
    delete : [
        [ '/delete-signatory', SignatoryCtrl.deleteSignatory ],
    ] 
}

