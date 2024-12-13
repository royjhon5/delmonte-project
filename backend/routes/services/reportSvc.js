const ReportsController = require('../../controller/_report/Reports');

const get = [
    [ '/print-summary-by-cat', ReportsController.PrintSummaryByCat ],
    [ '/print-summary-by-date-range', ReportsController.PrintSummaryByDateRange ]
]

module.exports.routes = { get: get }