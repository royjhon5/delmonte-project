const EmployeeTempCtrl = require('../../controller/transaction/EmployeeTemplateController');

module.exports.routes = {
    post: [
        [ '/post-employeetemplateheader', EmployeeTempCtrl.saveEmployeeTemplateHeader ],
    ], 
    get: [
        [ '/get-employeetemplateheader', EmployeeTempCtrl.getEmployeeTemplateHeader ],
    ], 
    remove: [
        [ '/remove-employeetemplateheader', EmployeeTempCtrl.deleteEmployeeTemplateHeader ],
    ] 
}