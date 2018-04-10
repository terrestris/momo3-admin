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
                case 'layer-download-column':
                    column.setVisible(view.getShowLayerDownloadColumn());
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
        var viewModel = view.lookupViewModel();
        BasiGX.confirm(viewModel.get('i18n.layerDeleteConfirmation'), {
            title: viewModel.get('i18n.layerDeleteConfirmationTitle'),
            fn: function(answer) {
                if (answer === 'yes') {
                    me.deleteLayer();
                }
            },
            scope: me
        });
    },

    deleteLayer: function() {
        var me = this;
        var view = me.getView();
        var selection = view.getSelectionModel().getSelection();
        var viewModel = me.getViewModel();
        var deletionErrorMsgTitle = viewModel.get('deletionErrorMsgTitle');
        var deletionErrorMsgText = viewModel.get('deletionErrorMsgText');
        var deletionMsgTemplate = viewModel.get('deletionMsgTemplate');
        var unsuccessfulDeletionMsgTemplate = viewModel.
            get('unsuccessfulDeletionMsgTemplate');

        if (selection.length < 1) {
            Ext.Msg.alert(deletionErrorMsgTitle,deletionErrorMsgText);
            return;
        }
        Ext.each(selection, function(rec) {
            view.setLoading(true);
            Ext.Ajax.request({
                url: BasiGX.util.Url.getWebProjectBaseUrl() +
                    'rest/momolayers/' + rec.getId(),
                method: 'DELETE',
                defaultHeaders: BasiGX.util.CSRF.getHeader(),
                callback: function(operation, success) {
                    view.setLoading(false);
                    view.getStore().load();
                    if (success) {
                        Ext.toast(Ext.String.format(deletionMsgTemplate,
                            rec.get('name')));
                    } else {
                        Ext.toast(
                          Ext.String.format(unsuccessfulDeletionMsgTemplate,
                            rec.get('name')
                          )
                        );
                        return false;
                    }
                }
            });
        });
    },

    handleCellClick: function(gridview, td, cellIndex, record){
        var clickedColumn = this.getView().getColumns()[cellIndex];
        switch(clickedColumn.name) {
            case 'layer-settings-column':
                this.redirectTo('layers/createOrEdit/' + record.get('id'));
                Ext.toast("Edit general-settings");
                break;
            case 'layer-style-column':
                Ext.toast("Edit style-settings");
                break;
            case 'layer-download-column':
                this.downloadLayerdata([record.get('id')]);
                break;
            case 'layer-preview-column':
                this.showLayerPreview(record);
                break;
            default:
                return;
        }
    },

    downloadLayerdata: function(layerIdArray){
        var me = this,
            viewModel = me.getViewModel(),
            downloadStartingMsg = viewModel.get('downloadStartingMsg'),
            downloadFailureMsg = viewModel.get('downloadFailureMsg');

        if (layerIdArray) {
            Ext.toast(downloadStartingMsg);
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
            Ext.toast(downloadFailureMsg);
        }
    },

    showLayerPreview: function(record) {
        var me = this;
        if(Ext.isNumber(record.get('id'))){
            var previewWindow = me.getView().previewWindow;
            var previewMap = previewWindow.down('gx_component_map').getMap();
            var previewTemplate = me.getViewModel().get('previewTemplate');

            Ext.Ajax.request({
                url: BasiGX.util.Url.getWebProjectBaseUrl() +
                    'rest/layers/' + record.get('id'),
                success: function(response) {
                    var title = Ext.String.format(previewTemplate,
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
                },
                scope: me
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
