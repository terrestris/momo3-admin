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

    config: {
        showCreateButton: true,
        showCopyButton: true,
        showDeleteButton: true,
        showFilterField: true,
        showLayerSettingsColumn: true,
        showLayerStyleColumn: false,
        showLayerMetadataColumn: true,
        showLayerPreviewColumn: true
    },

    bind: {
        title: '{title}'
    },

    hideHeaders: true,

    listeners: {
        beforerender: 'setComponentsVisibility'
    },

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
        name: 'layer-settings-column',
        width: 40,
        align: "center",
        tdCls: "column-tool",
        tpl: '<i class="fa fa-gear fa-2x" data-qtip="Layer Settings">'
    },{
        xtype: 'templatecolumn',
        name: 'layer-style-column',
        width: 40,
        align: "center",
        tdCls: "column-tool",
        tpl: '<i class="fa fa-paint-brush fa-2x" data-qtip="Layer Style"></i>'
    },{
        xtype: 'templatecolumn',
        name: 'layer-metadata-column',
        width: 40,
        align: "center",
        tdCls: "column-tool",
        tpl: '<i class="fa fa-download fa-2x" ' +
                'data-qtip="Download Layerdata"></i>'
    },{
        xtype: 'templatecolumn',
        name: 'layer-preview-column',
        width: 40,
        align: "center",
        tdCls: "column-tool",
        tpl: '<i class="fa fa-eye fa-2x" data-qtip="Preview Layer"></i>'
    }],

    tbar: [{
        xtype: 'button',
        name: 'create-layer-button',
        text: 'Create',
        scale: 'large',
        ui: 'momo',
        iconCls: 'fa fa-plus fa-2x',
        handler: 'onCreateClick'
    }, {
        xtype: 'button',
        name: 'copy-layer-button',
        text: 'Copy',
        scale: 'large',
        ui: 'momo',
        iconCls: 'fa fa-copy fa-2x',
        handler: 'onCopyClick'
    }, {
        xtype: 'button',
        name: 'delete-layer-button',
        text: 'Delete',
        scale: 'large',
        ui: 'momo',
        iconCls: 'fa fa-minus fa-2x',
        handler: 'onDeleteClick'
    }, '->', {
        xtype: 'textfield',
        name: 'filter-layer-list-field',
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
//        this.getView().on('selectionchange', 'selectionChanged');
        this.getView().on('render', 'loadStore');
    }

});
