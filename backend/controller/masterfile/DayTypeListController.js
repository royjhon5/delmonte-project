const { select, insert, update, remove } = require("../../models/mainModel");
const { VerifyOnSave } = require("../../models/rawQueryModel/rawQueryModel");

module.exports.getDataDay = async function (req, res) {
	var params = {
		fields: ["*"],
		tableName: "tbldaytype",
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

module.exports.saveDataDay = async function (req, res) {
	const data = req.body
	var params = {
		tableName: "tbldaytype",
		fieldValue: {
			id: data.id,
			dt_name: data.dt_name
		}
	}
	const checkParams = {
        table: "tbldaytype",
        conditions: { dt_name: data.dt_name }
    };
	try {
		if (data.dt_name === '') return res.status(400).json({ error: "Empty fields not allowed!" });
		const verifyResult = await VerifyOnSave(checkParams);
		if (verifyResult.data.length > 0) {
            const existingRecord = verifyResult.data[0];
            if (existingRecord.id === data.id) {
                return res.status(200).json({ message: "No changes made." });
            }
            return res.status(400).json({ error: "Day Type already exists!" });
        } 
		const result = await (data.id > 0 ? update(params) : insert(params));
        res.status(200).json(result);
	} catch (error) {
		res.status(400).send({ error: 'Server Error' });
		console.error(error)
	}
}

module.exports.deleteDataDay = async function (req, res) {
    const data = req.query
	var params = {
		tableName: "tbldaytype",
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