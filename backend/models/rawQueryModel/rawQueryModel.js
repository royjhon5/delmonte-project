const db = require('../../config/dbConnection')
const rawQueryModel = {

    EmployeeListJoin: async function (params) {
        return new Promise((resolve, reject) => {
            const locationJoin = " LEFT JOIN tbllocationlist l ON l.id = el.assigned_location_idlink ";
            const departmentJoin = " LEFT JOIN tbldepartment d ON d.id = el.assigned_department_idlink ";
            const activityJoin = " LEFT JOIN tblactivitylist a ON a.id = el.default_activity_idlink ";
            const groupLineJoin = " LEFT JOIN tblgroupline_list g ON g.id = el.assigned_group_idlink ";
            const query = 'SELECT el.*, l.location_name, d.department_name, a.activityname, g.groupline_name  FROM tblemployeelist el ' + locationJoin + departmentJoin + activityJoin + groupLineJoin;
            db.query(query, params.paramValue, (err, result) => {
                if (err) return reject(err);
                resolve({ success: true, data: result });
            });
        });
    },

    AccountToChargeJoin: async function (params) {
        return new Promise((resolve, reject) => {
            const activityJoin = " LEFT JOIN tblactivitylist a ON a.id = el.activity_id_link ";
            const glcodeJoin = " LEFT JOIN tblgl_list b ON b.id = el.glcode_id_link ";
            const costcenterJoin = " LEFT JOIN tblcostcenterlist c ON c.id = el.costcenter_id_link ";
            const query = 'SELECT el.*, a.activityname, b.gl_code, c.costcenter FROM tblaccount_to_charge el ' + activityJoin + glcodeJoin + costcenterJoin;
            db.query(query, params.paramValue, (err, result) => {
                if (err) return reject(err);
                resolve({ success: true, data: result });
            });
        });
    },

    AutoInsertDetailTemplate: async function (params) {
        return new Promise((resolve, reject) => {
            const query = `SELECT hdr.*, dtl.* FROM tbltemplates_employeehdr hdr, tbltemplates_employeedtl dtl WHERE hdr.id = dtl.template_employehdr_idlink AND hdr.id = ${params.templatelink_id} ORDER BY dtl.last_name ASC`;
            db.query(query, [], async (err, result) => {
                await result.forEach(element => {
                    // get dar time in from device here...
                    const queryDTR = `SELECT auth_time FROM ${process.env.DB_NAME2}.device_logs WHERE person_name LIKE "%${element.ChapaID}" ORDER BY auth_datetime ASC LIMIT 1`; // get first time in
                    db.query(queryDTR, [], (errDTR, resultDTR) => {
                        let timeIn = "0000";
                        if (resultDTR.length > 0) timeIn = resultDTR[0].auth_time.split(':')[0] + "" + resultDTR[0].auth_time.split(':')[1];
                        console.log(errDTR);
                        // insert dardtl
                        const query2 = `INSERT INTO tbldardtl (dar_idlink, ChapaID, emp_lname, emp_fname, emp_mname, emp_ext_name, time_in, gl, cost_center, activitylink_id, activity)
                            VALUES (${params.id}, "${element.ChapaID}", "${element.last_name}", "${element.first_name}", "${element.middle_name}", "${element.ext_name}", "${timeIn}", "${element.gl_code}", "${element.costcenter}", 
                            "${element.account_master_idlink}", "${element.activityname}")`;
                        db.query(query2, [], (err2, result2) => { console.log(err2); });
                    });
                });
                resolve({ success: true });
            });
        });
    },

    AddDARDetailsToSOA: async function (params) {
        return new Promise((resolve, reject) => {
            const query = `SELECT COUNT(DISTINCT(dtl.ChapaID)) as head_count, dtl.activitylink_id, dtl.gl, dtl.cost_center, dtl.activity, SUM(dtl.st) as total_st, SUM(dtl.ot) as total_ot,
                SUM(dtl.nd) as total_nd, SUM(dtl.ndot) as total_ndot FROM tbldarhdr hdr, tbldardtl dtl WHERE hdr.id = dtl.dar_idlink AND hdr.id = ${params.id} GROUP BY dtl.activitylink_id`;
            db.query(query, [], async (err, result) => {
                console.log(result);
                await result.forEach(element => {
                    // get account rates here...

                    // insert soa detail
                    const query2 = `INSERT INTO tblsoa_dtl (soa_hdr_idlink, dar_hdr_link_id, activity_idlink, h_st, h_ot, h_nd, h_ndot, head_count, gl_account, cost_center, activity)
                        VALUES (${params.soa_id}, "${params.id}", "${element.activitylink_id}", "${element.total_st}", "${element.total_ot}", "${element.total_nd}", "${element.total_ndot}", 
                        "${element.head_count}", "${element.gl}", "${element.cost_center}", "${element.activity}")`;
                    db.query(query2, [], (err2, result2) => { console.log(err2); });

                    // update dar header to soa id link
                    const query3 = `UPDATE tbldarhdr SET soa_no_link = ${params.soa_id} WHERE id = ${params.id}`;
                    db.query(query3, [], (err3, result3) => { console.log(err3); });
                });
                resolve({ success: true, message: "successfully saved" });
            });
        });
    },

    AutoComputeDARTime: async function (params) {
        return new Promise((resolve, reject) => {
            const shift = `(SELECT hdr.shift FROM tbldarhdr hdr WHERE hdr.id = tbldardtl.dar_idlink LIMIT 1) as shift`;
            const count = `(SELECT COUNT(dtl.ChapaID) FROM tbldardtl dtl WHERE dtl.ChapaID = tbldardtl.ChapaID AND dtl.dar_idlink = ${params.id} LIMIT 1) as count`;
            const query = `SELECT *, ${shift}, ${count} FROM tbldardtl WHERE dar_idlink = ${params.id} ORDER BY ChapaID ASC, id ASC`;
            db.query(query, [], async (err, result) => {
                // console.log(err);
                if (result) {
                    let chapaCounter = 1;
                    let arrayCounter = 1;
                    await result.forEach(element => {
                        let diff = 0;
                        let time_out = "0000";
                        if (chapaCounter == element.count) { // to know that this record is the last and this is where to save the final time out of employee
                            const queryDTR = `SELECT auth_time FROM ${process.env.DB_NAME2}.device_logs WHERE person_name LIKE "%${element.ChapaID}" ORDER BY auth_datetime DESC LIMIT 1, 1`; // get last dtr of chapa
                            db.query(queryDTR, [], (errDTR, resultDTR) => {
                                let timeOut = "0000";
                                if (resultDTR.length > 0) timeOut = resultDTR[0].auth_time.split(':')[0] + "" + resultDTR[0].auth_time.split(':')[1];
                                let timeInDateTime = "2025-01-01 " + element.time_in.substring(0, 2) + ":" + element.time_in.substring(2, 4);
                                let timeOutDateTime = "2025-01-01 " + timeOut.substring(0, 2) + ":" + timeOut.substring(2, 4);
                                if (element.shift == 2 && parseInt(timeOut.substring(0, 2)) < 17 && parseInt(element.time_in.substring(0, 2)) >= 17) {
                                    timeOutDateTime = "2025-01-02 " + timeOut.substring(0, 2) + ":" + timeOut.substring(2, 4); // next time in of that employee
                                }
                                diff = diff_hours(timeInDateTime, timeOutDateTime);
                                time_out = timeOut;
                                // save if ST if ot and nt are empty
                                let ST = diff;
                                // update dar detail set time out and (st, if not ot and ndot)
                                const query3 = `UPDATE tbldardtl SET time_out = "${time_out}", st = "${ST}" WHERE id = ${element.id}`;
                                db.query(query3, [], (err3, result3) => { console.log(err3); });
                            });
                            chapaCounter = 1; // reset to 1
                        } else { // in else, time out will be the next record time in
                            let timeInDateTime = "2025-01-01 " + element.time_in.substring(0, 2) + ":" + element.time_in.substring(2, 4);
                            let timeOutDateTime = "2025-01-01 " + result[arrayCounter].time_in.substring(0, 2) + ":" + result[arrayCounter].time_in.substring(2, 4); // next time in of that employee
                            if (element.shift == 2 && parseInt(result[arrayCounter].time_in.substring(0, 2)) < 17 && parseInt(element.time_in.substring(0, 2)) >= 17) {
                                timeOutDateTime = "2025-01-02 " + result[arrayCounter].time_in.substring(0, 2) + ":" + result[arrayCounter].time_in.substring(2, 4); // next time in of that employee
                            }
                            diff = diff_hours(timeInDateTime, timeOutDateTime);
                            time_out = result[arrayCounter].time_in;
                            // save if ST if ot and nt are empty
                            let ST = diff;
                            // update dar detail set time out and (st, if not ot and ndot)
                            const query3 = `UPDATE tbldardtl SET time_out = "${time_out}", st = "${ST}" WHERE id = ${element.id}`;
                            db.query(query3, [], (err3, result3) => { console.log(err3); });
                            chapaCounter += 1; // increment
                        }
                        arrayCounter += 1; // increment array counter
                    });
                    // compute hour diff of two dates
                    function diff_hours(dt2, dt1) {
                        dt2 = new Date(dt2);
                        dt1 = new Date(dt1);
                        var diff = (dt2.getTime() - dt1.getTime()) / 1000;
                        diff /= (60 * 60);
                        // Return the absolute value of the rounded difference in hours
                        return Math.abs(Math.round(diff));
                    }
                    resolve({ success: true, message: "successfully saved" });
                } else {
                    resolve({ success: false, message: "no data" });
                }
            });
        });
    },

}

module.exports = rawQueryModel;