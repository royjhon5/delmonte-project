const { select, insert, update, remove } = require("../../models/mainModel");
const { AutoInsertDetailTemplate, AutoComputeDARTime, DARDetailTime, generateDARNo, saveDARActivityBreakdown } = require("../../models/rawQueryModel/rawQueryModel");

module.exports.getDARHeader = async function (req, res) {
	var params = {
		fields: ["*"],
		tableName: "tbldarhdr",
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

module.exports.getDARHeaderAvailable = async function (req, res) {
	const data = req.query
	const daytype_name = "daytype as daytype_name";
	const location_name = "location as location_name";
	var params = {
		fields: ["*," + daytype_name + "," + location_name],
		tableName: "tbldarhdr",
		where: ["id <> ?", "xDate = ?", "dar_status = ?"],
		whereValue: [data.header_id, data.date, "ACTIVE"]
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

module.exports.saveDARHeader = async function (req, res) {
	const data = req.body.dataVariable
	var params = {
		tableName: "tbldarhdr",
		fieldValue: {
			id: data.id,
			soa_no_link: data.soa_no_link ? data.soa_no_link : "",
			day_type_idlink: data.day_type_idlink ? data.day_type_idlink : "",
			locationlink_id: data.locationlink_id ? data.locationlink_id : "",
			xDate: data.xDate ? data.xDate : "",
			shift: data.shift ? data.shift : "",
			dar_status: data.dar_status ? data.dar_status : "",
			prepared_by: data.prepared_by ? data.prepared_by : "",
			prepared_by_pos: data.prepared_by_pos ? data.prepared_by_pos : "",
			approved_by: data.approved_by ? data.approved_by : "",
			approved_by_pos: data.approved_by_pos ? data.approved_by_pos : "",
			checked_by: data.checked_by ? data.checked_by : "",
			checked_by_pos: data.checked_by_pos ? data.checked_by_pos : "",
			confirmed_by: data.confirmed_by ? data.confirmed_by : "",
			confirmed_by_pos: data.confirmed_by_pos ? data.confirmed_by_pos : "",
			templatelink_id: data.templatelink_id ? data.templatelink_id : "",
			department: data.department ? data.department : "",
			group_name: data.group_name ? data.group_name : "",
			daytype: data.daytype ? data.daytype : "",
			location: data.location ? data.location : "",
			departmend_id: data.departmend_id ? data.departmend_id : "",
			client_id: data.client_id ? data.client_id : "",
			client_name: data.client_name ? data.client_name : "",
			shift_time_in_hour: data.shift_time_in_hour ? data.shift_time_in_hour : "",
			shift_time_in_min: data.shift_time_in_min ? data.shift_time_in_min : "",
			shift_time_out_hour: data.shift_time_out_hour ? data.shift_time_out_hour : "",
			shift_time_out_min: data.shift_time_out_min ? data.shift_time_out_min : "",
		}
	}
	try {
		var result = await data.id > 0 ? update(params) : insert(params);
		result.then(async function (response) {
			if (response.id) {
				// add details of template of newly inserted header
				params.fieldValue.id = response.id
				await AutoInsertDetailTemplate(params.fieldValue);
				// generate dar no
				await generateDARNo({ id: response.id }).then(async function (result) {
					var params = {
						tableName: "tbldarhdr",
						fieldValue: {
							id: response.id,
							dar_no: result.dar_no,
						}
					}
					await update(params);
					response.dar_no = result.dar_no
					res.status(200).json(response);
				});
			} else res.status(200).json(response);
		})
	} catch (error) {
		res.status(400).send({ error: 'Server Error' });
		console.error(error)
	}
}

module.exports.postDARHeader = async function (req, res) {
	const data = req.body
	var params = {
		tableName: "tbldarhdr",
		fieldValue: {
			id: data.id,
			dar_status: "POSTED",
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

module.exports.deleteDARHeader = async function (req, res) {
	const data = req.query
	var params = {
		tableName: "tbldarhdr",
		where: ["id = ?"],
		whereValue: [data.id],
	}
	try {
		var result = remove(params);
		result.then(async function (response) {
			await remove({ tableName: "tbldardtl", where: ["dar_idlink = ?"], whereValue: [data.id] }); // delete details
			res.status(200).json(response);
		})
	} catch (error) {
		res.status(400).send({ error: 'Server Error' });
		console.error(error)
	}
}

// detail
module.exports.saveDARDetail = async function (req, res) {
	const data = req.body.dataVariable
	var params = {
		tableName: "tbldardtl",
		fieldValue: {
			id: data.id,
			dar_idlink: data.dar_idlink,
			ChapaID: data.ChapaID,
			emp_lname: data.emp_lname,
			emp_fname: data.emp_fname,
			emp_mname: data.emp_mname,
			emp_ext_name: data.emp_ext_name,
			time_in: data.time_in ? data.time_in : "",
			time_out: data.time_out ? data.time_out : "",
			st: data.st ? data.st : 0,
			ot: data.ot ? data.ot : 0,
			nd: data.nd ? data.nd : 0,
			ndot: data.ndot ? data.ndot : 0,
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

module.exports.saveDARDetailBreakdown = async function (req, res) {
	const data = req.body.dataVariable
	var params = {
		tableName: "tbldardtl",
		fieldValue: {
			dar_idlink: data.dar_idlink,
			time_in: data.time_in ? data.time_in : "",
			time_out: data.time_out ? data.time_out : "",
			st: data.st ? data.st : 0,
			ot: data.ot ? data.ot : 0,
			nd: data.nd ? data.nd : 0,
			ndot: data.ndot ? data.ndot : 0,
			gl: data.gl ? data.gl : "",
			cost_center: data.cost_center ? data.cost_center : "",
			activitylink_id: data.activitylink_id ? data.activitylink_id : 0,
			activity: data.activity ? data.activity : "",
			is_main: data.is_main ? data.is_main : 0,
			costcenterlink_id: data.costcenterlink_id ? data.costcenterlink_id : 0,
			glcodelink_id: data.glcodelink_id ? data.glcodelink_id : 0,
		},
		empids: data.empids ? data.empids : [],
	}
	try {
		await saveDARActivityBreakdown(params).then(async function (response) {
			res.status(200).json(response);
		})
	} catch (error) {
		res.status(400).send({ error: 'Server Error' });
		console.error(error)
	}
}

module.exports.transferDARDetail = async function (req, res) {
	const data = req.body
	var params = {
		tableName: "tbldardtl",
		fieldValue: {
			ChapaID: data.chapa_id,
			dar_idlink: data.dar_header_id,
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

module.exports.autoComputeDAR = async function (req, res) {
	const data = req.body
	try {
		await AutoComputeDARTime({ id: data.id }).then(async function (response) {
			res.status(200).json(response);
		})
	} catch (error) {
		res.status(400).send({ error: 'Server Error' });
		console.error(error)
	}
}

module.exports.getDARDetail = async function (req, res) {
	const data = req.query
	var params = {
		fields: ["*"],
		tableName: "tbldardtl",
		where: ["dar_idlink = ?"],
		whereValue: [data.header_id],
		orderBy: ["emp_lname ASC", "ChapaID ASC"]
	}
	if (data.group) params.groupBy = ['ChapaID'];
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

module.exports.getDARDetailByChapa = async function (req, res) {
	const data = req.query
	var params = {
		fields: ["*"],
		tableName: "tbldardtl",
		where: ["dar_idlink = ?", "ChapaID = ?"],
		whereValue: [data.header_id, data.chapa_id],
		orderBy: ["id ASC"]
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

module.exports.getDAREmployeeTime = async function (req, res) {
	const data = req.query
	try {
		await DARDetailTime({ chapa_id: data.chapa_id, date: data.date }).then(function (response) {
			console.log(response);
			if (response.success) res.status(200).json(response.data);
			else res.status(200).json(response);
		});
	} catch (error) {
		res.status(400).send({ error: 'Server Error' });
		console.error(error)
	}
}

module.exports.deleteDARDetail = async function (req, res) {
	const data = req.query
	var params = {
		tableName: "tbldardtl",
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

module.exports.testMethod = async function (req, res) {
	try {
		await DARDetailTime({ chapa_id: "934064", date: "2025-02-03" }).then(function (response) {
			res.status(200).json(response);
		})
	} catch (error) {
		res.status(400).send({ error: 'Server Error' });
		console.error(error)
	}
}