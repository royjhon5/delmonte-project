const { select, insert, update, remove } = require("../../models/mainModel");
const { VerifyOnSave } = require("../../models/rawQueryModel/rawQueryModel");

module.exports.getGroupData = async function (req, res) {
	var params = {
		fields: ["*"],
		tableName: "tblgroupline_list",
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

module.exports.saveGroupData = async function (req, res) {
    const data = req.body;

    var params = {
        tableName: "tblgroupline_list",
        fieldValue: {
            id: data.id,
            groupline_name: data.groupline_name.trim()
        }
    };
    const checkParams = {
        table: "tblgroupline_list",
        conditions: { groupline_name: data.groupline_name }
    };
    try {
        const trimmedGroupLine = data.groupline_name.trim();
		if (trimmedGroupLine === '') return res.status(400).json({ error: "Empty fields not allowed!" });
        const verifyResult = await VerifyOnSave(checkParams);
        if (verifyResult.data.length > 0) {
            const existingRecord = verifyResult.data[0];
            if (existingRecord.id === data.id) {
                return res.status(200).json({ message: "No changes made." });
            }
            return res.status(400).json({ error: "Group / line name already exists!" });
        } 
        const result = await (data.id > 0 ? update(params) : insert(params));
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
        console.error(error);
    }
};



module.exports.deleteGroupData = async function (req, res) {
    const data = req.query
	var params = {
		tableName: "tblgroupline_list",
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