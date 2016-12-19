Ext.define('MoMo.admin.view.panel.layer.Style',{
    extend: 'Ext.panel.Panel',

    xtype: 'momo-layer-style',

    requires: [
        'MoMo.admin.view.panel.layer.StyleController',
        'MoMo.admin.view.panel.layer.StyleModel',

        'MoMo.admin.view.panel.style.Styler'
    ],

    controller: 'momo-layer-style',

    routeId: 'style',

    title: 'Style', // TODO use title formula from viewmodel
//    bind: {
//        title: '{title}'
//    },

    scrollable: 'y',

    padding: 20,

    items: [{
        xtype: 'fieldset',
        title: 'Generate Style for Layer',
        items: [{
            xtype: 'momo-panel-style-styler',
            bind: {
                dspLayerName: 'DSP {layer.name}'
            },
            layerUrl: '/momo/geoserver.action'
        }]
    }]
});
