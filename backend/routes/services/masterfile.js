const Ctrl = require('../../controller/masterfile/ScannerListController');
const Ctrl2 = require('../../controller/masterfile/DocumentTypeController');
const DeptCtrl = require('../../controller/masterfile/DepartmentListController')
const post = [
    [ '/save-scanner-list', Ctrl.saveScannerList ],
    [ '/save-sub-document-type', Ctrl2.saveSubDocumentType ],
    [ '/save-department', DeptCtrl.saveDepartmentList ],
]
const get = [
    [ '/get-scanner-list', Ctrl.getScannerList ],
    [ '/get-document-type', Ctrl2.getDocumentType],
    [ '/get-sub-document-type', Ctrl2.getSubDocumentType ],
    [ '/get-department', DeptCtrl.getDepartmentList ],
    [ '/test', DeptCtrl.PrintSummaryByCat ],
]

const remove = [
    [ '/delete-scanner', Ctrl.deleteScannerData ],
    [ '/delete-subdocument', Ctrl2.deleteSubDocuments ],
    [ '/delete-department', DeptCtrl.deleteDepartmentData ],
]


module.exports.routes = { post: post, get: get, remove: remove }