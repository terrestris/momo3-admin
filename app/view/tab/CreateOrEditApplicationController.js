Ext.define('MoMo.admin.view.tab.CreateOrEditApplicationController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.momo-create-or-edit-application',

    onAfterRender: function() {
        var me = this;
        var view = me.getView();

        if (!Ext.isEmpty(view.entityId)) {
            me.loadApplicationData(view.entityId);
        } else {
            var layerTab = me.getView().down('momo-application-layer');
            var layerTreePanel = layerTab.down('momo-layertree');
            layerTreePanel.getController().loadStoreData();
        }

    },

    /**
     *
     */
    loadApplicationData: function(applicationId){
        var me = this;

        if (applicationId) {
            MoMo.admin.model.Application.load(applicationId, {
                scope: this,
                success: function(record) {
                    me.setAppData(record);
                },
                failure: function() {
                    Ext.toast('Error loading Application Data.');
                }
            });
        }
    },

    onSaveClick: function() {
        var me = this;
        var viewport = me.getView().up('viewport');
        var layerTreePanel = me.getView().down('momo-layertree');
        var layerTreePanelCtrl = layerTreePanel.getController();

        // validate fields in all tabs
        var allFieldsValid = me.validateFields();

        if (allFieldsValid) {

            viewport.setLoading(true);

            layerTreePanelCtrl.syncTreeStore(me.saveApplication, me);

        } else {
            Ext.toast('Please fill out all required fields.', null, 'b');
        }
    },

    /**
     *
     */
    saveApplication: function() {
        var me = this;
        var viewport = me.getView().up('viewport');

        Ext.Ajax.request({
            url: BasiGX.util.Url.getWebProjectBaseUrl() +
                    'momoapps/create.action',
            method: 'POST',
            defaultHeaders: BasiGX.util.CSRF.getHeader(),
            jsonData: me.collectAppData(),
            scope: me,
            callback: function() {
                viewport.setLoading(false);
            },
            success: function(response) {
                var json = JSON.parse(response.responseText);
                Ext.toast('Successfully created the application "'
                        + json.name + '"', null, 'b');
                var appList = viewport.down('momo-applicationlist');
                if (appList) {
                    appList.getStore().load();
                }
                this.redirectTo('applications');
            },
            failure: function(response) {
                var errorPrefix = "Could not create application:<br>";
                var errorMessage = errorPrefix +
                    "An unknown error occured.";

                if(response.status && response.statusText) {
                    if(response.status === 500) {
                        var json = JSON.parse(response.responseText);
                        errorMessage = errorPrefix + json.message;
                    } else {
                        errorMessage = errorPrefix + "HTTP-Status: " +
                        response.statusText + " (" + response.status + ")";
                    }
                }

                Ext.Msg.alert("Error", errorMessage);
            }
        });
    },

    /**
     *
     */
    setAppData: function(applicationRecord) {
        var me = this;
        var generalTab = me.getView().down('momo-application-general');
        var startViewTab = me.getView().down('momo-application-start-view');
        var layerTab = me.getView().down('momo-application-layer');
        var layerTreePanel = layerTab.down('momo-layertree');
        var generalTabViewModel = generalTab.getViewModel();
        var startViewTabViewModel = startViewTab.getViewModel();

        var appData = applicationRecord.getData();

        generalTabViewModel.set('appData', {
            name: appData.name,
            description: appData.description,
            language: appData.language,
            isPublic: appData.open,
            isActive: appData.active
        });

        startViewTabViewModel.set('appData', {
            mapProjection: 'EPSG:4326',
            mapCenter: {
                x: 31579292,
                y: 6095394
            },
            mapZoom: 2
        });

        layerTreePanel.setTreeConfigId(appData.layerTree.id);
        layerTreePanel.getController().loadStoreData();
    },

    /**
     *
     */
    collectAppData: function() {
        var me = this;
        var generalTab = me.getView().down('momo-application-general');
        var startViewTab = me.getView().down('momo-application-start-view');
        var layerTab = me.getView().down('momo-application-layer');
        var layerTreePanel = layerTab.down('momo-layertree');

        var generalData = generalTab.getViewModel().getData().appData;
        var startViewData = startViewTab.getViewModel().getData().appData;

        var appData = {
            name: generalData.name,
            description: generalData.description,
            language: generalData.language,
            isPublic: generalData.isPublic,
            isActive: generalData.isActive,
            projection: startViewData.mapProjection,
            center: startViewData.mapCenter,
            zoom: startViewData.mapZoom,
            layerTree: layerTreePanel.getTreeConfigId()
        };

        return appData;
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
                    this.redirectTo('applications');
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
            if(!field.validate()){
                valid = false;

                // set active tab where validation failed
                var invalidPanel =
                    field.up('panel[xtype^=momo\-application\-]');
                invalidPanel.up().setActiveTab(invalidPanel);

                return false; // -> break Ext.each
            }
        });
        return valid;
    }

});
