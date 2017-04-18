Ext.define('MoMo.admin.view.grid.UserPermissionGridModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.momo-userpermissiongrid',

    data: {
        groupColumnName: 'Group',
        subadminColumnName: 'Sub-Admin',
        editorColumnName: 'Editor',
        userColumnName: 'User'
    }
});
