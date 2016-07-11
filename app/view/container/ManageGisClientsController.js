Ext.define('MoMo.admin.view.container.ManageGisClientsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.container-managegisclients',

    addGisClient: function(){
        this.showCreateOrEditPanel();
    },

    deleteGisClient: function(){
        var gisclientGrid = this.getView().down('mm_grid_managegisclients');
        var gisclientStore = gisclientGrid.getStore();

        Ext.Msg.confirm({
            title: 'Delete Gis Client',
            message: 'Do you really want to delete the selected Gis Client(s)?',
            buttons: Ext.Msg.YESNO,
            fn: function(buttonId){
                if(buttonId === "yes"){
                    Ext.toast("We still have to do delete all unique entities"+
                        " contained by the Gis Client.");

                    gisclientStore.remove(gisclientGrid.getSelection());
                    gisclientStore.sync({
                        success: function() {
                            Ext.toast("Gis Client successfully deleted");
                        },
                        failure: function(){
                            Ext.toast("Error while deleting "+
                                "the selected Gis Client.");
                            gisclientStore.load();
                        }
                    });
                } else {
                    Ext.toast("Did not delete the selected Gis Client(s).");
                }
            }
        });
    },

    toggleGisClientVisibility: function(){
        var gisclientGrid = this.getView().down('mm_grid_managegisclients');
        var selectedGisClients = gisclientGrid.getSelection();

        Ext.Msg.confirm({
            title: 'Toggle Gis Client visibility',
            message: 'Do you really want to toggle the visibility of the ' +
                'selected Gis Client(s)?',
            buttons: Ext.Msg.YESNO,
            fn: function(buttonId){
                if(buttonId === "yes"){
                    Ext.each(selectedGisClients, function(gisClient){
                        var isVisible = gisClient.get('active');
                        gisClient.set('active', !isVisible);
                        gisClient.save({
                            success: function(){
                                Ext.toast('Visibility of ' +
                                    gisClient.get('name') + ' set to ' +
                                    !isVisible);
                            },
                            failure: function(){
                                Ext.toast('Internal Server Error!' +
                                    'Visibility of ' + gisClient.get('name') +
                                    'could not be set to ' + !isVisible);
                            }
                        });
                    });
                } else {
                    Ext.toast("Don`t hide the selected Gis Client(s).");
                }
            }
        });
    },

    showCreateOrEditPanel: function(settingsPage, record){
        var name = record ? record.get('name') : 'New Gis Client';
        var appId = record ? record.get('id') : null;
        if(!settingsPage){
            settingsPage='general';
        }

        //cleanup old panels before building a new one
        var panels = Ext.ComponentQuery.query(
                'panel[name=createoreditgisclient]');
        Ext.each(panels, function(panel) {
            panel.destroy();
        });

        var tabPanel = this.getView().up('app-main');
        var panel = {
            xtype: 'panel',
            layout: 'fit',
            title: name,
            name: 'createoreditgisclient',
            items: [{
                xtype: 'panel',
                layout: 'fit',
                title: name,
                tools: [{
                    type: 'close',
                    callback: function(btn){
                        btn.up('app-main').setActiveItem('manage-web-maps-tab');
                    }
                }],
                items: [{
                    xtype: 'mm_panel_createoreditgisclient',
                    pageName: settingsPage,
                    appId: appId
                }]
            }]
        };
        tabPanel.setActiveItem(panel);

        var tabBar = Ext.ComponentQuery.query('tabbar')[0];
        var tab = tabBar.down('tab[title="'+name+'"]');

        tabBar.remove(tab);
    },

    openGisClient: function(id){
        window.open('/momo/client?id='+id);
    }

});
