const RepCtrl = require('../../controller/reports/Reports')
module.exports.routes = {
    get: [
        ['/get-printdardetails', RepCtrl.PrintDARDetails],
        ['/get-printsoadetails', RepCtrl.PrintSOADetails],
    ],
    post: [

    ],
    delete: [

    ]
}

