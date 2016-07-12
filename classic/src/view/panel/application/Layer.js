Ext.define('MoMo.admin.view.panel.application.Layer', {
    extend: 'Ext.panel.Panel',

    xtype: 'momo-application-layer',

    requires: [
        'MoMo.admin.view.panel.application.LayerController',
        'MoMo.admin.view.panel.application.LayerModel'
    ],

    controller: 'momo-application-layer',

    viewModel: {
        type: 'momo-application-layer'
    },

    routeId: 'layer',

    bind: {
        title: '{title}'
    },

    padding: 20,

    items: [{
        xtype: 'fieldset',
        bind: {
            title: '{title}'
        },
        defaults: {
            width: '100%',
            msgTarget: 'side'
        },
        items: [{
            xtype: 'gridpanel',
            title: 'Available layers'
        }]
    }]

});
