Ext.define('MoMo.admin.view.grid.UserListController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.momo-userlist',

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

    handleCellClick: function(gridview, td, cellIndex, record){
        var me = this;
        switch(cellIndex) {
        case 2:
            Ext.toast("Edit user-settings");
            break;
        default:
            return;
        }
    }

});
