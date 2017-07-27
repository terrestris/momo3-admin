Ext.define('MoMo.admin.view.viewport.ViewportController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.momo-mainviewport',

    requires: [
        'MoMo.admin.view.tab.CreateOrEditApplication',
        'MoMo.admin.view.tab.CreateOrEditLayer'
    ],

    listen : {
        controller : {
            '#': {
                unmatchedroute : 'onRouteChange'
            }
        }
    },

    routes: {
        ':node': 'onRouteChange',
        ':node/createOrEdit': 'switchToView',
        ':node/createOrEdit/:id': 'switchToView'
    },

    componentMap: {
        'applications': 'MoMo.admin.view.tab.CreateOrEditApplication',
        'layers': 'MoMo.admin.view.tab.CreateOrEditLayer'
    },

    /**
     * retrieves user information from the backend and sets the information
     * on the applications main viewmodel
     */
    getUserBySession: function() {
        var me = this;
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
                    me.setAllowCreateOrEditWebmapsOnViewModel(viewModel, user);
                    me.setComponentsVisibilityBasedOnRole();
                    me.setLanguageForUser();
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
     * Method updates the viewmodels bool flag. A formula in the viewmodel
     * sometimes doesnt trigger, thats why we do it manually here
     */
    setAllowCreateOrEditWebmapsOnViewModel: function(viewModel, user) {
        var availableRoles = [];
        if (user && user.getData()) {
            availableRoles = user.getData().groupRoles;
        }
        var isAllowed = false;
        Ext.each(availableRoles, function(role) {
            if (role.indexOf('ROLE_ADMIN') > -1 ||
                role.indexOf('ROLE_SUBADMIN') > -1) {
                isAllowed = true;
            }
        });
        viewModel.set('allowCreateOrEditWebmaps', isAllowed);
    },

    /**
     * Method determines which parts of the frontend are available to the
     * user based on its roles
     */
    setComponentsVisibilityBasedOnRole: function() {
        var view = this.getView();
        var viewModel = this.getViewModel();
        var navigationTreeList = view.down(
            'treelist[reference=navigationTreeList]');
        var navigationStore = navigationTreeList.getStore();
        var user = viewModel.get('user');
        var hasValidUserDetails =
            user.get('department') &&
            user.get('email') &&
            user.get('firstName') &&
            user.get('lastName') &&
            user.get('language') &&
            user.get('telephone');

        if (!hasValidUserDetails) {
            // only profile tab shall be active and usable
            this.redirectTo('profile');
            navigationStore.clearFilter();
            navigationStore.filter([
                {
                    property : 'routeId',
                    value    : 'profile'
                }
            ]);
            return;
        }

        // determine the roles of the suer
        var groupRoles = user.get('groupRoles');
        var hasAdminRole = false;
        var hasSubAdminRole = false;
        var hasEditorRole = false;
        var hasUserRole = false;
        Ext.each(groupRoles, function(groupRole) {
            if (groupRole.indexOf('ROLE_USER') > -1) {
                hasUserRole = true;
            } else if (groupRole.indexOf('ROLE_EDITOR') > -1) {
                hasEditorRole = true;
            } else if (groupRole.indexOf('ROLE_SUBADMIN') > -1) {
                hasSubAdminRole = true;
            } else if (groupRole.indexOf('ROLE_ADMIN') > -1) {
                hasAdminRole = true;
            }
        });

        // filter the menu based on the roles
        if (hasAdminRole) {
            navigationStore.clearFilter();
            return;
        }

        if (hasSubAdminRole) {
            navigationStore.clearFilter();
            navigationStore.filterBy(function(rec) {
                if (rec.get('routeId') === "applications") {
                    return true;
                }
                if (rec.get('routeId') === "users") {
                    return false;
                }
                if (rec.get('routeId') === "profile") {
                    return true;
                }
                if (rec.get('routeId') === "layers") {
                    return true;
                }
                if (rec.get('routeId') === "groups") {
                    return true;
                }
            });
            return;
        }

        if (hasEditorRole) {
            navigationStore.clearFilter();
            navigationStore.filterBy(function(rec) {
                if (rec.get('routeId') === "applications") {
                    return true;
                }
                if (rec.get('routeId') === "users") {
                    return false;
                }
                if (rec.get('routeId') === "groups") {
                    return false;
                }
                if (rec.get('routeId') === "profile") {
                    return true;
                }
                if (rec.get('routeId') === "layers") {
                    return true;
                }
            });
            return;
        }

        if (hasUserRole) {
            navigationStore.clearFilter();
            navigationStore.filterBy(function(rec) {
                if (rec.get('routeId') === "applications") {
                    return true;
                }
                if (rec.get('routeId') === "users") {
                    return false;
                }
                if (rec.get('routeId') === "profile") {
                    return true;
                }
                if (rec.get('routeId') === "groups") {
                    return false;
                }
                if (rec.get('routeId') === "layers") {
                    return false;
                }
            });
            return;
        }
    },

    /**
     *
     */
    setLanguageForUser: function() {
        var viewModel = this.getViewModel();
        var user = viewModel.get('user');
        var lang = user.get('language') || 'en';
        var selector = 'momo-translation-' + lang + '-button';
        var button = Ext.ComponentQuery.query(selector)[0];
        // avoid toast
        button.getController().firstApplicationLoad = true;
        // trigger translation
        button.click();
    },

    /**
     *
     */
    logOut: function(){
        var me = this;
        var view = me.getView();
        var viewModel = view.getViewModel();
        Ext.MessageBox.confirm(viewModel.get('i18n.logoutTitle'),
            viewModel.get('i18n.logoutMessage'),
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

    switchToView: function(node, id) {
        var refs = this.getReferences(),
            mainCard = refs.mainCardPanel,
            mainLayout = mainCard.getLayout(),
            viewToCreate = this.componentMap[node],
            newView;

        var existingViews = Ext.ComponentQuery.query(
                "[$className=" + viewToCreate + "]");

        if(!Ext.isEmpty(existingViews)){
            existingViews[0].getViewModel().set('entityId',
                    id ? parseInt(id, 10) : null);
            mainLayout.setActiveItem(existingViews[0]);
        } else {
            newView = Ext.create(viewToCreate);
            newView.getViewModel().set('entityId',
                    id ? parseInt(id, 10) : null);
            Ext.suspendLayouts();
            mainLayout.setActiveItem(mainCard.add(newView));
            Ext.resumeLayouts(true);
        }

    },

    setCurrentView: function(hashTag) {
        hashTag = (hashTag || '').toLowerCase();

        var me = this,
            refs = me.getReferences(),
            mainCard = refs.mainCardPanel,
            mainLayout = mainCard.getLayout(),
            navigationList = refs.navigationTreeList,
            viewModel = me.getViewModel(),
            vmData = viewModel.getData(),
            store = navigationList.getStore(),
            node = store.findNode('routeId', hashTag),
            view = node ? node.get('view') : null,
            lastView = vmData.currentView,
            existingItem = mainCard.child('component[routeId=' + hashTag + ']'),
            newView;

        // kill any previously routed window
        if (lastView && lastView.isWindow) {
            lastView.destroy();
        }

        lastView = mainLayout.getActiveItem();

        if (!existingItem) {
            var viewToCreate = 'MoMo.admin.view.' +
            // TODO: Uncaught Error: [Ext.create] Unrecognized class
            // name / alias: MoMo.admin.view.pages.Error404Window
                    (view || 'pages.Error404Window');
            newView = Ext.create(viewToCreate, {
                hideMode: 'offsets',
                routeId: hashTag
            });
        }

        if (!newView || !newView.isWindow) {
            // !newView means we have an existing view, but if the newView
            // isWindow we don't add it to the card layout.
            if (existingItem) {
                // We don't have a newView, so activate the existing view.
                if (existingItem !== lastView) {
                    mainLayout.setActiveItem(existingItem);
                }
                newView = existingItem;
            } else {
                // newView is set (did not exist already), so add it and make
                // it the activeItem.
                Ext.suspendLayouts();
                mainLayout.setActiveItem(mainCard.add(newView));
                Ext.resumeLayouts(true);
            }
        }

        navigationList.setSelection(node);

        if (newView.isFocusable(true)) {
            newView.focus();
        }

        vmData.currentView = newView;
    },

    /**
     *
     */
    showHelpDocument: function() {
        var lang = this.getView().getViewModel().get('currentLanguage')
            .toLowerCase();
        var win = Ext.create('Ext.window.Window', {
            width: '80%',
            height: '80%',
            layout: 'fit',
            items: {
                xtype: 'component',
                autoEl: {
                    tag: 'iframe',
                    style: 'height: 100%; width: 100%; border: none',
                    src: '../userdocs/build/MoMo_doc_' + lang + '.pdf'
                }
            }
        });
        win.show();
    },

    onNavigationTreeSelectionChange: function (tree, node) {
        if (node && node.get('view')) {
            this.redirectTo(node.get("routeId"));
        }
    },

    onToggleNavigationSize: function (btn, pressedState) {
        var me = this,
            navContainer = me.getReferences().navigationContainer,
            navList = navContainer.down('treelist'),
            navContainerItems = navContainer.getRefItems(),
            collapsed = pressedState,
            width = collapsed ? 64 : 250;

        navList.setMicro(collapsed);

        Ext.each(navContainerItems, function(item) {
            item.setWidth(width);
        });

        if (collapsed) {
            btn.setIconCls('x-fa fa-angle-right');
        } else {
            btn.setIconCls('x-fa fa-angle-left');
        }
    },

    onMainViewRender: function() {
        if (!window.location.hash) {
            this.redirectTo('applications');
        }
    },

    onRouteChange: function(id){
        this.setCurrentView(id);
    },

    onSearchRouteChange: function () {
        this.setCurrentView('layers');
    },

    onEmailRouteChange: function () {
        this.setCurrentView('email');
    }
});
