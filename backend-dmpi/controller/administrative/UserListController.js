const { select, insert, update, remove } = require("../../models/mainModel");
const path = require('path');
const bcrypt = require('bcrypt');
const { GetForConfirmation, GetForApproval, GetSOAJoinDAR, PrintDARDetails, PrintSOADetails } = require("../../models/rawQueryModel/rawQueryModel");
const db = require('../../config/dbConnection');
const AuthModel = require('../../models/auth/authModel');
const dayjs = require('dayjs');
const pdf = require('pdf-creator-node');
const fs = require('fs');

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
	const data = req.query;
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
	if(data.soa_status == "CONFIRMED") {
		params.fieldValue.confirmed_by_id = data.user_id;
		params.fieldValue.confirmed_by = data.user_name;
		params.fieldValue.confirmedby_position = data.user_designation;
	}
	if(data.soa_status == "APPROVED") {
		params.fieldValue.approved_by_id = data.user_id;
		params.fieldValue.approved_by = data.user_name;
		params.fieldValue.approvedby_position = data.user_designation;
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

// print
module.exports.PrintDARDetails = async function (req, res) {
    const data = req.query;
    try {
        const response = await PrintDARDetails({ id: data.id });
        if (response.success) {
            const result = response.data;
            const totals = response.totals;
            const signatory = response.signatory;
            const mappedResults = result.map(reportData => {
                const currentDateTime = dayjs().format('MM/DD/YYYY HH:mm:ss');
                return {
                    ...reportData,
                    CurrentDateTime: currentDateTime
                };
            });
            const htmlPath = path.join(__dirname, '../../reports/DARDetails.html');
            if (!fs.existsSync(htmlPath)) {
                console.error('HTML template file not found');
                return res.status(500).send({ error: 'HTML template file not found' });
            }
            const html = fs.readFileSync(htmlPath, 'utf8');
            const options = {
                format: "A4",
                orientation: "portrait",
                border: "1mm",
                footer: {
                    height: "8mm",
                    contents: {
                        default: '<div style="width:100%; text-align:center;"><span style="color: #444;">Page {{page}}</span>/<span>{{pages}}</span></div>', // fallback value
                    }
                }
            };
            const document = {
                html: html,
                data: {
                    records: mappedResults,
                    totals: totals,
                    signatory: signatory,
                },
                type: 'buffer'
            };
            pdf.create(document, options)
                .then(async pdfBuffer => {
                    res.setHeader('Content-Disposition', 'inline; filename=DARReport.pdf');
                    res.setHeader('Content-Type', 'application/pdf');
                    res.send(pdfBuffer);
                })
                .catch(error => {
                    console.error('Error generating PDF', error);
                    res.status(500).send({ error: 'Error generating PDF' });
                });
        } else {
            res.status(200).json(response);
        }
    } catch (error) {
        console.error(error);
        res.status(400).send({ error: 'Server Error' });
    }
};

module.exports.PrintSOADetails = async function (req, res) {
    const data = req.query;
    try {
        const response = await PrintSOADetails({ id: data.id });
        if (response.success) {
            const result = response.data;
            const totals = response.totals;
            const signatory = response.signatory;
            const designation = response.designation;
            const mappedResults = result.map(reportData => {
                const currentDateTime = dayjs().format('MM/DD/YYYY HH:mm:ss');
                return {
                    ...reportData,
                    CurrentDateTime: currentDateTime
                };
            });
            const htmlPath = path.join(__dirname, '../../reports/SOADetails.html');
            if (!fs.existsSync(htmlPath)) {
                console.error('HTML template file not found');
                return res.status(500).send({ error: 'HTML template file not found' });
            }
            const html = fs.readFileSync(htmlPath, 'utf8');
            const options = {
                format: "A4",
                orientation: "portrait",
                border: "1mm",
                footer: {
                    height: "8mm",
                    contents: {
                        default: '<div style="width:100%; text-align:center;"><span style="color: #444;">Page {{page}}</span>/<span>{{pages}}</span></div>', // fallback value
                    }
                }
            };
            const document = {
                html: html,
                data: {
                    records: mappedResults,
                    totals: totals,
                    signatory: signatory,
                    designation: designation,
                },
                type: 'buffer'
            };
            pdf.create(document, options)
                .then(async pdfBuffer => {
                    res.setHeader('Content-Disposition', 'inline; filename=SOAReport.pdf');
                    res.setHeader('Content-Type', 'application/pdf');
                    res.send(pdfBuffer);
                })
                .catch(error => {
                    console.error('Error generating PDF', error);
                    res.status(500).send({ error: 'Error generating PDF' });
                });
        } else {
            res.status(200).json(response);
        }
    } catch (error) {
        console.error(error);
        res.status(400).send({ error: 'Server Error' });
    }
};

module.exports.displayImage = async function(req, res) {
    const data = req.query;
    
    fs.readFile(`../backend-dmpi/${data.src}`, function (err, image) {
        if (err) {
            return res.status(400).send({ error: 'Image not found.' }); 
        } else {
			res.setHeader('Content-Type', 'image/jpg');
			res.setHeader('Access-Control-Allow-Origin', '*');
			res.send(image);
		}     
    });
};