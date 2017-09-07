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

                            // an dieser Stelle ist UUID noch nicht gesetzt
                            layer.save({
                                callback: function(savedLayer) {
                                    // creation is an empty dataset, now update
                                    // with the real values from the form
                                    viewModel.set('layer', savedLayer);
                                    me.updateMetadataEntry(
                                        savedLayer, metadata, viewModel);
                                }
                            });
                        }
                        if (viewModel.getData()) {
                            Ext.toast(viewModel.
                                get('i18n.metadata.createdMetadataMsg') + uuid);
                        }
                    },
                    failure: function(){
                        me.getView().fireEvent('metadataUpdateFailure');
                        if (viewModel.getData()) {
                            Ext.toast(viewModel.
                                get('i18n.metadata.couldNotCreateMetadataMsg'));
                        }
                    }
                });
            },
            failure: function() {
                me.getView().fireEvent('metadataUpdateFailure');
                if (viewModel.getData()) {
                    Ext.toast(viewModel.
                        get('i18n.metadata.couldNotLoadLayerDataMsg'));
                }
            }
        });
    },

    /**
     *
     */
    updateMetadataEntry: function(layer, metadata, viewModel) {
        var me = this;
        var uuid = layer.get('metadataIdentifier');
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
                    me.getView().fireEvent('metadataUpdateSuccess');
                    if (viewModel && viewModel.getData()) {
                        Ext.toast(viewModel.
                            get('i18n.metadata.updatedMetadataMsg') + uuid);
                    }
                },
                failure: function(){
                    me.getView().fireEvent('metadataUpdateFailure');
                    if (viewModel && viewModel.getData()) {
                        Ext.toast(viewModel.
                            get('i18n.metadata.couldNotUpdateMetadataMsg'));
                    }
                }
            });
        }
    },

    /**
     * Reads a user provided metadata xml and fills the form with it
     */
    onMetadataUpload: function(field) {
        var me = this;
        var file = field.getEl().query('input[type=file]')[0].files[0];
        if (file.type !== "text/xml") {
            Ext.Msg.alert(me.getViewModel().get('i18n.metadata.noXMLTitle'),
                me.getViewModel().get('i18n.metadata.noXMLText'));
            return;
        }
        var reader = new FileReader();
        reader.onload = function(e) {
            var text = e.target.result;
            if (!text || text === "") {
                Ext.Msg.alert(me.getViewModel().get(
                    'i18n.metadata.parseFailTitle'),
                    me.getViewModel().get('i18n.metadata.parseFailText'));
                return;
            }
            var metadataObj = MoMo.shared.MetadataUtil.parseMetadataXml(text);
            me.getViewModel().set('metadata', metadataObj);
            Ext.Msg.alert(me.getViewModel().get(
                'i18n.metadata.uploadSuccessTitle'),
                me.getViewModel().get('i18n.metadata.uploadSuccessText'));
        };
        reader.readAsText(file);
    },

    /**
     * Gets the metadata XML and downloads it for the user
     */
    onMetadataDownload: function() {
        var coeLayer = Ext.ComponentQuery.query('momo-create-or-edit-layer')[0];
        if (!coeLayer) {
            return;
        }
        var me = this;
        var viewModel = coeLayer.getViewModel();
        Ext.Ajax.request({
            url: BasiGX.util.Url.getWebProjectBaseUrl() + 'metadata/csw.action',
            method: "POST",
            params: {
                xml: MoMo.shared.MetadataUtil.getLoadXml(
                    viewModel.get('layer').get('metadataIdentifier')),
                layerId: viewModel.get('layer').getId()
            },
            defaultHeaders: BasiGX.util.CSRF.getHeader(),
            success: function(response){
                var responseObj = Ext.decode(response.responseText);
                if (!responseObj.success) {
                    Ext.Msg.alert(me.getViewModel().get(
                        'i18n.metadata.downloadFailTitle'),
                        me.getViewModel().get(
                        'i18n.metadata.downloadFailText'));
                    return;
                }
                var filename = "Metadata.xml";
                var type = "text/xml";
                var file = new Blob([responseObj.data], {type: type});
                if (window.navigator.msSaveOrOpenBlob) {
                    // IE10+
                    window.navigator.msSaveOrOpenBlob(file, filename);
                } else { // Others
                    var a = document.createElement("a");
                    var url = URL.createObjectURL(file);
                    a.href = url;
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                    window.setTimeout(function() {
                        document.body.removeChild(a);
                        window.URL.revokeObjectURL(url);
                    }, 0);
                }
            },
            failure: function(){
                Ext.toast('Warning: Couldn\'t load Metadata for layer.');
            }
        });
    }
});
