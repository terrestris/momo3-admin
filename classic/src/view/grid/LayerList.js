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
        type: 'layers',
        sorters: [{
            property: 'name',
            direction: 'ASC'
        }]
    },

    config: {
        showCreateButton: true,
        showCopyButton: true,
        showDeleteButton: true,
        showFilterField: true,
        showLayerSettingsColumn: true,
        showLayerStyleColumn: false,
        showLayerDownloadColumn: true,
        showLayerPreviewColumn: true
    },

    previewWindow: null,

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
        name: 'layer-download-column',
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
        bind: {
            text: '{createLayer}'
        },
        scale: 'large',
        ui: 'momo',
        iconCls: 'fa fa-plus fa-2x',
        handler: 'onCreateClick'
    }, {
        xtype: 'button',
        name: 'delete-layer-button',
        bind: {
            text: '{deleteLayer}'
        },
        scale: 'large',
        ui: 'momo',
        iconCls: 'fa fa-minus fa-2x',
        handler: 'onDeleteClick'
    }, '->', {
        xtype: 'textfield',
        name: 'filter-layer-list-field',
        bind: {
            fieldLabel: '{filterByName}'
        },
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

        this.previewWindow = Ext.create('Ext.window.Window', {
            name: 'layer_preview_window',
            closeAction: 'hide',
            items: [{
                xtype: 'gx_component_map',
                width: 400,
                height: 400,
                map: new ol.Map({
                    controls: [],
                    view: new ol.View({
                        center: [11545048, 5938851],
                        zoom: 3
                    })
                })
            }]
        });
    }

});
