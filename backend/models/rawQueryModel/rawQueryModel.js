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
}

module.exports = rawQueryModel;