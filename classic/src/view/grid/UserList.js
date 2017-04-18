Ext.define('MoMo.admin.view.grid.UserList',{
    extend: 'Ext.grid.Panel',

    xtype: 'momo-userlist',

    requires: [
        'MoMo.admin.view.grid.UserListController',
        'MoMo.admin.view.grid.UserListModel',

        'MoMo.admin.store.Users'
    ],

    controller: 'momo-userlist',

    viewModel: {
        type: 'momo-userlist'
    },

    store: {
        type: 'users',
        sorters: [{
            property: 'lastName',
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
        width: 40,
        align: "center",
        tdCls: "column-tool",
        tpl: new Ext.XTemplate(
            '<tpl if="mainRole == \'ROLE_ADMIN\'">',
                '<i class="fa fa-star fa-2x" data-qtip="Admin"></i>',
            '<tpl elseif="mainRole == \'ROLE_SUBADMIN\'">',
                '<i class="fa fa-star-half-o fa-2x" data-qtip="Sub-Admin"></i>',
            '<tpl else >',
                '<i class="fa fa-star-o fa-2x" data-qtip="User"></i>',
            '</tpl>'
        )
    }, {
        xtype: 'templatecolumn',
        flex: 10,
        tpl: '<div data-qtip="{fullName}">{fullName}</div>'
    },{
        xtype: 'templatecolumn',
        width: 40,
        align: "center",
        tdCls: "column-tool",
        tpl: '<i class="fa fa-gear fa-2x" data-qtip="User Settings">'
    }],

    tbar: [{
        xtype: 'button',
        bind: {
            text: '{createUser}'
        },
        scale: 'large',
        ui: 'momo',
        iconCls: 'fa fa-plus fa-2x',
        handler: 'onCreateClick'
    }, {
        xtype: 'button',
        bind: {
            text: '{deleteUser}'
        },
        scale: 'large',
        ui: 'momo',
        iconCls: 'fa fa-minus fa-2x',
        handler: 'onDeleteClick'
    }, '->', {
        xtype: 'textfield',
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
    }

});
