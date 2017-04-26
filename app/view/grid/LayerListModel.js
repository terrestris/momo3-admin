Ext.define('MoMo.admin.view.grid.LayerListModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.momo-layerlist',

    data: {
        layerlistTitle: 'All layers',
        layerlistCreateLayer: 'Create',
        layerlistDeleteLayer: 'Delete',
        layerlistFilterByName: 'Filter by name',
        layerlistRefreshText: 'Refresh',
        layerlistSettings: 'Layer Settings',
        layerlistStyle: 'Layer Style',
        layerlistDownload: 'Download Layerdata',
        layerlistPreview: 'Preview Layer'
    }
});
