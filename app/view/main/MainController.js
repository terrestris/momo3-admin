/**
 * This class is the controller for the main view for the application. It is
 * specified as the "controller" of the Main view class.
 *
 */
Ext.define('MoMo.admin.view.main.MainController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.main',

    requires: [
        'BasiGX.util.CSRF',
        'BasiGX.util.Url'
    ],

    route_tab: {
        // datalayers: "manage-data-layers-tab",
        // gisclients: "manage-web-maps-tab",
        // users: "manage-users-tab",
        // account: "manage-account-info-tab",
        // usage: "view-usage-tab"
    },

    routes : {
        // ':tab': 'showTab',
//        ':tab/:page/:id': 'showSettingsPage',
//        ':tab/layers/:page/:id': 'showSettingsPage',
//        ':tab/layergroups/:page/:id': 'showLayergroupsPage',
        // ':tab/manage/:page': 'showAccountPage',
        // 'gisclients/:page/:id': 'showGisClientPage'
    },

    /**
     * retrieves user information from the backend and sets the information
     * on the applications main viewmodel
     */
    getUserBySession: function(){
        var viewModel = this.getViewModel();
        var getUserBySessionPath = BasiGX.util.Url.getWebProjectBaseUrl() +
            'user/getUserBySession.action';

        Ext.Ajax.request({
            url: getUserBySessionPath,
            method: 'GET',
            success: function(response) {
                if (response && response.responseText) {
                    var responseObj = Ext.decode(response.responseText);
                    var user = Ext.create(
                        'MoMo.admin.model.User',
                        responseObj.data
                    );
                    viewModel.set('user', user);
                } else {
                    Ext.Error.raise('Could not get user by session.');
                }
            },
            failure: function(response) {
                Ext.Msg.alert(
                    'Error',
                    Ext.String.format(response.responseText)
                );
            }
        });
    },

    logOut: function(){
        var me = this;
        Ext.MessageBox.confirm('Log out',
            'Are you sure you want to log out?',
            function(confirmed){
                if(confirmed === "yes"){
                    Ext.Ajax.request({
                        url: BasiGX.util.Url.getWebProjectBaseUrl() + 'logout',
                        method: "POST",
                        headers: BasiGX.util.CSRF.getHeader(),
                        scope: me,
                        success: function() {
                            location.href = BasiGX.util.Url
                                .getWebProjectBaseUrl() + "login/";
                        },
                        failure: function() {
                            location.href = BasiGX.util.Url
                                .getWebProjectBaseUrl() + "login/";
                        }
                    });
                }
            }
        );
    },

    onTabChange: function(main, newTab){
        var route = Ext.Object.getKey(this.route_tab, newTab.getItemId());
        if(route){
            this.redirectTo(route);
        }
    },

    showAccountPage: function(tab, page){
        // Finds the container from the route string
        var container = this.getView().getComponent(this.route_tab[tab]).
            getComponent(0);

        container.down('mm_panel_manageaccountinfo').
            getController().showCreateOrEditPanel(page);
    },

    showTab: function(tab){
        var view = this.getView();
        var itemId = this.route_tab[tab];

        if(tab === "account"){
            this.showAccountPage("account", "general");
        } else {
            view.setActiveItem(itemId);
        }
    },

    showLayergroupsPage: function(tab, page, id){
        var container = this.getView().getComponent(this.route_tab[tab]).
            getComponent(0);

        // TODO Determine record by tab, page and id
        var store = Ext.getStore('appStore');
        var record = store.getById(id);

        if(record){
            container.getController().showCreateOrEditPanel(page, record, true);
        }
    },

    showGisClientPage: function(){
//    showGisClientPage: function(page, id){
//        MoMo.admin.model.GisClient.load(57,{
//            scope: this,
//            success: function(record) {
//                this.getView().query("mm_container_managegisclients")[0].
//                        getController().showCreateOrEditPanel(page, record);
//            }
//        });
    }
});
