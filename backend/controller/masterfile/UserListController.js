const { select, insert, update, remove } = require("../../models/mainModel");
const bcrypt = require('bcrypt');

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
				UserLevel: data.UserLevel,
				FullName: data.FullName,
				Description: data.Description,
			}
		};
		const result = await (data.LoginID > 0 ? update(params) : insert(params));
		res.status(200).json(result);

	} catch (error) {
		res.status(400).json({ error: 'Server Error' });
		console.error(error);
	}
};

module.exports.ChangePassword = async function (req, res) { 
	const data = req.body;
	const saltRounds = 10;
	try {
		const hashedPassword = await bcrypt.hash(data.Password, saltRounds);
		const params = {
			tableName: "tbllogin",
			fieldValue: {
				LoginID: data.LoginID,
				Password: hashedPassword,
			}
		};
		const result = await (data.LoginID > 0 ? update(params) : insert(params));
		res.status(200).json(result);

	} catch (error) {
		res.status(400).json({ error: 'Server Error' });
		console.error(error);
	}
};





module.exports.getUsers = async function (req, res) {
	var params = {
		fields: ["*"],
		tableName: "tbllogin",
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


module.exports.getUserByID = async function (req, res) {
	const data = req.query
	var params = {
		fields: ["LoginID, notification_unread"],
		tableName: "tbllogin",
		where: ["LoginID = ?"],
		whereValue: [data.LoginID],
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

module.exports.deleteUserData = async function (req, res) {
    const data = req.query
	var params = {
		tableName: "tbllogin",
		where: ["LoginID = ?"],
		whereValue: [data.LoginID],
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
