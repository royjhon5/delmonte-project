const { select, insert, update, remove } = require("../../models/mainModel");
const { EmployeeListJoin, VerifyOnSave, saveEmployeeListImport } = require("../../models/rawQueryModel/rawQueryModel");
const XLSX = require('xlsx');
const fs = require('fs');
const db = require('../../config/dbConnection')

module.exports.getEmployeeList = async function (req, res) {
	const data = req.query;
	const params = {
        all: data.all ? true : false,
        where: [],
        whereValue: [],
    };
	try {
		await EmployeeListJoin(params).then(function(response){
			if(response.success) res.status(200).json(response.data);
			else res.status(200).json(response);
		});
	} catch (error) {
		res.status(400).send({ error: 'Server Error' });
		console.error(error)
	}
}


module.exports.getEmployeeListImported = async function (req, res) {
	var params = {
		fields: ["*"],
		tableName: "tblemployeelist_import",
	}
	try {
		await select(params).then(function(response){
			if(response.success) res.status(200).json(response.data);			
			else res.status(200).json(response);
		});
	} catch (error) {
		res.status(400).send({ error: 'Server Error' });
		console.error(error)
	}
}


module.exports.saveEmployeeData = async function (req, res) {
	const data = req.body
	var params = {
		tableName: "tblemployeelist",
		fieldValue: {
			id: data.id,
			chapa_id: data.chapa_id,
			firstname: data.firstname,
			lastname: data.lastname,
			middlename: data.middlename,
			extname: data.extname,
			assigned_location_idlink: data.assigned_location_idlink,
			assigned_department_idlink: data.assigned_department_idlink,
			assigned_group_idlink: data.assigned_group_idlink,
			default_activity_idlink: data.default_activity_idlink,
			activityname: data.activityname,
			gl_code: data.gl_code,
			costcenter: data.costcenter,
		}
	}
	const checkParams = {
		table: "tblemployeelist",
		conditions: { chapa_id: data.chapa_id }
	};
	try {
		if (data.chapa_id === '') return res.status(400).json({ error: "Chapa ID required!" });
		if (data.firstname === '') return res.status(400).json({ error: "First name required!" });
		if (data.lastname === '') return res.status(400).json({ error: "Last name Required!" });
		if (data.activityname === '') return res.status(400).json({ error: "Activity Required!" });
        const verifyResult = await VerifyOnSave(checkParams);
        if (verifyResult.data.length > 0) {
            const existingRecord = verifyResult.data[0];
            if (existingRecord.id === data.id) {
                return res.status(200).json({ message: "No changes made." });
            }
            return res.status(400).json({ error: "Chapa ID already exists!" });
        } 
		var result = await data.id > 0 ? update(params) : insert(params);
		res.status(200).json(result);
	} catch (error) {
		res.status(400).send({ error: 'Server Error' });
		console.error(error)
	}
}

module.exports.deleteEmployeeData = async function (req, res) {
    const data = req.query
	var params = {
		tableName: "tblemployeelist",
		where: ["id = ?"],
		whereValue: [data.id],
	}
	try {
		var result = remove(params);
		result.then(function(response){
			res.status(200).json(response);
		})
	} catch (error) {
		res.status(400).send({ error: 'Server Error' });
		console.error(error)
	}
}


module.exports.deleteMultipleEmployees = async function (req, res) {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ success: false, message: "Invalid request, 'ids' must be an array." });
    }
    const params = {
        tableName: "tblemployeelist",
        whereConditions: ["id = ?"],
        whereValues: ids.map(id => [id]),
    };

    try {
        const result = await remove(params);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).send({ error: 'Server Error' });
        console.error(error);
    }
};


module.exports.deleteSelectedDuplicates = async function (req, res) {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ success: false, message: "Invalid request, 'ids' must be an array." });
    }
    const params = {
        tableName: "tblemployeelist_import",
        whereConditions: ["chapa_id = ?"],
        whereValues: ids.map(id => [id]),
    };

    try {
        const result = await remove(params);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).send({ error: 'Server Error' });
        console.error(error);
    }
};

module.exports.saveEmployeeListImport = async function (req, res) {
	try {
        await saveEmployeeListImport().then(function(response){
			if(response.success) res.status(200).json(response);			
			else res.status(200).json(response);
		});
	} catch (error) {
		res.status(400).send({ error: 'Server Error' });
		console.error(error)
	}
}