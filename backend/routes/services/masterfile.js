const LocCtrl = require('../../controller/masterfile/LocationListController');
const GlCtrl = require('../../controller/masterfile/GLCodeListController');
const CostCtrl = require('../../controller/masterfile/CostCenterController');
const ActCtrl = require('../../controller/masterfile/ActivityListController');
const EmpCtrl = require('../../controller/masterfile/EmployeeListController');
const DeptCtrl = require('../../controller/masterfile/DepartmentListController');
const FieldCtrl = require('../../controller/masterfile/FieldListController');
const DayCtrl = require('../../controller/masterfile/DayTypeListController');
const AccontToChargeCtrl = require('../../controller/masterfile/AccountToChargeController');
const GroupCtrl = require('../../controller/masterfile/GroupListController');
const ClientCtrl = require('../../controller/masterfile/ClientListController');
const fileUpload = require('express-fileupload');
const uploadOptions = {
    useTempFiles: true,
    tempFileDir: '/tmp/'
}
module.exports.routes = {
    post: [
        [ '/post-location', LocCtrl.saveLocationData ],
        [ '/post-glcode', GlCtrl.saveGlCodeData ],
        [ '/post-costcenter', CostCtrl.saveCostCenterData ],
        [ '/post-activity', ActCtrl.saveActivityData ],
        [ '/post-employee', EmpCtrl.saveEmployeeData ],
        [ '/post-department', DeptCtrl.saveDepartmentList ],
        [ '/post-field', FieldCtrl.saveFieldData ],
        [ '/post-daytype', DayCtrl.saveDataDay ],
        [ '/post-accounttocharge', AccontToChargeCtrl.saveAccountToCharge ],
        [ '/post-accounttochargehdr', AccontToChargeCtrl.saveAccountToChargeHdr ],
        [ '/post-group', GroupCtrl.saveGroupData ],
        [ '/post-client', ClientCtrl.saveClientList ],
        [ '/post-saveemployelistimport', EmpCtrl.saveEmployeeListImport ],
        [ '/remove-multiple-employee', EmpCtrl.deleteMultipleEmployees ],
        [ '/remove-duplicate', EmpCtrl.deleteSelectedDuplicates ],
    ], 
    get: [
        [ '/get-location', LocCtrl.getLocationList ],
        [ '/get-glcode', GlCtrl.getGlCodeList ],
        [ '/get-costcenter', CostCtrl.getCostCenterList ],
        [ '/get-activity', ActCtrl.getActivityList ],
        [ '/get-employee', EmpCtrl.getEmployeeList ],
        [ '/get-employee-imported', EmpCtrl.getEmployeeListImported ],
        [ '/get-department', DeptCtrl.getDepartmentList ],
        [ '/get-field', FieldCtrl.getDataField ],
        [ '/get-daytype', DayCtrl.getDataDay ],
        [ '/get-accounttocharge', AccontToChargeCtrl.getAccountToCharge ],
        [ '/get-accounttochargehdr', AccontToChargeCtrl.getAccountToChargeHdr ],
        [ '/get-group', GroupCtrl.getGroupData ],
        [ '/get-client', ClientCtrl.getClientList ],
    ], 
    remove: [
        [ '/remove-location', LocCtrl.deleteLocationData ],
        [ '/remove-glcode', GlCtrl.deleteGlCodeData ],
        [ '/remove-costcenter', CostCtrl.deleteCostCenterData ],
        [ '/remove-activity', ActCtrl.deleteActivityData ],
        [ '/remove-employee', EmpCtrl.deleteEmployeeData ],
        [ '/remove-department', DeptCtrl.deleteDepartmentData ],
        [ '/remove-field', FieldCtrl.deleteFieldData ],
        [ '/remove-daytype', DayCtrl.deleteDataDay ],
        [ '/remove-accounttocharge', AccontToChargeCtrl.deleteAccoubtToCharge ],
        [ '/remove-accounttochargehdr', AccontToChargeCtrl.deleteAccoubtToChargeHdr ],
        [ '/remove-group', GroupCtrl.deleteGroupData ],
        [ '/remove-client', ClientCtrl.deleteClientData ],
    ] 
}