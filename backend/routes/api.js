const express = require('express');
const router = express.Router();

const authSvc = require('./services/authSvc');
const myPortalSvc = require('./services/myPortalSvc');
const uploadDocSvc = require('./services/uploadDocSvc');
const scannerListSvc = require('./services/masterfile');
const inquirySvc = require('./services/inquirySvc');
const reportSvc = require('./services/reportSvc')
const administrativeSvc = require('./services/administrativeSvc');

const arrayRoutesSvc = [authSvc, myPortalSvc, uploadDocSvc, scannerListSvc, inquirySvc, reportSvc, administrativeSvc];

arrayRoutesSvc.forEach(routeSvc => {
    // post
    if(routeSvc.routes.post){
        Object.entries(routeSvc.routes.post).forEach(([key]) => {
            router.post(routeSvc.routes.post[key][0], routeSvc.routes.post[key][1]);
        });
    }

    // get
    if(routeSvc.routes.get){
        Object.entries(routeSvc.routes.get).forEach(([key]) => {
            router.get(routeSvc.routes.get[key][0], routeSvc.routes.get[key][1]);
        });
    }

    // remove
    if (routeSvc.routes.remove) {
        Object.entries(routeSvc.routes.remove).forEach(([key]) => {
            router.delete(routeSvc.routes.remove[key][0], routeSvc.routes.remove[key][1]);
        });
    }
});

module.exports = router;







