const { select, insert, update, remove } = require("../../models/mainModel");
const { AccountToChargeJoin, VerifyOnSave } = require("../../models/rawQueryModel/rawQueryModel");

module.exports.getAccountToCharge = async function (req, res) {
	const data = req.query;
	const params = {
        all: data.all ? true : false,
        where: [],
        whereValue: [],
    };
	try {
		await AccountToChargeJoin(params).then(function(response){
			if(response.success) res.status(200).json(response.data);
			else res.status(200).json(response);
		});
	} catch (error) {
		res.status(400).send({ error: 'Server Error' });
		console.error(error)
	}
}

module.exports.saveAccountToCharge = async function (req, res) {
	const data = req.body
	var params = {
		tableName: "tblaccount_to_charge",
		fieldValue: {
			id: data.id,
			activity_id_link: data.activity_id_link,
			glcode_id_link: data.glcode_id_link,
			costcenter_id_link: data.costcenter_id_link,
		}
	}
	const checkParams = {
        table: "tblaccount_to_charge",
        conditions: {
            activity_id_link: data.activity_id_link,
            glcode_id_link: data.glcode_id_link,
            costcenter_id_link: data.costcenter_id_link
        }
    };
	try {
		if (data.activity_id_link === '') return res.status(400).json({ error: "Activity Required!" });
		if (data.glcode_id_link === '') return res.status(400).json({ error: "GL Code Required!" });
		if (data.costcenter_id_link === '') return res.status(400).json({ error: "Cost Center Required!" });
        const verifyResult = await VerifyOnSave(checkParams);
        if (verifyResult.data.length > 0) {
            const existingRecord = verifyResult.data[0];
            if (existingRecord.id === data.id) {
                return res.status(200).json({ message: "No changes made." });
            }
            return res.status(400).json({ error: "Account master data already exists!" });
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
		result.then(function(response){
			res.status(200).json(response);
		})
	} catch (error) {
		res.status(400).send({ error: 'Server Error' });
		console.error(error)
	}
}