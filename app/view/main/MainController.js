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
            'user/getBySession.action';

        Ext.Ajax.request({
            url: getUserBySessionPath,
            method: 'GET',
            success: function(response) {
                if (response && response.responseText) {
                    var responseObj = Ext.decode(response.responseText);
                    var user = Ext.create('MoMo.admin.model.User');
                    var MoMoUser = Ext.create(
                        'MoMo.admin.model.MoMoUser',
                        responseObj.data.MoMoUser
                    );
                    var stripeCustomerParams = Ext.create(
                        'MoMo.admin.model.StripeCustomerParams',
                        responseObj.data.stripeCustomerParams
                    );
                    var sessionInfo = Ext.create(
                        'MoMo.admin.model.SessionInfo',
                        responseObj.data.sessionInfo
                    );
                    user.setMoMoUser(MoMoUser);
                    user.setStripeCustomerParams(stripeCustomerParams);
                    user.setSessionInfo(sessionInfo);
                    viewModel.set('user', user);

                    var activeGroup = user.getSessionInfo().get('userGroup');
                    // set the activeGroup as selected group
                    if (activeGroup && activeGroup.id) {
                        viewModel.set('selectedUserGroup', activeGroup.id);
                    }
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

    /**
     *
     */
    activeGroupSelected: function(combo, record) {
        var me = this;
        var view = this.getView();
        var groupId = record.get('id');
        var lastValue = this.getViewModel().get('user').
            getSessionInfo().get('userGroup').id;
        if (parseInt(groupId, 10) === lastValue) {
            return;
        }
        var url = BasiGX.util.Url.getWebProjectBaseUrl() +
            'user/setSessionGroup.action';
        view.setLoading(true);
        Ext.Ajax.request({
            url: url,
            params: {
                groupId: groupId
            },
            method: 'POST',
            headers: BasiGX.util.CSRF.getHeader(),
            success: function(response) {
                view.setLoading(false);
                var json = Ext.decode(response.responseText);
                if (json.success) {
                    me.handleGroupChange(json);
                } else {
                    combo.setValue(lastValue);
                }
            },
            failure: function(response) {
                view.setLoading(false);
                combo.setValue(lastValue);
                Ext.Msg.alert(
                    'Error',
                    Ext.String.format(response.responseText)
                );
            }
        });
    },

    handleGroupChange: function(json) {
        var view = this.getView();
        var viewModel = view.getViewModel();

        // Refresh the model data. We have to create a new instance of
        // sessiondata in order to trigger the mainmodels formulas binds
        // on the user object, because deep:true seems to only work this way
        var newSessionInfo = Ext.create('MoMo.admin.model.SessionInfo', {
            userGroup: json.data.userGroup,
            roleForGroup: json.data.roleForGroup
        });
        viewModel.get('user').setSessionInfo(newSessionInfo);

        //set active tab to gisclients, should be always visible for everyone
        var gisClientTab = Ext.ComponentQuery.query(
            '[itemId=manage-web-maps-tab]')[0];
        view.setActiveTab(gisClientTab);

        // TODO: Refactor to always load a store / substore when a
        // specific tabpanel is shown!?!
        var storesToReload = [];
        var componentsWithStore = [];
        storesToReload.push(Ext.getStore('momotoolsStore'));
        storesToReload.push(Ext.getStore('gisClientStore'));

        // createnewfolders
        componentsWithStore = Ext.Array.merge(componentsWithStore,
            Ext.ComponentQuery.query('mm_grid_layerlist'));
        // createoreditlayer
        componentsWithStore = Ext.Array.merge(componentsWithStore,
            Ext.ComponentQuery.query('mm_grid_layergrouplist'));
        // create gisclient step 3 and 'my data layers and folders'
        componentsWithStore = Ext.Array.merge(componentsWithStore,
            Ext.ComponentQuery.query('treepanel'));
        // userstore - invite users to gisclient
        componentsWithStore = Ext.Array.merge(componentsWithStore,
            Ext.ComponentQuery.query('tagfield'));
        // userstore - manage users
        componentsWithStore = Ext.Array.merge(componentsWithStore,
            Ext.ComponentQuery.query('mm_grid_manageusers'));

        Ext.each(componentsWithStore, function(comp) {
            if (comp.store) {
                storesToReload.push(comp.getStore());
            }
        });

        Ext.each(storesToReload, function(store) {
            store.load();
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
