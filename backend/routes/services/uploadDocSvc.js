const Ctrl = require('../../controller/upload_doc/UploadDocController');
const post = [
    [ '/save-archive-header', Ctrl.saveArchiveHeader ],
    [ '/move-document', Ctrl.moveDocument ],
    [ '/upload-document', Ctrl.uploadDocument ],
    [ '/add-audit-log', Ctrl.addAuditLog ],
    [ '/add-notification', Ctrl.addNotification ],
    [ '/read-unread-notification', Ctrl.readUnreadNotification ],
    [ '/update-new-notification', Ctrl.updateNewNotification ],
    [ '/update-notification-status', Ctrl.updateNotificationUnreadLogin ],
]
const get = [
    [ '/preview-scanned', Ctrl.PreviewScannedDocs ],
    [ '/scan-new-document', Ctrl.ScanNewDocument ],
    [ '/browse-from-ecarding', Ctrl.getBrowseFromEcarding ],
    [ '/office-from-ecarding', Ctrl.getOfficeFromEcarding ],
    [ '/payee-from-ecarding', Ctrl.getPayeeFromEcarding ],
    [ '/personnel-from-ecarding', Ctrl.getPersonnelFromEcarding ],
    [ '/get-audit-log', Ctrl.getAuditLog ],
    [ '/get-notification', Ctrl.getNotification ],
    [ '/get-new-notification', Ctrl.getNewNotification ],
]

module.exports.routes = { post: post, get: get }