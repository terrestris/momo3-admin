Ext.define('MoMo.admin.view.grid.EntityPermissions',{
    extend: 'Ext.grid.Panel',

    xtype: 'momo-entitypermissions',

    requires: [
        'MoMo.admin.view.grid.EntityPermissionsController',
        'MoMo.admin.view.grid.EntityPermissionsModel',
        'MoMo.admin.store.EntityPermissions'
    ],

    /**
     *
     */
    config: {
        /**
         * the entity we want to handle  -> 'MomoLayer' or 'MomoApplication'
         */
        entity: null,

        /**
         * the targetEntity we want to handle -> 'MomoUser' or 'MomoUserGroup'
         */
        targetEntity: null,

        /**
         * the id of the entity we want to use
         */
        id: null
    },

    controller: 'momo-entitypermissions',

    store: {
        type: 'entitypermissions',
        sorters: [{
            property: 'displayTitle',
            direction: 'ASC'
        }],
        // filter out the admin user group, as it may not be edited
        filters: [
            function(item) {
                return item.get('displayTitle') !== "Admin User Group";
            }
        ]
    },

    viewModel: {
        type: 'momo-entitypermissions'
    },

    columns: [{
        // handle different column names for users / groups
        renderer: function(value, cell, record, dataIndex, index, store, view) {
            var target = view.up().getTargetEntity();
            var grid = view.up();
            if (grid) {
                var columns = grid.getColumns();
                Ext.each(columns, function(column) {
                    if (column.dataIndex === 'displayTitle') {
                        if (target === 'MomoUser') {
                            column.setText(
                                grid.getViewModel().get('i18n').usersColumnTitle
                            );
                        } else {
                            column.setText(
                                grid.getViewModel().get(
                                    'i18n').groupsColumnTitle
                            );
                        }
                    }
                });
            }
            return value;
        },
        dataIndex: 'displayTitle',
        width: '25%'
    }, {
        xtype: 'checkcolumn',
        // if you remove this line, no column texts will be rendered :-) ???
        text: 'Read',
        bind: {
            text: '{i18n.readPermissionColumnTitle}'
        },
        dataIndex: 'PERMISSION_READ',
        width: '25%'
    }, {
        xtype: 'checkcolumn',
        bind: {
            text: '{i18n.updatePermissionColumnTitle}'
        },
        dataIndex: 'PERMISSION_UPDATE',
        width: '25%'
    }, {
        xtype: 'checkcolumn',
        bind: {
            text: '{i18n.deletePermissionColumnTitle}'
        },
        dataIndex: 'PERMISSION_DELETE',
        width: '24%'
    }]
});
