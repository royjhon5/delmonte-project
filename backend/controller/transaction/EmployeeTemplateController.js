const { select, insert, update, remove } = require("../../models/mainModel");
// const { AccountToChargeJoin } = require("../../models/rawQueryModel/rawQueryModel");

module.exports.getEmployeeTemplateHeader = async function (req, res) {
	var params = {
		fields: ["*"],
		tableName: "tbltemplates_employeehdr",
	}
	try {
		await select(params).then(function (response) {
			if (response.success) res.status(200).json(response.data);
			else res.status(200).json(response);
		});
	} catch (error) {
		res.status(400).send({ error: 'Server Error' });
		console.error(error)
	}
}

module.exports.saveEmployeeTemplateHeader = async function (req, res) {
	const data = req.body
	var params = {
		tableName: "tbltemplates_employeehdr",
		fieldValue: {
			id: data.id,
			TName: data.TName,
			location_idlink: data.location_idlink,
			department_idlink: data.department_idlink,
			group_idlink: data.group_idlink,
			shifting: data.shifting,
			location: data.location,
			department: data.department,
			emp_group: data.emp_group,
		}
	}
	try {
		var result = await data.id > 0 ? update(params) : insert(params);
		result.then(function (response) {
			res.status(200).json(response);
		})
	} catch (error) {
		res.status(400).send({ error: 'Server Error' });
		console.error(error)
	}
}

module.exports.deleteEmployeeTemplateHeader = async function (req, res) {
	const data = req.query
	var params = {
		tableName: "tbltemplates_employeehdr",
		where: ["id = ?"],
		whereValue: [data.id],
	}
	try {
		var result = remove(params);
		result.then(async function (response) {
			await remove({ tableName: "tbltemplates_employeedtl", where: ["template_employehdr_idlink = ?"], whereValue: [data.id] }); // delete details
			res.status(200).json(response);
		})
	} catch (error) {
		res.status(400).send({ error: 'Server Error' });
		console.error(error)
	}
}

// detail
module.exports.saveEmployeeTemplateDetail = async function (req, res) {
	const data = req.body
	var params = {
		tableName: "tbltemplates_employeedtl",
		fieldValue: {
			id: data.id,
			template_employehdr_idlink: data.template_employehdr_idlink,
			ChapaID: data.ChapaID,
			last_name: data.last_name,
			first_name: data.first_name,
			middle_name: data.middle_name,
			ext_name: data.ext_name,
			default_acitivity_idlink: data.default_acitivity_idlink,
			activityname: data.activityname,
			gl_code: data.gl_code,
			costcenter: data.costcenter,
		},

	}
	$template_name = "(SELECT hdr.TName FROM tbltemplates_employeehdr hdr WHERE hdr.id = tbltemplates_employeedtl.template_employehdr_idlink LIMIT 1) as template_name";
	var checkParams = {
		fields: ["*," + $template_name],
		tableName: "tbltemplates_employeedtl",
		where: ["ChapaID = ?"],
		whereValue: [data.ChapaID],
	}
	try {
		// check exists
		await select(checkParams).then(async function (response) {
			if (response.data.length > 0) return res.status(200).send({ success: false, message: "Cannot add. Employee already exists in a template: "+response.data[0].template_name+"." });
			else {
				// save if not exists
				var result = await data.id > 0 ? update(params) : insert(params);
				result.then(function (response) {
					res.status(200).json(response);
				})
			}
		});
	} catch (error) {
		res.status(400).send({ error: 'Server Error' });
		console.error(error)
	}
}

module.exports.getEmployeeTemplateDetail = async function (req, res) {
	const data = req.query
	var params = {
		fields: ["*"],
		tableName: "tbltemplates_employeedtl",
		where: ["template_employehdr_idlink = ?"],
		whereValue: [data.header_id],
	}
	try {
		await select(params).then(function (response) {
			if (response.success) res.status(200).json(response.data);
			else res.status(200).json(response);
		});
	} catch (error) {
		res.status(400).send({ error: 'Server Error' });
		console.error(error)
	}
}

module.exports.deleteEmployeeTemplateDetail = async function (req, res) {
	const data = req.query
	var params = {
		tableName: "tbltemplates_employeedtl",
		where: ["id = ?"],
		whereValue: [data.id],
	}
	try {
		var result = remove(params);
		result.then(function (response) {
			res.status(200).json(response);
		})
	} catch (error) {
		res.status(400).send({ error: 'Server Error' });
		console.error(error)
	}
}