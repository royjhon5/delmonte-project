const LocCtrl = require('../../controller/masterfile/LocationListController');
const GlCtrl = require('../../controller/masterfile/GLCodeListController');
const CostCtrl = require('../../controller/masterfile/CostCenterController');
const ActCtrl = require('../../controller/masterfile/ActivityListController');
const EmpCtrl = require('../../controller/masterfile/EmployeeListController');

module.exports.routes = {
    post: [
        [ '/post-location', LocCtrl.saveLocationData ],
        [ '/post-glcode', GlCtrl.saveGlCodeData ],
        [ '/post-costcenter', CostCtrl.saveCostCenterData ],
        [ '/post-activity', ActCtrl.saveActivityData ],
        [ '/post-employee', EmpCtrl.saveEmployeeData ],
    ], 
    get: [
        [ '/get-location', LocCtrl.getLocationList ],
        [ '/get-glcode', GlCtrl.getGlCodeList ],
        [ '/get-costcenter', CostCtrl.getCostCenterList ],
        [ '/get-activity', ActCtrl.getActivityList ],
        [ '/get-employee', EmpCtrl.getEmployeeList ],
    ], 
    remove: [
        [ '/remove-location', LocCtrl.deleteLocationData ],
        [ '/remove-glcode', GlCtrl.deleteGlCodeData ],
        [ '/remove-costcenter', CostCtrl.deleteCostCenterData ],
        [ '/remove-activity', ActCtrl.deleteActivityData ],
        [ '/remove-employee', EmpCtrl.deleteEmployeeData ],
    ] 
}