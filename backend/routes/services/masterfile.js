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
        [ '/post-group', GroupCtrl.saveGroupData ],
        [ '/post-client', ClientCtrl.saveClientList ],
        [ '/remove-multiple-employee', EmpCtrl.deleteMultipleEmployees ],
    ], 
    get: [
        [ '/get-location', LocCtrl.getLocationList ],
        [ '/get-glcode', GlCtrl.getGlCodeList ],
        [ '/get-costcenter', CostCtrl.getCostCenterList ],
        [ '/get-activity', ActCtrl.getActivityList ],
        [ '/get-employee', EmpCtrl.getEmployeeList ],
        [ '/get-department', DeptCtrl.getDepartmentList ],
        [ '/get-field', FieldCtrl.getDataField ],
        [ '/get-daytype', DayCtrl.getDataDay ],
        [ '/get-accounttocharge', AccontToChargeCtrl.getAccountToCharge ],
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
        [ '/remove-group', GroupCtrl.deleteGroupData ],
        [ '/remove-client', ClientCtrl.deleteClientData ],
    ] 
}