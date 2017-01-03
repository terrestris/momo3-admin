Ext.define('MoMo.admin.view.grid.LayerListController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.momo-layerlist',

    requires: [
        'MoMo.admin.util.LayerParser'
    ],

    /**
     *
     */
    setComponentsVisibility: function(panel) {
        var me = this;
        var view = me.getView();

        panel.down('button[name=create-layer-button]').setVisible(
                view.getShowCreateButton());
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
                this.downloadLayerdata([record.get('id')]);
                break;
            case 5:
                this.showLayerPreview(record);
                break;
            default:
                return;
        }
    },

    downloadLayerdata: function(layerIdArray){
        if (layerIdArray) {
            Ext.toast('Download will start shortly, please wait...');
            var form = Ext.DomHelper.append(document.body, {
                tag : 'form',
                method : 'post',
                children: [{
                    tag: 'input',
                    type:'hidden',
                    name: '_csrf',
                    value: BasiGX.util.CSRF.getValue()
                },{
                    tag: 'input',
                    type:'hidden',
                    name: 'layerIds',
                    value: layerIdArray.toString()
                }],
                action : BasiGX.util.Url.getWebProjectBaseUrl() +
                    'momolayers/download.action'
            });
            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
        } else {
            Ext.toast('Could not download Layerdata!');
        }
    },

    showLayerPreview: function(record) {
        var me = this;
        if(Ext.isNumber(record.get('id'))){
            var previewWindow = this.getView().previewWindow;
            var previewMap = previewWindow.down('gx_component_map').getMap();

            Ext.Ajax.request({
                url: BasiGX.util.Url.getWebProjectBaseUrl() +
                    'rest/layers/' + record.get('id'),
                success: function(response) {
                    var title = Ext.String.format('Preview of "{0}"',
                            record.get('name'));
                    var obj = Ext.decode(response.responseText);
                    var layer = MoMo.admin.util.LayerParser.
                            createOlLayer(obj);

                    var dataExtentUrl = BasiGX.util.Url.getWebProjectBaseUrl() +
                        'momolayers/getLayerExtent.action?layerId=' +
                        record.get('id');

                    previewWindow.setTitle(title);
                    previewWindow.show();
                    previewMap.getLayers().clear();
                    previewMap.addLayer(layer);

                    me.setExtentForLayer(layer, dataExtentUrl, previewMap);
                },
                failure: function(response) {
                    Ext.raise('server-side failure with status code ' +
                        response.status);
                }
            });
        }
    },

        /**
     * Request the layers data extent and set it in the map
     */
    setExtentForLayer: function(layer, dataExtentUrl, previewMap) {
        var defaultBounds = [-17992664, 2837342, -3218916, 6594375];//USA
        Ext.Ajax.request({
            url: dataExtentUrl,
            success: function(response) {
                var obj = Ext.decode(response.responseText);
                if (obj.success && obj.data) {
                    var extent = obj.data.split(",");
                    var minx = parseFloat(extent[0]);
                    var miny = parseFloat(extent[1]);
                    var maxx = parseFloat(extent[2]);
                    var maxy = parseFloat(extent[3]);
                    previewMap.getView().fit([minx, miny, maxx, maxy],
                        previewMap.getSize());
                } else {
                    previewMap.getView().fit(defaultBounds,
                        previewMap.getSize());
                }
            },
            failure: function(response) {
                Ext.raise('server-side failure with status code ' +
                    response.status);
                previewMap.getView().fit(defaultBounds, previewMap.getSize());
            }
        });
    }

});
