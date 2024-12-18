const { select, insert, update, remove } = require("../../models/mainModel");

module.exports.getEmployeeMasterfile = async function (req, res) {
	var params = {
		fields: ["*"],
		tableName: "tblemployeemasterfile",
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

module.exports.saveEmployeeMasterFile = async function (req, res) {
	const data = req.body
	var params = {
		tableName: "tblemployeemasterfile",
		fieldValue: {
			EmpID: data.EmpID,
			IsPH: data.IsPH
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