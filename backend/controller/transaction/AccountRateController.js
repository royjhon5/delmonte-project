const { select, insert, update, remove } = require("../../models/mainModel");

module.exports.getAccountRateList = async function (req, res) {
	const daytype = "(SELECT dt_name FROM tbldaytype WHERE id = tblaccount_rates.daytype_link LIMIT 1) as daytype";
	var params = {
		fields: ["*," + daytype],
		tableName: "tblaccount_rates",
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

module.exports.saveAccountRateData = async function (req, res) {
	const data = req.body
	var params = {
		tableName: "tblaccount_rates",
		fieldValue: {
			id: data.id,
			daytype_link: data.daytype_link,
			st_rate: data.st_rate,
			ot_rate: data.ot_rate,
			nd_rate: data.nd_rate,
			ndot_rate: data.ndot_rate,
		}
	}
	var checkParams = {
		tableName: "tblaccount_rates",
		where: ["daytype_link = ?", "id <> ?"],
		whereValue: [data.daytype_link, data.id],
	}
	try {
		// check exists
		await select(checkParams).then(async function (response) {
			if (response.data.length > 0) return res.status(200).send({ success: false, message: "Day Type already exists in the rate master." });
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

module.exports.deleteAccountRateData = async function (req, res) {
    const data = req.query
	var params = {
		tableName: "tblaccount_rates",
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