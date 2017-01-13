Ext.define('MoMo.admin.view.panel.application.GeneralController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.momo-application-general',

    onPublicCheckboxChange: function(box) {
        var me = this;
        var viewModel = me.getView().lookupViewModel();

        if (box.checked) {
            Ext.toast(viewModel.get('general.publicBoxToastText'), null, 'b');
        }
    },

    onActiveCheckboxChange: function(box) {
        var me = this;
        var viewModel = me.getView().lookupViewModel();

        if (!box.checked) {
            Ext.toast(viewModel.get('general.activeBoxToastText'), null, 'b');
        }
    }

});
