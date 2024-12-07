/**
 * Account maintenance page class
 */
class AccountMaintenance extends BasePage {
    // Selector configurations
    static selectors = {
        table: '#accountTable',
        modal: {
            form: '#accountForm',
            container: '#accountModal',
            label: '#accountModalLabel',
            overlay: '#accountModal .overlay',
            inputs: {
                id: '#accountId',
                account: '#account',
                reason: '#reason'
            },
            buttons: {
                add: '#addAccountBtn',
                save: '#saveAccountBtn'
            }
        },
        logs: {
            modal: '#logModal',
            label: '#logModalLabel',
            timeline: '#logTimeline',
            overlay: '#logModal .overlay'
        }
    };

    constructor() {
        super();
        this.initDataTable();
        this.loadReasonsList();
        this.initFormValidation();
        this.bindEvents();
    }

    bindEvents() {
        const { modal } = AccountMaintenance.selectors;
        
        // Add button event
        $(modal.buttons.add).on('click', () => this.showModal());
        
        // Save button event
        $(modal.buttons.save).on('click', () => this.saveAccount());
        
        // Modal events
        $(modal.container).on('hidden.bs.modal', () => {
            $(modal.form).validate().resetForm();
            $(modal.form)[0].reset();
            $('.is-invalid').removeClass('is-invalid');
        });
    }

    initDataTable() {
        this.dataTable = $(AccountMaintenance.selectors.table).DataTable({
            serverSide: true,
            processing: true,
            searching: false,
            ordering: false,
            pageLength: 10,
            lengthMenu: [10, 25, 50, 100],
            autoWidth: false,
            scrollX: true,
            dom: '<"row"<"col-sm-12"tr>>' +
                 '<"row mt-3"<"col-sm-12 col-md-5"l><"col-sm-12 col-md-7"p>>',
            ajax: {
                url: '/account-maintenance/list',
                type: 'GET',
                data: d => ({
                    draw: d.draw,
                    start: d.start,
                    length: d.length
                })
            },
            columns: [
                { 
                    data: 'accountNo',
                    className: 'text-center',
                    width: '180px'
                },
                { 
                    data: 'reasonDescription',
                    render: data => data || '-'
                },
                { 
                    data: 'lastModifiedTime',
                    className: 'text-center',
                    width: '180px',
                    render: data => data ? `<span class="badge badge-success">${data}</span>` : '-'
                },
                {
                    data: null,
                    className: 'text-center',
                    width: '120px',
                    render: data => this.renderActions(data)
                }
            ],
            columnDefs: [
                {
                    targets: [0,1, 2, 3],  // Account, LastModifiedTime, Actions 列
                    className: 'text-nowrap'
                }
            ],
            drawCallback: () => {
                $('[data-toggle="tooltip"]').tooltip();
            }
        });

        // Handle tooltip cleanup
        this.dataTable.on('page.dt length.dt', () => {
            $('[data-toggle="tooltip"]').tooltip('dispose');
        });

        // Handle window resize
        $(window).on('resize', () => {
            this.dataTable.columns.adjust().draw();
        });
    }

    renderActions(data) {
        return `
            <div class="btn-group">
                <button class="btn btn-info btn-sm" 
                        data-toggle="tooltip" 
                        title="Edit"
                        onclick="accountMaintenance.editAccount('${data.id}', '${this.escapeHtml(data.accountNo)}', '${data.reasonId}')">
                    <i class="fas fa-pencil-alt"></i>
                </button>
                <button class="btn btn-danger btn-sm" 
                        data-toggle="tooltip" 
                        title="Delete"
                        onclick="accountMaintenance.deleteAccount('${data.id}')">
                    <i class="fas fa-trash"></i>
                </button>
                <button class="btn btn-primary btn-sm" 
                        data-toggle="tooltip" 
                        title="Operation Logs"
                        onclick="accountMaintenance.showOperationLogs('${data.id}', '${this.escapeHtml(data.accountNo)}')">
                    <i class="fas fa-history"></i>
                </button>
            </div>`;
    }

    async loadReasonsList() {
        try {
            const response = await $.ajax({
                url: '/reasons-maintenance/list',
                method: 'GET'
            });

            const { modal } = AccountMaintenance.selectors;
            const $reasonSelect = $(modal.inputs.reason);
            $reasonSelect.empty().append('<option value="">Select a reason</option>');
            
            response.data.forEach(reason => {
                $reasonSelect.append(`<option value="${reason.id}">${reason.description}</option>`);
            });
        } catch (error) {
            console.error('Error loading reasons:', error);
            this.showMessage('Failed to load reasons list', 'error');
        }
    }

    initFormValidation() {
        const { modal } = AccountMaintenance.selectors;
        
        super.initFormValidation(modal.form, {
            account: {
                required: true,
                minlength: 3,
                maxlength: 100
            },
            reason: {
                required: true
            }
        }, {
            account: {
                required: "Please enter account",
                minlength: "Account must be at least 3 characters",
                maxlength: "Account cannot exceed 100 characters"
            },
            reason: {
                required: "Please select a reason"
            }
        });
    }

