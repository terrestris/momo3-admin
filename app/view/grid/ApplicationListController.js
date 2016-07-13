Ext.define('MoMo.admin.view.grid.ApplicationListController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.momo-applicationlist',

    requires: [
        'MoMo.admin.view.tab.CreateOrEditApplication'
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
        this.redirectTo('applications/createOrEdit');
    },

    onCopyClick: function() {
        Ext.toast("Copy application");
    },

    onDeleteClick: function() {
        Ext.toast("Delete application");
    },

    handleCellClick: function(gridview, td, cellIndex, record){
        var me = this;
        switch(cellIndex) {
        case 2: // general-settings
            Ext.toast("Edit general-settings");
            break;
        case 3: //tool-settings
            Ext.toast("Edit tool-settings");
            break;
        case 4: //layer-settings
            Ext.toast("Edit layer-settings");
            break;
        case 5: //share-settings
            Ext.toast("Edit share-settings");
            break;
        case 6: // shwo preview
            window.open('/momo/client?id=' + record.get('id'));
            break;
        default:
            return;
        }
    }

});
