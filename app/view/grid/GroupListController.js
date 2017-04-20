Ext.define('MoMo.admin.view.grid.GroupListController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.momo-grouplist',

    requires: [
        'BasiGX.util.MsgBox'
    ],

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

    createGroup: function(decision, groupName) {
        if (decision !== "ok") {
            return;
        }
        var group = Ext.create('MoMo.admin.model.Group', {
            name: groupName
        });

        group.save({
            callback: function(/*savedRec, operation, success*/) {
            }
        });

    },

    onCreateClick: function() {
        var me = this;
        var viewModel = me.getView().getViewModel();
        BasiGX.prompt(viewModel.get('i18n.profilepanelActionSuccess'), {
            title: viewModel.get('i18n.profilepanelActionSuccess'),
            fn: me.createGroup
        });
    },

    onDeleteClick: function() {
        Ext.toast("Delete group");
    },

    handleCellClick: function(gridview, td, cellIndex){
        switch(cellIndex) {
            case 2:
                Ext.toast("Edit group-settings");
                break;
            default:
                return;
        }
    }

});
