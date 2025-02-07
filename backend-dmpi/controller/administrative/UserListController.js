const { select, insert, update, remove } = require("../../models/mainModel");
const path = require('path');
const bcrypt = require('bcrypt');
const { GetForConfirmation, GetForApproval, GetSOAJoinDAR } = require("../../models/rawQueryModel/rawQueryModel");
const db = require('../../config/dbConnection');
const AuthModel = require('../../models/auth/authModel');

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
				cb(null, data.efilename)
			}
		})
	}).single('efile');
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


module.exports.getUsers = async function (req, res) {
	var params = {
		fields: ["*"],
		tableName: "tbllogin",
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


module.exports.UserRegistration = async function (req, res) {
	const data = req.body;
	const saltRounds = 10;
	try {
		const hashedPassword = await bcrypt.hash('Default@123', saltRounds);
		let oldProfilePicturePath = null;
		let oldSignaturePath = null;
		if (data.LoginID > 0) {
			const existingUser = await query(`SELECT filepath_profilepicture FROM tbllogin WHERE LoginID = ?`, [data.LoginID]);
			if (existingUser.length > 0) {
				oldProfilePicturePath = existingUser[0].filepath_profilepicture;
				oldSignaturePath = existingUser[0].filepath_esignature;
			}
		}
		const newProfilePicturePath = path.join(process.env.PROFILE_PICTURE_PATH, data.filepath_profilepicture);
		const newSignaturePath = path.join(process.env.E_SIGNATURE_PATH, data.filepath_esignature);
		const params = {
			tableName: "tbllogin",
			fieldValue: {
				LoginID: data.LoginID,
				Username: data.Username,
				Password: hashedPassword,
				Position: data.Position,
				roles: data.roles,
				personal_key: data.personal_key,
				Client_name: data.Client_name,
				FullName: data.FullName,
				filepath_profilepicture: newProfilePicturePath,
				filepath_esignature: newSignaturePath,
			}
		};
		const result = await (data.LoginID > 0 ? update(params) : insert(params));
		if (data.LoginID > 0 && oldProfilePicturePath && oldProfilePicturePath !== newProfilePicturePath) {
			fs.unlink(oldProfilePicturePath, (err) => {
				if (err) {
					console.error("Failed to delete old profile picture:", err);
				} else {
					console.log("Old profile picture deleted successfully.");
				}
			});
		} else if (data.LoginID > 0 && oldSignaturePath && oldSignaturePath !== newSignaturePath) {
			fs.unlink(oldSignaturePath, (err) => {
				if (err) {
					console.error("Failed to delete old signature:", err);
				} else {
					console.log("Old signature deleted successfully.");
				}
			});
		}
		res.status(200).json(result);
	} catch (error) {
		res.status(400).json({ error: 'Server Error' });
		console.error(error);
	}
};

module.exports.VerifyPersonalKey = async function (req, res) {
	const { id, personalkey } = req.body;
	try {
		const verifyInfo = await AuthModel.VerifyPersonalKey(id, personalkey);
		if (!verifyInfo) {
			return res.status(400).json({ error: 'Invalid Personal key! please contact adminstrator ' });
		} else {
			res.status(200).json({ success: 'Personal Key is Valid.' });
		}
	} catch (error) {
		console.error(error.message);
		res.status(500).send('Server Error');
	}
}

module.exports.getForConfirmation = async function (req, res) {
	try {
		await GetForConfirmation().then(function (response) {
			if (response.success) res.status(200).json(response.data);
			else res.status(200).json(response);
		});
	} catch (error) {
		res.status(400).send({ error: 'Server Error' });
		console.error(error)
	}
};

module.exports.getForApproval = async function (req, res) {
	try {
		await GetForApproval().then(function (response) {
			if (response.success) res.status(200).json(response.data);
			else res.status(200).json(response);
		});
	} catch (error) {
		res.status(400).send({ error: 'Server Error' });
		console.error(error)
	}
};

module.exports.getSOAJoinDAR = async function (req, res) {
	const data = req.body;
	try {
		await GetSOAJoinDAR({ id: data.id }).then(function (response) { // need pass SOA ID
			if (response.success) res.status(200).json(response.data);
			else res.status(200).json(response);
		});
	} catch (error) {
		res.status(400).send({ error: 'Server Error' });
		console.error(error)
	}
};

module.exports.changeStatusSOA = async function (req, res) {
	const data = req.body; // dependi sa pag send sa data, pwede e remove ang dataVariable kung di mugana
	var params = {
		tableName: "tblsoahdr",
		fieldValue: {
			id: data.id,
			soa_status: data.soa_status, // changed status variable e.g. CONFIRMED, DISAPPROVED, APPROVED
			status_remarks: data.status_remarks, // add status remarks e.g. Disapproved because...
		},

	}
	try {
		var result = await data.id > 0 ? update(params) : insert(params); // pero update ra gamit ani
		result.then(function (response) {
			res.status(200).json(response);
		})
	} catch (error) {
		res.status(400).send({ error: 'Server Error' });
		console.error(error)
	}
}

module.exports.countForConfirmation = async function (req, res) {
	var params = {
		fields: ["COUNT(*) AS count"],
		tableName: "tblsoahdr",
		where: ["soa_status = ?"],
		whereValue: ['SUBMITTED'],
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


module.exports.countForApproval = async function (req, res) {
	var params = {
		fields: ["COUNT(*) AS count"],
		tableName: "tblsoahdr",
		where: ["soa_status = ?"],
		whereValue: ['CONFIRMED'],
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

