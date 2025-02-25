const { select, insert, update, remove } = require("../../models/mainModel");
const bcrypt = require('bcrypt');
const db = require('../../config/dbConnection')

module.exports.UserRegistration = async function (req, res) {
    const { LoginID, Username, UserLevel, FullName, Description, form_id } = req.body;
    const defaultPassword = 'Default@123';
    const saltRounds = 10;
    try {
        const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds);
        const checkUserQuery = 'SELECT * FROM tbllogin WHERE LoginID = ?';
        await db.query(checkUserQuery, [LoginID], (err, results) => {
            if (err) {
                res.status(400).json({ error: 'Server error' });
                console.error(err);
                return;
            }
            if (results.length > 0) {
                const updateUserQuery = 'UPDATE tbllogin SET Username = ?, Password = ?, UserLevel = ?, FullName = ?, Description = ? WHERE LoginID = ?';
                db.query(updateUserQuery, [Username, hashedPassword, UserLevel, FullName, Description, LoginID], (err) => {
                    if (err) {
                        res.status(400).json({ error: 'Server error' });
                        console.error(err);
                        return;
                    }
                    res.status(200).json({ message: 'User updated successfully' });
                });
            } else {
                const insertUserQuery = 'INSERT INTO tbllogin (Username, Password, UserLevel, FullName, Description) VALUES (?, ?, ?, ?, ?)';
                db.query(insertUserQuery, [Username, hashedPassword, UserLevel, FullName, Description], (err, result) => {
                    if (err) {
                        res.status(400).json({ error: 'Server error' });
                        console.error(err);
                        return;
                    }
                    const userId = result.insertId;
                    if (Array.isArray(form_id) && form_id.length > 0) {
                        const insertAccessRightsQuery = 'INSERT INTO tbl_user_access_rights (user_id, form_id) VALUES ?';
                        const values = form_id.map(fid => [userId, fid]);
                        db.query(insertAccessRightsQuery, [values], (err) => {
                            if (err) {
                                res.status(400).json({ error: 'Server error' });
                                console.error(err);
                                return;
                            }
                            res.status(200).json({ message: 'User registered successfully with access rights' });
                        });
                    } else {
                        res.status(200).json({ message: 'User registered successfully' });
                    }
                });
            }
        });

    } catch (error) {
        res.status(400).json({ error: 'Server error' });
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

module.exports.getAccessRights = async function(req, res) {
	const { user_id } = req.query;
	if (!user_id) {
	  return res.status(400).json({ error: 'Bad Request: Missing user_id' });
	}
	try {
	  const query = 'SELECT form_id FROM tbl_user_access_rights WHERE user_id = ?';
	  await db.query(query, [user_id], async(err, results) => {
		if(err) throw err;
		res.json(results)
	  })
	} catch(error) {
	  console.error(error)
	} 
  };



module.exports.getFormList = async function (req, res) {
	var params = {
		fields: ["*"],
		tableName: "tblform_list",
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
