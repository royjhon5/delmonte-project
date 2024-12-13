const { select, insert, update, remove } = require("../../models/mainModel");

module.exports.saveScannerList = async function (req, res) {
	const data = req.body
	var params = {
		tableName: "tblscanners",
		fieldValue: {
			id: data.id,
			scannerName: data.scannerName,
			dedicatedTempPath: data.dedicatedTempPath,
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

module.exports.getScannerList = async function (req, res) {
	var params = {
		fields: ["*"],
		tableName: "tblscanners",
		// where: ["id = ?"],
		// whereValue: [1],
		// groupBy: ["id"],
		// orderBy: ["id ASC"],
		// limit: 1
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


module.exports.deleteScannerData = async function (req, res) {
    const data = req.query
	var params = {
		tableName: "tblscanners",
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