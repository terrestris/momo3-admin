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
        var selection = view.getSelectionModel().getSelection();
        if (selection.length !== 1) {
            Ext.Msg.alert(
                'Error',
                'Please select a single application before!'
            );
            return;
        }
        var appId = selection[0].get('id');
        BasiGX.prompt('Enter a new name for the application to be copied', {
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
                                Ext.toast("Application has been copied " +
                                    "successfull");
                            } else {
                                Ext.Msg.alert(
                                    'Error',
                                    'Could not copy the application.'
                                );
                            }
                        },
                        failure: function() {
                            view.setLoading(false);
                            Ext.Msg.alert(
                                'Error',
                                'Could not copy the application.'
                            );
                        }
                    });
                }
            }
        });
    },

    onDeleteClick: function() {
        var view = this.getView();
        var selection = view.getSelectionModel().getSelection();
        if (selection.length < 1) {
            Ext.Msg.alert(
                'Error',
                'Please select at least one application before!'
            );
            return;
        }
        Ext.each(selection, function(app) {
            app.erase({
                callback: function(rec,operation,success) {
                    if (success) {
                        Ext.toast("Application deleted");
                    } else {
                        Ext.toast("Application deletion failed");
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
            case 3: //tool-settings
                this.redirectTo('applications/createOrEdit/' +
                        record.get('id'));
                break;
            case 4: //layer-settings
                this.redirectTo('applications/createOrEdit/' +
                        record.get('id'));
                break;
            case 5: //share-settings
                this.redirectTo('applications/createOrEdit/' +
                        record.get('id'));
                break;
            case 6: // shwo preview
                window.open('/momo/client?id=' + record.get('id'));
                break;
            default:
                return;
        }
    }

});
