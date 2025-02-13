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


module.exports.saveEmployeeMasterFile = async function (req, res) {
	const data = req.body
	var params = {
		tableName: "tblemployeemasterfile",
		fieldValue: {
			EmpID: data.EmpID,
			IsPH: data.IsPH
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
	const data = req.body
	var params = {
		fields: ["*"],
		tableName: "tblemployeemasterfile",
		where: ["EmployeeStatus = ?", "IsPH = ?"],
		whereValue: ['ACTIVE', 1],
	}
	try {
		const response = await select(params);
		if (response.success) {
			if (data.checkReport == 1) return res.status(200).json({ success: true, message: "Successfully generated report." });
			else {
                const result = response;
				const mappedResults = result.data.map(prevState => {
                    return {
                        ...prevState,
                        // CurrentDateTime: currentDateTime, if naay need e change sa result data
                    };
                });
				const filename = 'Pack House Employees';
				const heading1 = 'Pack House Employees';
				const months = ['Januray', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
				// 
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

				ws.cell(1, 1).string("Rule:");
				ws.cell(2, 1).string("1.The items with asterisk are required.");
				ws.cell(3, 1).string("2.Gender 1:Male 2:Female");
				ws.cell(4, 1).string("3.Date Format:YYYY/MM/DD");
				ws.cell(5, 1).string("4.Separate the card numbers with semicolon.");
				ws.cell(6, 1).string("5.If the card number is started with 0, add ' before 0. For example, '012345.");
				ws.cell(7, 1).string("6.Separate the organization heirarchies with /.");
				ws.cell(8, 1).string("7.Format of Room No.:Take room 1 as an example, the room No. should be 1 or 1-1-1-1(Project-Building-Unit-Room No.).");
				
				ws.cell(9, 1).string("*Person ID");
				ws.cell(9, 2).string("*Organization");
				ws.cell(9, 3).string("*Person Name");
				ws.cell(9, 4).string("*Gender");
				ws.cell(9, 5).string("Contact");
				ws.cell(9, 6).string("Email");
				ws.cell(9, 7).string("Effective Time");
				ws.cell(9, 8).string("Expiry Time");
				ws.cell(9, 9).string("Card No.");
				ws.cell(9, 10).string("Room No.");
				ws.cell(9, 11).string("Floor No.");

				var row = 9;
				mappedResults.map(item => {
					row += 1; // add space
					ws.cell(row, 1).string("'"+item.ChapaID_Old);
					ws.cell(row, 2).string("Employee");
					ws.cell(row, 3).string(item.FName + " " + item.MName + " " + item.LName + " " + item.ExtName + " - " + item.ChapaID_Old);
					ws.cell(row, 4).string("'1");
					ws.cell(row, 5).string("");
					ws.cell(row, 6).string("");
					ws.cell(row, 7).string("");
					ws.cell(row, 8).string("");
					ws.cell(row, 9).string("");
					ws.cell(row, 10).string("");
					ws.cell(row, 11).string("");
				})

				wb.write(filename + ".xlsx", res); // download the generated excel file
			}
		} else res.status(200).json(response);
	} catch (error) {
		res.status(400).send({ error: 'Server Error' });
		console.error(error)
	}
}