
Ext.define("MoMo.admin.view.container.ManageUsers",{
    extend: "Ext.container.Container",

    xtype: "mm_container_manageusers",

    requires: [
        "MoMo.admin.view.container.ManageUsersController",
        "MoMo.admin.view.container.ManageUsersModel"
    ],

    controller: "container-manageusers",
    viewModel: {
        type: "container-manageusers"
    },

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    padding: 20,

    items: []
});
