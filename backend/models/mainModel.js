const db = require('../config/dbConnection')

const mainModel = {

    select: async function (params) {
        return new Promise((resolve, reject) => {
            if (!params) return resolve({ success: false, error: 'required data', message: 'no data supplied' });
            let query = "SELECT";
            if (!params.fields) query += " * ";
            else {
                if (!Array.isArray(params.fields) || params.fields.length == 0) query += " * ";
                else query += " " + params.fields.join(", ") + " ";
            }
            if (!params.tableName) return resolve({ success: false, error: 'required data', message: 'missing table' });
            else query += " FROM " + params.tableName + " ";
            if (params.joins && Array.isArray(params.joins)) {
                params.joins.forEach(join => {
                    if (join.type && join.table && join.condition) {
                        query += ` ${join.type.toUpperCase()} JOIN ${join.table} ON ${join.condition} `;
                    }
                });
            }
            if (params.where && !Array.isArray(params.whereValue))
                if (params.where.length == 0) return resolve({ success: false, error: 'required data', message: 'missing where value' });
            if (params.where && Array.isArray(params.where)) {
                if (params.where.length > 0 && params.whereValue.length > 0) query += " WHERE " + params.where.join(" AND ") + " ";
            }
            if (params.groupBy && Array.isArray(params.groupBy)) {
                query += " GROUP BY " + params.groupBy.join(", ") + " ";
            }
            if (params.orderBy && Array.isArray(params.orderBy)) {
                query += " ORDER BY " + params.orderBy.join(", ") + " ";
            }
            if (params.limit) {
                query += " LIMIT " + params.limit + " ";
            } else {

            }

            db.query(query, params.whereValue, (err, result) => {
                if (err) return reject(err);
                resolve({ success: true, data: result });
            });
        });
    },


    insert: async function (params) {
        // const query = `INSERT INTO tblmyportalfolder (folder_name, user_id_link) VALUES (?,?)`;
        return new Promise((resolve, reject) => {
            if (!params) return resolve({ success: false, error: 'required data', message: 'no data supplied' });
            var query = "INSERT INTO"; // start insert query
            var fields = [];
            var placeholder = [];
            var fieldValue = [];
            // table - String
            if (!params.tableName) return resolve({ success: false, error: 'required data', message: 'missing table' });
            else query += " " + params.tableName + " ";
            // field and value - Object e.g. {id: 1, name: 'test'}
            if (typeof params.fieldValue !== 'object') return resolve({ success: false, error: 'required data', message: 'missing table' });
            Object.entries(params.fieldValue).forEach(([key, value]) => {
                fields.push(key);
                placeholder.push("?");
                fieldValue.push(value);
            });
            query += " (" + fields.join() + ") VALUES (" + placeholder.join() + ") ";
            // query
            db.query(query, fieldValue, (err, result) => {
                if (err) return reject(err);
                return resolve({ success: true, message: "successfully inserted", id: result.insertId });
            });
        });
    },

    update: async function (params) { // always the first in the object is in the where clause e.g id
        // const query = `UPDATE tblsubdocuments SET subDocument_name = ? WHERE id = ?`;
        return new Promise((resolve, reject) => {
            if (!params) return resolve({ success: false, error: 'required data', message: 'no data supplied' });
            var query = "UPDATE"; // start update query
            var fields = [];
            var fieldValue = [];
            // table - String
            if (!params.tableName) return resolve({ success: false, error: 'required data', message: 'missing table' });
            else query += " " + params.tableName + " ";
            // field and value - Object e.g. {id: 1, name: 'test'}
            if (typeof params.fieldValue !== 'object') return resolve({ success: false, error: 'required data', message: 'missing table' });
            Object.entries(params.fieldValue).forEach(([key, value]) => {
                fields.push(key + " = ?");
                fieldValue.push(value);
            });
            query += " SET " + fields.join() + " WHERE " + Object.keys(params.fieldValue)[0] + " = ?";
            fieldValue.push(params.fieldValue[Object.keys(params.fieldValue)[0]]);
            // query
            db.query(query, fieldValue, (err, result) => {
                if (err) return reject(err);
                resolve({ success: true, message: "successfully saved" });
            });
        });
    },


    remove: async function (params) {
        return new Promise((resolve, reject) => {
            if (!params) return resolve({ success: false, error: 'required data', message: 'no data supplied' });
    
            let query = "DELETE FROM ";
            if (!params.tableName) return resolve({ success: false, error: 'required data', message: 'missing table' });
    
            query += params.tableName;
    
            if (Array.isArray(params.where) && Array.isArray(params.whereValue)) {
                query += " WHERE " + params.where.join(" AND ");
            } else if (Array.isArray(params.whereConditions) && Array.isArray(params.whereValues)) {
                const conditions = params.whereConditions.join(" AND ");
                const placeholders = params.whereValues.map(() => `(${conditions})`).join(" OR ");
                query += " WHERE " + placeholders;
                params.whereValue = params.whereValues.flat();
            } else {
                return resolve({ success: false, error: 'Invalid data format', message: 'Check parameters' });
            }
    
            db.query(query, params.whereValue, (err, result) => {
                if (err) return reject(err);
                return resolve({ success: true, message: "Successfully deleted" });
            });
        });
    },

}

module.exports = mainModel;