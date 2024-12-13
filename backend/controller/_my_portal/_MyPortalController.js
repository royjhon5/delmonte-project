const { FolderSubFolderByUser } = require("../../models/_my_portal_model/_MyPortalModel");
const { select, insert, update, remove } = require("../../models/mainModel");
const fs = require('fs');
const path = require('path');
const { getDateNow } = require("../../common/commonSettings");

module.exports.getMyPortalFolderAndSubFolderListByUser = async function (req, res) {
	const data = req.query // ?user_id_link= or use "?all=true" to display all
	var params = {
		all: data.all ? true : false,
		paramValue: [data.user_id_link]
	}
	try {
		await FolderSubFolderByUser(params).then(function (response) {
			if (response.success) res.status(200).json(response.data);
			else res.status(200).json(response);
		});
	} catch (error) {
		res.status(400).send({ error: 'Server Error' });
		console.error(error)
	}
}

module.exports.getMyPortalFolderList = async function (req, res) {
	const data = req.query
	var params = {
		fields: ["*"],
		tableName: "tblmyportalfolder",
		where: ["user_id_link = ?"],
		whereValue: [data.user_id_link],
		// where: ["id = ?"],
		// whereValue: [1],
		// groupBy: ["id"],
		// orderBy: ["id ASC"],
		// limit: 1
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

module.exports.saveMyPortalFolderList = async function (req, res) {
	const data = req.body
	var params = {
		tableName: "tblmyportalfolder",
		fieldValue: {
			id: data.id,
			folder_name: data.folder_name,
			user_id_link: data.user_id_link,
		}
	}
	try {
		var result = await data.id > 0 ? update(params) : insert(params);
		result.then(function (response) {
			res.status(200).json(response);
		})
	} catch (error) {
		res.status(400).send({ error: 'Server Error' });
		console.error(error)
	}
}

module.exports.getMyPortalSubFolderList = async function (req, res) {
	const data = req.query // use "?all=true" to display all
	var params = {
		fields: ["*"],
		tableName: "tblmyportalsubfolder",
		where: ["id_link = ?"],
		whereValue: [data.id_link],
		// groupBy: ["id"],
		// orderBy: ["id ASC"],
		// limit: 1
	}
	if (data.all) {
		delete params.where;
		delete params.whereValue;
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

module.exports.saveMyPortalSubFolderList = async function (req, res) {
	const data = req.body
	var params = {
		tableName: "tblmyportalsubfolder",
		fieldValue: {
			id: data.id,
			id_link: data.id_link,
			sub_folder_name: data.sub_folder_name,
		}
	}
	try {
		var result = await data.id > 0 ? update(params) : insert(params);
		result.then(function (response) {
			res.status(200).json(response);
		})
	} catch (error) {
		res.status(400).send({ error: 'Server Error' });
		console.error(error)
	}
}

module.exports.saveMyPortalFiles = async function (req, res) {
	const data = req.body
	var params = {
		tableName: "tblmyportalfiles",
		fieldValue: {
			id: data.id,
			sub_id_link: data.sub_id_link,
			file_path: path.join(process.env.NAS_STORAGE_MYPORTAL, data.file_path),
			filesize: data.filesize,
			file_name: data.file_name,
		}
	}
	try {
		var result = await data.id > 0 ? update(params) : insert(params);
		result.then(function (response) {
			res.status(200).json(response);
		})
	} catch (error) {
		res.status(400).send({ error: 'Server Error' });
		console.error(error)
	}
}

module.exports.uploadMyPortalFiles = async function (req, res) {
	const multer = require('multer');
	const upload = multer({
		storage: multer.diskStorage({
			destination: function (req, file, cb) {
				cb(null, process.env.NAS_STORAGE_MYPORTAL)
			},
			filename: function (req, file, cb) {
				const data = req.body;
				cb(null, data.filename)
			}
		})
	}).single('file');
	try {
		await upload(req, res, function (err) {
			if (err instanceof multer.MulterError) {
				// A Multer error occurred when uploading.
				return res.status(200).json({ success: false, message: "Uploading failed. Please contact administrator." });
			} else if (err) {
				// An unknown error occurred when uploading.
				return res.status(200).json({ success: false, message: "File path not found. Check connection to NAS." });
			} else {
				// Everything went fine and save document in DB here.
				return res.status(200).json({ success: true, message: "Successfully uploaded file." });
			}
		})
	} catch (error) {
		res.status(500).json({ error: error })
	}
}


module.exports.getMyProtalFiles = async function (req, res) {
	const data = req.query
	var params = {
		fields: ["*"],
		tableName: "tblmyportalfiles",
		where: ["sub_id_link = ?"],
		whereValue: [data.sub_id_link],
	}
	if (data.all) {
		delete params.where;
		delete params.whereValue;
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


module.exports.deleteMainFolderData = async function (req, res) {
	try {
		await upload(req, res, function (err) {
			if (err instanceof multer.MulterError) {
				// A Multer error occurred when uploading.
				return res.status(200).json({ success: false, message: "Uploading failed. Please contact administrator." });
			} else if (err) {
				// An unknown error occurred when uploading.
				return res.status(200).json({ success: false, message: "File path not found. Check connection to NAS." });
			} else {
				// Everything went fine and save document in DB here.
				return res.status(200).json({ success: true, message: "Successfully upload file." });
			}
		})
	} catch (error) {
		res.status(500).json({ error: error })
	}
	// 
	const data = req.query
	var params = {
		tableName: "tblmyportalfolder",
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