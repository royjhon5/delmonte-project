const Ctrl = require('../../controller/masterfile/ScannerListController');

module.exports.routes = {
    post: [
        [ '/save-scanner-list', Ctrl.saveScannerList ],
    ], 
    get: [
        [ '/get-scanner-list', Ctrl.getScannerList ],
    ], 
    remove: [
        
    ] 
}