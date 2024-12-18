const AdminCtrl = require('../../controller/administrative/EmployeeMasterfileList')

const get = [
    [ '/get-employeemasterfile', AdminCtrl.getEmployeeMasterfile ],
]


module.exports.routes = { get: get }