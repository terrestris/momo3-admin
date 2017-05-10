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
        }],
        listeners: {
            load: function(store){
                var layerList = Ext.ComponentQuery.query('momo-layerlist')[0];
                var tableView = layerList.getView();
                store.each(function(rec) {
                    if (rec.get('readPermissionGrantedFromAnyApplication')) {
                        var row = tableView.getRow(rec);
                        if (row) {
                            var el = Ext.fly(row);
                            // mask the user row
                            el.mask();
                        }
                    }
                });
            }
        }
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
        title: '{layerlistTitle}'
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
        bind: {
            tooltip: '{layerlistRefreshText}'
        },
        callback: 'loadStore'
    }],

    columns: [{
        xtype: 'templatecolumn',
        flex: 10,
        tpl: '<div data-qtip="{name}">{name}</div>'
    },{
        xtype: 'gridcolumn',
        name: 'layer-settings-column',
        width: 40,
        align: "center",
        renderer: function() {
            return '<i class="fa fa-gear fa-2x" data-qtip="' +
                this.getViewModel().get('layerlistSettings') + '">';
        }
    },{
        xtype: 'gridcolumn',
        name: 'layer-style-column',
        width: 40,
        align: "center",
        renderer: function() {
            return '<i class="fa fa-paint-brush fa-2x" data-qtip="' +
                this.getViewModel().get('layerlistStyle') + '">';
        }
    },{
        xtype: 'gridcolumn',
        name: 'layer-download-column',
        width: 40,
        align: "center",
        renderer: function() {
            return '<i class="fa fa-download fa-2x" data-qtip="' +
                this.getViewModel().get('layerlistDownload') + '">';
        }
    },{
        xtype: 'gridcolumn',
        name: 'layer-preview-column',
        width: 40,
        align: "center",
        renderer: function() {
            return '<i class="fa fa-eye fa-2x" data-qtip="' +
                this.getViewModel().get('layerlistPreview') + '">';
        }
    }],

    tbar: [{
        xtype: 'button',
        name: 'create-layer-button',
        bind: {
            text: '{layerlistCreateLayer}'
        },
        scale: 'large',
        ui: 'momo',
        iconCls: 'fa fa-plus fa-2x',
        handler: 'onCreateClick'
    }, {
        xtype: 'button',
        name: 'delete-layer-button',
        bind: {
            text: '{layerlistDeleteLayer}'
        },
        scale: 'large',
        ui: 'momo',
        iconCls: 'fa fa-minus fa-2x',
        handler: 'onDeleteClick'
    }, '->', {
        xtype: 'textfield',
        name: 'filter-layer-list-field',
        bind: {
            fieldLabel: '{layerlistFilterByName}'
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
