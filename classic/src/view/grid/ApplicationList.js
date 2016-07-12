Ext.define('MoMo.admin.view.grid.ApplicationList',{
    extend: 'Ext.grid.Panel',

    xtype: 'momo-applicationlist',

    requires: [
        'MoMo.admin.view.grid.ApplicationListController',
        'MoMo.admin.view.grid.ApplicationListModel',

        'MoMo.admin.store.Application'
    ],

    controller: 'momo-applicationlist',

    viewModel: {
        type: 'momo-applicationlist'
    },

    store: {
        type: 'applications'
    },

    bind: {
        title: '{title}'
    },

    hideHeaders: true,

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
        tpl: new Ext.XTemplate(
                '<div data-qtip="{name}">',
                '{name}',
                '<tpl if="active === false">',
                    ' <i class="fa fa-eye-slash"></i>',
                '</tpl>',
                '</div>',
            {
                // XTemplate configuration:
                disableFormats: true,
                // member functions:
                isNotEmpty: function(entity){
                    return entity.length > 0;
                },
                // member functions:
                getLayers: function(values){
                    var layers = BasiGX.util.Object.getValue(
                        'mapLayers', values);
                    return layers;
                }
            })
    },{
        xtype: 'templatecolumn',
        flex: 1,
        align: "center",
        name: "general-settings",
        tdCls: "column-tool",
        tpl: '<i class="fa fa-gear fa-2x" data-qtip="General Settings"></i>',
        bind: {
            hidden: '{!allowCreateOrEditWebmaps}'
        }
    },{
        xtype: 'templatecolumn',
        flex: 1,
        align: "center",
        name: "tool-settings",
        tdCls: "column-tool",
        tpl: '<i class="fa fa-wrench fa-2x" data-qtip="Interface Settings">' +
            '</i>',
        bind: {
            hidden: '{!allowCreateOrEditWebmaps}'
        }
    },{
        xtype: 'templatecolumn',
        flex: 1,
        align: "center",
        name: "layer-settings",
        tdCls: "column-tool",
        tpl: '<i class="fa fa-list fa-2x" data-qtip="Layers Settings"></i>',
        bind: {
            hidden: '{!allowCreateOrEditWebmaps}'
        }
    },{
        xtype: 'templatecolumn',
        flex: 1,
        align: "center",
        name: "share-settings",
        tdCls: "column-tool",
        tpl: '<i class="fa fa-users fa-2x" data-qtip="Share Web Map"></i>',
        bind: {
            hidden: '{!allowCreateOrEditWebmaps}'
        }
    },{
        xtype: 'templatecolumn',
        flex: 1,
        align: "center",
        name: "preview",
        tdCls: "column-tool",
        tpl: '<i class="fa fa-eye fa-2x" data-qtip="Show Preview"></i>'
    }],

    tbar: [{
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

    bbar: [{
        xtype: 'button',
        text: 'Create',
        listeners: {
            click: 'onCreateClick'
        }
    }, {
        xtype: 'button',
        text: 'Edit',
        listeners: {
            click: 'onEditClick'
        }
    }, {
        xtype: 'button',
        text: 'Copy',
        listeners: {
            click: 'onCopyClick'
        }
    }, {
        xtype: 'button',
        text: 'Delete',
        listeners: {
            click: 'onDeleteClick'
        }
    }],

    initComponent: function(){
        this.callParent(arguments);
        this.getView().on('cellclick', 'handleCellClick');
        this.getView().on('selectionchange', 'selectionChanged');
        this.getView().on('render', 'loadStore');
    }

});
