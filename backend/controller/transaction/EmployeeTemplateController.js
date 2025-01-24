const { select, insert, update, remove } = require("../../models/mainModel");
// const { AccountToChargeJoin } = require("../../models/rawQueryModel/rawQueryModel");

module.exports.getEmployeeTemplateHeader = async function (req, res) {
	var params = {
		fields: ["*"],
		tableName: "tbltemplates_employeehdr",
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

module.exports.saveEmployeeTemplateHeader = async function (req, res) {
	const data = req.body
	var params = {
		tableName: "tbltemplates_employeehdr",
		fieldValue: {
			id: data.id,
			TName: data.TName,
			account_master_idlink: data.account_master_idlink,
			location_idlink: data.location_idlink,
			department_idlink: data.department_idlink,
			group_idlink: data.group_idlink,
			shifting: data.shifting,
			location: data.location,
			department: data.department,
			emp_group: data.emp_group,
			activityname: data.activityname,
			gl_code: data.gl_code,
			costcenter: data.costcenter
		}
	}
	try {
		var result = await data.id > 0 ? update(params) : insert(params);
		result.then(function(response){
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
		result.then(function(response){
			res.status(200).json(response);
		})
	} catch (error) {
		res.status(400).send({ error: 'Server Error' });
		console.error(error)
	}
}