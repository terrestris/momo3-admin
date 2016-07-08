
Ext.define("MoMo.admin.view.container.ManageGisClients",{
    extend: "Ext.container.Container",

    xtype: "mm_container_managegisclients",

    requires: [
        "MoMo.admin.view.container.ManageGisClientsController",
        "MoMo.admin.view.container.ManageGisClientsModel"
    ],

    controller: "container-managegisclients",
    viewModel: {
        type: "container-managegisclients"
    },

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    padding: 20,

    items: []

});
