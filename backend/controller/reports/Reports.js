const dayjs = require('dayjs');
const pdf = require('pdf-creator-node');
const fs = require('fs');
const path = require('path');
const { select } = require("../../models/mainModel");
const { PrintDARDetails } = require("../../models/rawQueryModel/rawQueryModel");

module.exports.PrintDARDetails = async function (req, res) {
    const data = req.query;
    try {
        const response = await PrintDARDetails({ id: data.id });
        if (response.success) {
            const result = response.data;
            const totals = response.totals;
            const signatory = response.signatory;
            const mappedResults = result.map(reportData => {
                const currentDateTime = dayjs().format('MM/DD/YYYY HH:mm:ss');
                return {
                    ...reportData,
                    CurrentDateTime: currentDateTime
                };
            });
            const htmlPath = path.join(__dirname, '../../reports/DARDetails.html');
            if (!fs.existsSync(htmlPath)) {
                console.error('HTML template file not found');
                return res.status(500).send({ error: 'HTML template file not found' });
            }
            const html = fs.readFileSync(htmlPath, 'utf8');
            const options = {
                format: "A4",
                orientation: "portrait",
                border: "1mm",
                footer: {
                    height: "8mm",
                    contents: {
                        default: '<div style="width:100%; text-align:center;"><span style="color: #444;">Page {{page}}</span>/<span>{{pages}}</span></div>', // fallback value
                    }
                }
            };
            const document = {
                html: html,
                data: {
                    records: mappedResults,
                    totals: totals,
                    signatory: signatory,
                },
                type: 'buffer'
            };
            pdf.create(document, options)
                .then(async pdfBuffer => {
                    res.setHeader('Content-Disposition', 'inline; filename=DARReport.pdf');
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