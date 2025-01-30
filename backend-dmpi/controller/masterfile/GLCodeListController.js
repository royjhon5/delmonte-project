const { select, insert, update, remove } = require("../../models/mainModel");

module.exports.getGlCodeList = async function (req, res) {
	var params = {
		fields: ["*"],
		tableName: "tblgl_list",
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

module.exports.saveGlCodeData = async function (req, res) {
	const data = req.body
	var params = {
		tableName: "tblgl_list",
		fieldValue: {
			id: data.id,
			gl_code: data.gl_code
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

module.exports.deleteGlCodeData = async function (req, res) {
    const data = req.query
	var params = {
		tableName: "tblgl_list",
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