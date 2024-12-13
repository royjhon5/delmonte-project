const { select, insert, update, remove } = require("../../models/mainModel");
const { BrowseFromEcardingModel, OfficeFromEcardingModel, PayeeFromEcardingModel, PersonnelFromEcardingModel } = require("../../models/_my_portal_model/_MyPortalModel");
const { getDateNow } = require("../../common/commonSettings");
const fs = require('fs');
const path = require('path');

module.exports.uploadDocument = async function (req, res) {
	const multer = require('multer');
	const upload = multer({
		storage: multer.diskStorage({
			destination: function (req, file, cb) {
				cb(null, process.env.NAS_STORAGE)
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
				return res.status(200).json({ success: true, message: "Successfully upload file." });
			}
		})
	} catch (error) {
		res.status(500).json({ error: error })
	}
}

module.exports.PreviewScannedDocs = async function (req, res) {
	const data = req.query
	try {
		if (connectToNAS().success) return res.status(200).json({ success: false, message: "Disconnected from NAS. Please try again." })
		if (!data.scannerPath) return res.status(200).json({ success: false, message: "Required scanner path." });
		// const pathFolder = "//192.168.1.88/d/samplesaving";
		// const pathFolder = "//192.168.1.9/Home/samplesaving";
		const pathFolder = data.scannerPath;

		if (!fs.existsSync(pathFolder)) { // if not exist create new
			if (!checkFileConnection(pathFolder)) return res.status(200).send({ success: false, message: 'Scanner directory not found.' });
		}

		fs.readdir(pathFolder, async function (err, fileName) {
			if (err) {
				console.log('unable to scan directory: ' + err);
				return res.status(200).send({ success: false, message: 'Scanner directory not found.' });
			}
			if (fileName.length > 0) {
				var filePath = pathFolder + "/" + fileName[0];
				var fileSize = Math.ceil(fs.statSync(filePath).size / 1024); // size in KB
				if (path.extname(filePath) == ".pdf") {
					return res.status(200).json({ success: true, data: "data:application/" + path.extname(filePath).substring(1) + ";base64, " + escape(base64_encode(filePath)), filesize: fileSize, filename: fileName[0], filepath: filePath, mimeType: "application/" + path.extname(filePath).substring(1), base64Data: base64_encode(filePath) });
				} else if (path.extname(filePath) == ".jpg" || path.extname(filePath) == ".jpeg") {
					return res.status(200).json({ success: true, data: "data:image/" + path.extname(filePath).substring(1) + ";base64, " + escape(base64_encode(filePath)), filesize: fileSize, filename: fileName[0], filepath: filePath, mimeType: "image/" + path.extname(filePath).substring(1), base64Data: base64_encode(filePath) });
				} else {
					return res.status(200).json({ success: false, message: "Nothing to preview. Please scan using the selected scanner." });
				}
			} else {
				return res.status(200).json({ success: false, message: "Nothing to preview. Please scan using the selected scanner." });
			}
		});
	} catch (error) {
		res.status(400).send({ error: 'Server Error' });
		console.error(error)
	}
}

module.exports.ScanNewDocument = async function (req, res) {
	const data = req.query
	try {
		if (connectToNAS().success) return res.status(200).json({ success: false, message: "Disconnected from NAS. Please try again." })
		if (!data.scannerPath) res.status(200).json({ success: false, message: "Required scanner path." });
		// const pathFolder = "//192.168.1.88/d/samplesaving";
		// const pathFolder = "//192.168.1.82228/d/samplesaving2";
		const pathFolder = data.scannerPath;

		if (!fs.existsSync(pathFolder)) { // if not exist create new
			if (!checkFileConnection(pathFolder)) return res.status(200).send({ success: false, message: 'Scanner directory not found.' });
		}

		fs.readdir(pathFolder, (err, files) => {
			if (err) throw err;
			for (const file of files) {
				fs.unlink(path.join(pathFolder, file), (err) => {
					if (err) throw err;
				});
			}
		});
		return res.status(200).json({ success: true, message: "Successfully cleared folder." });
	} catch (error) {
		res.status(400).send({ error: 'Server Error' });
		console.error(error)
	}
}

module.exports.moveDocument = async function (req, res) {
	const data = req.body
	try {
		// const pathFrom = '//192.168.1.9/home/samplesaving2/sample.pdf'
		const pathFrom = data.filePath;
		const pathTo = process.env.NAS_STORAGE + "/" + path.basename(pathFrom);

		if (connectToNAS().success) return res.status(200).json({ success: false, message: connectToNAS().message });
		if (!pathFrom || !pathTo) return res.status(200).json({ success: false, message: "Required scanner path." });

		if (!fs.existsSync(pathFrom)) { // if not exist create new
			return res.status(200).send({ success: false, message: 'Source file not found. Please rescan and try again.' });
		}

		// check target directory if existing
		if (!fs.existsSync(path.dirname(pathTo))) { // if not exist create new
			if (!checkFileConnection(path.dirname(pathTo))) return res.status(200).send({ success: false, message: 'Target directory not found.' });
		}

		fs.rename(pathFrom, pathTo, function (err) {
			if (err) return res.status(200).json({ success: false, message: "Path file incorrect. Please rescan and try again." });
			return res.status(200).json({ success: true, message: "Successfully moved file." });
		})
	} catch (error) {
		res.status(400).send({ error: 'Server Error' });
		console.error(error)
	}
}

module.exports.saveArchiveHeader = async function (req, res) {
	const data = req.body
	var params = {
		tableName: "tblarchivehdr",
		fieldValue: {
			id: data.id,
			DocTypeLinkID: data.DocTypeLinkID,
			// DocReferenceID: data.DocReferenceID, // saved on insert only
			DVNo: data.DVNo,
			DVDate: data.DVDate,
			JEVNo: data.JEVNo,
			ORSNo: data.ORSNo,
			ORSDate: data.ORSDate,
			Payee: data.Payee,
			Office: data.Office,
			Particulars: data.Particulars,
			Amount: data.Amount,
			EArchiveNote: data.EArchiveNote,
			ArchivedBy: data.ArchivedBy, //
			ArchiveDateTime: await getDateNow('datetime'),
			pathfile_name: path.join(process.env.NAS_STORAGE, data.pathfile_name),
			scannerID: data.scannerID,
			SubDocName: data.SubDocName,
			SubDocIDLink: data.SubDocIDLink,
			KeyWord: data.KeyWord,
			Subject: data.Subject,
			Department: data.Department,
			xAmount: data.xAmount,
			OfficeTo: data.OfficeTo,
			DepartmentTo: data.DepartmentTo,
			PayrollPeriod: data.PayrollPeriod,
			DocNature: data.DocNature,
			fileSize: data.fileSize,
			documentDate: data.documentDate,
			personnelName: data.personnelName,
			AOMNo: data.AOMNo,
			AOMDate: data.AOMDate,
			DateReceived: data.DateReceived,
			DateSent: data.DateSent,
			LetterFor: data.LetterFor,
			LetterTo: data.LetterTo,
			category: data.category,
			NeedFollowUp: data.NeedFollowUp,
			DateFollowUp: data.DateFollowUp,
			IsClosed: data.IsClosed,
			FollowUpRemarks: data.FollowUpRemarks,
		}
	}
	try {
		if (data.id > 0) {
			await update(params).then(function (response) {
				res.status(200).json(response);
			});
		} else {
			await insert(params).then(async function (response) {
				await update({ tableName: "tblarchivehdr", fieldValue: { id: response.id, DocReferenceID: data.DocReferenceID + "" + response.id } }); // update reference id
				res.status(200).json(response);
			});
		}
	} catch (error) {
		res.status(400).send({ error: 'Server Error' });
		console.error(error)
	}
}

module.exports.addAuditLog = async function (req, res) {
	const data = req.body
	var params = {
		tableName: "tblauditlog",
		fieldValue: {
			id: data.id,
			action: data.action,
			audit_data: data.audit_data,
			interface: data.interface,
			audit_by: data.audit_by, //
			audit_datetime: await getDateNow('datetime'),
		}
	}
	try {
		await insert(params).then(async function (response) {
			res.status(200).json(response);
		});
	} catch (error) {
		res.status(400).send({ error: 'Server Error' });
		console.error(error)
	}
}

module.exports.getAuditLog = async function (req, res) {
	const data = req.query.dataVariable;
	var params = {
		fields: ["*, (SELECT l.FullName FROM tbllogin l WHERE l.LoginID = al.audit_by LIMIT 1) as audit_log_display"],
		tableName: "tblauditlog al",
		where: [],
		whereValue: [],
		orderBy: ["id DESC"],
	}
	if (data.DateFrom && data.DateTo) {
		params.where.push('al.audit_datetime BETWEEN ? AND ?');
		params.whereValue.push(data.DateFrom + " 00:00:01");
		params.whereValue.push(data.DateTo + " 23:59:59");
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

module.exports.getBrowseFromEcarding = async function (req, res) {
	const data = req.query.dataVariable;
	var params = {
		all: data.all ? true : false,
		where: [],
		whereValue: []
	}
	if (data.FilterType == 1) {
		params.where.push('thdr.DVNo LIKE ?');
		params.whereValue.push("%" + data.DVNo + "%");
	}
	else if (data.FilterType == 2) {
		params.where.push('thdr.TransDate BETWEEN ? AND ?');
		params.whereValue.push(data.DateFrom);
		params.whereValue.push(data.DateTo);
	}
	else if (data.FilterType == 3) {
		params.where.push('thdr.Payee LIKE ?');
		params.whereValue.push("%" + data.Payee + "%");
	}
	else if (data.FilterType == 4) {
		params.where.push('cdtl.check_no LIKE ?');
		params.whereValue.push("%" + data.CheckNo + "%");
	}
	try {
		await BrowseFromEcardingModel(params).then(function (response) {
			if (response.success) res.status(200).json(response.data);
			else res.status(200).json(response);
		});
	} catch (error) {
		res.status(400).send({ error: 'Server Error' });
		console.error(error)
	}
}

module.exports.getOfficeFromEcarding = async function (req, res) {
	const data = req.query.dataVariable;
	var params = {
		all: data.all ? true : false,
		where: [],
		whereValue: []
	}
	params.where.push('o.description LIKE ?');
	params.whereValue.push("%" + data.officeName + "%");
	try {
		await OfficeFromEcardingModel(params).then(function (response) {
			if (response.success) res.status(200).json(response.data);
			else res.status(200).json(response);
		});
	} catch (error) {
		res.status(400).send({ error: 'Server Error' });
		console.error(error)
	}
}

module.exports.getPayeeFromEcarding = async function (req, res) {
	const data = req.query.dataVariable;
	var params = {
		all: data.all ? true : false,
		where: [],
		whereValue: []
	}
	params.where.push('p.name LIKE ?');
	params.whereValue.push("%" + data.Payee + "%");
	try {
		await PayeeFromEcardingModel(params).then(function (response) {
			if (response.success) res.status(200).json(response.data);
			else res.status(200).json(response);
		});
	} catch (error) {
		res.status(400).send({ error: 'Server Error' });
		console.error(error)
	}
}

module.exports.getPersonnelFromEcarding = async function (req, res) {
	const data = req.query.dataVariable;
	var params = {
		all: data.all ? true : false,
		where: [],
		whereValue: []
	}
	params.where.push('CONCAT(e.FName, " ", e.MName, " ", e.LName) LIKE ?');
	params.whereValue.push("%" + data.name + "%");
	try {
		await PersonnelFromEcardingModel(params).then(function (response) {
			if (response.success) res.status(200).json(response.data);
			else res.status(200).json(response);
		});
	} catch (error) {
		res.status(400).send({ error: 'Server Error' });
		console.error(error)
	}
}

module.exports.addNotification = async function (req, res) {
	const data = req.body
	var params = {
		tableName: "tblnotifcation",
		fieldValue: {
			id: data.id,
			archive_hdr_id: data.archive_hdr_id,
			user_id: data.user_id,
			action: data.action,
			datetimecreated: await getDateNow('datetime'),
		}
	}
	try {
		await insert(params).then(async function (response) {
			res.status(200).json(response);
		});
	} catch (error) {
		res.status(400).send({ error: 'Server Error' });
		console.error(error)
	}
}

module.exports.getNotification = async function (req, res) {
	const data = req.query.dataVariable;
	var params = {
		fields: ["*, (SELECT l.FullName FROM tbllogin l WHERE l.LoginID = al.user_id LIMIT 1) as name_display"],
		tableName: "tblnotifcation al",
		where: [],
		whereValue: [],
		orderBy: ["id DESC"],
		limit: 10
	}
	if (data.DateFrom && data.DateTo) {
		params.where.push('al.datetimecreated BETWEEN ? AND ?');
		params.whereValue.push(data.DateFrom + " 00:00:01");
		params.whereValue.push(data.DateTo + " 23:59:59");
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

module.exports.readUnreadNotification = async function (req, res) {
	const data = req.body
	var params = {
		tableName: "tbllogin",
		fieldValue: {
			LoginID: data.LoginID,
			notification_unread: 0, // either 1 or 0
		}
	}
	try {
		await update(params).then(function (response) {
			res.status(200).json(response);
		});
	} catch (error) {
		res.status(400).send({ error: 'Server Error' });
		console.error(error)
	}
}

module.exports.updateNotificationUnreadLogin = async function (req, res) {
	const data = req.body
	var params = {
		tableName: "tbllogin",
		fieldValue: {
			UserLevel: "Schema Admin",
			notification_unread: data.notification_unread,
		},
	}
	try {
		await update(params).then(function (response) {
			res.status(200).json(response);
		});
	} catch (error) {
		res.status(400).send({ error: 'Server Error' });
		console.error(error)
	}
}


module.exports.getNewNotification = async function (req, res) {
	const data = req.query.dataVariable;
	var params = {
		fields: ["*"],
		tableName: "tblarchivehdr",
		where: [],
		whereValue: [],
		orderBy: ["id DESC"],
		limit: 100
	}
	params.where.push('DateFollowUp <= ?');
	params.whereValue.push(await getDateNow('date'));
	params.where.push('NeedFollowUp = ?');
	params.whereValue.push(1);
	params.where.push('IsClosed = ?');
	params.whereValue.push(0);
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

module.exports.updateNewNotification = async function (req, res) {
	const data = req.body
	var params = {
		tableName: "tblarchivehdr",
		fieldValue: {
			id: data.id,
			NeedFollowUp: data.NeedFollowUp,
			FollowUpRemarks: data.FollowUpRemarks
		}
	}
	if(data.DateFollowUp) params.fieldValue.DateFollowUp = data.DateFollowUp;
	if(data.IsClosed) params.fieldValue.IsClosed = data.IsClosed;
	try {
		await update(params).then(async function (response) {
			res.status(200).json(response);
		});
	} catch (error) {
		res.status(400).send({ error: 'Server Error' });
		console.error(error)
	}
}

// other functions
async function checkFileConnection(createPath) {
	try {
		const pathFolder = createPath;
		if (!fs.existsSync(pathFolder)) {
			try {
				fs.mkdirSync(pathFolder, { recursive: true });
			} catch (error) {
				return false;
			}
			return true;
		}
		return false;
	} catch (err) {
		// console.error(err);
		console.error("file path not found.");
		return false;
	}
}

// check NAS availability
function connectToNAS() {
	const nasPath = process.env.NAS_PATH;
	const nasIP = process.env.NAS_IP;
	const nasUsername = process.env.NAS_USER;
	const nasPassword = process.env.NAS_PASS;
	if (!fs.existsSync(nasPath)) {
		require('child_process').exec('start cmd.exe /K net use "' + "\\" + '\\' + nasIP + '" ' + nasPassword + ' /USER:' + nasUsername + '');
		return { success: true };
	} else {
		return { success: false };
	}
}

// function to encode file data to base64 encoded string
function base64_encode(file) {
	// read binary data
	var bitmap = fs.readFileSync(file, { encoding: 'base64' });
	// convert binary data to base64 encoded string
	return bitmap;
}