    showModal(id = null, account = '', reasonId = '') {
        const { modal } = AccountMaintenance.selectors;
        
        this.resetForm(modal.form);
        $(modal.label).text(id ? 'Edit Account' : 'Add Account');

        if (id) {
            $(modal.inputs.id).val(id);
            $(modal.inputs.account).val(account);
            $(modal.inputs.reason).val(reasonId);
        }
        this.hideModalLoading();
        $(modal.container).modal('show');
    }

    async editAccount(id, account, reasonId) {
        try {
            await this.loadReasonsList();
            this.showModal(id, account, reasonId);
        } catch (error) {
            console.error('Error loading reasons:', error);
            this.showMessage('Failed to load reasons list', 'error');
        }
    }

    async saveAccount() {
        const { modal } = AccountMaintenance.selectors;
        const $form = $(modal.form);
        
        if (!$form.valid()) return;

        const formData = {
            id: $(modal.inputs.id).val() || null,
            accountNo: $(modal.inputs.account).val(),
            reasonId: $(modal.inputs.reason).val()
        };

        try {
            this.showModalLoading('Saving...');

            await $.ajax({
                url: formData.id ? `/account-maintenance/${formData.id}` : '/account-maintenance',
                method: formData.id ? 'PUT' : 'POST',
                contentType: 'application/json',
                data: JSON.stringify(formData)
            });
            this.hideModalLoading();
            $(modal.container).modal('hide');
            this.dataTable.ajax.reload();
            this.showMessage('Account saved successfully', 'success');
        } catch (error) {
            console.error('Save error:', error);
            this.showMessage(error.responseJSON?.message || 'Failed to save', 'error');
        } finally {
            this.hideModalLoading();
        }
    }

    async deleteAccount(id) {
        if (!confirm('Are you sure you want to delete this account?')) return;

        try {
            this.showModalLoading('Deleting...');

            await $.ajax({
                url: `/account-maintenance/${id}`,
                method: 'DELETE'
            });

            this.dataTable.ajax.reload();
            this.showMessage('Account deleted successfully', 'success');
        } catch (error) {
            console.error('Delete error:', error);
            this.showMessage(error.responseJSON?.message || 'Failed to delete', 'error');
        } finally {
            this.hideModalLoading();
        }
    }

    async showOperationLogs(id, accountNo) {
        const { logs } = AccountMaintenance.selectors;
        
        $(logs.modal).modal('show');
        $(logs.label).text(`Operation Logs - ${accountNo}`);
        
        try {
            this.showModalLoading('Loading logs...');

            const response = await $.ajax({
                url: `/account-maintenance/${id}/logs`,
                method: 'GET'
            });

            this.renderTimeline(response);
        } catch (error) {
            console.error('Error loading logs:', error);
            this.showMessage('Failed to load operation logs', 'error');
        } finally {
            this.hideModalLoading();
        }
    }

    renderTimeline(logs) {
        const { logs: { timeline } } = AccountMaintenance.selectors;
        
        if (!logs?.length) {
            $(timeline).html('<div class="text-center p-3"><span class="badge badge-secondary">No Logs</span></div>');
            return;
        }

        const groupedLogs = this.groupLogsByDate(logs);
        const html = Object.entries(groupedLogs).map(([date, dayLogs]) => `
            <div class="time-label">
                <span class="bg-info">${date}</span>
            </div>
            ${dayLogs.map(log => `
                <div>
                    <i class="${this.getOperationIcon(log.operationType)} ${this.getOperationBgClass(log.operationType)}"></i>
                    <div class="timeline-item">
                        <span class="time">
                            <i class="fas fa-clock"></i> ${new Date(log.createdAt).toLocaleTimeString()}
                        </span>
                        <h3 class="timeline-header">
                            <span class="badge badge-${this.getOperationTypeClass(log.operationType)}">
                                ${log.operationType}
                            </span>
                            ${this.escapeHtml(log.operationDesc)}
                        </h3>
                    </div>
                </div>
            `).join('')}`
        ).join('') + '<div><i class="fas fa-clock bg-gray"></i></div>';

        $(timeline).html(html);
    }

    groupLogsByDate(logs) {
        return logs.reduce((groups, log) => {
            const date = new Date(log.createdAt).toLocaleDateString();
            (groups[date] = groups[date] || []).push(log);
            return groups;
        }, {});
    }

    getOperationTypeClass(type) {
        return {
            'CREATE': 'success',
            'UPDATE': 'info',
            'DELETE': 'danger'
        }[type] || 'secondary';
    }

    getOperationIcon(type) {
        return {
            'CREATE': 'fas fa-plus',
            'UPDATE': 'fas fa-edit',
            'DELETE': 'fas fa-trash'
        }[type] || 'fas fa-info';
    }

    getOperationBgClass(type) {
        return {
            'CREATE': 'bg-success',
            'UPDATE': 'bg-info',
            'DELETE': 'bg-danger'
        }[type] || 'bg-secondary';
    }
}

// Initialize when DOM is ready
$(document).ready(() => {
    window.accountMaintenance = new AccountMaintenance();
}); 