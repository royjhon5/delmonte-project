const db = require('../../config/dbConnection')
const MyPortalModel = {

    FolderSubFolderByUser: async function (params) {
        return new Promise((resolve, reject) => {
            var addWhere = "";
            if (!params.all) addWhere = " WHERE f.user_id_link = ?";
            if (!params.all && params.paramValue[0] == undefined) return resolve({ success: false, error: 'required data', message: 'missing parameter' });
            const query = 'SELECT f.id, f.folder_name, f.user_id_link, sf.id_link, sf.sub_folder_name FROM tblmyportalfolder f LEFT JOIN tblmyportalsubfolder sf ON f.id = sf.id_link' + addWhere;
            db.query(query, params.paramValue, (err, result) => {
                if (err) return reject(err);
                resolve({ success: true, data: result });
            });
        });
    },

    BrowseFromEcardingModel: async function (params) {
        return new Promise((resolve, reject) => {
            var addWhere = " WHERE thdr.Status = 'CLOSED'";
            if (!params.all) {
                if (params.where.length == 0 || params.whereValue.length == 0) return resolve({ success: false, error: 'required data', message: 'required filter' });
                if (params.where && Array.isArray(params.where)) {
                    addWhere += " AND " + params.where.join("/-/").replace(/\/-\//g, " AND ") + " ";
                }
            }
            const net = `(CASE` +
                ` WHEN thdr.TransType = 'SALARY' THEN (SELECT SUM(c.TNet50) FROM ${process.env.DB_NAME3}.tblpayrollhdr c WHERE c.TRHDRID = thdr.THdrID GROUP BY(TRHDRID) UNION SELECT SUM(c.TNet50) FROM ${process.env.DB_NAME3}.tblpayrollhdr_archive c WHERE c.TRHDRID = thdr.THdrID GROUP BY(TRHDRID))` +
                ` WHEN thdr.TransType = 'OTHER BENEFITS' THEN (SELECT SUM(c.TNet50) FROM ${process.env.DB_NAME2}.tblotherbenefitshdr c WHERE c.TRHDRID = thdr.THdrID GROUP BY(TRHDRID))` +
                ` WHEN thdr.TransType = 'CASH ADVANCE' THEN (SELECT SUM(c.Net) FROM ${process.env.DB_NAME2}.tblcashadvance c WHERE c.TRHDRID = thdr.THdrID GROUP BY(TRHDRID))` +
                ` WHEN thdr.TransType = 'FINANCIAL ASSISTANCE' THEN (SELECT SUM(c.Net) FROM ${process.env.DB_NAME2}.tblfinancialassistance c WHERE c.TRHDRID = thdr.THdrID GROUP BY(TRHDRID))` +
                ` WHEN thdr.TransType = 'PAYMENTS' THEN (SELECT SUM(d.TotalNet) FROM ${process.env.DB_NAME2}.tblpayments c, ${process.env.DB_NAME2}.tblpaymentchecks d WHERE c.TRHDRID = thdr.THdrID AND c.PID = d.DTLID GROUP BY(TRHDRID))` +
                ` END) as netAmount`;
            const getJev = `(Select jn.jev_no from ${process.env.DB_NAME2}.tbljevnos jn where thdr.THdrID = jn.hdr_id limit 1) as jevNo`;
            const query = `SELECT *, ${getJev}, ${net}, cdtl.check_no FROM ${process.env.DB_NAME2}.tbltranshdr thdr LEFT JOIN ${process.env.DB_NAME2}.tblcheckdisbursementdtl cdtl ON thdr.THdrID = cdtl.THDRID ${addWhere} limit 50`;
            db.query(query, params.whereValue, (err, result) => {
                if (err) return reject(err);
                result.length > 0 ? resolve({ success: true, data: result }) : resolve({ success: false, message: "No Data" });
            });
        });
    },

    OfficeFromEcardingModel: async function (params) {
        return new Promise((resolve, reject) => {
            var addWhere = " WHERE o.OfID > 0";
            if (!params.all) {
                if (params.where.length == 0 || params.whereValue.length == 0) return resolve({ success: false, error: 'required data', message: 'required filter' });
                if (params.where && Array.isArray(params.where)) {
                    addWhere += " AND " + params.where.join("/-/").replace(/\/-\//g, " AND ") + " ";
                }
            }
            const query = `SELECT * FROM ${process.env.DB_NAME2}.tblofficelist o ${addWhere} limit 50`;
            db.query(query, params.whereValue, (err, result) => {
                if (err) return reject(err);
                result.length > 0 ? resolve({ success: true, data: result }) : resolve({ success: false, message: "No Data" });
            });
        });
    },

    PayeeFromEcardingModel: async function (params) {
        return new Promise((resolve, reject) => {
            var addWhere = " WHERE p.payeeID > 0";
            if (!params.all) {
                if (params.where.length == 0 || params.whereValue.length == 0) return resolve({ success: false, error: 'required data', message: 'required filter' });
                if (params.where && Array.isArray(params.where)) {
                    addWhere += " AND " + params.where.join("/-/").replace(/\/-\//g, " AND ") + " ";
                }
            }
            const query = `SELECT * FROM ${process.env.DB_NAME2}.tblpayee p ${addWhere} limit 50`;
            db.query(query, params.whereValue, (err, result) => {
                if (err) return reject(err);
                result.length > 0 ? resolve({ success: true, data: result }) : resolve({ success: false, message: "No Data" });
            });
        });
    },

    PersonnelFromEcardingModel: async function (params) {
        return new Promise((resolve, reject) => {
            var addWhere = " WHERE e.EmpID > 0";
            if (!params.all) {
                if (params.where.length == 0 || params.whereValue.length == 0) return resolve({ success: false, error: 'required data', message: 'required filter' });
                if (params.where && Array.isArray(params.where)) {
                    addWhere += " AND " + params.where.join("/-/").replace(/\/-\//g, " AND ") + " ";
                }
            }
            const fullname = 'CONCAT(e.FName, " ", e.MName, " ", e.LName) as fullname';
            const query = `SELECT *, ${fullname} FROM ${process.env.DB_NAME3}.tblemployeemaster e ${addWhere} limit 50`;
            db.query(query, params.whereValue, (err, result) => {
                if (err) return reject(err);
                result.length > 0 ? resolve({ success: true, data: result }) : resolve({ success: false, message: "No Data" });
            });
        });
    },

    InquiryFilterSearch: async function (params) {
        return new Promise((resolve, reject) => {
            var addWhere = "";
            if (!params.all) {
                if (params.where.length == 0 || params.whereValue.length == 0) return resolve({ success: false, error: 'required data', message: 'required filter' });
                if (params.where && Array.isArray(params.where)) {
                    addWhere += " WHERE " + params.where.join("/-/").replace(/\/-\//g, " AND ") + " ";
                }
            }
            const ArchivedByDisplay = "(SELECT l.FullName FROM tbllogin l WHERE l.LoginID = thdr.ArchivedBy LIMIT 1) as ArchivedByDisplay";
            const document_type = "(SELECT dt.DTName FROM tbldocumenttype dt WHERE dt.id = thdr.DocTypeLinkID LIMIT 1) as document_type";
            const query = `SELECT *, ${document_type}, ${ArchivedByDisplay} FROM tblarchivehdr thdr ${addWhere} limit 25`;
            db.query(query, params.whereValue, (err, result) => {
                if (err) return reject(err);
                result.length > 0 ? resolve({ success: true, data: result }) : resolve({ success: false, message: "No Data" });
            });
        });
    },

    DashboardPieStatistics: async function (params) {
        return new Promise((resolve, reject) => {
            var addWhere = "";
            if (!params.all) {
                if (params.where.length == 0 || params.whereValue.length == 0) return resolve({ success: false, error: 'required data', message: 'required filter' });
                if (params.where && Array.isArray(params.where)) {
                    addWhere += " AND " + params.where.join("/-/").replace(/\/-\//g, " AND ") + " ";
                }
            }
            const query = `SELECT dt.DTName, COUNT(thdr.id) as count, COALESCE(sum(thdr.fileSize), 0) as total_fileSize FROM tbldocumenttype dt LEFT JOIN tblarchivehdr thdr ON (dt.id = thdr.DocTypeLinkID ${addWhere}) GROUP BY DTName`;
            db.query(query, params.whereValue, (err, result) => {
                if (err) return reject(err);
                result.length > 0 ? resolve({ success: true, data: result }) : resolve({ success: false, message: "No Data" });
            });
        });
    },

    DashboardBarStatistics: async function (params) {
        return new Promise((resolve, reject) => {
            var addWhere = "";
            if (!params.all) {
                if (params.where.length == 0 || params.whereValue.length == 0) return resolve({ success: false, error: 'required data', message: 'required filter' });
                if (params.where && Array.isArray(params.where)) {
                    addWhere += " WHERE " + params.where.join("/-/").replace(/\/-\//g, " AND ") + " ";
                }
            }
            const query = `SELECT COUNT(thdr.id) as count, MONTH(thdr.ArchiveDateTime) as month_number FROM tblarchivehdr thdr ${addWhere} GROUP BY MONTH(thdr.ArchiveDateTime)`;
            db.query(query, params.whereValue, async (err, result) => {
                if (err) return reject(err);
                if (result.length > 0) {
                    var dataResult = [];
                    const months = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBOER", "NOVEMBER", "DECEMBER"];
                    await result.forEach(async (element) => {
                        await months.forEach(async (month, index) => {
                            var temp = { month: months[index], count: 0 };
                            if ((index + 1) == element.month_number) temp.count = element.count;
                            dataResult.push(temp);
                        });
                    });
                    resolve({ success: true, data: dataResult });
                } else resolve({ success: false, message: "No Data" });
            });
        });
    },

    ReportByDateRange: async function (params) {
        return new Promise((resolve, reject) => {
            var addWhere = "";
            if (!params.all) {
                if (params.where.length == 0 || params.whereValue.length == 0) return resolve({ success: false, error: 'required data', message: 'required filter' });
                if (params.where && Array.isArray(params.where)) {
                    addWhere += " WHERE " + params.where.join("/-/").replace(/\/-\//g, " AND ") + " ";
                }
            }
            const docType = "(SELECT dt.DTName FROM tbldocumenttype dt WHERE dt.id = thdr.DocTypeLinkID LIMIT 1) as docType";
            const query = `SELECT *, ${docType} FROM tblarchivehdr thdr ${addWhere} ORDER BY DocTypeLinkID ASC, DocReferenceID ASC`;
            db.query(query, params.whereValue, async (err, result) => {
                if (err) return reject(err);
                if (result.length > 0) {
                    var dataResult = [];
                    var totalDocs = 0;
                    var totalSize = 0;
                    var dataTemp = [];
                    var subtotalDocs = 0;
                    var subtotalSize = 0;
                    var lastDocType = result[0].DocTypeLinkID;
                    var lastDocTypeName = result[0].docType;
                    await result.forEach(async (element) => {
                        if (lastDocType != element.DocTypeLinkID) {
                            dataResult.push({ rows: dataTemp, rowTotals: { docType: lastDocTypeName, subtotalDocs: subtotalDocs, subtotalSize: subtotalSize } });
                            dataTemp = [];
                            subtotalDocs = 0;
                            subtotalSize = 0;
                            lastDocType = element.DocTypeLinkID;
                            lastDocTypeName = element.docType;
                        }
                        subtotalDocs += 1;
                        subtotalSize += element.fileSize; // in kb
                        totalDocs += 1;
                        totalSize += element.fileSize; // in kb
                        dataTemp.push(element);
                    });
                    dataResult.push({ rows: dataTemp, rowTotals: { docType: lastDocTypeName, subtotalDocs: subtotalDocs, subtotalSize: subtotalSize } });
                    resolve({ success: true, data: dataResult, totals: { totalDocs: totalDocs, totalSize: totalSize } });
                } else resolve({ success: false, message: "No Data" });
            });
        });
    },
}

module.exports = MyPortalModel;