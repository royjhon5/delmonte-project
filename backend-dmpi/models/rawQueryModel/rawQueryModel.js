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

                    const query2 = `INSERT INTO tbldardtl (dar_idlink, ChapaID, emp_lname, emp_fname, emp_mname, emp_ext_name, time_in, gl, cost_center, activitylink_id, activity)
                        VALUES (${params.id}, "${element.ChapaID}", "${element.last_name}", "${element.first_name}", "${element.middle_name}", "${element.ext_name}", "0800", "${element.gl_code}", "${element.costcenter}", 
                        "${element.account_master_idlink}", "${element.activityname}")`;
                    db.query(query2, [], (err2, result2) => { console.log(err2); });
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

    GetForConfirmation: async function () {
        return new Promise((resolve, reject) => {
            const query = `SELECT *, id as soa_id FROM tblsoahdr WHERE soa_status = "SUBMITTED" ORDER BY xDate ASC, id ASC`;
            db.query(query, [], async (err, result) => {
                resolve({ success: true, data: result });
            });
        });
    },

    GetForApproval: async function () {
        return new Promise((resolve, reject) => {
            const query = `SELECT *, id as soa_id FROM tblsoahdr WHERE soa_status = "CONFIRMED" ORDER BY xDate ASC, id ASC`;
            db.query(query, [], async (err, result) => {
                resolve({ success: true, data: result });
            });
        });
    },

    GetSOAJoinDAR: async function (params) {
        return new Promise((resolve, reject) => {
            const query = `SELECT dhdr.*, dhdr.id as dar_id FROM tbldarhdr dhdr, tblsoahdr shdr WHERE shdr.id=${params.id} AND shdr.id = dhdr.soa_no_link AND shdr.soa_status = "SUBMITTED" ORDER BY dhdr.id ASC`; // dar header data only
            db.query(query, [], async (err, result) => {
                resolve({ success: true, data: result });
            });
        });
    },

    // print
    PrintDARDetails: async function (params) {
        let resultData = [];
        let totalST = 0, totalOT = 0, totalND = 0, totalNDOT = 0, totalHC = 1, cntr = 1;

        return new Promise((resolve, reject) => {
            const dataQuery = `
                SELECT hdr.department, hdr.xDate, dtl.*, hdr.prepared_by, hdr.checked_by, hdr.shift  
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
            const filepath_esignature = `(SELECT l.filepath_esignature FROM tbllogin l WHERE l.LoginID = hdr.id LIMIT 1) as filepath_esignature`;
            const query = `SELECT hdr.*, dtl.*, ${sumFields}, ${filepath_esignature} FROM tblsoahdr hdr, tblsoa_dtl dtl WHERE hdr.id = dtl.soa_hdr_idlink and hdr.id = ${params.id} GROUP BY dtl.activity_idlink ORDER BY dtl.activity ASC, dtl.gl_account ASC`;
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
}

module.exports = rawQueryModel;