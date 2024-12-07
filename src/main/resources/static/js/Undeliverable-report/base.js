/**
 * Base page class
 */
class BasePage {
    constructor() {
        if (this.constructor === BasePage) {
            throw new Error('BasePage is an abstract class and cannot be instantiated directly');
        }
    }

    /**
     * Initialize form validation
     * @param {string} formSelector - Form selector or jQuery object
     * @param {Object} rules - Validation rules
     * @param {Object} messages - Error messages
     */
    initFormValidation(formSelector, rules, messages) {
        $(formSelector).validate({
            rules: rules,
            messages: messages,
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

    /**
     * Initialize modal
     * @param {Object} options - Configuration options
     */
    initModal(options) {
        const { modalElement, onShow, onShown, onHide, onHidden } = options;
        const $modal = $(modalElement);

        if (onShow) $modal.on('show.bs.modal', onShow);
        if (onShown) $modal.on('shown.bs.modal', onShown);
        if (onHide) $modal.on('hide.bs.modal', onHide);
        if (onHidden) $modal.on('hidden.bs.modal', onHidden);
    }

    /**
     * Show loading modal
     * @param {string} message - Loading message text
     */
    showModalLoading(message = 'Loading...') {
        $('.modal.show .overlay').show();
        $('.modal.show .loading-message').text(message);
    }

    /**
     * Hide loading modal
     */
    hideModalLoading() {
        $('.modal.show .overlay').hide();
    }

    /**
     * Reset form
     * @param {string} formSelector - Form selector or jQuery object
     */
    resetForm(formSelector) {
        const $form = $(formSelector);
        $form[0].reset();
        $form.find('.is-invalid').removeClass('is-invalid');
        $form.find('.invalid-feedback').remove();
    }

    /**
     * Show message notification
     * @param {string} message - Message content
     * @param {string} type - Message type (success/error/warning/info)
     */
    showMessage(message, type = 'info') {
        toastr[type](message, {
            closeButton: true,
            progressBar: true,
            positionClass: 'toast-top-right',
            timeOut: 3000
        });
    }

    /**
     * HTML escape
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    escapeHtml(text) {
        return $('<div>').text(text).html();
    }
}
