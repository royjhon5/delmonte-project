const EmployeeTempCtrl = require('../../controller/transaction/EmployeeTemplateController');
const DARCtrl = require('../../controller/transaction/DARController');
const SOACtrl = require('../../controller/transaction/SOAController');
const AccRateCtrl = require('../../controller/transaction/AccountRateController');

module.exports.routes = {
    post: [
        ['/post-employeetemplateheader', EmployeeTempCtrl.saveEmployeeTemplateHeader],
        ['/post-employeetemplatedetail', EmployeeTempCtrl.saveEmployeeTemplateDetail],
        // 
        ['/post-darheader', DARCtrl.saveDARHeader],
        ['/post-postdarheader', DARCtrl.postDARHeader],
        ['/post-dardetail', DARCtrl.saveDARDetail],
        ['/post-transferdardetail', DARCtrl.transferDARDetail],
        //
        ['/post-soaheader', SOACtrl.saveSOAHeader],
        ['/post-postsoaheader', SOACtrl.postSOAHeader],
        ['/post-soadetail', SOACtrl.saveSOADetail],
        ['/post-adddardetails', SOACtrl.addDARDetails],
        // 
        ['/post-accountrate', AccRateCtrl.saveAccountRateData],
    ],
    get: [
        ['/get-employeetemplateheader', EmployeeTempCtrl.getEmployeeTemplateHeader],
        ['/get-employeetemplatedetail', EmployeeTempCtrl.getEmployeeTemplateDetail],
        // 
        ['/get-darheader', DARCtrl.getDARHeader],
        ['/get-dardetail', DARCtrl.getDARDetail],
        ['/get-darheaderavailable', DARCtrl.getDARHeaderAvailable],
        ['/get-test-method', DARCtrl.testMethod],
        // 
        ['/get-soaheader', SOACtrl.getSOAHeader],
        ['/get-soadetail', SOACtrl.getSOADetail],
        ['/get-darheaderforsoa', SOACtrl.getDARHeaderForSOA],
        // 
        [ '/get-accountrate', AccRateCtrl.getAccountRateList ],
    ],
    remove: [
        ['/remove-employeetemplateheader', EmployeeTempCtrl.deleteEmployeeTemplateHeader],
        ['/remove-employeetemplatedetail', EmployeeTempCtrl.deleteEmployeeTemplateDetail],
        // 
        ['/remove-darheader', DARCtrl.deleteDARHeader],
        ['/remove-dardetail', DARCtrl.deleteDARDetail],
        // 
        ['/remove-soaheader', SOACtrl.deleteSOAHeader],
        ['/remove-soadetail', SOACtrl.deleteSOADetail],
        // 
        [ '/remove-accountrate', AccRateCtrl.deleteAccountRateData ],
    ]
}