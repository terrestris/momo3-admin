Ext.define('MoMo.admin.view.grid.ApplicationListModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.momo-applicationlist',

    data: {
        title: 'All applications',
        createApp: 'Create',
        copyApp: 'Copy',
        deleteApp: 'Delete',
        filterByName: 'Filter by name'
    }
});
