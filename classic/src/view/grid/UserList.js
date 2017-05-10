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
            '<tpl>',
                '<i class="fa fa-star-o fa-2x" data-qtip="User"></i>',
            '</tpl>'
        )
    }, {
        xtype: 'templatecolumn',
        flex: 10,
        tpl: '<div data-qtip="{fullName}">{fullName}</div>'
    }],

    tbar: [
        {
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
        }
    ],

    initComponent: function(){
        this.callParent(arguments);
        this.getView().on('render', 'loadStore');
    }

});
