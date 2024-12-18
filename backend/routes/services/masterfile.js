const Ctrl = require('../../controller/masterfile/ScannerListController');
const post = [
    [ '/save-scanner-list', Ctrl.saveScannerList ],
]
const get = [
    [ '/get-scanner-list', Ctrl.getScannerList ],
]

const remove = [
]


module.exports.routes = { post: post, get: get, remove: remove }