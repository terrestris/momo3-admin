Ext.define('MoMo.admin.view.container.ManageUsersController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.container-manageusers',

    inviteUsers: function(){
        Ext.toast('Invite Users');
    },

    deleteUsers: function(){
        var usersGrid = this.getView().down('mm_grid_manageusers');
        var usersStore = usersGrid.getStore();
        var adminSelected = false;

        Ext.each(usersGrid.getSelection(), function(user){
            var roleNames = Ext.Array.pluck(user.get('roles'), "name");
            adminSelected = Ext.Array.contains(roleNames, 'ROLE_APOLLO_ADMIN');
        });

        if(!adminSelected){
            Ext.Msg.confirm({
                title: 'Delete Users',
                message: 'Do you really want to delete the selected User(s)?',
                buttons: Ext.Msg.YESNO,
                fn: function(buttonId){
                    if(buttonId === "yes"){
                        usersStore.remove(usersGrid.getSelection());
                        usersStore.sync({
                            success: function() {
                                Ext.toast("Deleted users.");
                            },
                            failure: function(){
                                Ext.toast("Error while deleting "+
                                    "the selected Users.");
                                usersStore.load();
                            }
                        });
                    } else {
                        Ext.toast("Did not delete selected Users");
                    }
                }
            });
        } else {
            Ext.Msg.alert('Status', 'You can not delete Admins.');
        }
    }
});
