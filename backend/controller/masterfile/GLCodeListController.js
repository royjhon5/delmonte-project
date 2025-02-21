const { select, insert, update, remove } = require("../../models/mainModel");
const { VerifyOnSave } = require("../../models/rawQueryModel/rawQueryModel");

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
	const checkParams = {
        table: "tblgl_list",
        conditions: { gl_code: data.gl_code }
    };
	try {
		const trimmedGl = data.gl_code.trim();
		if (trimmedGl === '') return res.status(400).json({ error: "Empty fields not allowed!" });
        const verifyResult = await VerifyOnSave(checkParams);
        if (verifyResult.data.length > 0) {
            const existingRecord = verifyResult.data[0];
            if (existingRecord.id === data.id) {
                return res.status(200).json({ message: "No changes made." });
            }
            return res.status(400).json({ error: "GL Code already exists!" });
        } 
		const result = await (data.id > 0 ? update(params) : insert(params));
        res.status(200).json(result);
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