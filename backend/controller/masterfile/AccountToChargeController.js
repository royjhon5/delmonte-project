const { select, insert, update, remove } = require("../../models/mainModel");
const { AccountToChargeJoin, VerifyOnSave } = require("../../models/rawQueryModel/rawQueryModel");

module.exports.getAccountToCharge = async function (req, res) {
	const data = req.query;
	var params = {
		all: data.all ? true : false,
		where: [],
		whereValue: [],
		fields: ["*"],
		tableName: "tblaccount_to_charge",
	}
	if (data.header_id) {
		params.where.push('header_id = ?');
		params.whereValue.push(data.header_id);
	}
	try {
		await select(params).then(function (response) {
			if (response.success) res.status(200).json(response.data);
			else res.status(200).json(response);
		});
	} catch (error) {
		res.status(400).send({ error: 'Server Error' });
		console.error(error)
	}
}

module.exports.getAccountToChargeHdr = async function (req, res) {
	var params = {
		fields: ["*"],
		tableName: "tblaccount_to_charge_hdr",
	}
	try {
		await select(params).then(function (response) {
			if (response.success) res.status(200).json(response.data);
			else res.status(200).json(response);
		});
	} catch (error) {
		res.status(400).send({ error: 'Server Error' });
		console.error(error)
	}
}

module.exports.saveAccountToCharge = async function (req, res) {
	const data = req.body.AccountMasterData;
	var params = {
		tableName: "tblaccount_to_charge",
		fieldValue: {
			id: data.id,
			header_id: data.header_id ? data.header_id : "",
			activity: data.activity ? data.activity : "",
			gl_code: data.gl_code ? data.gl_code : "",
			costcenter: data.costcenter ? data.costcenter : "",
			r_st: data.r_st ? data.r_st : "",
			r_ot: data.r_ot ? data.r_ot : "",
			r_nd: data.r_nd ? data.r_nd : "",
			r_ndot: data.r_ndot ? data.r_ndot : "",
			rh_st: data.rh_st ? data.rh_st : "",
			rh_ot: data.rh_ot ? data.rh_ot : "",
			rh_nd: data.rh_nd ? data.rh_nd : "",
			rh_ndot: data.rh_ndot ? data.rh_ndot : "",
			sh_st: data.sh_st ? data.sh_st : "",
			sh_ot: data.sh_ot ? data.sh_ot : "",
			sh_nd: data.sh_nd ? data.sh_nd : "",
			sh_ndot: data.sh_ndot ? data.sh_ndot : "",
			rd_st: data.rd_st ? data.rd_st : "",
			rd_ot: data.rd_ot ? data.rd_ot : "",
			rd_nd: data.rd_nd ? data.rd_nd : "",
			rd_ndot: data.rd_ndot ? data.rd_ndot : "",
			rdrh_st: data.rdrh_st ? data.rdrh_st : "",
			rdrh_ot: data.rdrh_ot ? data.rdrh_ot : "",
			rdrh_nd: data.rdrh_nd ? data.rdrh_nd : "",
			rdrh_ndot: data.rdrh_ndot ? data.rdrh_ndot : "",
			rdsh_st: data.rdsh_st ? data.rdsh_st : "",
			rdsh_ot: data.rdsh_ot ? data.rdsh_ot : "",
			rdsh_nd: data.rdsh_nd ? data.rdsh_nd : "",
			rdsh_ndot: data.rdsh_ndot ? data.rdsh_ndot : "",
			labor_type: data.labor_type ? data.labor_type : ""
		}
	}
	try {
		const checkParams = {
			fields: ["*"],
			tableName: "tblaccount_to_charge",
			where: ['id <> ?', 'activity = ?', 'gl_code = ?', 'costcenter = ?'],
			whereValue: [data.id, data.activity, data.gl_code, data.costcenter],
		};
		// check exists
		select(checkParams).then(async function (response) {
			if (response.data.length > 0) res.status(200).json({ success: false, message: "Account master already exists." });
			else {
				const result = await (data.id > 0 ? update(params) : insert(params));
				res.status(200).json(result);
			}
		})
	} catch (error) {
		res.status(400).send({ error: 'Server Error' });
		console.error(error)
	}
}

module.exports.saveAccountToChargeHdr = async function (req, res) {
	const data = req.body
	var params = {
		tableName: "tblaccount_to_charge_hdr",
		fieldValue: {
			id: data.id,
			client_name: data.client_name,
			location: data.location,
			department: data.department,
		}
	}
	const checkParams = {
		table: "tblaccount_to_charge_hdr",
		conditions: {
			client_name: data.client_name,
			location: data.location,
			department: data.department
		}
	};
	try {
		const verifyResult = await VerifyOnSave(checkParams);
		if (verifyResult.data.length > 0) {
			const existingRecord = verifyResult.data[0];
			if (existingRecord.id === data.id) {
				return res.status(200).json({ message: "No changes made." });
			}
			return res.status(400).json({ error: "Account to charge header already exists!" });
		}
		const result = await (data.id > 0 ? update(params) : insert(params));
		res.status(200).json(result);
	} catch (error) {
		res.status(400).send({ error: 'Server Error' });
		console.error(error)
	}
}

module.exports.deleteAccoubtToCharge = async function (req, res) {
	const data = req.query
	var params = {
		tableName: "tblaccount_to_charge",
		where: ["id = ?"],
		whereValue: [data.id],
	}
	try {
		var result = remove(params);
		result.then(function (response) {
			res.status(200).json(response);
		})
	} catch (error) {
		res.status(400).send({ error: 'Server Error' });
		console.error(error)
	}
}

module.exports.deleteAccoubtToChargeHdr = async function (req, res) {
	const data = req.query
	var params = {
		tableName: "tblaccount_to_charge_hdr",
		where: ["id = ?"],
		whereValue: [data.id],
	}
	try {
		var result = remove(params);
		// delete details
		var params = {
			tableName: "tblaccount_to_charge",
			where: ["header_id = ?"],
			whereValue: [data.id],
		}
		remove(params);
		result.then(function (response) {
			res.status(200).json(response);
		})
	} catch (error) {
		res.status(400).send({ error: 'Server Error' });
		console.error(error)
	}
}