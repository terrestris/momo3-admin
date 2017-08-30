Ext.define('MoMo.admin.view.tab.CreateOrEditLayerController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.momo-create-or-edit-layer',

    requires: [
        'MoMo.shared.MetadataUtil'
    ],

    /**
     * Cleanup Layerdata to avoid artifacts when navigating through the
     * admin frontend.
     */
    onHide: function(){
        var me = this;
        var viewModel = me.getViewModel();
        viewModel.set('entityId', null);

        var cleanLayer = Ext.create('MoMo.admin.model.Layer');
        var cleanLayerAppearance = Ext.create(
                'MoMo.admin.model.LayerAppearance');

        cleanLayer.setAppearance(cleanLayerAppearance);

        viewModel.set('layer', cleanLayer);
        viewModel.get('layer').set('id', undefined);

        // ATTENTION !!!
        // We destroy the view in the onHide method for cleanup reasons.
        me.getView().destroy();
    },

    /**
     *
     */
    loadLayerData: function(){
        var me = this;
        var view = me.getView();
        var viewModel = me.getViewModel();
        var layerId = viewModel.get('entityId');

        if (layerId) {

            MoMo.admin.model.Layer.load(layerId, {
                scope: this,
                success: function(record) {
                    viewModel.set('layer', record);
                    view.down('momo-panel-style-styler')
                            .setLayerName(record.getSource().get('layerNames'));
                    var uuid = record.get('metadataIdentifier');
                    if(uuid){
                        me.loadMetadata(uuid);
                    }
                    me.loadEntityPermissionStores();
                },
                failure: function() {
                    Ext.toast('Error loading Layer Data.');
                }
            });
        } else {
            var cleanLayer = Ext.create('MoMo.admin.model.Layer');
            var cleanLayerAppearance = Ext.create(
                    'MoMo.admin.model.LayerAppearance');

            cleanLayer.setAppearance(cleanLayerAppearance);

            viewModel.set('layer', cleanLayer);
            viewModel.get('layer').set('id', undefined);
            me.loadEntityPermissionStores();
        }
        var generalTab = me.getView().down('momo-layer-general');
        me.getView().setActiveItem(generalTab);
    },

    /**
     *
     */
    loadMetadata: function(uuid){
        var me = this;
        var viewModel = me.getViewModel();
        Ext.Ajax.request({
            url: BasiGX.util.Url.getWebProjectBaseUrl() + 'metadata/csw.action',
            method: "POST",
            params: {
                xml: MoMo.shared.MetadataUtil.getLoadXml(uuid),
                layerId: viewModel.get('layer').getId()
            },
            defaultHeaders: BasiGX.util.CSRF.getHeader(),
            success: function(response){
                var responseObj = Ext.decode(response.responseText);
                var metadataObj = MoMo.shared.MetadataUtil.parseMetadataXml(
                        responseObj.data);
                viewModel.set('metadata', metadataObj);
            },
            failure: function(){
                Ext.toast('Warning: Couldn\'t load Metadata for layer.');
            }
        });
    },

    /**
     *
     */
    loadEntityPermissionStores: function() {
        var permissionTab = this.getView().down(
            'momo-layer-permission');
        var grids = permissionTab.query('momo-entitypermissions');
        Ext.each(grids, function(grid) {
            grid.getController().loadStore();
        });
    },

    onSaveClick: function() {
        var me = this;
        var allFieldsValid = me.validateFields();
        var view = me.getView();
        var viewModel = me.getViewModel();
        var stylerPanel = view.down('momo-panel-style-styler');
        var metadataPanel = view.down('momo-layer-metadata');
        var layer = viewModel.get('layer');
        var metadata = viewModel.get('metadata');
        var appearance = layer.getAppearance();

        // preparing booleans to determine when everything has been updated
        // in order to switch back to the all-layers view. If we switch to
        // early, several methods will fail because of destroyed views or
        // viewmodels
        var styleSaveNeeded = stylerPanel && layer.get(
            'dataType').toLowerCase() !== 'raster';
        var styleSaved = false;
        var metadataSaved = false;
        var layerSaveNeeded = layer && layer.getId();
        var layerSaved = false;
        var layerAppearanceSaveNeeded = layer && layer.getId() &&
            appearance && appearance.getId();
        var layerAppearanceSaved = false;


        if (allFieldsValid) {

            view.setLoading(true);

            if (styleSaveNeeded) {
                stylerPanel.on({
                    'styleUpdateSuccess': function() {
                        styleSaved = true;
                        me.checkForUpdateComplete(
                            styleSaveNeeded, styleSaved,
                            metadataSaved,
                            layerSaveNeeded, layerSaved,
                            layerAppearanceSaveNeeded, layerAppearanceSaved
                        );
                    },
                    scope: me
                });
                var stylerPanelCtrl = stylerPanel.getController();
                stylerPanelCtrl.applyAndSave();
            }

            var metadataCtrl = metadataPanel.getController();
            metadataPanel.on({
                'metadataUpdateSuccess': function() {
                    metadataSaved = true;
                    me.checkForUpdateComplete(
                        styleSaveNeeded, styleSaved,
                        metadataSaved,
                        layerSaveNeeded, layerSaved,
                        layerAppearanceSaveNeeded, layerAppearanceSaved
                    );
                },
                scope: me
            });
            if (Ext.isEmpty(layer.get('metadataIdentifier'))){
                metadataCtrl.createMetadataEntry(
                    layer, metadata);
            } else {
                metadataCtrl.updateMetadataEntry(
                    layer, metadata);
            }

            if (layerSaveNeeded) {
                layer.save({
                    callback: function(rec,operation,success) {
                        if (success) {
                            layerSaved = true;
                            me.checkForUpdateComplete(
                                styleSaveNeeded, styleSaved,
                                metadataSaved,
                                layerSaveNeeded, layerSaved,
                                layerAppearanceSaveNeeded, layerAppearanceSaved
                            );
                            Ext.toast("Layer " + layer.get('name') + " saved.");

                        } else {
                            view.setLoading(false);
                            Ext.toast("Layer " + layer.get('name') +
                                " could not be saved.");
                        }
                    }
                });
            }

            if (layerAppearanceSaveNeeded) {
                appearance.save({
                    callback: function(rec,operation,success) {
                        if (success) {
                            layerAppearanceSaved = true;
                            me.checkForUpdateComplete(
                                styleSaveNeeded, styleSaved,
                                metadataSaved,
                                layerSaveNeeded, layerSaved,
                                layerAppearanceSaveNeeded, layerAppearanceSaved
                            );
                            Ext.toast("Layerappearance for layer " +
                                    layer.get('name') + " saved.");
                        } else {
                            view.setLoading(false);
                            Ext.toast("Layerappearance for layer " +
                                    layer.get('name') + " could not be saved.");
                        }
                    }
                });
            }

        } else {
            Ext.toast("Please fill out the required fields.");
        }
    },

    /**
     * check if all requests have finished succesfully before
     * destroying views....
     */
    checkForUpdateComplete: function(styleSaveNeeded, styleSaved, metadataSaved,
            layerSaveNeeded, layerSaved, layerAppearanceSaveNeeded,
            layerAppearanceSaved) {
        if ((styleSaveNeeded && !styleSaved) ||
            (layerSaveNeeded && !layerSaved) ||
            (layerAppearanceSaveNeeded && !layerAppearanceSaved)) {
            return;
        }

        if (metadataSaved) {
            // finally update permissions
            this.updatePermissionsAndRedirect();
        }
    },

    /**
     * Method detects when and if permission have been updated in
     * order to make the final redirect to the layers overview page.
     * We need to do this as the update requires component to still exist,
     * while redirect destroys them, so it may not happen too early
     */
    updatePermissionsAndRedirect: function() {
        var me = this;
        var permissionGrids = me.getView().query(
            'momo-entitypermissions');
        var awaitedEvents = permissionGrids.length;
        var permissionsupdatedEvents = 0;
        var permissionsunmodifiedEvents = 0;
        Ext.each(permissionGrids, function(grid) {
            grid.getController().on('permissionsunmodified', function() {
                permissionsunmodifiedEvents++;
                if (permissionsunmodifiedEvents === awaitedEvents) {
                    // nothing has changed, just redirect
                    me.getView().setLoading(false);
                    me.redirectTo('layers');
                    return;
                }
                if (permissionsunmodifiedEvents +
                    permissionsupdatedEvents === awaitedEvents) {
                    Ext.toast(me.getView().getViewModel().get('i18n')
                        .permissionsUpdatesSuccessText);
                    me.getView().setLoading(false);
                    me.redirectTo('layers');
                }
            }, {single: true});
            grid.getController().on('permissionsupdated', function() {
                permissionsupdatedEvents++;
                if (permissionsunmodifiedEvents === awaitedEvents) {
                    // nothing has changed, just redirect
                    me.getView().setLoading(false);
                    me.redirectTo('layers');
                    return;
                }
                if (permissionsunmodifiedEvents +
                    permissionsupdatedEvents === awaitedEvents) {
                    if (awaitedEvents !== 0) {
                        Ext.toast(me.getView().getViewModel().get('i18n')
                            .permissionsUpdatesSuccessText);
                    }
                    me.getView().setLoading(false);
                    me.redirectTo('layers');
                }
            }, {single: true});
            grid.getController().updatePermissions();
        });
    },

    /**
     *
     */
    onCancelClick: function() {
        var me = this;

        Ext.Msg.confirm(
            'Please confirm',
            'All unsaved changes will be lost. Do you really want to quit?',
            function(choice) {
                if (choice === 'yes') {
                    this.redirectTo('layers');
                } else {
                    return false;
                }
            }, me
        );
    },

    /**
     *
     */
    validateFields: function() {
        var view = this.getView();
        var valid = true;
        Ext.each(view.query('field'), function(field) {
            if(!(field instanceof Ext.form.field.File) && !field.validate()){
                valid = false;

                // set active tab where validation failed
                var invalidPanel = field.up('panel[xtype^=momo\-layer\-]');
                invalidPanel.up().setActiveTab(invalidPanel);
            }
        });

        return valid;
    }

});
