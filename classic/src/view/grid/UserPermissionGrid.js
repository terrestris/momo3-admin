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
        ],
        // filter out the admin user group, as it may not be edited
        filters: [
            function(item) {
                return item.get('groupname') !== "Admin User Group";
            }
        ]
    }),

    columns: [{
        bind: {
            text: '{i18n.userPermissionGridPanelGroupColumnName}'
        },
        dataIndex: 'groupname',
        width: '25%'
    }, {
        xtype: 'checkcolumn',
        bind: {
            text: '{i18n.userPermissionGridPanelSubadminColumnName}'
        },
        dataIndex: 'subadminpermissionactive',
        width: '25%'
    }, {
        xtype: 'checkcolumn',
        bind: {
            text: '{i18n.userPermissionGridPanelEditorColumnName}'
        },
        dataIndex: 'editorpermissionactive',
        width: '25%'
    }, {
        xtype: 'checkcolumn',
        bind: {
            text: '{i18n.userPermissionGridPanelUserColumnName}'
        },
        dataIndex: 'userpermissionactive',
        width: '24%'
    }],

    listeners: {
        cellclick: 'handleSelectionChange',
        render: 'loadData'
    }

});
