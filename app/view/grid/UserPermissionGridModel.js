Ext.define('MoMo.admin.view.grid.UserPermissionGridModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.momo-userpermissiongrid',

    data: {
        userPermissionGridPanelGroupColumnName: 'Group',
        userPermissionGridPanelSubadminColumnName: 'Sub-Admin',
        userPermissionGridPanelEditorColumnName: 'Editor',
        userPermissionGridPanelUserColumnName: 'User'
    }
});
