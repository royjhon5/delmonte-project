const { select, insert, update, remove } = require("../../models/mainModel");
const path = require('path');
const bcrypt = require('bcrypt');

module.exports.uploadProfilePicture = async function (req, res) {
	const multer = require('multer');
	const upload = multer({
		storage: multer.diskStorage({
			destination: function (req, file, cb) {
				cb(null, process.env.PROFILE_PICTURE_PATH)
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

module.exports.uploadESignature = async function (req, res) {
	const multer = require('multer');
	const upload = multer({
		storage: multer.diskStorage({
			destination: function (req, file, cb) {
				cb(null, process.env.E_SIGNATURE_PATH)
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


module.exports.UserRegistration = async function (req, res) { 
	const data = req.body;
	const saltRounds = 10;
	try {
		const hashedPassword = await bcrypt.hash('Default@123', saltRounds);
		const params = {
			tableName: "tbllogin",
			fieldValue: {
				LoginID: data.LoginID,
				Username: data.Username,
				Password: hashedPassword,
				Position: data.Position,
                Client_name: data.Client_name,
				FullName: data.FullName,
                filepath_profilepicture: path.join(process.env.PROFILE_PICTURE_PATH, data.filepath_profilepicture),
                filepath_esignature: path.join(process.env.E_SIGNATURE_PATH, data.filepath_esignature),
			}
		};
		const result = await (data.LoginID > 0 ? update(params) : insert(params));
		res.status(200).json(result);

	} catch (error) {
		res.status(400).json({ error: 'Server Error' });
		console.error(error);
	}
};














