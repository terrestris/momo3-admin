Ext.define('MoMo.admin.view.grid.LayerListController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.momo-layerlist',

    /**
     *
     */
    setComponentsVisibility: function(panel) {
        var me = this;
        var view = me.getView();

        panel.down('button[name=create-layer-button]').setVisible(
                view.getShowCreateButton());
        panel.down('button[name=copy-layer-button]').setVisible(
                view.getShowCopyButton());
        panel.down('button[name=delete-layer-button]').setVisible(
                view.getShowDeleteButton());
        panel.down('textfield[name=filter-layer-list-field]').setVisible(
                view.getShowFilterField());

        Ext.each(panel.getColumns(), function(column) {
            switch(column.name) {
                case 'layer-settings-column':
                    column.setVisible(view.getShowLayerSettingsColumn());
                    break;
                case 'layer-style-column':
                    column.setVisible(view.getShowLayerStyleColumn());
                    break;
                case 'layer-metadata-column':
                    column.setVisible(view.getShowLayerMetadataColumn());
                    break;
                case 'layer-preview-column':
                    column.setVisible(view.getShowLayerPreviewColumn());
                    break;
                default:
                    break;
            }
        });

    },

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
        this.redirectTo('layers/createOrEdit');
    },

    onCopyClick: function() {
        Ext.toast("Copy layer");
    },

    onDeleteClick: function() {
        var me = this;
        var view = me.getView();
        view.setLoading(true);
        var selection = view.getSelectionModel().getSelection();
        Ext.each(selection, function(rec) {
            rec.erase({
                callback: function(record,operation,success) {
                    view.setLoading(false);
                    view.getStore().load();
                    if (success) {
                        Ext.toast("Layer " + rec.get('name') + " deleted.");
                    } else {
                        Ext.toast("Layer " + rec.get('name') +
                            " could not be deleted.");
                        return false;
                    }
                }
            });
        });
    },

    handleCellClick: function(gridview, td, cellIndex, record){
        switch(cellIndex) {
            case 2:
                this.redirectTo('layers/createOrEdit/' + record.get('id'));
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
