const { select, insert, update, remove } = require("../../models/mainModel");

module.exports.getDataField = async function (req, res) {
	var params = {
		fields: ["*"],
		tableName: "tblfield_list",
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

module.exports.saveFieldData = async function (req, res) {
	const data = req.body
	var params = {
		tableName: "tblfield_list",
		fieldValue: {
			id: data.id,
			field_name: data.field_name
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

module.exports.deleteFieldData = async function (req, res) {
    const data = req.query
	var params = {
		tableName: "tblfield_list",
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