const { select, insert, update, remove } = require("../../models/mainModel");

module.exports.saveClientList = async function (req, res) {
	const data = req.body
	var params = {
		tableName: "tblclient",
		fieldValue: {
			id: data.id,
			client_code: data.client_code,
			client_name: data.client_name,
			client_address: data.client_address,
			client_contactno: data.client_contactno,
			client_email: data.client_email,
			client_tinno: data.client_tinno,
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

module.exports.getClientList = async function (req, res) {
	var params = {
		fields: ["*"],
		tableName: "tblclient",
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

module.exports.deleteClientData = async function (req, res) {
    const data = req.query
	var params = {
		tableName: "tblclient",
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