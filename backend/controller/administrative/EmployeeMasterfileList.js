const { select, insert, update, remove } = require("../../models/mainModel");
const { getDateNow } = require("../../common/commonSettings");

module.exports.getEmployeeMasterfile = async function (req, res) {
	var params = {
		fields: ["*"],
		tableName: "tblemployeemasterfile",
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
				
				// ws.cell(1, 1, 1, 10, true).string(heading1).style(centerStyle); // row, column
				// ws.cell(2, 1, 2, 10, true).string("As of " + months[parseInt(await getDateNow('month')) - 1] + " " + await getDateNow('day') + ", " + await getDateNow('year')).style(centerStyle);

				// var row = 3;
				// row += 2; // add space
				// ws.cell(row, 1).string("Chapa ID").style(borderedStyle);
				// ws.cell(row, 2).string("Lastname").style(borderedStyle);
				// ws.cell(row, 3).string("Firstname").style(borderedStyle);
				// ws.cell(row, 4).string("Middlename").style(borderedStyle);
				// ws.cell(row, 5).string("Extname").style(borderedStyle);
				// ws.cell(row, 6).string("Fullname").style(borderedStyle);
				var row = 0;
				mappedResults.map(item => {
					row += 1; // add space
					// ws.cell(row, 1).string(item.ChapaID_Old).style(borderedStyle);
					// ws.cell(row, 2).string(item.LName).style(borderedStyle);
					// ws.cell(row, 3).string(item.FName).style(borderedStyle);
					// ws.cell(row, 4).string(item.MName).style(borderedStyle);
					// ws.cell(row, 5).string(item.ExtName).style(borderedStyle);
					// ws.cell(row, 6).string(item.FName + " " + item.LName).style(borderedStyle);
					ws.cell(row, 1).string("'"+item.EmpID);
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