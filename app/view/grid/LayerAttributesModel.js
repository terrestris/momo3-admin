Ext.define('MoMo.admin.view.grid.LayerAttributesModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.grid-layerattributes',

    requires: [
        'MoMo.admin.store.LayerAttributes'
    ],

    data: {
        layer: null,
        keyColumnHeader: '',
        valueColumnHeader: ''
    },

    stores: {
        layerAttributes: {
            type: 'layerattributes',
            autoLoad: true,
            proxy: {
                url: '/momo/geoserver.action/?service=WFS&request=' +
                    'DescribeFeatureType&typeName={layer.source.layerNames}',
                type: 'ajax',
                reader: {
                    type: 'xml',
                    namespace: 'xsd',
                    record: 'element',
                    rootProperty: 'sequence'
                }
            }
        }
    }

});
