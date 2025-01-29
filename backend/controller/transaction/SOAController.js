const { select, insert, update, remove } = require("../../models/mainModel");
const { AddDARDetailsToSOA } = require("../../models/rawQueryModel/rawQueryModel");

module.exports.getSOAHeader = async function (req, res) {
	const daytype = "(SELECT a.dt_name FROM tbldaytype a WHERE a.id = tblsoahdr.daytype_idlink LIMIT 1) as daytype";
	const location = "(SELECT a.location_name FROM tbllocationlist a WHERE a.id = tblsoahdr.location_idlink LIMIT 1) as location";
	const department = "(SELECT a.department_name FROM tbldepartment a WHERE a.id = tblsoahdr.dept_idlink LIMIT 1) as department";
	var params = {
		fields: ["*," + daytype + "," + location + "," + department],
		tableName: "tblsoahdr",
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

module.exports.saveSOAHeader = async function (req, res) {
	let date_ob = new Date();
	// current month
	let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
	// current year
	let year = date_ob.getFullYear();

	const data = req.body.dataVariable
	var params = {
		tableName: "tblsoahdr",
		fieldValue: {
			id: data.id,
			dept_idlink: data.dept_idlink ? data.dept_idlink : "",
			location_idlink: data.location_idlink ? data.location_idlink : "",
			daytype_idlink: data.daytype_idlink ? data.daytype_idlink : "",
			soa_no: data.soa_no ? data.soa_no : "",
			xDate: data.xDate ? data.xDate : "",
			soa_status: data.soa_status ? data.soa_status : "",
			prepared_by: data.prepared_by ? data.prepared_by : "",
			preparedby_position: data.preparedby_position ? data.preparedby_position : "",
			checked_by: data.checked_by ? data.checked_by : "",
			checkedby_position: data.checkedby_position ? data.checkedby_position : "",
			confirmed_by: data.confirmed_by ? data.confirmed_by : "",
			confirmedby_position: data.confirmedby_position ? data.confirmedby_position : "",
			approved_by: data.approved_by ? data.approved_by : "",
			approvedby_position: data.approvedby_position ? data.approvedby_position : "",
			period_coverage: data.period_coverage ? data.period_coverage : "",
		}
	}
	try {
		var result = await data.id > 0 ? update(params) : insert(params);
		result.then(async function (response) {
			if (response.id) {
				var params = {
					tableName: "tblsoahdr",
					fieldValue: {
						id: response.id,
						soa_no: year + "-" + month + "-" + response.id,
					}
				}
				await update(params);
			}
			res.status(200).json(response);
		})
	} catch (error) {
		res.status(400).send({ error: 'Server Error' });
		console.error(error)
	}
}

module.exports.postSOAHeader = async function (req, res) {
	const data = req.body
	var params = {
		tableName: "tblsoahdr",
		fieldValue: {
			id: data.id,
			soa_status: "POSTED",
		}
	}
	try {
		await update(params).then(async function (response) {
			res.status(200).json(response);
		})
	} catch (error) {
		res.status(400).send({ error: 'Server Error' });
		console.error(error)
	}
}

module.exports.deleteSOAHeader = async function (req, res) {
	const data = req.query
	var params = {
		tableName: "tblsoahdr",
		where: ["id = ?"],
		whereValue: [data.id],
	}
	try {
		var result = remove(params);
		result.then(async function (response) {
			await remove({ tableName: "tblsoa_dtl", where: ["soa_hdr_idlink = ?"], whereValue: [data.id] }); // delete details
			res.status(200).json(response);
		})
	} catch (error) {
		res.status(400).send({ error: 'Server Error' });
		console.error(error)
	}
}

// detail
module.exports.addDARDetails = async function (req, res) {
	const data = req.body
	try {
		await AddDARDetailsToSOA({ id: data.id, soa_id: data.soa_id }).then(function (response) {
			res.status(200).json(response);
		})
	} catch (error) {
		res.status(400).send({ error: 'Server Error' });
		console.error(error)
	}
}

module.exports.saveSOADetail = async function (req, res) {
	const data = req.body.dataVariable
	var params = {
		tableName: "tblsoa_dtl",
		fieldValue: {
			id: data.id,
			dar_idlink: data.dar_idlink,
			ChapaID: data.ChapaID,
			emp_lname: data.emp_lname,
			emp_fname: data.emp_fname,
			emp_mname: data.emp_mname,
			emp_ext_name: data.emp_ext_name,
			time_in: data.time_in,
			time_out: data.time_out,
			st: data.st,
			ot: data.ot,
			nd: data.nd,
			ndot: data.ndot,
			gl: data.gl,
			cost_center: data.cost_center,
			activitylink_id: data.activitylink_id,
			activity: data.activity,
		},

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

module.exports.getSOADetail = async function (req, res) {
	const data = req.query
	var params = {
		fields: ["*"],
		tableName: "tblsoa_dtl",
		where: ["soa_hdr_idlink = ?"],
		whereValue: [data.header_id],
		orderBy: ["activity ASC"]
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

module.exports.getDARHeaderForSOA = async function (req, res) {
	const data = req.query
	const daytype_name = "(SELECT a.dt_name FROM tbldaytype a WHERE a.id = tbldarhdr.day_type_idlink LIMIT 1) as daytype_name";
	const location_name = "(SELECT a.location_name FROM tbllocationlist a WHERE a.id = tbldarhdr.locationlink_id LIMIT 1) as location_name";
	var params = {
		fields: ["*," + daytype_name + "," + location_name],
		tableName: "tbldarhdr",
		where: ["soa_no_link = ?", "xDate = ?", "dar_status = ?"],
		whereValue: [0, data.date, "POSTED"]
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

module.exports.deleteSOADetail = async function (req, res) {
	const data = req.query
	var params = {
		tableName: "tblsoa_dtl",
		where: ["id = ?"],
		whereValue: [data.id],
	}
	if (data.group) {
		params.groupBy(["ChapaID"]);
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