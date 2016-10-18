Ext.define('MoMo.admin.view.tab.CreateOrEditApplicationController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.momo-create-or-edit-application',

    onSaveClick: function() {
        var me = this;
        var viewport = me.getView().up('viewport');

        // validate fields in all tabs
        var allFieldsValid = me.validateFields();

        if(allFieldsValid) {

            viewport.setLoading(true);

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
                    appList.getStore().load();
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

        } else {
            Ext.toast('Please fill out all required fields.', null, 'b');
        }
    },

    /**
     *
     */
    collectAppData: function() {
        var me = this;
        var generalTab = me.getView().down('momo-application-general');
        var startViewTab = me.getView().down('momo-application-start-view');

        var generalData = generalTab.getViewModel().getData().appData;
        var startViewData = startViewTab.getViewModel().getData();

        var appData = {
            name: generalData.name,
            description: generalData.description,
            language: generalData.language,
            isPublic: generalData.isPublic,
            isActive: generalData.isActive,
            projection: startViewData.mapProjection,
            center: startViewData.mapCenter,
            zoom: startViewData.mapZoom
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
