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
