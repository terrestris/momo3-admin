Ext.define('MoMo.admin.view.grid.UserPermissionGrid',{
    extend: 'Ext.grid.Panel',

    xtype: 'momo-userpermissiongrid',

    requires: [
        'MoMo.admin.view.grid.UserPermissionGridModel',
        'MoMo.admin.view.grid.UserPermissionGridController'
    ],

    controller: 'momo-userpermissiongrid',
    viewModel: {
        type: 'momo-userpermissiongrid'
    },

    store:  Ext.create('Ext.data.Store', {
        fields: [
            'groupid',
            'groupname',
            'subadminpermissionactive',
            'editorpermissionactive',
            'userpermissionactive'
        ]
    }),

    columns: [{
        bind: {
            text: '{groupColumnName}'
        },
        dataIndex: 'groupname',
        width: '25%'
    }, {
        xtype: 'checkcolumn',
        bind: {
            text: '{subadminColumnName}'
        },
        dataIndex: 'subadminpermissionactive',
        width: '25%'
    }, {
        xtype: 'checkcolumn',
        bind: {
            text: '{editorColumnName}'
        },
        dataIndex: 'editorpermissionactive',
        width: '25%'
    }, {
        xtype: 'checkcolumn',
        bind: {
            text: '{userColumnName}'
        },
        dataIndex: 'userpermissionactive',
        width: '24%'
    }],

    listeners: {
        cellclick: 'handleSelectionChange',
        render: 'loadData'
    }

});
