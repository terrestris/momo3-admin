Ext.define('MoMo.admin.view.grid.EntityPermissionsModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.momo-entitypermissions',

    data: {
        usersColumnTitle: 'Users',
        groupsColumnTitle: 'Groups',
        readPermissionColumnTitle: 'Read',
        updatePermissionColumnTitle: 'Update',
        deletePermissionColumnTitle: 'Delete',
        permissionsUpdatesSuccessTitle: 'Success',
        permissionsUpdatesSuccessText: 'Permissions updated',
        permissionsUpdatesFailureTitle: 'Failure',
        permissionsUpdatesFailureText: 'Permissions failed to update'
    }
});
