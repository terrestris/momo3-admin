Ext.define('MoMo.admin.view.panel.layer.Style',{
    extend: 'Ext.panel.Panel',

    xtype: 'momo-layer-style',

    requires: [
        'MoMo.admin.view.panel.style.Styler'
    ],

    routeId: 'style',

    bind: {
        title: '{style.title}'
    },

    scrollable: 'y',

    padding: 20,

    items: [{
        xtype: 'fieldset',
        bind: {
            title: '{style.fieldsetTitle}'
        },
        items: [{
            xtype: 'momo-panel-style-styler',
            bind: {
                dspLayerName: 'DSP {layer.name}'
            },
            layerUrl: '/momo/geoserver.action'
        }]
    }]
});
