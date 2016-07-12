Ext.define('MoMo.admin.view.panel.application.GeneralController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.momo-application-general',

    onPublicCheckboxChange: function(box) {
        var me = this,
            viewModel = me.getViewModel();

        if (box.checked) {
            Ext.toast(viewModel.get('publicBoxToastText'));
        }
    },

    onActiveCheckboxChange: function(box) {
        var me = this,
            viewModel = me.getViewModel();

        if (box.checked) {
            Ext.toast(viewModel.get('activeBoxToastText'));
        }
    }

});
