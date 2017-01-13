Ext.define('MoMo.admin.view.grid.UserListModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.momo-userlist',

    data: {
        title: 'All users',
        createUser: 'Create',
        deleteUser: 'Delete',
        filterByName: 'Filter by name'
    }
});
