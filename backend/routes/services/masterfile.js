const LocCtrl = require('../../controller/masterfile/LocationListController');
const GlCtrl = require('../../controller/masterfile/GLCodeListController');
const CostCtrl = require('../../controller/masterfile/CostCenterController');
const ActCtrl = require('../../controller/masterfile/ActivityListController');
const EmpCtrl = require('../../controller/masterfile/EmployeeListController');
const DeptCtrl = require('../../controller/masterfile/DepartmentListController');

module.exports.routes = {
    post: [
        [ '/post-location', LocCtrl.saveLocationData ],
        [ '/post-glcode', GlCtrl.saveGlCodeData ],
        [ '/post-costcenter', CostCtrl.saveCostCenterData ],
        [ '/post-activity', ActCtrl.saveActivityData ],
        [ '/post-employee', EmpCtrl.saveEmployeeData ],
        [ '/post-department', DeptCtrl.saveDepartmentList ],
    ], 
    get: [
        [ '/get-location', LocCtrl.getLocationList ],
        [ '/get-glcode', GlCtrl.getGlCodeList ],
        [ '/get-costcenter', CostCtrl.getCostCenterList ],
        [ '/get-activity', ActCtrl.getActivityList ],
        [ '/get-employee', EmpCtrl.getEmployeeList ],
        [ '/get-department', DeptCtrl.getDepartmentList ],
    ], 
    remove: [
        [ '/remove-location', LocCtrl.deleteLocationData ],
        [ '/remove-glcode', GlCtrl.deleteGlCodeData ],
        [ '/remove-costcenter', CostCtrl.deleteCostCenterData ],
        [ '/remove-activity', ActCtrl.deleteActivityData ],
        [ '/remove-employee', EmpCtrl.deleteEmployeeData ],
        [ '/remove-department', DeptCtrl.deleteDepartmentData ],
    ] 
}