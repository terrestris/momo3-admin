Ext.define("MoMo.admin.view.button.ToolToggle",{
    extend: "Ext.button.Button",

    xtype: "momo-button-tooltoggle",

    margin: 10,
    enableToggle: true,
    scale: 'large',
    iconAlign:'bottom',

    config: {
        // This determines the actual button we want to see in the map by its
        // xtype.
        toolId: ""
    },

    initComponent: function(){
        if(Ext.isEmpty(this.getToolId())){
            Ext.raise("No toolId defined for momo-button-tooltoggle.");
        }
        this.callParent(arguments);
    },

    toggleHandler: function(button, pressed){
        var viewModel = button.lookupViewModel();
        var activeTools = viewModel.get('application.activeTools');
        var toolId = button.toolId;

        if(pressed){
            activeTools.push(toolId);
        } else {
            Ext.Array.remove(activeTools, toolId);
        }
        viewModel.set('application.activeTools', activeTools);
    }
});
