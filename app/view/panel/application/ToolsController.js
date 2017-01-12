Ext.define('MoMo.admin.view.panel.application.ToolsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.momo-application-tools',

    requires: [
        'MoMo.admin.store.Tools',
        'MoMo.admin.view.button.ToolToggle'
    ],

    onBoxReady: function() {
        var me = this;
        this.store = Ext.create('MoMo.admin.store.Tools', {
            autoLoad: true,
            listeners: {
                scope: me,
                load: me.createToolButtons
            }
        });
    },

    createToolButtons: function(store, recs) {
        var me = this;
        var viewModel = me.getView().lookupViewModel();
        var application = viewModel.get('application');
        var fieldset = me.getView().down('fieldset');
        Ext.each(recs, function(rec) {
            if(rec.data.properties.ui === 'momo-tools') {
                var btn = {
                    xtype: "momo-button-tooltoggle",
                    glyph: rec.get('glyph'),
                    tooltip: rec.get('name'),
                    toolId: rec.get('id')
                };
                if(Ext.Array.contains(application.data.activeTools,
                        rec.get('id'))) {
                    btn.pressed = true;
                }
                fieldset.add(btn);
            }
        });
    }

});
