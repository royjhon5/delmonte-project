const { select, insert, update, remove } = require("../../models/mainModel");

module.exports.getActivityList = async function (req, res) {
	var params = {
		fields: ["*"],
		tableName: "tblactivitylist",
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

module.exports.saveActivityData = async function (req, res) {
	const data = req.body
	var params = {
		tableName: "tblactivitylist",
		fieldValue: {
			id: data.id,
			activityname: data.activityname
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

module.exports.deleteActivityData = async function (req, res) {
    const data = req.query
	var params = {
		tableName: "tblactivitylist",
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