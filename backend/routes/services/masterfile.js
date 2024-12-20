const LocCtrl = require('../../controller/masterfile/LocationListController');
const GlCtrl = require('../../controller/masterfile/GLCodeListController');
const CostCtrl = require('../../controller/masterfile/CostCenterController');
const ActCtrl = require('../../controller/masterfile/ActivityListController');

module.exports.routes = {
    post: [
        [ '/post-location', LocCtrl.saveLocationData ],
        [ '/post-glcode', GlCtrl.saveGlCodeData ],
        [ '/post-costcenter', CostCtrl.saveCostCenterData ],
        [ '/post-activity', ActCtrl.saveActivityData ],
    ], 
    get: [
        [ '/get-location', LocCtrl.getLocationList ],
        [ '/get-glcode', GlCtrl.getGlCodeList ],
        [ '/get-costcenter', CostCtrl.getCostCenterList ],
        [ '/get-activity', ActCtrl.getActivityList ],
    ], 
    remove: [
        [ '/remove-location', LocCtrl.deleteLocationData ],
        [ '/remove-glcode', GlCtrl.deleteGlCodeData ],
        [ '/remove-costcenter', CostCtrl.deleteCostCenterData ],
        [ '/remove-activity', ActCtrl.deleteActivityData ],
    ] 
}