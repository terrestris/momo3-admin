Ext.define('MoMo.admin.view.container.ManageGisClientsModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.container-managegisclients',

    data: {
        directions: '<h3>Here you can manage your GisClients.</h3>' +
            'To add Layer Groups, drag and drop them to a GisClient.<br/>' +
            'You can manage them in "Manage Layers".<br/> ' +
            'To add users to your map, drag and drop them in the edit ' +
            'or view field of the GisClient.' +
            '<p><i class="fa fa-gear fa-2x"></i> Press the settingsbutton to ' +
            'edit the general settings of a Gis Client.</p>' +
            '<p><i class="fa fa-wrench fa-2x"></i> Press the interfacebutton ' +
            'to edit the interface settings of a Gis Client.</p>' +
            '<p><i class="fa fa-list fa-2x"></i> Press the ' +
            'layerbutton to edit the layersettings of a Gis Client.</p>' +
            '<p><i class="fa fa-users fa-2x"></i> Press the sharebutton to ' +
            'share your Gis Client.</p>' +
            '<p><i class="fa fa-eye fa-2x"></i> Press the previewbutton' +
            'to open the Gis Client in a new tab.</p>'
    }

});
