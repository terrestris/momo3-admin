Ext.define('MoMo.admin.view.grid.LayerListModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.momo-layerlist',

    data: {
        title: 'All layers',
        createLayer: 'Create',
        deleteLayer: 'Delete',
        filterByName: 'Filter by name'
    }
});
