const EmployeeTempCtrl = require('../../controller/transaction/EmployeeTemplateController');
const DARCtrl = require('../../controller/transaction/DARController');

module.exports.routes = {
    post: [
        [ '/post-employeetemplateheader', EmployeeTempCtrl.saveEmployeeTemplateHeader ],
        [ '/post-employeetemplatedetail', EmployeeTempCtrl.saveEmployeeTemplateDetail ],
        // 
        [ '/post-darheader', DARCtrl.saveDARHeader ],
        [ '/post-postdarheader', DARCtrl.postDARHeader ],
        [ '/post-dardetail', DARCtrl.saveDARDetail ],
        [ '/post-transferdardetail', DARCtrl.transferDARDetail ],
    ], 
    get: [
        [ '/get-employeetemplateheader', EmployeeTempCtrl.getEmployeeTemplateHeader ],
        [ '/get-employeetemplatedetail', EmployeeTempCtrl.getEmployeeTemplateDetail ],
        // 
        [ '/get-darheader', DARCtrl.getDARHeader ],
        [ '/get-dardetail', DARCtrl.getDARDetail ],
        [ '/get-darheaderavailable', DARCtrl.getDARHeaderAvailable ],
        [ '/get-test-method', DARCtrl.testMethod ],
    ], 
    remove: [
        [ '/remove-employeetemplateheader', EmployeeTempCtrl.deleteEmployeeTemplateHeader ],
        [ '/remove-employeetemplatedetail', EmployeeTempCtrl.deleteEmployeeTemplateDetail ],
        // 
        [ '/remove-darheader', DARCtrl.deleteDARHeader ],
        [ '/remove-dardetail', DARCtrl.deleteDARDetail ],
    ] 
}