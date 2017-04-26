Ext.define('MoMo.admin.view.grid.GroupPermissionGridModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.momo-grouppermissiongrid',

    data: {
        groupPermissionGridPanelGroupColumnName: 'Group',
        groupPermissionGridPanelSubadminColumnName: 'Sub-Admin',
        groupPermissionGridPanelEditorColumnName: 'Editor',
        groupPermissionGridPanelUserColumnName: 'User',
        groupAddUserBtnText: 'Add User',
        groupAddUserTitle: 'Add user to group',
        groupAddUserText: 'Select a user, group and role you want to add',
        groupAddUserSelectGroupTitle: 'Select a group',
        groupAddUserSelectUserTitle: 'Select a user',
        groupAddUserSelectRoleTitle: 'Select a role',
        groupAddUserSaveBtnText: 'Save',
        groupAddUserSelectFirst: 'Please select valid options',
        groupAddUserSuccess: 'Update success',
        groupAddUserFail: 'Update failed'
    }
});
