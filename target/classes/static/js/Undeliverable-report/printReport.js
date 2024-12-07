class PrintReport extends BasePage {
    constructor() {
        super();
        this.elements = {
            buttons: {
                generate: $('#generateBtn'),
                back: $('#backBtn'),
                print: $('#printBtn'),
                export: $('#exportBtn')
            },
            sections: {
                welcome: $('#welcome-section'),
                report: $('#report-section')
            },
            tables: {
                noSms: {
                    element: $('#noSmsTable'),
                    instance: null
                },
                unCustomer: {
                    element: $('#unCustomerTable'),
                    instance: null
                }
            }
        };
        this.bindEvents();
    }

    bindEvents() {
        const { buttons } = this.elements;
        buttons.generate.on('click', () => this.generateReport());
        buttons.back.on('click', () => this.backToWelcome());
        buttons.print.on('click', () => this.printAllTables());
        buttons.export.on('click', () => this.exportAllTables());
    }

    async generateReport() {
        try {
            const { generate } = this.elements.buttons;
            generate.prop('disabled', true)
                .html('<i class="fas fa-spinner fa-spin mr-2"></i>Generating...');

            this.initTables();
            this.toggleView(true);

        } catch (error) {
            console.error('Failed to generate report:', error);
            this.showMessage('Failed to generate report: ' + error.message, 'error');
        } finally {
            const { generate } = this.elements.buttons;
            generate.prop('disabled', false)
                .html('<i class="fas fa-file-alt mr-2"></i>Generate Report');
        }
    }

    toggleView(showReport) {
        const { welcome, report } = this.elements.sections;
        if (showReport) {
            welcome.hide();
            report.show();
        } else {
            welcome.show();
            report.hide();
        }
    }

    initTables() {
        const commonConfig = {
            serverSide: true,
            processing: true,
            searching: false,
            ordering: false,
            autoWidth: false,
            pageLength: 10,
            lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
            dom: "<'row'<'col-sm-12'tr>><'row'<'col-sm-12 col-md-5'l><'col-sm-12 col-md-7'p>>",
            language: {
                emptyTable: "No data available",
                processing: "Loading...",
                zeroRecords: "No matching records found"
            }
        };

        // Initialize No SMS Report table
        this.elements.tables.noSms.instance = this.elements.tables.noSms.element.DataTable({
            ...commonConfig,
            ajax: {
                url: '/print-report/no-sms-report',
                method: 'GET',
                data: (d) => ({
                    draw: d.draw,
                    start: d.start,
                    length: d.length
                }),
                dataFilter: function(data) {
                    let json = JSON.parse(data);
                    return JSON.stringify({
                        draw: json.draw || 1,
                        recordsTotal: json.total || 0,
                        recordsFiltered: json.total || 0,
                        data: json.list || []
                    });
                }
            },
            columns: [
                { data: 'secAccNo', title: 'Securities Account' },
                { data: 'secAccName', title: 'Account Name' }
            ]
        });

        // Initialize Undeliverable Customer Report table
        this.elements.tables.unCustomer.instance = this.elements.tables.unCustomer.element.DataTable({
            ...commonConfig,
            ajax: {
                url: '/print-report/un-customer-report',
                method: 'GET',
                data: (d) => ({
                    draw: d.draw,
                    start: d.start,
                    length: d.length
                }),
                dataFilter: function(data) {
                    let json = JSON.parse(data);
                    return JSON.stringify({
                        draw: json.draw || 1,
                        recordsTotal: json.total || 0,
                        recordsFiltered: json.total || 0,
                        data: json.list || []
                    });
                }
            },
            columns: [
                { data: 'secAccNo', title: 'Securities Account' },
                { data: 'userNo', title: 'User No' },
                { data: 'secAccName', title: 'Account Name' },
                { data: 'telNo', title: 'Phone Number' }
            ]
        });
    }

    backToWelcome() {
        Object.values(this.elements.tables).forEach(table => {
            if (table.instance) {
                table.instance.clear().destroy();
                table.instance = null;
            }
        });
        this.toggleView(false);
    }

    async printAllTables() {
        try {
            this.showMessage('Preparing data for printing...', 'info');

            // 获取完整数据
            const [noSmsResponse, unCustomerResponse] = await Promise.all([
                fetch('/print-report/no-sms-report/all'),
                fetch('/print-report/un-customer-report/all')
            ]);

            if (!noSmsResponse.ok || !unCustomerResponse.ok) {
                throw new Error('Failed to fetch print data');
            }

            const noSmsData = await noSmsResponse.json();
            const unCustomerData = await unCustomerResponse.json();

            console.log('Print data:', { noSmsData, unCustomerData });

            const printWindow = window.open('', '_blank');
            if (!printWindow) {
                throw new Error('Pop-up blocked. Please allow pop-ups for printing.');
            }

            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                    <head>
                        <title>Margin Report</title>
                        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/admin-lte@3.1.0/dist/css/adminlte.min.css">
                        ${this.getPrintStyles()}
                    </head>
                    <body>
                        <div class="container">
                            ${this.getPrintTableTemplate('Margin Customers Not in User Snap', noSmsData, ['Securities Account', 'Account Name'])}
                            ${this.getPrintTableTemplate('Undeliverable Margin Customers', unCustomerData, ['Securities Account', 'User No', 'Account Name', 'Phone Number'])}
                        </div>
                    </body>
                </html>
            `);
            printWindow.document.close();
            
            printWindow.onload = () => {
                setTimeout(() => {
                    printWindow.print();
                    this.showMessage('Print prepared successfully', 'success');
                }, 500);
            };

        } catch (error) {
            console.error('Print error:', error);
            this.showMessage('Failed to prepare print data: ' + error.message, 'error');
        }
    }

    getPrintTableTemplate(title, data, headers) {
        const rows = Array.isArray(data) ? data : (data?.list || []);
        return `
            <div class="card">
                <div class="card-header">
                    <h3>${title}</h3>
                </div>
                <div class="card-body">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                ${headers.map(header => `<th>${header}</th>`).join('')}
                            </tr>
                        </thead>
                        <tbody>
                            ${rows.map(item => `
                                <tr>
                                    ${headers.map(header => {
                                        const field = this.getFieldNameFromHeader(header);
                                        return `<td>${item[field] || ''}</td>`;
                                    }).join('')}
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    getFieldNameFromHeader(header) {
        const fieldMap = {
            'Securities Account': 'secAccNo',
            'Account Name': 'secAccName',
            'User No': 'userNo',
            'Phone Number': 'telNo'
        };
        return fieldMap[header];
    }

    getPrintStyles() {
        return `
            <style>
                @media print {
                    body { 
                        padding: 20px; 
                        font-family: 'Source Sans Pro', sans-serif;
                    }
                    .container {
                        width: 100%;
                        padding-right: 15px;
                        padding-left: 15px;
                        margin-right: auto;
                        margin-left: auto;
                    }
                    .card { 
                        margin-bottom: 2rem; 
                        break-inside: avoid;
                        border: none;
                        box-shadow: none;
                    }
                    .card-header { 
                        background-color: transparent; 
                        border-bottom: 1px solid rgba(0,0,0,.125); 
                        padding: 0.75rem 1.25rem;
                    }
                    .card-header h3 { 
                        font-size: 1.1rem; 
                        font-weight: 400; 
                        margin: 0; 
                        color: #1f2d3d;
                    }
                    .table { 
                        width: 100%; 
                        margin-bottom: 0; 
                        background-color: transparent; 
                        border-collapse: collapse;
                    }
                    .table thead th { 
                        border-bottom: 2px solid #dee2e6; 
                        background-color: #f4f6f9 !important;
                        font-weight: 500; 
                        padding: 0.75rem; 
                        text-align: left; 
                        vertical-align: bottom; 
                        border-top: 1px solid #dee2e6;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    .table tbody td { 
                        padding: 0.75rem; 
                        vertical-align: middle; 
                        border-top: 1px solid #dee2e6;
                    }
                    .table-bordered { 
                        border: 1px solid #dee2e6;
                    }
                    .table-bordered th, 
                    .table-bordered td { 
                        border: 1px solid #dee2e6 !important;
                    }
                }
            </style>
        `;
    }

    async exportAllTables() {
        try {
            this.showMessage('Preparing data for export...', 'info');
            
            const response = await fetch('/print-report/export', {
                method: 'GET',
                headers: {
                    'Accept': 'application/octet-stream'
                }
            });

            if (!response.ok) {
                throw new Error('Export failed');
            }

            const filename = response.headers.get('Content-Disposition')?.split('filename=')[1] || 'margin_report.xlsx';
            
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            this.showMessage('Export completed successfully', 'success');
        } catch (error) {
            console.error('Export error:', error);
            this.showMessage('Failed to export data', 'error');
        }
    }
}

// Initialize when DOM is ready
$(document).ready(() => {
    window.printReport = new PrintReport();
}); 