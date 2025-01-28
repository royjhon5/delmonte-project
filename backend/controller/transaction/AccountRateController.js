const { select, insert, update, remove } = require("../../models/mainModel");

module.exports.getAccountRateList = async function (req, res) {
	const activity = "(SELECT a.activityname FROM tblactivitylist a, tblaccount_to_charge b WHERE a.id = b.activity_id_link AND b.id = tblaccount_rates.activitylink_id LIMIT 1) as activity";
	const costcenter = "(SELECT a.costcenter FROM tblcostcenterlist a, tblaccount_to_charge b WHERE a.id = b.costcenter_id_link AND b.id = tblaccount_rates.activitylink_id LIMIT 1) as costcenter";
	const gl = "(SELECT a.gl_code FROM tblgl_list a, tblaccount_to_charge b WHERE a.id = b.glcode_id_link AND b.id = tblaccount_rates.activitylink_id LIMIT 1) as gl";
	var params = {
		fields: ["*," + activity + "," + costcenter + "," + gl],
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
			activitylink_id: data.activitylink_id,
			st_rate: data.st_rate,
			ot_rate: data.ot_rate,
			nd_rate: data.nd_rate,
			ndot_rate: data.ndot_rate,
		}
	}
	var checkParams = {
		tableName: "tblaccount_rates",
		where: ["activitylink_id = ?", "id <> ?"],
		whereValue: [data.activitylink_id, data.id],
	}
	try {
		// check exists
		await select(checkParams).then(async function (response) {
			if (response.data.length > 0) return res.status(200).send({ success: false, message: "Activity already exists in the rate template." });
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