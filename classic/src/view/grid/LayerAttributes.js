Ext.define('MoMo.admin.view.grid.LayerAttributes',{
    extend: 'Ext.grid.Panel',

    xtype: 'momo-grid-layerattributes',

    requires: [
        'MoMo.admin.view.grid.LayerAttributesModel',
        'MoMo.admin.store.LayerAttributes'
    ],

    viewModel: 'grid-layerattributes',

    config: {
        layer: null
    },

    initComponent: function(){
        this.callParent();
        var layerSrc = this.getLayer().getSource();
        var layerUrl = layerSrc.get('url');
        var layerName = layerSrc.get('layerNames');
        var store = this.getStore();
        var proxy = store.getProxy();
        var url = layerUrl +
            '?service=WFS&' +
            'request=DescribeFeatureType&typeName=' + layerName;

        proxy.setUrl(url);
        store.load();

    },

    columns: [{
        bind: {
            text: '{keyColumnHeader}'
        },
        dataIndex: 'name',
        flex: 1
    },{
        bind: {
            text: '{valueColumnHeader}'
        },
        dataIndex: 'type'
    }],

    store: {
        type: 'layerattributes'
    }

});
