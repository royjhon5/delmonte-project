const { select, insert, update, remove } = require("../../models/mainModel");
const { getDateNow } = require("../../common/commonSettings");

module.exports.getEmployeeMasterfile = async function (req, res) {
	var params = {
		fields: ["*"],
		tableName: "tblemployeemasterfile",
		where: ["EmployeeStatus = ?"],
		whereValue: ['ACTIVE'],
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

module.exports.getByDate = async function (req, res) {
	var params = {
		fields: ["*"],
		tableName: "tblemployeemasterfile",
		where: ["EmployeeStatus = ?"],
		whereValue: ['ACTIVE'],
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


module.exports.saveEmployeeMasterFile = async function (req, res) {
	const data = req.body
	var params = {
		tableName: "tblemployeemasterfile",
		fieldValue: {
			EmpID: data.EmpID,
			IsPH: data.IsPH,
			DateSetPHEmployee: data.DateSetPHEmployee
		}
	}
	try {
		var result = await data.EmpID > 0 ? update(params) : insert(params);
		result.then(function(response){
			res.status(200).json(response);
		})
	} catch (error) {
		res.status(400).send({ error: 'Server Error' });
		console.error(error)
	}
}

module.exports.getPackhouseEmployees = async function (req, res) {
	var params = {
		fields: ["*"],
		tableName: "tblemployeemasterfile",
		where: ["EmployeeStatus = ?", "IsPH = ?"],
		whereValue: ['ACTIVE', 1],
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

module.exports.exportPackhouseEmployee = async function (req, res) {
	const { fromDate, toDate, checkReport } = req.query;
	const data = req.body
	var params = {
		fields: ["*"],
		tableName: "tblemployeemasterfile",
		where: ["EmployeeStatus = ?", "IsPH = ?"],
		whereValue: ['ACTIVE', 1],
	}
	if (fromDate && toDate) {
        params.where.push("DateSetPHEmployee BETWEEN ? AND ?");
        params.whereValue.push(fromDate, toDate);
    }
	try {
		const response = await select(params);
		if (response.success) {
			if (checkReport == 1) {
                return res.status(200).json({ success: true, message: "Successfully generated report." });
            } else {
                const result = response;
				const mappedResults = result.data.map(prevState => {
                    return {
                        ...prevState,
                    };
                });
				const filename = 'Pack House Employees';
				var xl = require('excel4node');
				var wb = new xl.Workbook();
				var ws = wb.addWorksheet('Sheet 1');
				var style = wb.createStyle({
					font: {
						color: '#000000',
						size: 12,
					},
					numberFormat: '$#,##0.00; ($#,##0.00); -',
				});
				var centerStyle = wb.createStyle({ alignment: { horizontal: 'center' } });
				var borderedStyle = wb.createStyle({
					border: {
						left: {
							style: 'thin',
							color: '#000000'
						},
						right: {
							style: 'thin',
							color: '#000000'
						},
						top: {
							style: 'thin',
							color: '#000000'
						},
						bottom: {
							style: 'thin',
							color: '#000000'
						}
					}
				});

				ws.cell(1, 1).string("Rule");
				ws.cell(2, 1).string("At least one of family name and given name is required.");
				ws.cell(3, 1).string("Once configured, the ID cannot be edited. Confirm the ID rule before setting an ID.");
				ws.cell(4, 1).string("Do NOT change the layout and column title in this template file. The importing may fail if changed.");
				ws.cell(5, 1).string("You can add persons to an existing departments. The department names should be separated by/. For example, import persons to Department A in All Departments. Format: All Departments/Department A.");
				ws.cell(6, 1).string("Start Time of Effective Period is used for Access Control Module and Time & Attendance Module. Format: yyyy/mm/dd hh:mm:ss.");
				ws.cell(7, 1).string("End Time of Effective Period is used for Access Control Module and Time & Attendance Module. Format: yyyy/mm/dd hh:mm:ss.");
				
				ws.cell(8, 1).string("ID");
				ws.cell(8, 2).string("First Name");
				ws.cell(8, 3).string("Last Name");
				ws.cell(8, 4).string("Start Time of Effective Period");
				ws.cell(8, 5).string("End Time of Effective Period");

				var row = 8;
				mappedResults.map(item => {
					row += 1; // add space
					ws.cell(row, 1).string(item.ChapaID_Old);
					ws.cell(row, 2).string(item.FName + " " + item.MName + " " + item.LName + " " + item.ExtName);
					ws.cell(row, 3).string("");
					ws.cell(row, 4).string("");
					ws.cell(row, 5).string("");

				})

				wb.write(filename + ".xlsx", res); // download the generated excel file
			}
		} else res.status(200).json(response);
	} catch (error) {
		res.status(400).send({ error: 'Server Error' });
		console.error(error)
	}
}



module.exports.exportForEmployeeList = async function (req, res) {
    const { fromDate, toDate, checkReport } = req.query; 
    var params = {
        fields: ["*"],
        tableName: "tblemployeemasterfile",
        where: ["EmployeeStatus = ?", "IsPH = ?"],
        whereValue: ["ACTIVE", 1],
    };
    if (fromDate && toDate) {
        params.where.push("DateSetPHEmployee BETWEEN ? AND ?");
        params.whereValue.push(fromDate, toDate);
    }

    try {
        const response = await select(params);
        if (response.success) {
            if (checkReport == 1) {
                return res.status(200).json({ success: true, message: "Successfully generated report." });
            } else {
                const result = response;
                const mappedResults = result.data.map(item => ({ ...item }));

                const filename = "Pack House Employees";
                var xl = require("excel4node");
                var wb = new xl.Workbook();
                var ws = wb.addWorksheet("Sheet 1");

                ws.cell(1, 1).string("chapa_id");
                ws.cell(1, 2).string("firstname");
                ws.cell(1, 3).string("lastname");
                ws.cell(1, 4).string("middlename");
                ws.cell(1, 5).string("extname");

                mappedResults.forEach((item, index) => {
                    ws.cell(index + 2, 1).string(item.ChapaID_Old || "");
                    ws.cell(index + 2, 2).string(item.FName || "");
                    ws.cell(index + 2, 3).string(item.LName || "");
                    ws.cell(index + 2, 4).string(item.MName || "");
                    ws.cell(index + 2, 5).string(item.ExtName || "");
                });

                wb.write(filename + ".xlsx", res);
            }
        } else {
            res.status(200).json(response);
        }
    } catch (error) {
        res.status(400).send({ error: "Server Error" });
        console.error(error);
    }
};
