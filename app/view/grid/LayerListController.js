Ext.define('MoMo.admin.view.grid.LayerListController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.momo-layerlist',

    requires: [
        // 'MoMo.admin.view.tab.CreateOrEditApplication'
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

    onCreateClick: function() {
        Ext.toast("Create layer");
    },

    onCopyClick: function() {
        Ext.toast("Copy layer");
    },

    onDeleteClick: function() {
        Ext.toast("Delete layer");
    },

    handleCellClick: function(gridview, td, cellIndex){
        switch(cellIndex) {
            case 2:
                Ext.toast("Edit general-settings");
                break;
            case 3:
                Ext.toast("Edit style-settings");
                break;
            case 4:
                Ext.toast("Download layerdata");
                break;
            case 5:
                Ext.toast("Show Layer preview");
                break;
            default:
                return;
        }
    }

});
