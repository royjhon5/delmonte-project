const { parse } = require('path');
const db = require('../../config/dbConnection')
const rawQueryModel = {

    EmployeeListJoin: async function (params) {
        return new Promise((resolve, reject) => {
            const locationJoin = " LEFT JOIN tbllocationlist l ON l.id = el.assigned_location_idlink ";
            const departmentJoin = " LEFT JOIN tbldepartment d ON d.id = el.assigned_department_idlink ";
            const groupLineJoin = " LEFT JOIN tblgroupline_list g ON g.id = el.assigned_group_idlink ";
            const query = 'SELECT el.*, l.location_name, d.department_name, g.groupline_name  FROM tblemployeelist el ' + locationJoin + departmentJoin + groupLineJoin;
            db.query(query, params.paramValue, (err, result) => {
                if (err) return reject(err);
                resolve({ success: true, data: result });
            });
        });
    },

    VerifyOnSave: async function (params) {
        return new Promise((resolve, reject) => {
            const { table, conditions } = params; 
            if (!table || !conditions || Object.keys(conditions).length === 0) {
                return reject(new Error("Invalid parameters"));
            }
            const whereClauses = Object.keys(conditions)
                .map((key) => `${key} = ?`)
                .join(" AND ");   
            const values = Object.values(conditions);
            const query = `SELECT * FROM ${table} WHERE ${whereClauses}`;
            db.query(query, values, (err, result) => {
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
                    // select dar header date
                    const darQuery = `SELECT * FROM tbldarhdr WHERE id = ${params.id} LIMIT 1`;
                    db.query(darQuery, [], async (errDar, resultDar) => {
                        if (resultDar.length > 0) {
                            // get dar time in from device here...
                            let timeInHour = (parseInt(resultDar[0].shift_time_in_hour) - 2).toString().padStart(2, "0"); // minus 2hrs
                            let timeOutHour = (parseInt(resultDar[0].shift_time_out_hour) + 2).toString().padStart(2, "0"); // add 2hrs
                            let darScheduleIn = resultDar[0].xDate + " " + timeInHour + ":" + resultDar[0].shift_time_in_min + ":00";
                            let darScheduleOut = resultDar[0].xDate + " " + timeOutHour + ":" + resultDar[0].shift_time_out_min + ":00";
                            const queryDTR = `SELECT auth_time FROM ${process.env.DB_NAME2}.device_logs WHERE person_name LIKE "%${element.ChapaID}" AND auth_datetime BETWEEN "${darScheduleIn}" AND "${darScheduleOut}" ORDER BY auth_datetime ASC LIMIT 1`; // get first time in
                            db.query(queryDTR, [], (errDTR, resultDTR) => {
                                let timeIn = "";
                                if (resultDTR.length > 0) timeIn = resultDTR[0].auth_time.split(':')[0] + "" + resultDTR[0].auth_time.split(':')[1];
                                const queryDTROut = `SELECT auth_time FROM ${process.env.DB_NAME2}.device_logs WHERE person_name LIKE "%${element.ChapaID}" AND auth_datetime BETWEEN "${darScheduleIn}" AND "${darScheduleOut}" ORDER BY auth_datetime DESC LIMIT 1`; // get last dtr of chapa
                                db.query(queryDTROut, [], (errDTROut, resultDTROut) => {
                                    let timeOut = "";
                                    if (resultDTROut.length > 0) {
                                        if (timeIn != resultDTROut[0].auth_time.split(':')[0] + "" + resultDTROut[0].auth_time.split(':')[1]) {
                                            timeOut = resultDTROut[0].auth_time.split(':')[0] + "" + resultDTROut[0].auth_time.split(':')[1];
                                        }
                                    }
                                    // compute st
                                    let ST = 0;
                                    if (timeIn && timeOut) {
                                        let timeInDateTime = "2025-01-01 " + resultDar[0].shift_time_in_hour + ":" + resultDar[0].shift_time_in_min;
                                        let timeOutDateTime = "2025-01-01 " + resultDar[0].shift_time_out_hour + ":" + resultDar[0].shift_time_out_min;
                                        if (parseInt(resultDar[0].shift_time_in_hour) > parseInt(resultDar[0].shift_time_out_hour)) { // next day
                                            timeOutDateTime = "2025-01-02 " + resultDar[0].shift_time_out_hour + ":" + resultDar[0].shift_time_out_min;
                                        }
                                        let diff = diff_hours(timeInDateTime, timeOutDateTime);
                                        ST = parseFloat(diff);
                                        ST = ST > 8 ? 8 : ST; // make sure only 8 hrs ST
                                    }
                                    // insert dardtl
                                    const query2 = `INSERT INTO tbldardtl (dar_idlink, ChapaID, emp_lname, emp_fname, emp_mname, emp_ext_name, time_in, time_out, gl, cost_center, activitylink_id, activity, st, is_main)
                                        VALUES (${params.id}, "${element.ChapaID}", "${element.last_name}", "${element.first_name}", "${element.middle_name}", "${element.ext_name}", "${timeIn}", "${timeOut}", "${element.gl_code}", "${element.costcenter}", 
                                        "${element.default_acitivity_idlink}", "${element.activityname}", "${ST}", "1")`;
                                    db.query(query2, [], (err2, result2) => { console.log(err2); });
                                })
                            });
                        }
                    })
                    // compute hour diff of two dates
                    function diff_hours(dt2, dt1) {
                        dt2 = new Date(dt2);
                        dt1 = new Date(dt1);
                        var diff = (dt2.getTime() - dt1.getTime()) / 1000;
                        diff /= (60 * 60);
                        // Return the absolute value of the rounded difference in hours
                        return Math.abs(diff.toFixed(2));
                    }
                });
                resolve({ success: true });
            });
        });
    },

    AddDARDetailsToSOA: async function (params) {
        return new Promise((resolve, reject) => {
            const query = `SELECT COUNT(DISTINCT(dtl.ChapaID)) as head_count, hdr.day_type_idlink, dtl.activitylink_id, dtl.gl, dtl.cost_center, dtl.activity, SUM(dtl.st) as total_st, SUM(dtl.ot) as total_ot,
                SUM(dtl.nd) as total_nd, SUM(dtl.ndot) as total_ndot FROM tbldarhdr hdr, tbldardtl dtl WHERE hdr.id = dtl.dar_idlink AND hdr.id = ${params.id} GROUP BY dtl.activitylink_id`;
            db.query(query, [], async (err, result) => {
                console.log(err)
                await result.forEach(element => {
                    // get account rates here...
                    const accountRateSql = `SELECT * FROM tblaccount_rates WHERE daytype_link = ${element.day_type_idlink} LIMIT 1`;
                    db.query(accountRateSql, [], async (errRate, resultRate) => {
                        let c_rates_st = 0;
                        let c_rates_ot = 0;
                        let c_rates_nd = 0;
                        let c_rates_ndot = 0;
                        let amount_st = 0;
                        let amount_ot = 0;
                        let amount_nd = 0;
                        let amount_ndot = 0;
                        let total_amount = 0;
                        if (resultRate.length > 0) {
                            c_rates_st = resultRate[0].st_rate;
                            c_rates_ot = resultRate[0].ot_rate;
                            c_rates_nd = resultRate[0].nd_rate;
                            c_rates_ndot = resultRate[0].ndot_rate;
                            amount_st = parseFloat(resultRate[0].st_rate) * parseFloat(element.total_st);
                            amount_ot = parseFloat(resultRate[0].ot_rate) * parseFloat(element.total_ot);
                            amount_nd = parseFloat(resultRate[0].nd_rate) * parseFloat(element.total_nd);
                            amount_ndot = parseFloat(resultRate[0].ndot_rate) * parseFloat(element.total_ndot);
                            total_amount = amount_st + amount_ot + amount_nd + amount_ndot;
                        }
                        // insert soa detail
                        const query2 = `INSERT INTO tblsoa_dtl (soa_hdr_idlink, dar_hdr_link_id, activity_idlink, h_st, h_ot, h_nd, h_ndot, head_count, gl_account, cost_center, activity,
                            c_rates_st, c_rates_ot, c_rates_nd, c_rates_ndot, amount_st, amount_ot, amount_nd, amount_ndot, total_amount)
                            VALUES (${params.soa_id}, "${params.id}", "${element.activitylink_id}", "${element.total_st}", "${element.total_ot}", "${element.total_nd}", "${element.total_ndot}", 
                            "${element.head_count}", "${element.gl}", "${element.cost_center}", "${element.activity}", "${c_rates_st}", "${c_rates_ot}", "${c_rates_nd}", 
                            "${c_rates_ndot}", "${amount_st}", "${amount_ot}", "${amount_nd}", "${amount_ndot}", "${total_amount}")`;
                        db.query(query2, [], (err2, result2) => { console.log(err2); });
                    })
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
            const darDate = `(SELECT hdr.xDate FROM tbldarhdr hdr WHERE hdr.id = tbldardtl.dar_idlink LIMIT 1) as darDate`;
            const department = `(SELECT hdr.department FROM tbldarhdr hdr WHERE hdr.id = tbldardtl.dar_idlink LIMIT 1) as department`;
            const query = `SELECT *, ${shift}, ${count}, ${darDate}, ${department} FROM tbldardtl WHERE dar_idlink = ${params.id} ORDER BY ChapaID ASC, id ASC`;
            db.query(query, [], async (err, result) => {
                // console.log(err);
                if (result) {
                    let chapaCounter = 1;
                    let arrayCounter = 1;
                    await result.forEach(element => {
                        let diff = 0;
                        let time_out = "";
                        if (chapaCounter == element.count) { // to know that this record is the last and this is where to save the final time out of employee
                            const queryDTR = `SELECT auth_time FROM ${process.env.DB_NAME2}.device_logs WHERE person_name LIKE "%${element.ChapaID}" AND auth_date = "${element.darDate}" ORDER BY auth_datetime DESC LIMIT 1`; // get last dtr of chapa
                            db.query(queryDTR, [], (errDTR, resultDTR) => {
                                let timeOut = "";
                                if (resultDTR.length > 0) timeOut = resultDTR[0].auth_time.split(':')[0] + "" + resultDTR[0].auth_time.split(':')[1];
                                let timeInDateTime = "2025-01-01 " + element.time_in.substring(0, 2) + ":" + element.time_in.substring(2, 4);
                                let timeOutDateTime = "2025-01-01 " + timeOut.substring(0, 2) + ":" + timeOut.substring(2, 4);
                                if (element.shift == 2 && parseInt(timeOut.substring(0, 2)) < 17 && parseInt(element.time_in.substring(0, 2)) >= 17) {
                                    timeOutDateTime = "2025-01-02 " + timeOut.substring(0, 2) + ":" + timeOut.substring(2, 4); // next time in of that employee
                                }
                                diff = diff_hours(timeInDateTime, timeOutDateTime);
                                time_out = timeOut;
                                // save if ST if ot and nt are empty
                                let ST = parseFloat(diff);

                                if (element.department != "PACK HOUSE" && ST > 1) ST = ST - 1;

                                // update dar detail set time out
                                const query3 = `UPDATE tbldardtl SET time_out = "${time_out}" WHERE id = ${element.id} AND time_out = ""`;
                                db.query(query3, [], (err3, result3) => { console.log(err3); });
                                // update st where no value on ot and ndot
                                const query4 = `UPDATE tbldardtl SET st = "${ST}" WHERE id = ${element.id} AND ot = 0 AND ndot = 0 AND st = 0`;
                                db.query(query4, [], (err4, result4) => { console.log(err4); });
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
                            let ST = parseFloat(diff);
                            // update dar detail set time out
                            const query3 = `UPDATE tbldardtl SET time_out = "${time_out}" WHERE id = ${element.id} AND time_out = ""`;
                            db.query(query3, [], (err3, result3) => { console.log(err3); });
                            // update st where no value on ot and ndot
                            const query4 = `UPDATE tbldardtl SET st = "${ST}" WHERE id = ${element.id} AND ot = 0 AND ndot = 0 AND st = 0`;
                            db.query(query4, [], (err4, result4) => { console.log(err4); });
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
                        return Math.abs(diff.toFixed(2));
                    }
                    resolve({ success: true, message: "successfully saved" });
                } else {
                    resolve({ success: false, message: "no data" });
                }
            });
        });
    },

    DARDetailTime: async function (params) {
        return new Promise((resolve, reject) => {
            // timeIn and person name
            let timeIn = "N/A";
            let timeOut = "N/A";
            const queryDTR = `SELECT auth_time FROM ${process.env.DB_NAME2}.device_logs WHERE person_name LIKE "%${params.chapa_id}" and auth_date = "${params.date}" ORDER BY auth_datetime ASC LIMIT 1`; // get first time in
            db.query(queryDTR, [], async (errDTR, resultDTR) => {
                if (resultDTR.length > 0) {
                    timeIn = resultDTR[0].auth_time.split(':')[0] + "" + resultDTR[0].auth_time.split(':')[1];;
                    // timeOut
                    const queryDTR2 = `SELECT auth_time FROM ${process.env.DB_NAME2}.device_logs WHERE person_name LIKE "%${params.chapa_id}" and auth_date = "${params.date}" ORDER BY auth_datetime DESC`; // get first time in
                    db.query(queryDTR2, [], async (errDTR2, resultDTR2) => {
                        if (resultDTR2.length > 1) {
                            timeOut = resultDTR2[0].auth_time.split(':')[0] + "" + resultDTR2[0].auth_time.split(':')[1];
                        }
                        resolve({ success: true, data: [{ time_in: timeIn, time_out: timeOut }] });
                    });
                } else {
                    resolve({ success: true, data: [{ time_in: timeIn, time_out: timeOut }] });
                }
            });
        });
    },

    saveDARActivityBreakdown: async function (params) {
        return new Promise(async (resolve, reject) => {
            if (params.empids.length > 0) {
                await params.empids.forEach(element => {
                    let toSave = params.fieldValue;
                    const queryEmp = `SELECT * FROM tblemployeelist WHERE chapa_id = "${element}" LIMIT 1`;
                    db.query(queryEmp, [], async (errEmp, resultEmp) => {
                        console.log(errEmp);
                        if (resultEmp.length > 0) {
                            toSave.ChapaID = resultEmp[0].chapa_id;
                            toSave.emp_lname = resultEmp[0].lastname;
                            toSave.emp_fname = resultEmp[0].firstname;
                            toSave.emp_mname = resultEmp[0].middlename;
                            toSave.emp_ext_name = resultEmp[0].extname;

                            // insert
                            const query2 = `INSERT INTO tbldardtl (dar_idlink, ChapaID, emp_lname, emp_fname, emp_mname, emp_ext_name, time_in, time_out, st, ot, nd, ndot, gl, cost_center, activitylink_id, activity, is_main, costcenterlink_id, glcodelink_id)
                                VALUES (${toSave.dar_idlink}, "${toSave.ChapaID}", "${toSave.emp_lname}", "${toSave.emp_fname}", "${toSave.emp_mname}", "${toSave.emp_ext_name}", "${toSave.time_in}", "${toSave.time_out}", "${toSave.st}", "${toSave.ot}", 
                                "${toSave.nd}", "${toSave.ndot}", "${toSave.gl}", "${toSave.cost_center}", "${toSave.activitylink_id}", "${toSave.activity}", "${toSave.is_main}", "${toSave.costcenterlink_id}", "${toSave.glcodelink_id}")`;
                            db.query(query2, [], (err2, result2) => { console.log(err2); });
                        }
                    });
                });
                resolve({ success: true, message: "successfully saved" });
            } else {
                resolve({ success: false, message: "no employees to save" });
            }
        });
    },

    saveDARDetail: async function (params) {
        return new Promise(async (resolve, reject) => {
            const queryDARDtl = `SELECT * FROM tbldardtl WHERE dar_idlink = "${params.fieldValue.dar_idlink}" and ChapaID = "${params.fieldValue.ChapaID}" LIMIT 1`;
            db.query(queryDARDtl, [], async (errDARDtl, resultDARDtl) => {
                console.log(errDARDtl);
                let toSave = params.fieldValue;
                if (resultDARDtl.length > 0) {
                    // insert dardtl breakdown
                    const query2 = `INSERT INTO tbldardtl (dar_idlink, ChapaID, emp_lname, emp_fname, emp_mname, emp_ext_name, time_in, time_out, st, ot, nd, ndot, gl, cost_center, activitylink_id, activity, is_main, costcenterlink_id, glcodelink_id)
                        VALUES (${toSave.dar_idlink}, "${toSave.ChapaID}", "${toSave.emp_lname}", "${toSave.emp_fname}", "${toSave.emp_mname}", "${toSave.emp_ext_name}", "${toSave.time_in}", "${toSave.time_out}", "${toSave.st}", "${toSave.ot}", 
                        "${toSave.nd}", "${toSave.ndot}", "${toSave.gl}", "${toSave.cost_center}", "${toSave.activitylink_id}", "${toSave.activity}", "${toSave.is_main}", "${toSave.costcenterlink_id}", "${toSave.glcodelink_id}")`;
                    db.query(query2, [], (err2, result2) => { console.log(err2); });
                } else {
                    // new employee added to dar
                    toSave.is_main = 1;
                    const darQuery = `SELECT * FROM tbldarhdr WHERE id = ${toSave.dar_idlink} LIMIT 1`;
                    db.query(darQuery, [], async (errDar, resultDar) => {
                        if (resultDar.length > 0) {
                            // get dar time in from device here...
                            let timeInHour = (parseInt(resultDar[0].shift_time_in_hour) - 2).toString().padStart(2, "0"); // minus 2hrs
                            let timeOutHour = (parseInt(resultDar[0].shift_time_out_hour) + 2).toString().padStart(2, "0"); // add 2hrs
                            let darScheduleIn = resultDar[0].xDate + " " + timeInHour + ":" + resultDar[0].shift_time_in_min + ":00";
                            let darScheduleOut = resultDar[0].xDate + " " + timeOutHour + ":" + resultDar[0].shift_time_out_min + ":00";
                            const queryDTR = `SELECT auth_time FROM ${process.env.DB_NAME2}.device_logs WHERE person_name LIKE "%${toSave.ChapaID}" AND auth_datetime BETWEEN "${darScheduleIn}" AND "${darScheduleOut}" ORDER BY auth_datetime ASC LIMIT 1`; // get first time in
                            db.query(queryDTR, [], (errDTR, resultDTR) => {
                                let timeIn = "";
                                if (resultDTR.length > 0) timeIn = resultDTR[0].auth_time.split(':')[0] + "" + resultDTR[0].auth_time.split(':')[1];
                                const queryDTROut = `SELECT auth_time FROM ${process.env.DB_NAME2}.device_logs WHERE person_name LIKE "%${toSave.ChapaID}" AND auth_datetime BETWEEN "${darScheduleIn}" AND "${darScheduleOut}" ORDER BY auth_datetime DESC LIMIT 1`; // get last dtr of chapa
                                db.query(queryDTROut, [], (errDTROut, resultDTROut) => {
                                    let timeOut = "";
                                    if (resultDTROut.length > 0) {
                                        if (timeIn != resultDTROut[0].auth_time.split(':')[0] + "" + resultDTROut[0].auth_time.split(':')[1]) {
                                            timeOut = resultDTROut[0].auth_time.split(':')[0] + "" + resultDTROut[0].auth_time.split(':')[1];
                                        }
                                    }
                                    // compute st
                                    let ST = 0;
                                    if (timeIn && timeOut) {
                                        let timeInDateTime = "2025-01-01 " + resultDar[0].shift_time_in_hour + ":" + resultDar[0].shift_time_in_min;
                                        let timeOutDateTime = "2025-01-01 " + resultDar[0].shift_time_out_hour + ":" + resultDar[0].shift_time_out_min;
                                        if (parseInt(resultDar[0].shift_time_in_hour) > parseInt(resultDar[0].shift_time_out_hour)) { // next day
                                            timeOutDateTime = "2025-01-02 " + resultDar[0].shift_time_out_hour + ":" + resultDar[0].shift_time_out_min;
                                        }
                                        let diff = diff_hours(timeInDateTime, timeOutDateTime);
                                        ST = parseFloat(diff);
                                        ST = ST > 8 ? 8 : ST; // make sure only 8 hrs ST
                                    }
                                    // insert dardtl
                                    const query2 = `INSERT INTO tbldardtl (dar_idlink, ChapaID, emp_lname, emp_fname, emp_mname, emp_ext_name, time_in, time_out, st, ot, nd, ndot, gl, cost_center, activitylink_id, activity, is_main, costcenterlink_id, glcodelink_id)
                                        VALUES (${toSave.dar_idlink}, "${toSave.ChapaID}", "${toSave.emp_lname}", "${toSave.emp_fname}", "${toSave.emp_mname}", "${toSave.emp_ext_name}", "${toSave.time_in}", "${toSave.time_out}", "${ST}", "0", 
                                        "0", "0", "${toSave.gl}", "${toSave.cost_center}", "${toSave.activitylink_id}", "${toSave.activity}", "${toSave.is_main}", "${toSave.costcenterlink_id}", "${toSave.glcodelink_id}")`;
                                    db.query(query2, [], (err2, result2) => { console.log(err2); });
                                })
                            });
                        }
                    })
                    // compute hour diff of two dates
                    function diff_hours(dt2, dt1) {
                        dt2 = new Date(dt2);
                        dt1 = new Date(dt1);
                        var diff = (dt2.getTime() - dt1.getTime()) / 1000;
                        diff /= (60 * 60);
                        // Return the absolute value of the rounded difference in hours
                        return Math.abs(diff.toFixed(2));
                    }
                }
                resolve({ success: true, message: "successfully saved" });
            });
        });
    },


    submitSOAToDMPI: async function (params) {
        return new Promise((resolve, reject) => {
            // soa header
            const querySOAHdr = `INSERT INTO ${process.env.DB_NAME3}.tblsoahdr (id, dept_idlink, location_idlink, daytype_idlink, soa_no, xDate, soa_status, prepared_by, preparedby_position, checked_by, 
                checkedby_position, confirmed_by, confirmedby_position, approved_by, approvedby_position, period_coverage, department, location, daytype) SELECT id, dept_idlink, location_idlink, daytype_idlink, 
                soa_no, xDate, soa_status, prepared_by, preparedby_position, checked_by, checkedby_position, confirmed_by, confirmedby_position, approved_by, approvedby_position, period_coverage, 
                department, location, daytype FROM tblsoahdr WHERE id=${params.id}`;
            db.query(querySOAHdr, [], async (errSOAHdr, resultSOAHdr) => { });

            // soa detail
            const querySOADtl = `INSERT INTO ${process.env.DB_NAME3}.tblsoa_dtl SELECT * FROM tblsoa_dtl WHERE soa_hdr_idlink=${params.id}`;
            db.query(querySOADtl, [], async (errSOADtl, resultSOADtl) => { });

            // dar header
            const queryDARHdr = `INSERT INTO ${process.env.DB_NAME3}.tbldarhdr SELECT * FROM tbldarhdr WHERE soa_no_link=${params.id}`;
            db.query(queryDARHdr, [], async (errDARHdr, resultDARHdr) => { });

            // dar detail
            const queryDARDtl = `INSERT INTO ${process.env.DB_NAME3}.tbldardtl SELECT dtl.* FROM tbldarhdr hdr, tbldardtl dtl WHERE hdr.id = dtl.dar_idlink AND hdr.soa_no_link=${params.id}`;
            db.query(queryDARDtl, [], async (errDARDtl, resultDARDtl) => { });

            // Update SOA Header
            const queryUpdateSOA = `UPDATE ${process.env.DB_NAME3}.tblsoahdr SET soa_status = 'SUBMITTED' WHERE id=${params.id}`;
            db.query(queryUpdateSOA, [], async (errUpdateSOA, resultUpdateSOA) => { });

            resolve({ success: true, message: "successfully saved" });
        });
    },

    // print
    PrintDARDetails: async function (params) {
        let resultData = [];
        let totalST = 0, totalOT = 0, totalND = 0, totalNDOT = 0, totalHC = 1, cntr = 1;

        return new Promise((resolve, reject) => {
            const daytype = `(SELECT a.dt_name FROM tbldaytype a WHERE a.id = hdr.day_type_idlink LIMIT 1) as daytype`;
            const dataQuery = `
                SELECT hdr.department, hdr.xDate, dtl.*, ${daytype}, hdr.prepared_by, hdr.checked_by, hdr.shift  
                FROM tbldarhdr hdr, tbldardtl dtl 
                WHERE hdr.id = dtl.dar_idlink AND hdr.id = ${params.id} 
                ORDER BY dtl.emp_lname ASC, dtl.ChapaID ASC 
            `;
            db.query(dataQuery, params.paramValue, (err, result) => {
                if (err) return reject(err);
                if (result.length > 0) {
                    let lastChapa = result[0].ChapaID;
                    let prepared_by = result[0].prepared_by;
                    let checked_by = result[0].checked_by;

                    resultData.push({
                        ChapaID: "",
                        emp_lname: result[0].activity.toUpperCase(),
                        emp_fname: "",
                        emp_mname: "",
                        emp_ext_name: "",
                        time_in: "",
                        time_out: "",
                        st: "",
                        ot: "",
                        nd: "",
                        ndot: "",
                        gl: "",
                        glcost_center: "",
                        daytype: result[0].daytype,
                        department: result[0].department,
                        xDate: result[0].xDate,
                        shift: result[0].shift
                    });

                    result.forEach(element => {
                        if (lastChapa != element.ChapaID) {
                            lastChapa = element.ChapaID;
                            totalHC += 1;
                            cntr = 1;
                            resultData.push({
                                ChapaID: "",
                                emp_lname: element.activity.toUpperCase(),
                                emp_fname: "",
                                emp_mname: "",
                                emp_ext_name: "",
                                time_in: "",
                                time_out: "",
                                st: "",
                                ot: "",
                                nd: "",
                                ndot: "",
                                gl: "",
                                glcost_center: "",
                                daytype: element.daytype,
                                department: element.department,
                                xDate: element.xDate,
                                shift: element.shift
                            });
                        }
                        if (cntr > 1) {
                            element.ChapaID = "";
                            element.emp_lname = "";
                            element.emp_fname = "";
                            element.emp_mname = "";
                            element.emp_ext_name = "";
                        }
                        resultData.push(element);
                        totalST += parseFloat(element.st);
                        totalOT += parseFloat(element.ot);
                        totalND += parseFloat(element.nd);
                        totalNDOT += parseFloat(element.ndot);
                        cntr += 1;
                    });

                    resolve({
                        success: true,
                        data: resultData,
                        totals: { totalHC, totalST, totalOT, totalND, totalNDOT },
                        signatory: { prepared_by: prepared_by.toUpperCase(), checked_by: checked_by.toUpperCase() }
                    });
                } else {
                    resolve({
                        success: false,
                        data: [],
                        totals: { totalHC: 0, totalST: 0, totalOT: 0, totalND: 0, totalNDOT: 0 },
                        signatory: { prepared_by: "", checked_by: "" }
                    });
                }
            });
        });
    },


    PrintSOADetails: async function (params) {
        let resultData = [];
        let totalST = 0;
        let totalOT = 0;
        let totalND = 0;
        let totalNDOT = 0;
        let totalHC = 1;
        let cntr = 1;
        return new Promise((resolve, reject) => {
            const sumFields = `SUM(h_st) as th_st, SUM(h_ot) as th_ot, SUM(h_nd) as th_nd, SUM(h_ndot) as th_ndot, SUM(amount_st) as tamount_st, SUM(amount_ot) as tamount_ot, SUM(amount_nd) as tamount_nd, SUM(amount_ndot) as tamount_ndot, SUM(total_amount) as ttotal_amount, SUM(head_count) as thead_count`;
            const query = `SELECT hdr.*, dtl.*, ${sumFields} FROM tblsoahdr hdr, tblsoa_dtl dtl WHERE hdr.id = dtl.soa_hdr_idlink and hdr.id = ${params.id} GROUP BY dtl.activity_idlink ORDER BY dtl.activity ASC, dtl.gl_account ASC`;
            db.query(query, params.paramValue, (err, result) => {
                if (err) return reject(err);
                if (result.length > 0) {
                    let prepared_by = result[0].prepared_by;
                    let checked_by = result[0].checked_by;
                    let confirmed_by = result[0].confirmed_by;
                    let approved_by = result[0].approved_by;
                    let preparedby_position = result[0].preparedby_position;
                    let checkedby_position = result[0].checkedby_position;
                    let confirmedby_position = result[0].confirmedby_position;
                    let approvedby_position = result[0].approvedby_position;
                    result.forEach(element => {
                        element.count = cntr;
                        resultData.push(element);
                        totalST += parseFloat(element.st);
                        totalOT += parseFloat(element.ot);
                        totalND += parseFloat(element.nd);
                        totalNDOT += parseFloat(element.ndot);
                        cntr += 1;
                    })
                    resolve({
                        success: true,
                        data: resultData,
                        totals: { totalHC: totalHC, totalST: totalST, totalOT: totalOT, totalND: totalND, totalNDOT: totalNDOT },
                        signatory: { prepared_by: prepared_by.toUpperCase(), checked_by: checked_by.toUpperCase(), confirmed_by: confirmed_by.toUpperCase(), approved_by: approved_by.toUpperCase() },
                        designation: { preparedby_position: preparedby_position.toUpperCase(), checkedby_position: checkedby_position.toUpperCase(), confirmedby_position: confirmedby_position.toUpperCase(), approvedby_position: approvedby_position.toUpperCase() }
                    });
                } else {
                    resolve({
                        success: true,
                        data: [],
                        totals: { totalHC: 0, totalST: 0, totalOT: 0, totalND: 0, totalNDOT: 0 },
                        signatory: { prepared_by: "", checked_by: "", confirmed_by: "", approved_by: "" },
                        signatory: { preparedby_position: "", checkedby_position: "", confirmedby_position: "", approvedby_position: "" },
                    });
                }
            });
        });
    },

    generateDARNo: async function (params) {
        return new Promise((resolve, reject) => {
            let dar_no = "";
            const query = `SELECT dar_no FROM tbldarhdr WHERE id <> ${params.id} ORDER BY id DESC LIMIT 1`;
            db.query(query, [], async (err, result) => {
                if (result.length > 0) {
                    if (result[0].dar_no) {
                        const darNoRaw = result[0].dar_no.split('-');
                        if (darNoRaw[0] != getYearMonthCurrent('year')) {
                            dar_no = getYearMonthCurrent() + "-00001";
                        } else {
                            dar_no = getYearMonthCurrent() + "-" + (parseInt(darNoRaw[2]) + 1).toString().padStart(5, "0"); // increment series 
                        }
                    } else {
                        dar_no = getYearMonthCurrent() + "-00001";
                    }
                } else {
                    dar_no = getYearMonthCurrent() + "-00001";
                }
                function getYearMonthCurrent(type = 'year_month') {
                    const dateObj = new Date();
                    const month = dateObj.getMonth() + 1; // months from 1-12
                    const day = dateObj.getDate();
                    const year = dateObj.getFullYear();
                    const pMonth = month.toString().padStart(2, "0");
                    const pDay = day.toString().padStart(2, "0");
                    if (type == 'year_month') return `${year}-${pMonth}`;
                    else if (type == 'year') return `${year}`;
                    else return `${year}-${pMonth}-${pDay}`;
                }
                resolve({ success: true, dar_no: dar_no });
            });
        });
    },

    // GetForConfirmation: async function () {
    //     return new Promise((resolve, reject) => {
    //         const query = `SELECT dhdr.*, shdr.*, shdr.id as soa_id FROM tbldarhdr dhdr, tblsoahdr shdr WHERE shdr.id = dhdr.soa_no_link AND shdr.soa_status = "SUBMITTED" ORDER BY dhdr.xDate ASC, dhdr.id ASC`;
    //         db.query(query, [], async (err, result) => {
    //             console.log(result);
    //             resolve({ success: true, data: result });
    //         });
    //     });
    // },

    // GetForApproval: async function () {
    //     return new Promise((resolve, reject) => {
    //         const query = `SELECT dhdr.*, shdr.*, shdr.id as soa_id FROM tbldarhdr dhdr, tblsoahdr shdr WHERE shdr.id = dhdr.soa_no_link AND shdr.soa_status = "CONFIRMED" ORDER BY dhdr.xDate ASC, dhdr.id ASC`;
    //         db.query(query, [], async (err, result) => {
    //             console.log(result);
    //             resolve({ success: true, data: result });
    //         });
    //     });
    // },
}

module.exports = rawQueryModel;