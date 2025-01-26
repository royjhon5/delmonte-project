const { select, insert, update, remove } = require("../../models/mainModel");
const { AutoInsertDetailTemplate } = require("../../models/rawQueryModel/rawQueryModel");

module.exports.getDARHeader = async function (req, res) {
	const daytype_name = "(SELECT a.dt_name FROM tbldaytype a WHERE a.id = tbldarhdr.day_type_idlink LIMIT 1) as daytype_name";
	const location_name = "(SELECT a.location_name FROM tbllocationlist a WHERE a.id = tbldarhdr.locationlink_id LIMIT 1) as location_name";
	var params = {
		fields: ["*," + daytype_name + "," + location_name],
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
			template_name: data.template_name ? data.template_name : "",
			activity: data.activity ? data.activity : "",
			department: data.department ? data.department : "",
			group_name: data.group_name ? data.group_name : "",
		}
	}
	try {
		var result = await data.id > 0 ? update(params) : insert(params);
		result.then(async function (response) {
			if (response.id) {
				// add details of template of newly inserted header
				params.fieldValue.id = response.id
				await AutoInsertDetailTemplate(params.fieldValue);
			}
			res.status(200).json(response);
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

module.exports.getDARDetail = async function (req, res) {
	const data = req.query
	var params = {
		fields: ["*"],
		tableName: "tbldardtl",
		where: ["dar_idlink = ?"],
		whereValue: [data.header_id],
		orderBy: ["emp_lname ASC", "ChapaID ASC"]
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

module.exports.deleteDARDetail = async function (req, res) {
	const data = req.query
	var params = {
		tableName: "tbldardtl",
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

module.exports.testMethod = async function (req, res) {
	try {
		await AutoInsertDetailTemplate({ id: 5, templatelink_id: 1 }).then(function (response) {
			res.status(200).json(response);
		})
	} catch (error) {
		res.status(400).send({ error: 'Server Error' });
		console.error(error)
	}
}