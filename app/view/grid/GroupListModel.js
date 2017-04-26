Ext.define('MoMo.admin.view.grid.GroupListModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.momo-grouplist',

    data: {
        groupGridTitle: 'All users',
        groupGridCreateGroup: 'Create',
        groupGridDeleteGroup: 'Delete',
        groupGridFilterByName: 'Filter by name',
        groupGridRefresh: 'Refresh',
        groupSettings: 'Settings',
        groupCreationTitle: 'Group creation',
        groupCreationText: 'Please enter the name of the group to create',
        groupCreatedSuccessText: 'Group successfully created',
        groupCreatedFailureText: 'Group creation failed',
        groupDeletionNoSelectionText: 'Please select a group before',
        groupDeletionText: 'Are you sure you want to delete this group?',
        groupDeletionTitle: 'Deletion',
        groupDeletionSuccessText: 'Group successfully deleted',
        groupDeletionFailureText: 'Group deletion failed',
        groupModifyText: 'Please enter a new name for the group',
        groupModifyTitle: 'Modify',
        groupModifySuccessText: 'Group successfully edited',
        groupModifyFailureText: 'Group edit failed'
    }
});
