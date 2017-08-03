Ext.define('MoMo.admin.view.panel.style.StylerController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.panel.style.styler',

    requires: [
        'BasiGX.util.CSRF',
        'BasiGX.util.Url',

        'MoMo.admin.util.Sld',
        'MoMo.admin.view.panel.style.Rules'
    ],

    /**
     * Holds the delayed task since we can possibly be called while the view is
     * still being configured.
     *
     * @private
     */
    rebuildTask: null,

    /**
     * The interval in milliseconds, at which we recheck if the view is done
     * being configured.
     *
     * @private
     */
    rebuildCheckInterval: 25,

    /**
     * Called when the configured value for layerName changes in the view, this
     * method checks if and how the user interface can be rebuild.
     *
     * @param {String} layerName The fully qualified name of the layer, e.g.
     *     'namespace:featuretype'.
     */
    checkRebuildUserInterface: function(layerName) {
        var me = this;
        if (me.rebuildTask) {
            me.rebuildTask.cancel();
        }
        var view = me.getView();
        if (view.isConfiguring) {
            me.rebuildTask = new Ext.util.DelayedTask(
                me.checkRebuildUserInterface, me, [layerName]
            );
            me.rebuildTask.delay(me.rebuildCheckInterval);
        } else {
            me.rebuildUserInterface(layerName);
        }
    },

    fetchCurrentSld: function(callback) {
        var me = this;
        var view = me.getView();

        Ext.Ajax.request({
            url: view.getLayerUrl(),
            method: 'GET',
            params: {
                service: 'WMS',
                request: 'GetStyles',
                layers: view.getViewModel().get('layer').getSource()
                        .get('layerNames'),
                version: view.getWmsVersion()
            },
            success: function(response) {
                callback(null, response.responseText);
            },
            failure: function(response) {
                var msg = 'Failed to fetch SLD. Status: ' + response.status;
                var err = new Error(msg);
                callback(err, response.responseText);
            }
        });
    },

    /**
     * Rebuilds the SLD container according to the passed layerName.
     *
     * @param {String} layerName The fully qualified name of the layer, e.g.
     *     'namespace:featuretype'.
     */
    rebuildUserInterface: function(layerName) {
        var me = this;
        var view = me.getView();
        var viewModel = this.getViewModel();
        view.isConfiguring = true;

        if(viewModel.get('layer.dataType') === "Raster"){
            view.update('Styler does not support layers with raster data.');
            return;
        }

        view.removeAll();
        view.setHtml('');
        if (!layerName) {
            me.markErrored('missingOrInvalidLayerName');
            return;
        }
        view.setLoading(true);
        me.fetchCurrentSld(me.gotSld.bind(me));
    },

    reloadCurrentStyle: function() {
        this.rebuildUserInterface(this.getView().getLayerName());
    },

    gotSld: function(err, sldString) {
        var me = this;
        var view = me.getView();
        view.setLoading(false);
        if (err) {
            Ext.log.warn(err);
            me.markErrored('failedToFetch');
            return;
        }
        view.add({
            xtype: 'momo-panel-style-rules',
            sld: sldString
        });
        view.geometryType = MoMo.admin.util.Sld
            .guessGeometryTypeFromSldString(sldString);
        view.isConfiguring = false;
    },

    applyAndSave: function() {
        var me = this;
        var view = me.getView();
        var rulesPanel = view.down('momo-panel-style-rules');
        if (!rulesPanel) {
            return;
        }
        var rules = rulesPanel.rules;
        var sldObj = rulesPanel.sldObj;

        if (sldObj && rules) {
            MoMo.admin.util.Sld.setRulesOfSldObject(sldObj, rules);
            rulesPanel.setSld(MoMo.admin.util.Sld.toSldString(sldObj));

            this.persistSld();
        }
    },

    persistSld: function(){
        var me = this;
        var view = me.getView();
        var viewModel = view.getViewModel();
        var rulesPanel = view.down('momo-panel-style-rules');
        var sldObj = rulesPanel.sldObj;
        var sldString = rulesPanel.getSld();
        var sldName = MoMo.admin.util.Sld.getSldNameFromSld(sldObj);
        var targetLayer = viewModel.get('layer');

        Ext.Ajax.request({
            url: BasiGX.util.Url.getWebProjectBaseUrl() +
                'sld/update.action',
            method: 'POST',
            params: {
                sld: sldString,
                sldName: sldName,
                // TODO What happens in create-mode?
                layerId: targetLayer.getId()
            },
            defaultHeaders: BasiGX.util.CSRF.getHeader(),
            scope: this,
            success: function() {
                Ext.toast("Successfully updated style.");
            },
            failure: function(response) {
                Ext.toast(Ext.decode(response.responseText).message,
                        "Couldn't update style.");
            }
        });
    },

    /**
     * Marks the main SLD styler container as currently being incorrectly
     * configured, usually from an unexpected layerName configuration or after a
     * request for getting styles failed.
     */
    markErrored: function(msgKey){
        var me = this;
        var msg = me.getViewModel().get(msgKey || 'genericError');
        me.getView().setHtml(msg);
    }
});
