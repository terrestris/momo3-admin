Ext.define('MoMo.admin.view.grid.GroupListModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.momo-grouplist',

    data: {
        groupGridTitle: 'All users',
        groupGridCreateGroup: 'Create',
        groupGridDeleteGroup: 'Delete',
        groupGridFilterByName: 'Filter by name',
        groupGridRefresh: 'Refresh'
    }
});
