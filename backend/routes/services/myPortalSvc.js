const Ctrl = require('../../controller/_my_portal/_MyPortalController');
const post = [
    [ '/save-my-portal-folder', Ctrl.saveMyPortalFolderList ],
    [ '/save-my-portal-subfolder', Ctrl.saveMyPortalSubFolderList ],
    [ '/save-my-portal-files', Ctrl.saveMyPortalFiles ],
    [ '/upload-my-portal-files', Ctrl.uploadMyPortalFiles ],
]
const get = [
    [ '/my-portal-folder-list', Ctrl.getMyPortalFolderList ],
    [ '/my-portal-subfolder-list', Ctrl.getMyPortalSubFolderList ],
    [ '/my-portal-folder-by-user', Ctrl.getMyPortalFolderAndSubFolderListByUser ],
    [ '/my-portal-files', Ctrl.getMyProtalFiles ],
]
const remove = [
    [ '/delete-mainfolder', Ctrl.deleteMainFolderData ],
]

module.exports.routes = { post: post, get: get, remove: remove }