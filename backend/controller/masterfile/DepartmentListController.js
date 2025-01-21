const { select, insert, update, remove } = require("../../models/mainModel");

module.exports.saveDepartmentList = async function (req, res) {
	const data = req.body
	var params = {
		tableName: "tbldepartment",
		fieldValue: {
			id: data.id,
			department_name: data.department_name,
		}
	}
	try {
		var result = await data.id > 0 ? update(params) : insert(params);
		result.then(function(response){
			res.status(200).json(response);
		})
	} catch (error) {
		res.status(400).send({ error: 'Server Error' });
		console.error(error)
	}
}

module.exports.getDepartmentList = async function (req, res) {
	var params = {
		fields: ["*"],
		tableName: "tbldepartment",
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

module.exports.deleteDepartmentData = async function (req, res) {
    const data = req.query
	var params = {
		tableName: "tbldepartment",
		where: ["id = ?"],
		whereValue: [data.id],
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

module.exports.PrintSummaryByCat = async function (req, res) {
    const data = req.query;
    const params = {
        fields: ["*, (SELECT l.DTName FROM tbldocumenttype l WHERE l.id = hdr.DocTypeLinkID LIMIT 1) as doc_type"],
        tableName: "tblarchivehdr hdr",
        where: ["id = ?"],
        whereValue: [data.id],
    };
    try {
        const response = await select(params);
        if (response.success) {
            const result = response.data;
            const mappedResults = result.map(archiveData => {
				const currentDateTime = dayjs().format('MM/DD/YYYY HH:mm:ss');
                return {
                    ...archiveData,
					CurrentDateTime: currentDateTime,
                    formattedDate: dayjs(archiveData.DVDate).format('MMMM DD, YYYY'),
                };
            });
            const htmlPath = path.join(__dirname, '../../reports/SummaryByCatAndDate.html');
            if (!fs.existsSync(htmlPath)) {
                console.error('HTML template file not found');
                return res.status(500).send({ error: 'HTML template file not found' });
            }
            const html = fs.readFileSync(htmlPath, 'utf8');
            const options = {
                format: 'A5',
                orientation: 'landscape',
                border: '5mm',
            };
            const document = {
                html: html,
                data: { vouchers: mappedResults },
                type: 'buffer'
            };
            pdf.create(document, options)
                .then(pdfBuffer => {
                    res.setHeader('Content-Disposition', 'inline; filename=CashVoucher.pdf');
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
