const { select, insert, update, remove } = require("../../models/mainModel");

module.exports.saveSubDocumentType = async function (req, res) {
	const data = req.body
	var params = {
		tableName: "tblsubdocuments",
		fieldValue: {
			id: data.id,
			subDocument_name: data.subDocument_name,
			DocType_IDLink: data.DocType_IDLink,
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


module.exports.getDocumentType = async function (req, res) {
    const data = req.query // ?DocType_IDLink= or use "?all=true" to display all
	var params = {
		fields: ["*"],
		tableName: "tbldocumenttype",
		// groupBy: ["id"],
		// orderBy: ["id ASC"],
		// limit: 1
	}
    if(data.all) {
		delete params.where;
		delete params.whereValue;
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

module.exports.getSubDocumentType = async function (req, res) {
    const data = req.query // ?DocType_IDLink= or use "?all=true" to display all
	var params = {
		fields: ["*"],
		tableName: "tblsubdocuments",
		where: ["DocType_IDLink = ?"],
		whereValue: [data.DocType_IDLink],
		// groupBy: ["id"],
		// orderBy: ["id ASC"],
		// limit: 1
	}
    if(data.all) {
		delete params.where;
		delete params.whereValue;
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


module.exports.deleteSubDocuments = async function (req, res) {
    const data = req.query
	var params = {
		tableName: "tblsubdocuments",
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