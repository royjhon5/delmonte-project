const { select, insert, update, remove } = require("../../models/mainModel");
const { InquiryFilterSearch, DashboardPieStatistics, DashboardBarStatistics } = require("../../models/_my_portal_model/_MyPortalModel");
const fs = require('fs');
const path = require('path');

module.exports.PreviewFile = async function (req, res) {
	const data = req.query
	try {
		// if (connectToNAS().success) return res.status(200).json({ success: false, message: "Disconnected from NAS. Please try again." })
		if (!data.filePath) return res.status(200).json({ success: false, message: "Required file path." });
		// const filePath = "uploads/test.pdf";
		const filePath = data.filePath;

		fs.readFile(filePath, 'utf8', async (err, data) => { // check if file exists
			if (err) {
				console.error(err);
				return res.status(200).json({ success: false, message: "Nothing to preview. File not found." });
			} else {
				const fileSize = Math.ceil(fs.statSync(filePath).size / 1024); // size in KB
				const fileName = path.basename(filePath);
				if (path.extname(filePath) == ".pdf") {
					return res.status(200).json({ success: true, data: "data:application/" + path.extname(filePath).substring(1) + ";base64, " + escape(base64_encode(filePath)), filesize: fileSize, filename: fileName, filepath: filePath, mimeType: "application/" + path.extname(filePath).substring(1), base64Data: base64_encode(filePath) });
				} else if (path.extname(filePath) == ".jpg" || path.extname(filePath) == ".jpeg") {
					return res.status(200).json({ success: true, data: "data:image/" + path.extname(filePath).substring(1) + ";base64, " + escape(base64_encode(filePath)), filesize: fileSize, filename: fileName, filepath: filePath, mimeType: "image/" + path.extname(filePath).substring(1), base64Data: base64_encode(filePath) });
				} else {
					return res.status(200).json({ success: false, message: "Nothing to preview. File not found." });
				}
			}
		});
	} catch (error) {
		res.status(400).send({ error: 'Server Error' });
		console.error(error)
	}
}

module.exports.getInquirySearchFilter = async function (req, res) {
	const data = req.query.dataVariable;
	var params = {
		all: data.all ? true : false,
		where: [],
		whereValue: []
	}
	if(data.DocTypeLinkID) {
		params.where.push('DocTypeLinkID LIKE ?');
		params.whereValue.push("%"+data.DocTypeLinkID+"%");
	}
	if(data.SubDocIDLink) {
		params.where.push('SubDocIDLink LIKE ?');
		params.whereValue.push("%"+data.SubDocIDLink+"%");
	}
	if(data.DVNo) {
		params.where.push('DVNo LIKE ?');
		params.whereValue.push("%"+data.DVNo+"%");
	}
	if(data.DVDateFrom && data.DVDateTo) {
		params.where.push('DVDate BETWEEN ? AND ?');
		params.whereValue.push(data.DVDateFrom + " 00:00:01");
		params.whereValue.push(data.DVDateTo + " 23:59:59");
	}
	if(data.JEVNo) {
		params.where.push('JEVNo LIKE ?');
		params.whereValue.push("%"+data.JEVNo+"%");
	}
	if(data.UploadDateFrom && data.UploadDateTo) {
		params.where.push('ArchiveDateTime BETWEEN ? AND ?');
		params.whereValue.push(data.UploadDateFrom + " 00:00:01");
		params.whereValue.push(data.UploadDateTo + " 23:59:59");
	}
	if(data.Payee) {
		params.where.push('Payee LIKE ?');
		params.whereValue.push("%"+data.Payee+"%");
	}
	if(data.Particulars) {
		params.where.push('Particulars LIKE ?');
		params.whereValue.push("%"+data.Particulars+"%");
	}
	if(data.Office) {
		params.where.push('Office LIKE ?');
		params.whereValue.push("%"+data.Office+"%");
	}
	if(data.Department) {
		params.where.push('Department LIKE ?');
		params.whereValue.push("%"+data.Department+"%");
	}
	if(data.KeyWord) {
		params.where.push('KeyWord LIKE ?');
		params.whereValue.push("%"+data.KeyWord+"%");
	}
	if(data.isCOAUser && data.isCOAUser == 1){
		params.where.push('DocTypeLinkID NOT IN (?, ? , ?)');
		params.whereValue.push(2);
		params.whereValue.push(4);
		params.whereValue.push(5);
	}
	try {
		await InquiryFilterSearch(params).then(function (response) {
			if (response.success) res.status(200).json(response.data);
			else res.status(200).json(response);
		});
	} catch (error) {
		res.status(400).send({ error: 'Server Error' });
		console.error(error)
	}
}

module.exports.getDashboardPieStatistics = async function (req, res) {
	// const data = req.query;
	const data = req.query;
	var params = {
		all: data.all ? true : false,
		where: ['MONTH(thdr.ArchiveDateTime) = ?', 'YEAR(thdr.ArchiveDateTime) = ?'],
		whereValue: [data.monthParam, data.yearParam]
	}
	try {
		await DashboardPieStatistics(params).then(function (response) {
			if (response.success) res.status(200).json(response.data);
			else res.status(200).json(response);
		});
	} catch (error) {
		res.status(400).send({ error: 'Server Error' });
		console.error(error)
	}
}

module.exports.getDashboardBarStatistics = async function (req, res) {
	// const data = req.query;
	const data = req.query;
	var params = {
		all: data.all ? true : false,
		where: ['thdr.DocTypeLinkID = ?', 'YEAR(thdr.ArchiveDateTime) = ?'],
		whereValue: [data.DocTypeLinkID, data.yearParam]
	}
	try {
		await DashboardBarStatistics(params).then(function (response) {
			if (response.success) res.status(200).json(response.data);
			else res.status(200).json(response);
		});
	} catch (error) {
		res.status(400).send({ error: 'Server Error' });
		console.error(error)
	}
}

module.exports.getDashboardTotalStorage = async function (req, res) {
	var params = {
		fields: ["SUM(fileSize) as total_storage"],
		tableName: "tblarchivehdr"
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

// other functions
// check NAS availability
function connectToNAS() {
	const nasPath = process.env.NAS_PATH;
	const nasIP = process.env.NAS_IP;
	const nasUsername = process.env.USER;
	const nasPassword = process.env.PASS;
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