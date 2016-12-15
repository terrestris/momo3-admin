Ext.define('MoMo.admin.view.panel.style.FilterModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.panel.style.filter',

    data: {
        title: 'Use Filter',
        attributeComboLabel: 'Property',
        operatorComboLabel: 'Operator',
        literalNumberField1Label: 'Lower boundary',
        literalNumberField2Label: 'Value',
        literalTextFieldLabel: 'Is like pattern'
    }

});
