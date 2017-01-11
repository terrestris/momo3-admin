Ext.define('MoMo.admin.view.grid.ApplicationList',{
    extend: 'Ext.grid.Panel',

    xtype: 'momo-applicationlist',

    requires: [
        'MoMo.admin.view.grid.ApplicationListController',
        'MoMo.admin.view.grid.ApplicationListModel',

        'MoMo.admin.store.Applications'
    ],

    controller: 'momo-applicationlist',

    viewModel: {
        type: 'momo-applicationlist'
    },

    store: {
        type: 'applications',
        sorters: [{
            property: 'name',
            direction: 'ASC'
        }]
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
                '</div>'
            )
    },{
        xtype: 'templatecolumn',
        flex: 1,
        align: "center",
        tdCls: "column-tool",
        tpl: '<i class="fa fa-gear fa-2x" data-qtip="General Settings"></i>',
        bind: {
            hidden: '{!allowCreateOrEditWebmaps}'
        }
    },{
        xtype: 'templatecolumn',
        flex: 1,
        align: "center",
        tdCls: "column-tool",
        tpl: '<i class="fa fa-eye fa-2x" data-qtip="Show Preview"></i>'
    }],

    tbar: [{
        xtype: 'button',
        text: 'Create',
        scale: 'large',
        ui: 'momo',
        iconCls: 'fa fa-plus fa-2x',
        handler: 'onCreateClick'
    }, {
        xtype: 'button',
        text: 'Copy',
        scale: 'large',
        ui: 'momo',
        iconCls: 'fa fa-copy fa-2x',
        handler: 'onCopyClick'
    }, {
        xtype: 'button',
        text: 'Delete',
        scale: 'large',
        ui: 'momo',
        iconCls: 'fa fa-minus fa-2x',
        handler: 'onDeleteClick'
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
//        this.getView().on('selectionchange', 'selectionChanged');
        this.getView().on('render', 'loadStore');
    }

});
