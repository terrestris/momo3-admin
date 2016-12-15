Ext.define('MoMo.admin.view.panel.style.Symbolizer', {
    extend: 'Ext.panel.Panel',
    xtype: 'momo-panel-style-symbolizer',

    requires: [
        'MoMo.admin.util.Sld',
        'MoMo.admin.view.panel.style.SymbolizerController',
        'MoMo.admin.view.panel.style.SymbolizerModel'
    ],

    controller: 'panel.style.symbolizer',
    viewModel: {
        type: 'panel.style.symbolizer'
    },

    bodyStyle: {
        background: '#f6f6f6'
    },

    config: {
        symbolizer: null
    },

    listeners: {
        boxready: 'setupInitialUI'
    }
});
