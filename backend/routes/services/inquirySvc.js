const Ctrl = require('../../controller/inquiry/InquiryController');
const post = [
   
]
const get = [
    [ '/preview-file', Ctrl.PreviewFile ],
    [ '/get-inquiry-search-filter', Ctrl.getInquirySearchFilter ],
    [ '/get-dashboard-pie-statistics', Ctrl.getDashboardPieStatistics ],
    [ '/get-dashboard-bar-statistics', Ctrl.getDashboardBarStatistics ],
    [ '/get-dashboard-total-storage', Ctrl.getDashboardTotalStorage ],
]

module.exports.routes = { post: post, get: get }