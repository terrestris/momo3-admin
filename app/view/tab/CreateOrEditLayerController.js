Ext.define('MoMo.admin.view.tab.CreateOrEditLayerController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.momo-create-or-edit-layer',

    /**
     *
     */
    onAfterRender: function() {
        var me = this;
        var view = me.getView();
        var viewModel = me.getViewModel();

        if (!Ext.isEmpty(view.entityId)) {
            me.loadLayerData(view.entityId);
        } else {
            var cleanLayer = Ext.create('MoMo.admin.model.Layer');
            var cleanLayerAppearance = Ext.create(
                    'MoMo.admin.model.LayerAppearance');

            cleanLayer.setAppearance(cleanLayerAppearance);

            viewModel.set('layer', cleanLayer);
            viewModel.get('layer').set('id', undefined);
        }
    },

    /**
     *
     */
    loadLayerData: function(layerId){
        var me = this;
        var view = me.getView();

        if (layerId) {
            var viewModel = me.getViewModel();

            MoMo.admin.model.Layer.load(layerId, {
                scope: this,
                success: function(record) {
                    viewModel.set('layer', record);
                    view.down('momo-panel-style-styler')
                            .setLayerName(record.getSource().get('layerNames'));
//                    var panel = view.up('panel');
//                    if(record.get('name')){
//                        panel.setTitle(record.get('name'));
//                    }
                },
                failure: function() {
                    Ext.toast('Error loading Layer Data.');
                }
            });
        }
    },

    onSaveClick: function() {
        var me = this;
        var allFieldsValid = me.validateFields();
        var view = me.getView();
        var viewModel = me.getViewModel();
        var layer = viewModel.get('layer');
        var appearance = layer.getAppearance();

        if (allFieldsValid) {

            view.setLoading(true);

            if (layer && layer.getId()) {
                layer.save({
                    success: function() {
                        view.setLoading(false);
                        Ext.toast("Layer " + layer.get('name') + " saved.");
                    }
                });
            }

            if(layer && layer.getId() && appearance && appearance.getId()){
                appearance.save({
                    success: function(){
                        view.setLoading(false);
                        Ext.toast("Layerappearance for layer " +
                            layer.get('name') + " saved.");
                    }
                });
            }
        } else {
            Ext.toast("Please fill out the required fields.");
        }
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

                return false; // -> break Ext.each
            }
        });
        return valid;
    }

});
