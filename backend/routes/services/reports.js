const RepCtrl = require('../../controller/reports/Reports')
module.exports.routes = {
    get: [
        ['/get-printdardetails', RepCtrl.PrintDARDetails],
        ['/get-printsoadetails', RepCtrl.PrintSOADetails],
        ['/get-displayimage', RepCtrl.displayImage],
    ],
    post: [

    ],
    delete: [

    ]
}

