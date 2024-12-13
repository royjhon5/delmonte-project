const dayjs = require('dayjs');
const pdf = require('pdf-creator-node');
const fs = require('fs');
const path = require('path');
const { select } = require("../../models/mainModel");
const { ReportByDateRange } = require("../../models/_my_portal_model/_MyPortalModel");
const pdfParse = require('pdf-parse');

module.exports.PrintSummaryByCat = async function (req, res) {
    const data = req.query;
    const params = {
        fields: ["*"],
        tableName: "tblarchivehdr",
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
                    formattedDate: dayjs(archiveData.DVDate).format('MMMM DD, YYYY')
                };
            });
            const htmlPath = path.join(__dirname, '../../reports/SummaryByCatAndDate.html');
            if (!fs.existsSync(htmlPath)) {
                console.error('HTML template file not found');
                return res.status(500).send({ error: 'HTML template file not found' });
            }
            const html = fs.readFileSync(htmlPath, 'utf8');
            const options = {
                format: 'A4',
                orientation: 'landscape',
                border: '10mm',
            };
            const document = {
                html: html,
                data: {
                    vouchers: mappedResults
                },
                type: 'buffer'
            };
            pdf.create(document, options)
                .then(async pdfBuffer => {
                    // res.setHeader('Content-Disposition', 'inline; filename=CashVoucher.pdf');
                    // res.setHeader('Content-Type', 'application/pdf');
                    // res.send(pdfBuffer);

                    // create excel
                    // const data = await 
                    pdf(pdfBuffer).then(function (data) {
                        console.log(data);
                    })
                    const lines = data.text.split('\n');
                    // Create a workbook and a worksheet 
                    const workbook = xlsx.utils.book_new();
                    const worksheet = xlsx.utils.aoa_to_sheet(lines.map(line => [line]));
                    // Append the worksheet to the workbook 
                    xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
                    // Write the workbook to a file 
                    xlsx.writeFile(workbook, "Report.xlsx");
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

module.exports.PrintSummaryByDateRange = async function (req, res) {
    const data = req.query.dataVariable;
    const params = {
        all: data.all ? true : false,
        where: [],
        whereValue: [],
    };
    if (data.Department) {
        params.where.push('thdr.Department LIKE ?');
        params.whereValue.push("%" + data.Department + "%");
    }
    if (data.DocTypeLinkID) {
        params.where.push('thdr.DocTypeLinkID LIKE ?');
        params.whereValue.push("%" + data.DocTypeLinkID + "%");
    }
    if (data.DocType) {
        if (Array.isArray(data.DocType)) {
            var questionMark = '';
            data.DocType.forEach(element => {
                questionMark += '?,';
                params.whereValue.push(element);
            });
            params.where.push('(SELECT dt.DTName FROM tbldocumenttype dt WHERE dt.id = thdr.DocTypeLinkID LIMIT 1) IN (' + questionMark.replace(/,\s*$/, "") + ')');
        } else {
            params.where.push('(SELECT dt.DTName FROM tbldocumenttype dt WHERE dt.id = thdr.DocTypeLinkID LIMIT 1) LIKE ?');
            params.whereValue.push("%" + data.DocType + "%");
        }
    }
    if (data.DateFrom && data.DateTo) {
        params.where.push('thdr.ArchiveDateTime BETWEEN ? AND ?');
        params.whereValue.push(data.DateFrom + " 00:00:01");
        params.whereValue.push(data.DateTo + " 23:59:59");
    }
    try {
        const response = await ReportByDateRange(params);
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
                const currentDateTime = dayjs().format('MM/DD/YYYY HH:mm:ss');
                const details = {
                    Masterlist: data.Masterlist,
                    byCat: data.byCat,
                    Department: data.Department,
                    COATransmittal: data.COATransmittal,
                    CurrentDateTime: currentDateTime,
                    DateFrom: dayjs(data.DateFrom).format('MMMM DD, YYYY'),
                    DateTo: dayjs(data.DateTo).format('MMMM DD, YYYY'),
                    totals: result.totals,
                    GeneratedBy: data.GeneratedBy
                }
                const htmlPath = path.join(__dirname, '../../reports/SummaryByDateRange.html');
                if (!fs.existsSync(htmlPath)) {
                    console.error('HTML template file not found');
                    return res.status(500).send({ error: 'HTML template file not found' });
                }
                const html = fs.readFileSync(htmlPath, 'utf8');
                const options = {
                    format: 'Legal',
                    orientation: 'landscape',
                    border: '10mm',
                };
                var filename = 'File';
                var heading1 = "Report";
                if (data.Masterlist == 1) {
                    filename = 'Document Masterlist';
                    heading1 = "Master List Summary of Archived Documents";
                }
                if (data.byCat == 1) {
                    filename = 'Summary By Category';
                    heading1 = "Summary of Archived Document By Category and Period Date";
                }
                if (data.Department) {
                    filename = 'Summary By Department';
                    heading1 = "Summary of Archived Document By Department and Period Date";
                }
                if (data.COATransmittal == 1) {
                    filename = 'COA Transmittal Report';
                    heading1 = "COA Transmittal Report";
                }
                if (data.excel) { // if excel
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

                    ws.cell(1, 1, 1, 10, true).string(heading1).style(centerStyle); // row, column
                    ws.cell(2, 1, 2, 10, true).string("For the Period of " + details.DateFrom + " - " + details.DateTo).style(centerStyle);

                    var row = 3;
                    mappedResults.map(item => {
                        row += 2; // add space
                        ws.cell(row, 1, row, 10, true).string("Document Category: " + item.rowTotals.docType);
                        row += 2; // add space
                        ws.cell(row, 1).string("Reference ID").style(borderedStyle);
                        ws.cell(row, 2).string("DV No").style(borderedStyle);
                        ws.cell(row, 3).string("DV Date").style(borderedStyle);
                        ws.cell(row, 4).string("JEV No").style(borderedStyle);
                        ws.cell(row, 5).string("Payee").style(borderedStyle);
                        ws.cell(row, 6).string("Office").style(borderedStyle);
                        ws.cell(row, 7).string("Department").style(borderedStyle);
                        ws.cell(row, 8).string("Particulars").style(borderedStyle);
                        ws.cell(row, 9).string("Amount").style(borderedStyle);
                        ws.cell(row, 10).string("eRAS Notes").style(borderedStyle);
                        row += 1; // add space
                        item.rows.map(rowItem => {
                            ws.cell(row, 1).string(rowItem.DocReferenceID).style(borderedStyle);
                            ws.cell(row, 2).string(rowItem.DVNo).style(borderedStyle);
                            ws.cell(row, 3).string(rowItem.DVDate).style(borderedStyle);
                            ws.cell(row, 4).string(rowItem.JEVNo).style(borderedStyle);
                            ws.cell(row, 5).string(rowItem.Payee).style(borderedStyle);
                            ws.cell(row, 6).string(rowItem.Office).style(borderedStyle);
                            ws.cell(row, 7).string(rowItem.Department).style(borderedStyle);
                            ws.cell(row, 8).string(rowItem.Particulars).style(borderedStyle);
                            ws.cell(row, 9).string(rowItem.xAmount).style(borderedStyle);
                            ws.cell(row, 10).string(rowItem.KeyWord).style(borderedStyle);
                            row += 1; // add space
                        })
                        row += 1; // add space
                        ws.cell(row, 1, row, 10, true).string("Sub Total No of Document/s "+item.rowTotals.docType+": " + item.rowTotals.subtotalDocs);
                        row += 2; // add space
                        ws.cell(row, 1, row, 10, true).string("Sub Total Size "+item.rowTotals.docType+" in the Storage Disk: " + item.rowTotals.subtotalSize + "KB");
                    })
                    row += 2; // add space
                    ws.cell(row, 1, row, 10, true).string("Total No of Document/s:" + details.totals.totalDocs);
                    row += 2; // add space
                    ws.cell(row, 1, row, 10, true).string("Total File Size in the Storage Disk:" + details.totals.totalSize + "KB");

                    wb.write(filename + ".xlsx", res); // download the generated excel file
                } else { // if pdf
                    const document = {
                        html: html,
                        data: { records: mappedResults, details: details },
                        type: 'buffer'
                    };
                    pdf.create(document, options)
                        .then(async (pdfBuffer) => {
                            res.setHeader('Content-Disposition', 'inline; filename=' + filename + ".pdf");
                            res.setHeader('Content-Type', 'application/pdf');
                            res.send(pdfBuffer);
                        })
                        .catch(error => {
                            console.error('Error generating PDF', error);
                            res.status(500).send({ error: 'Error generating PDF' });
                        });
                }
            }
        } else {
            res.status(200).json(response);
        }
    } catch (error) {
        console.error(error);
        res.status(400).send({ error: 'Server Error' });
    }
};