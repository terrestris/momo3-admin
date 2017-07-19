Ext.define('MoMo.admin.view.grid.GroupPermissionGrid',{
    extend: 'Ext.grid.Panel',

    xtype: 'momo-grouppermissiongrid',

    requires: [
        'MoMo.admin.view.grid.GroupPermissionGridModel',
        'MoMo.admin.view.grid.GroupPermissionGridController'
    ],

    controller: 'momo-grouppermissiongrid',
    viewModel: {
        type: 'momo-grouppermissiongrid'
    },

    store:  Ext.create('Ext.data.Store', {
        fields: [
            'groupid',
            'groupname',
            'username',
            'userid',
            'subadminpermissionactive',
            'editorpermissionactive',
            'userpermissionactive'
        ],
        groupField: 'groupname',
        // filter out the admin user group, as it may not be edited
        filters: [
            function(item) {
                return item.get('groupname') !== "Admin User Group";
            }
        ]
    }),

    features: [{
        ftype:'grouping',
        enableGroupingMenu: false,
        enableNoGroups: false
    }],

    columns: [{
        bind: {
            text: '{i18n.groupPermissionGridPanelGroupColumnName}'
        },
        dataIndex: 'username',
        width: '25%'
    }, {
        xtype: 'checkcolumn',
        bind: {
            text: '{i18n.groupPermissionGridPanelSubadminColumnName}'
        },
        dataIndex: 'subadminpermissionactive',
        width: '25%'
    }, {
        xtype: 'checkcolumn',
        bind: {
            text: '{i18n.groupPermissionGridPanelEditorColumnName}'
        },
        dataIndex: 'editorpermissionactive',
        width: '25%'
    }, {
        xtype: 'checkcolumn',
        bind: {
            text: '{i18n.groupPermissionGridPanelUserColumnName}'
        },
        dataIndex: 'userpermissionactive',
        width: '24%'
    }],

    listeners: {
        cellclick: 'handleSelectionChange',
        render: 'loadData'
    }

});
