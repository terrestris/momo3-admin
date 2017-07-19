Ext.define('MoMo.admin.view.grid.UserListModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.momo-userlist',

    data: {
        title: 'All sers',
        createUser: 'Create',
        deleteUser: 'Delete',
        filterByName: 'Filter by name',
        actionSuccess: 'Success',
        actionFailure: 'Error',
        deleteUserText: 'Do you really want to delete the selected ' +
            'account(s)?',
        deletionSuccessText: 'An account has been successfully deleted',
        deletionFailureText: 'An account could not be deleted',
        userlistFirstNameLabel: ''
    }
});
