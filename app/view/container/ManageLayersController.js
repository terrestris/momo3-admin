Ext.define('MoMo.admin.view.container.ManageLayersController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.container-managelayers',
    requires: [
        'BasiGX.util.Url'
    ],

    addLayer: function(){
        this.showCreateOrEditPanel();
    },

    deleteLayers: function(){
        var layersTree = this.getView().down('mm_tree_managelayers');

        Ext.Msg.confirm({
            title: 'Delete Layers',
            message: 'Do you really want to delete the selected Layer(s)?',
            buttons: Ext.Msg.YESNO,
            fn: function(buttonId){
                if(buttonId === "yes"){
                    var selection = layersTree.getSelection();
                    Ext.each(selection, function(l){
                        var restSubPath = 'layers'; // default

                        // adapt the restSubPath if we don't have a group/
                        // folder
                        if(l.get('type') !== 'Group') {
                            restSubPath = 'momolayers';
                        }

                        var urlToUseForDelete = BasiGX.util.Url
                                .getWebProjectBaseUrl() +
                                'rest/'+ restSubPath + '/' + l.get('id');

                        // override the buildurl function
                        l.getProxy().buildUrl = function(){
                            return urlToUseForDelete;
                        };

                        // remove the layer
                        l.erase({
                            callback: function() {
                                layersTree.getStore().load();
                            },
                            success: function(){
                                Ext.toast("Deleted " + l.get('name'));
                            },
                            failure: function(){
                                Ext.toast("Error while deleting "+
                                    "the selected layers.");
                            }
                        });
                    });
                } else {
                    Ext.toast("Don`t delete selected layers");
                }
            }
        });
    },

    addLayerGroup: function(){
        this.showCreateOrEditPanel(undefined, undefined, true);
    },

    showCreateOrEditPanel: function(settingsPage, record, isGroup){
        var item;
        var name = record ? record.get('name') : 'New Data Layer';
        var layerId = record ? record.get('id') : null;
        var layerNames = record && record.getSource() ? record.getSource()
                .get('layerNames') : null;

        if(record){
            name = record.get('name');
        } else if (isGroup) {
            name = 'New Folder';
        } else {
            name = 'New Layer';
        }

        if(!settingsPage){
            settingsPage='general';
        }

        if (isGroup || record && !record.isLeaf()) {
            item = {
                xtype: 'mm_panel_createoreditlayergroup',
                pageName: settingsPage,
                layergroupId: layerId
            };
        } else {
            item = {
                xtype: 'mm_panel_createoreditlayer',
                pageName: settingsPage,
                layerId: layerId,
                layerName: layerNames // TODO why isn't this in the viewmodel?
            };
        }

        var tabPanel = this.getView().up('app-main');
        var panel = {
            xtype: 'panel',
            layout: 'fit',
            name: layerId + 'coePanel',
            title: name,
            items: [{
                xtype: 'panel',
                layout: 'fit',
                title: name,
                tools: [{
                    type: 'close',
                    callback: function(btn){
                        btn.up('app-main').setActiveItem(
                            'manage-data-layers-tab');
                    }
                }],
                items: [item]
            }]
        };
        tabPanel.setActiveItem(panel);

        var tabBar = Ext.ComponentQuery.query('tabbar')[0];
        var tab = tabBar.down('tab[title="'+name+'"]');

        tabBar.remove(tab);
    }

});
