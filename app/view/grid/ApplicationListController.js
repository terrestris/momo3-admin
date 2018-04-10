Ext.define('MoMo.admin.view.grid.ApplicationListController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.momo-applicationlist',

    loadStore: function(){
        this.getView().getStore().load();
    },

    /**
     * examples/kitchensink/#filtered-tree
     */
    onFilterChange: function(filterField) {
        var grid = this.getView(),
            filters = grid.store.getFilters();

        if (filterField.value) {
            this.nameFilter = filters.add({
                id: 'nameFilter',
                property: 'name',
                value: filterField.value,
                anyMatch: true,
                caseSensitive: false
            });
        } else if (this.nameFilter) {
            filters.remove(this.nameFilter);
            this.nameFilter = null;
        }
    },

    onCreateClick: function() {
        this.redirectTo('applications/createOrEdit');
    },

    onCopyClick: function() {
        var view = this.getView();
        var viewModel = view.lookupViewModel();
        var appCopyErrorMsgTitle = viewModel.get('i18n.appCopyErrorMsgTitle');
        var appCopySelectAppsBeforeMsg = viewModel.
            get('i18n.appCopySelectAppsBeforeMsg');
        var appCopyPromptMsg = viewModel.get('i18n.appCopyPromptMsg');
        var appCopiedSuccessfulMsg = viewModel.
            get('i18n.appCopiedSuccessfulMsg');
        var appCopyErrorMsg = viewModel.get('i18n.appCopyErrorMsg');
        var copyPromptTitle = viewModel.get('i18n.appCopyPromptTitle');

        var selection = view.getSelectionModel().getSelection();
        if (selection.length !== 1) {
            Ext.Msg.alert(
                appCopyErrorMsgTitle,
                appCopySelectAppsBeforeMsg
            );
            return;
        }
        var appId = selection[0].get('id');
        BasiGX.prompt(appCopyPromptMsg, {
            fn: function(decision, appName) {
                if (decision === "ok" && appName !== "") {
                    view.setLoading(true);
                    var url = BasiGX.util.Url.getWebProjectBaseUrl() +
                        'momoapps/copy.action';
                    Ext.Ajax.request({
                        url: url,
                        method: 'POST',
                        defaultHeaders: BasiGX.util.CSRF.getHeader(),
                        params: {
                            appId: appId,
                            appName: appName
                        },
                        success: function(response) {
                            view.setLoading(false);
                            if (response && response.status === 201) {
                                view.getStore().load();
                                Ext.toast(appCopiedSuccessfulMsg);
                            } else {
                                Ext.Msg.alert(
                                    appCopyErrorMsgTitle,
                                    appCopyErrorMsg
                                );
                            }
                        },
                        failure: function() {
                            view.setLoading(false);
                            Ext.Msg.alert(
                                appCopyErrorMsgTitle,
                                appCopyErrorMsg
                            );
                        }
                    });
                }
            },
            title: copyPromptTitle
        });
    },

    onDeleteClick: function() {
        var me = this;
        var view = me.getView();
        var viewModel = view.lookupViewModel();
        BasiGX.confirm(viewModel.get('i18n.appDeleteConfirmation'), {
            title: viewModel.get('i18n.appDeleteConfirmationTitle'),
            fn: function(answer) {
                if (answer === 'yes') {
                    me.deleteApp();
                }
            },
            scope: me
        });
    },

    deleteApp: function() {
        var view = this.getView();
        var selection = view.getSelectionModel().getSelection();
        var viewModel = view.lookupViewModel();
        var appCopyErrorMsgTitle = viewModel.get('i18n.appCopyErrorMsgTitle');
        var appCopySelectAppsBeforeMsg = viewModel.
            get('i18n.appCopySelectAppsBeforeMsg');
        var appDeletedMsg = viewModel.get('i18n.appDeletedMsg');
        var appDeletionErrorMsg = viewModel.get('i18n.appDeletionErrorMsg');

        if (selection.length < 1) {
            Ext.Msg.alert(
                appCopyErrorMsgTitle,
                appCopySelectAppsBeforeMsg
            );
            return;
        }
        Ext.each(selection, function(app) {
            app.erase({
                callback: function(rec,operation,success) {
                    if (success) {
                        Ext.toast(appDeletedMsg);
                    } else {
                        Ext.toast(appDeletionErrorMsg);
                    }
                }
            });
        });
    },

    handleCellClick: function(gridview, td, cellIndex, record){
        switch(cellIndex) {
            case 2: // general-settings
                this.redirectTo('applications/createOrEdit/' +
                        record.get('id'));
                break;
            case 3: // show preview
                window.open('/momo/client?id=' + record.get('id'));
                break;
            default:
                return;
        }
    }

});
