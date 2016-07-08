
Ext.define("MoMo.admin.view.container.ManageLayers",{
    extend: "Ext.container.Container",

    xtype: "mm_container_managelayers",

    requires: [
        "MoMo.admin.view.container.ManageLayersController",
        "MoMo.admin.view.container.ManageLayersModel"
    ],

    controller: "container-managelayers",
    viewModel: {
        type: "container-managelayers"
    },

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    padding: 20,

    items: []
});
