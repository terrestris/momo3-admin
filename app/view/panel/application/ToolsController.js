Ext.define('MoMo.admin.view.panel.application.ToolsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.momo-application-tools',

    requires: [
        'MoMo.admin.store.Tools',
        'MoMo.admin.view.button.ToolToggle'
    ],

    createToolButtons: function(store, recs) {
        var view = this;
        var viewModel = view.lookupViewModel();
        var application = viewModel.get('application');
        var fieldset = view.down('fieldset');
        Ext.each(recs, function(rec) {
            if(rec.data.properties.ui === 'momo-tools') {
                var btn = {
                    xtype: "momo-button-tooltoggle",
                    glyph: rec.get('glyph'),
                    tooltip: rec.get('name'),
                    toolId: rec.get('id')
                };
                if(!application.get('id')){
                    if(!Ext.Array.contains(
                        application.data.activeTools, rec.get('id'))){
                            application.data.activeTools.push(rec.get('id'));
                    }
                }
                if(Ext.Array.contains(
                        application.data.activeTools, rec.get('id'))) {
                    btn.pressed = true;
                }
                fieldset.add(btn);
            }
        });
    }

});
