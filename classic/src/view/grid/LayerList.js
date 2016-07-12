Ext.define('MoMo.admin.view.grid.LayerList',{
    extend: 'Ext.grid.Panel',

    xtype: 'momo-layerlist',

    requires: [
        'MoMo.admin.view.grid.LayerListController',
        'MoMo.admin.view.grid.LayerListModel',

        'MoMo.admin.store.Layers'
    ],

    controller: 'momo-layerlist',

    viewModel: {
        type: 'momo-layerlist'
    },

    store: {
        type: 'layers'
    },

    bind: {
        title: '{title}'
    },

    hideHeaders: true,

    maxHeight: '80%',

    scrollable: 'y',

    selModel: {
        type: 'checkboxmodel',
        checkOnly: true,
        columnSelect: true,
        mode: 'MULTI',
        checkboxSelect: true
    },

    tools: [{
        itemId: 'refresh',
        type: 'refresh',
        tooltip: 'Refresh',
        callback: 'loadStore'
    }],

    columns: [{
        xtype: 'templatecolumn',
        flex: 10,
        tpl: '<div data-qtip="{name}">{name}</div>'
    },{
        xtype: 'templatecolumn',
        width: 40,
        align: "center",
        name: "layer-settings",
        tdCls: "column-tool",
        tpl: '<i class="fa fa-gear fa-2x" data-qtip="Layer Settings">'
    },{
        xtype: 'templatecolumn',
        width: 40,
        align: "center",
        name: "style-layer",
        tdCls: "column-tool",
        tpl: '<i class="fa fa-paint-brush fa-2x" data-qtip="Layer Style"></i>'
    },{
        xtype: 'templatecolumn',
        width: 40,
        align: "center",
        name: "download-layerdata",
        tdCls: "column-tool",
        tpl: '<i class="fa fa-download fa-2x" data-qtip="Download Layerdata"></i>'
    },{
        xtype: 'templatecolumn',
        width: 40,
        align: "center",
        name: "add-layer",
        tdCls: "column-tool",
        tpl: '<i class="fa fa-eye fa-2x" data-qtip="Preview Layer"></i>'
    }],

    tbar: [{
        xtype: 'button',
        text: 'Create',
        scale: 'large',
        ui: 'momo',
        iconCls: 'fa fa-plus fa-2x',
        listeners: {
            click: 'onCreateClick'
        }
    }, {
        xtype: 'button',
        text: 'Copy',
        scale: 'large',
        ui: 'momo',
        iconCls: 'fa fa-copy fa-2x',
        listeners: {
            click: 'onCopyClick'
        }
    }, {
        xtype: 'button',
        text: 'Delete',
        scale: 'large',
        ui: 'momo',
        iconCls: 'fa fa-minus fa-2x',
        listeners: {
            click: 'onDeleteClick'
        }
    }, '->', {
        xtype: 'textfield',
        fieldLabel: 'Filter by name',
        labelWidth: undefined,
        triggers: {
            clear: {
                cls: 'x-form-clear-trigger',
                handler: function(){
                    // Will trigger the change listener
                    this.reset();
                }
            }
        },
        listeners: {
            change: 'onFilterChange',
            buffer: 250
        }
    }],

    initComponent: function(){
        this.callParent(arguments);
        this.getView().on('cellclick', 'handleCellClick');
        this.getView().on('selectionchange', 'selectionChanged');
        this.getView().on('render', 'loadStore');
    }

});
