const express = require('express');
const router = express.Router();
const XLSX = require('xlsx');
const fs = require('fs');
const fileUpload = require('express-fileupload');
const db = require('../config/dbConnection');

const uploadOptions = {
  useTempFiles: true,
  tempFileDir: '/tmp/'
}

const arrayRoutesSvc = [
    require('./services/authSvc'),
    require('./services/masterfile'),
    require('./services/administrativeSvc'),
    require('./services/transaction'),
    require('./services/reports')
];

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

router.post('/import-excel', fileUpload(uploadOptions), async (req, res) => {
    try {
      const { excel } = req.files;
      if (excel.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        fs.unlinkSync(excel.tempFilePath);
        return res.status(400).json({ msg: 'File is invalid' });
      }
      const workbook = XLSX.read(excel.tempFilePath, { type: 'file' });
      const sheetName = workbook.SheetNames[0];
      const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    
      const successData = [];
      const failureData = [];
    
      for (let i = 0; i < data.length; i++) {
        const {
          chapa_id = '',
          firstname = '',
          lastname = '',
          middlename = '',
          extname = '',
        } = data[i];
        
        const sql =
            'INSERT INTO tblemployeelist_import (chapa_id, firstname, lastname, middlename, extname) VALUES (?, ?, ?, ?, ?)';
        try {
          const [rows] = await db.query(sql, [
            chapa_id || '',
            firstname || '',
            lastname || '',
            middlename || '',
            extname || '',
            ]);
          
          if (rows.affectedRows) {
            successData.push(data[i]);
          } else {
            failureData.push(data[i]);
          }
        } catch (err) {
          failureData.push(data[i]);
          console.error(`Failed to insert row: ${JSON.stringify(data[i])}`, err);
        }
      }
      fs.unlinkSync(excel.tempFilePath);
      return res.status(200).json({
        msg: 'File processed',
        success: successData.length,
        failure: failureData.length,
        successData,
        failureData
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: 'Internal server error' });
    }
});


router.post("/validate-duplicates", async (req, res) => {
  try {
      const importedData = req.body; // Expecting an array of objects [{ chapa_id: '123' }, { chapa_id: '456' }]

      if (!importedData || importedData.length === 0) {
          return res.status(400).json({ message: "No data provided." });
      }

      const chapaIds = importedData.map(emp => emp.chapa_id);
      const sql = `SELECT chapa_id FROM tblemployeelist_import WHERE chapa_id IN (${chapaIds.map(() => "?").join(",")})`;
      
      db.query(sql, chapaIds, (err, results) => {
          if (err) {
              console.error(err);
              return res.status(500).json({ message: "Database error." });
          }

          const existingChapaIds = results.map(row => row.chapa_id);
          return res.json({ duplicates: existingChapaIds });
      });

  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;







