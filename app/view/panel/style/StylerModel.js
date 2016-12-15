Ext.define('MoMo.admin.view.panel.style.StylerModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.panel.style.styler',
    data: {
        missingOrInvalidLayerName: 'layerName is required and must be a ' +
            'fully qualified layername.',
        genericError: 'An unspecified error occured',
        failedToFetch: 'The current styling could not be obtained',
        titlePrefix: 'Styling ',
        btnTextReloadCurrentStyle: 'Reset to original style',
        btnTextApplyAndSave: 'Save style',
        dspLayerName: ''
    }

});
