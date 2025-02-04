const RepCtrl = require('../../controller/reports/Reports')
module.exports.routes = {
    get: [
        ['/get-printdardetails', RepCtrl.PrintDARDetails],
    ],
    post: [

    ],
    delete: [

    ]
}

