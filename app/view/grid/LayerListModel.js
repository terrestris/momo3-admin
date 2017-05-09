Ext.define('MoMo.admin.view.grid.LayerListModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.momo-layerlist',

    data: {
        layerlistTitle: '',
        layerlistCreateLayer: '',
        layerlistDeleteLayer: '',
        layerlistFilterByName: '',
        layerlistRefreshText: '',
        layerlistSettings: '',
        layerlistStyle: '',
        layerlistDownload: '',
        layerlistPreview: '',
        deletionErrorMsgTitle: '',
        deletionErrorMsgText: '',
        deletionMsgTemplate: '',
        unsuccessfulDeletionMsgTemplate: '',
        downloadStartingMsg: '',
        downloadFailureMsg: '',
        previewTemplate: ''
    }
});
