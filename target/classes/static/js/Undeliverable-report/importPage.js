/**
 * Import page class
 */
class ImportPage extends BasePage {
    // Selector configurations
    static selectors = {
        form: '#generateForm',
        dateInput: '#dateInput',
        generateBtn: '#generateBtn',
        fileInput: '#fileInput',
        uploadForm: '#uploadForm',
        generateResult: '#generateResult',
        uploadResult: '#uploadResult',
        stats: {
            generate: {
                total: '#generateTotalRecords',
                time: '#generateTime'
            },
            upload: {
                total: '#uploadTotalRecords',
                time: '#uploadTime'
            }
        }
    };

    constructor() {
        super();
        this.initDatePicker();
        this.initFileUpload();
        this.bindEvents();
    }

    bindEvents() {
        // Generate report event
        $(ImportPage.selectors.generateBtn).on('click', () => this.handleGenerate());

        // File upload event
        $(ImportPage.selectors.uploadForm).on('submit', (e) => {
            e.preventDefault();
            this.handleUpload();
        });
    }

    initDatePicker() {
        const { dateInput } = ImportPage.selectors;
        const yesterday = moment().subtract(1, 'days');
        const minDate = moment().subtract(1, 'months');
        
        laydate.render({
            elem: dateInput,
            type: 'date',
            trigger: 'click',
            lang: 'en',
            value: yesterday.format('YYYY-MM-DD'),
            min: minDate.format('YYYY-MM-DD'),
            max: yesterday.format('YYYY-MM-DD'),
            theme: '#1890ff',
            btns: ['clear', 'confirm'],
            done: (value) => {
                if (!value) {
                    this.showMessage('Please select a date', 'warning');
                    return false;
                }
                return true;
            }
        });

        // Add validation to date input
        $(dateInput).on('change', () => {
            const value = $(dateInput).val();
            if (!value) {
                this.showMessage('Please select a date', 'warning');
                return false;
            }
            return true;
        });
    }

    initFileUpload() {
        $(ImportPage.selectors.fileInput).fileinput({
            theme: 'fa5',
            language: 'en',
            showUpload: false,
            showPreview: false,
            showClose: false,
            maxFileSize: 5120,
            allowedFileExtensions: ['txt'],
            msgInvalidFileExtension: 'Invalid file type "{name}". Only "{extensions}" files are supported.'
        });
    }

    async handleGenerate() {
        const date = $(ImportPage.selectors.dateInput).val();
        if (!date) {
            this.showMessage('Please select a date', 'warning');
            return;
        }

        const $button = $(ImportPage.selectors.generateBtn);

        try {
            $button.prop('disabled', true)
                .html('<i class="fas fa-spinner fa-spin mr-2"></i>Generating...');

            const response = await $.ajax({
                url: '/margin-trade-limit/generate',
                method: 'POST',
                data: { date: date }
            });

            this.updateGenerateStats(response);
            $(ImportPage.selectors.generateResult).slideDown();
            this.showMessage('Generated successfully', 'success');
        } catch (error) {
            console.error('Generate error:', error);
            this.showMessage(error.responseJSON?.message || 'Failed to generate', 'error');
        } finally {
            $button.prop('disabled', false)
                .html('<i class="fas fa-file-alt mr-1"></i>Generate Report');
        }
    }

    async handleUpload() {
        const $fileInput = $(ImportPage.selectors.fileInput);
        if (!$fileInput[0].files.length) {
            this.showMessage('Please select a file', 'warning');
            return;
        }

        const formData = new FormData();
        formData.append('file', $fileInput[0].files[0]);

        try {
            $fileInput.fileinput('disable');
            this.showModalLoading('Uploading...');

            const response = await $.ajax({
                url: '/margin-trade-limit/import',
                method: 'POST',
                data: formData,
                processData: false,
                contentType: false
            });

            this.updateUploadStats(response);
            $(ImportPage.selectors.uploadResult).slideDown();
            this.showMessage('Upload completed successfully', 'success');
        } catch (error) {
            console.error('Upload error:', error);
            this.showMessage(error.responseJSON?.message || 'Failed to upload', 'error');
        } finally {
            this.hideModalLoading();
            $fileInput.fileinput('enable').fileinput('clear');
        }
    }

    updateGenerateStats(data) {
        const { stats } = ImportPage.selectors;
        $(stats.generate.total).text(data.totalRecords || '0');
        $(stats.generate.time).text(moment().format('YYYY-MM-DD HH:mm:ss'));
    }

    updateUploadStats(data) {
        const { stats } = ImportPage.selectors;
        $(stats.upload.total).text(data.totalRecords || '0');
        $(stats.upload.time).text(moment().format('YYYY-MM-DD HH:mm:ss'));
    }
}

// Initialize when DOM is ready
$(document).ready(() => {
    window.importPage = new ImportPage();
}); 