Ext.define('MoMo.admin.view.panel.layer.MetadataController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.momo-layer-metadata',

    requires: [
        'MoMo.shared.MetadataUtil'
    ],

    /**
     *
     */
    onShow: function(){
        this.prefillEmptyFields();
    },

    /**
     *
     */
    prefillEmptyFields: function(){
        var view = this.getView();
        var viewModel = view.lookupViewModel();
        var title = viewModel.get('metadata.title');
        var personName = viewModel.get('metadata.person.name');
        var email = viewModel.get('metadata.person.email');
        var extent = viewModel.get('metadata.geography.extent');

        if(Ext.isEmpty(title)) {
            viewModel.set('metadata.title', viewModel.get('layer.name'));
        }

        if(Ext.isEmpty(personName)) {
            viewModel.set('metadata.person.name',
                    viewModel.get('user.fullName'));
        }
        if(Ext.isEmpty(email)) {
            viewModel.set('metadata.person.email', viewModel.get('user.email'));
        }

        if(Ext.isEmpty(extent.maxX) && Ext.isEmpty(extent.minX) &&
                Ext.isEmpty(extent.maxY) && Ext.isEmpty(extent.minY)){
//            view.setLoading(true);
            Ext.Ajax.request({
                url: BasiGX.util.Url.getWebProjectBaseUrl() +
                        'momolayers/getLayerExtent.action?layerId=' +
                        viewModel.get('layer.id'),
                success: function(response) {
                    var obj = Ext.decode(response.responseText);
                    if (obj.success && obj.data) {
                        var layerExtent = obj.data.split(",");
                        var minX = parseFloat(layerExtent[0]);
                        var minY = parseFloat(layerExtent[1]);
                        var maxX = parseFloat(layerExtent[2]);
                        var maxY = parseFloat(layerExtent[3]);

                        viewModel.set('metadata.geography.extent',{
                            minX: minX,
                            minY: minY,
                            maxX: maxX,
                            maxY: maxY
                        });
//                        view.setLoading(false);
                    }
                },
                failure: function(response) {
                    Ext.raise('server-side failure with status code ' +
                        response.status);
                }
            });
        }
    },

    /**
     *
     */
    createMetadataEntry: function(layerObj, metadata){
        var me = this;
        var xml = MoMo.shared.MetadataUtil.getInsertBlankXml();
        var layer;
        var viewModel = me.getView().lookupViewModel();

        MoMo.admin.model.Layer.load(layerObj.data.id, {
            scope: this,
            success: function(record) {
                layer = record;
                Ext.Ajax.request({
                    url: BasiGX.util.Url.getWebProjectBaseUrl() +
                        'metadata/csw.action',
                    method: "POST",
                    params: {
                        xml: xml,
                        layerId: layer.getId()
                    },
                    defaultHeaders: BasiGX.util.CSRF.getHeader(),
                    scope: this,
                    success: function(response) {
                        var responseObj;
                        var uuid;
                        if (response && response.responseText) {
                            responseObj = Ext.decode(response.responseText);
                            uuid = MoMo.shared.MetadataUtil.uuidFromXmlString(
                                    responseObj.data);
                            layer.set('metadataIdentifier', uuid);
                            layer.save();
                            // creation is an empty dataset, now update with
                            // the real values from the form
                            me.updateMetadataEntry(layer, metadata);
                        }
                        Ext.toast(viewModel.
                          get('i18n.metadata.createdMetadataMsg') + uuid);
                    },
                    failure: function(){
                        Ext.toast(viewModel.
                          get('i18n.metadata.couldNotCreateMetadataMsg'));
                    }
                });
            },
            failure: function() {
                Ext.toast(viewModel.
                  get('i18n.metadata.couldNotLoadLayerDataMsg'));
            }
        });
    },

    /**
     *
     */
    updateMetadataEntry: function(layer, metadata){
        var me = this;
        var uuid = layer.get('metadataIdentifier');
        var viewModel = me.getView().lookupViewModel();
        if(uuid && metadata){
            var xml = MoMo.shared.MetadataUtil.getUpdateXml(uuid, metadata);
            Ext.Ajax.request({
                url: BasiGX.util.Url.getWebProjectBaseUrl() +
                'metadata/csw.action',
                method: "POST",
                params: {
                    xml: xml,
                    layerId: layer.getId()
                },
                defaultHeaders: BasiGX.util.CSRF.getHeader(),
                scope: this,
                success: function() {
                    Ext.toast(viewModel.
                      get('i18n.metadata.updatedMetadataMsg') + uuid);
                },
                failure: function(){
                    Ext.toast(viewModel.
                      get('i18n.metadata.couldNotUpdateMetadataMsg'));
                }
            });
        }

    }
});
