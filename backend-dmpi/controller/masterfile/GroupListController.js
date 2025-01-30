const { select, insert, update, remove } = require("../../models/mainModel");

module.exports.getGroupData = async function (req, res) {
	var params = {
		fields: ["*"],
		tableName: "tblgroupline_list",
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

module.exports.saveGroupData = async function (req, res) {
	const data = req.body
	var params = {
		tableName: "tblgroupline_list",
		fieldValue: {
			id: data.id,
			groupline_name: data.groupline_name
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

module.exports.deleteGroupData = async function (req, res) {
    const data = req.query
	var params = {
		tableName: "tblgroupline_list",
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