const { select, insert, update, remove } = require("../../models/mainModel");
const { VerifyOnSave } = require("../../models/rawQueryModel/rawQueryModel");

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
	const checkParams = {
        table: "tblfield_list",
        conditions: { field_name: data.field_name }
    };
	try {
		const trimmedField = data.field_name.trim();
		if (trimmedField === '') return res.status(400).json({ error: "Empty fields not allowed!" });
		const verifyResult = await VerifyOnSave(checkParams);
        if (verifyResult.data.length > 0) {
            const existingRecord = verifyResult.data[0];
            if (existingRecord.id === data.id) {
                return res.status(200).json({ message: "No changes made." });
            }
            return res.status(400).json({ error: "Field List already exists!" });
        } 
		const result = await (data.id > 0 ? update(params) : insert(params));
        res.status(200).json(result);
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