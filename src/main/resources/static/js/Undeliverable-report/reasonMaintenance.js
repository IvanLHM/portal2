/**
 * 原因维护页面类
 */
class ReasonMaintenance extends BasePage {
    static selectors = {
        table: '#reasonTable',
        modal: {
            form: '#reasonForm',
            container: '#reasonModal',
            title: '#reasonModalLabel',
            inputs: {
                id: '#reasonId',
                description: '#description'
            },
            buttons: {
                save: '#saveReasonBtn'
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
        this.initFormValidation();
        this.bindEvents();
    }


    bindEvents() {
        const { modal, logs } = ReasonMaintenance.selectors;
        
        // Add button event
        $('#addReasonBtn').on('click', () => this.showAddModal());
        
        // Save button event
        $(modal.buttons.save).on('click', () => this.handleSave());
        
        // Modal events
        $(modal.container).on('hidden.bs.modal', () => {
            $(modal.form).validate().resetForm();
            $(modal.form)[0].reset();
            $('.is-invalid').removeClass('is-invalid');
            this.hideModalLoading();
        });

        // Log modal events
        $(logs.modal).on('hidden.bs.modal', () => {
            $(logs.timeline).empty();
            this.hideModalLoading();
        });
    }

    initDataTable() {
        this.dataTable = $(ReasonMaintenance.selectors.table).DataTable({
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
                url: '/reasons-maintenance/list',
                type: 'GET',
                data: d => ({
                    draw: d.draw,
                    start: d.start,
                    length: d.length
                })
            },
            columns: [
                { 
                    data: 'id',
                    title: 'ID',
                    width: '80px',
                    className: 'text-center'
                },
                { 
                    data: 'description',
                    title: 'Description'
                },
                { 
                    data: 'lastModifiedTime',
                    title: 'Last Update',
                    width: '180px',
                    className: 'text-center',
                    render: data => data ? `<span class="badge badge-success">${data}</span>` : '-'
                },
                {
                    data: null,
                    title: 'Actions',
                    width: '120px',
                    className: 'text-center',
                    orderable: false,
                    render: data => this.getActionButtons(data)
                }
            ],
            columnDefs: [
                {
                    targets: [0,,1, 2, 3],  // ID, Last Update, Actions columns
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

    initFormValidation() {
        const { modal } = ReasonMaintenance.selectors;
        
        $(modal.form).validate({
            rules: {
                description: {
                    required: true,
                    maxlength: 200
                }
            },
            messages: {
                description: {
                    required: "Please enter description",
                    maxlength: "Description cannot exceed 200 characters"
                }
            },
            errorElement: 'span',
            errorPlacement: (error, element) => {
                error.addClass('invalid-feedback');
                element.closest('.form-group').append(error);
            },
            highlight: (element) => {
                $(element).addClass('is-invalid');
            },
            unhighlight: (element) => {
                $(element).removeClass('is-invalid');
            }
        });
    }

    showAddModal() {
        const { modal } = ReasonMaintenance.selectors;
        $(modal.title).text('Add Reason');
        $(modal.inputs.id).val('');
        $(modal.container).modal('show');
    }

    showEditModal(data) {
        const { modal } = ReasonMaintenance.selectors;
        $(modal.title).text('Edit Reason');
        $(modal.inputs.id).val(data.id);
        $(modal.inputs.description).val(data.description);
        $(modal.container).modal('show');
    }

    async handleSave() {

        const { modal } = ReasonMaintenance.selectors;
        const $form = $(modal.form);
        if (!$form.valid()) return;

        const formData = {
            id: $(modal.inputs.id).val() || null,
            description: $(modal.inputs.description).val()
        };

        try {
            this.showModalLoading('Saving...');
            
            await $.ajax({
                url: formData.id ? `/reasons-maintenance/${formData.id}` : '/reasons-maintenance',
                method: formData.id ? 'PUT' : 'POST',
                contentType: 'application/json',
                data: JSON.stringify(formData)
            }); 
            this.hideModalLoading();
            $(modal.container).modal('hide');
            this.dataTable.ajax.reload();
            this.showMessage('Reason saved successfully', 'success');

        } catch (error) {
            console.error('Save error:', error);
            this.showMessage(error.responseJSON?.message || 'Failed to save', 'error');
        } finally {
            this.hideModalLoading();
        }
    }

    async handleDelete(id) {
        if (!confirm('Are you sure you want to delete this reason?')) return;

        try {
            this.showModalLoading('Deleting...');

            await $.ajax({
                url: `/reasons-maintenance/${id}`,
                method: 'DELETE'
            });

            await this.dataTable.ajax.reload();
            this.showMessage('Deleted successfully', 'success');
        } catch (error) {
            console.error('Delete error:', error);
            this.showMessage(error.responseJSON?.message || 'Failed to delete', 'error');
        } finally {
            this.hideModalLoading();
        }
    }

    async showOperationLogs(id, description) {
        const { logs } = ReasonMaintenance.selectors;
        
        try {
            $(logs.label).text(`Operation Logs - ${description}`);
            $(logs.modal).modal('show');
            this.showModalLoading('Loading logs...');

            const response = await $.ajax({
                url: `/reasons-maintenance/${id}/logs`,
                method: 'GET'
            });

            const timelineHtml = response.map(log => `
                <div class="time-label">
                    <span class="bg-info">${this.formatDateTime(log.createTime)}</span>
                </div>
                <div>
                    <i class="fas fa-history bg-blue"></i>
                    <div class="timeline-item">
                        <div class="timeline-body">
                            ${log.operation} by ${log.operator}
                        </div>
                    </div>
                </div>
            `).join('');

            $(logs.timeline).html(timelineHtml);
        } catch (error) {
            console.error('Load logs error:', error);
            this.showMessage('Failed to load operation logs', 'error');
        } finally {
            this.hideModalLoading();
        }
    }

    getActionButtons(data) {
        return `
            <div class="btn-group">
                <button type="button" class="btn btn-info btn-sm" 
                        data-toggle="tooltip" 
                        title="Edit"
                        onclick="reasonMaintenance.showEditModal(${JSON.stringify(data).replace(/"/g, '&quot;')})">
                    <i class="fas fa-pencil-alt"></i>
                </button>
                <button type="button" class="btn btn-danger btn-sm" 
                        data-toggle="tooltip" 
                        title="Delete"
                        onclick="reasonMaintenance.handleDelete('${data.id}')">
                    <i class="fas fa-trash"></i>
                </button>
                <button type="button" class="btn btn-primary btn-sm"
                        data-toggle="tooltip"
                        title="Operation Logs"
                        onclick="reasonMaintenance.showOperationLogs('${data.id}', '${this.escapeHtml(data.description)}')">
                    <i class="fas fa-history"></i>
                </button>
            </div>`;
    }
}

// Initialize when DOM is ready
$(document).ready(() => {
    window.reasonMaintenance = new ReasonMaintenance();
}); 