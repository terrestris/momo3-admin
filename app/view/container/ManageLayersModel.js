Ext.define('MoMo.admin.view.container.ManageLayersModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.container-managelayers',
    data: {
        directions: '<h3>Here you can manage your Layers and Layer Groups.' +
            '</h3>' +
            '<p>To create a new Layer press the "Upload Layer" button.</p>' +
            '<p>To create a new Folder press the "Create new Folder" ' +
            'button.</p>' +
            '<p>To delete Layers check the box on the left side of the ' +
            'layercolumn you want to delete and click "Delete Layers".</p>' +
            '<p><i class="fa fa-eye fa-2x"></i> Press the previewbutton to ' +
            'see a preview of the belonging Layer.</p>' +
            '<p><i class="fa fa-download fa-2x"></i> Press the ' +
            'downloadbutton to download the layerdata.</p>' +
            '<p><i class="fa fa-gear fa-2x"></i> Press the settingsbutton to ' +
            'edit the Layers or Folders settings.</p>' +
            '<p><i class="fa fa-file-o fa-2x"></i> Press the layerbutton to ' +
            'edit the layers of a folder.</p>' +
            '<p><i class="fa fa-folder-open-o fa-2x"></i> Press the ' +
            'folderbutton to edit the folders of a layer.</p>' +
            '<p><i class="fa fa-paint-brush fa-2x"></i> Press the ' +
            'stylebutton to edit the styling of a layer.</p>'
    }
});
