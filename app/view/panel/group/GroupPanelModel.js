Ext.define('MoMo.admin.view.panel.GroupPanelModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.momo-grouppanel',

    data: {
        grouppanelTitle: 'Edit groups and permissions',
        grouppanelActionSuccess: 'Success',
        grouppanelActionFailure: 'Error',
        grouppanelSaveButtonText: 'Save',
        grouppanelUpdateSuccessText: 'Permissions updated',
        grouppanelUpdateFailureText: 'Permissions could not be updated',
        grouppanelEditPermissionsTitle: 'Permissions',
        grouppanelPermissionGridDescription: 'Here you can manage all users ' +
            'permissions for the different groups. The User you are changing' +
            'the permissions for will be notified via email about his new ' +
            'roles and groups'
    }
});
