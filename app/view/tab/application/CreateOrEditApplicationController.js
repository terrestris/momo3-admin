Ext.define('MoMo.admin.view.tab.CreateOrEditApplicationController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.momo-create-or-edit-application',

    onSaveClick: function() {
        var me = this;
        var view = me.getView();

        // validate fields in all tabs
        var allFieldsValid = me.validateFields();

        if(allFieldsValid) {

            view.setLoading(true);

            Ext.Ajax.request({
                url: BasiGX.util.Url.getWebProjectBaseUrl() +
                        'apps/create.action',
                method: 'POST',
                defaultHeaders: BasiGX.util.CSRF.getHeader(),
                jsonData: me.collectAppData(),
                scope: me,
                callback: function() {
                    view.setLoading(false);
                },
                success: function(/*response*/) {
//                    var json = JSON.parse(response.responseText);
                    // TODO ...
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
                    var view = this.getView(),
                        viewportCtrl =
                            view.up('momo-mainviewport').getController();
                    //viewportCtrl.switchToView('applications');
                    viewportCtrl.redirectTo('applications');
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
