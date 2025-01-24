const EmployeeTempCtrl = require('../../controller/transaction/EmployeeTemplateController');

module.exports.routes = {
    post: [
        [ '/post-employeetemplateheader', EmployeeTempCtrl.saveEmployeeTemplateHeader ],
        [ '/post-employeetemplatedetail', EmployeeTempCtrl.saveEmployeeTemplateDetail ],
    ], 
    get: [
        [ '/get-employeetemplateheader', EmployeeTempCtrl.getEmployeeTemplateHeader ],
        [ '/get-employeetemplatedetail', EmployeeTempCtrl.getEmployeeTemplateDetail ],
    ], 
    remove: [
        [ '/remove-employeetemplateheader', EmployeeTempCtrl.deleteEmployeeTemplateHeader ],
        [ '/remove-employeetemplatedetail', EmployeeTempCtrl.deleteEmployeeTemplateDetail ],
    ] 
}