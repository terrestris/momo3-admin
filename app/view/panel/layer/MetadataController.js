Ext.define('MoMo.admin.view.panel.layer.MetadataController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.momo-layer-metadata',

    requires: [
        'MoMo.shared.MetadataUtil'
    ],

    /**
     *
     */
    onBoxReady: function(){
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
            view.setLoading(true);
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
                        view.setLoading(false);
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
    createMetadataEntry: function(){
        var me = this;
        var xml = MoMo.shared.MetadataUtil.getInsertBlankXml();

        Ext.Ajax.request({
            url: BasiGX.util.Url.getWebProjectBaseUrl() +
                'metadata/csw.action',
            method: "POST",
            params: {
                xml: xml
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
                    var layer = me.getView().lookupViewModel().get('layer');
                    layer.set('metadataIdentifier', uuid);
                    layer.save();
                }
                Ext.toast('Createad MetadataSet with UUID: ' + uuid);
            },
            failure: function(){
                Ext.toast('Error: Couldn\'t create MetadaSet');
            }
        });
    },

    /**
     *
     */
    updateMetadataEntry: function(){
        var me = this;
        var viewModel = me.getView().lookupViewModel();
        var layer = viewModel.get('layer');
        var uuid = layer.get('metadataIdentifier');
        var metadata = viewModel.get('metadata');

        // TODO Handle update for layer without metadata UUID
        if(uuid && metadata){
            var xml = MoMo.shared.MetadataUtil.getUpdateXml(uuid, metadata);
            Ext.Ajax.request({
                url: BasiGX.util.Url.getWebProjectBaseUrl() +
                'metadata/csw.action',
                method: "POST",
                params: {
                    xml: xml
                },
                defaultHeaders: BasiGX.util.CSRF.getHeader(),
                scope: this,
                success: function() {
                    Ext.toast('Updated MetadataSet with UUID: ' + uuid);
                },
                failure: function(){
                    Ext.toast('Error: Couldn\'t update MetadaSet');
                }
            });
        }

    }

});
