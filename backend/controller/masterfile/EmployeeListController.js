const { select, insert, update, remove } = require("../../models/mainModel");
const { EmployeeListJoin } = require("../../models/rawQueryModel/rawQueryModel");

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