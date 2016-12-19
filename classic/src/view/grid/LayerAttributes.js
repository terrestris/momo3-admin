Ext.define('MoMo.admin.view.grid.LayerAttributes',{
    extend: 'Ext.grid.Panel',

    xtype: 'momo-grid-layerattributes',

    requires: [
        'MoMo.admin.view.grid.LayerAttributesModel'
    ],

    viewModel: 'grid-layerattributes',

    config: {
        layer: null
    },

    initComponent: function(){
        this.callParent();
        if(this.getLayer()){
            this.getViewModel().set('layer', this.getLayer());
        }
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

    bind: {
        store: '{layerAttributes}'
    }

});
