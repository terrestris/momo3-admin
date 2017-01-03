Ext.define('MoMo.admin.view.grid.LayerTreeController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.momo-layertree',

    requires: [
        'Ext.menu.Menu',
        'Ext.menu.Item'
    ],

    statics: {
        LAYER_TREE_LEAF_CLASS: 'de.terrestris.momo.model.tree.LayerTreeLeaf',
        LAYER_TREE_FOLDER_CLASS: 'de.terrestris.momo.model.tree.LayerTreeFolder'
    },

    /**
     *
     */
    loadStoreData: function() {
        var me = this;
        var view = me.getView();
        var treeConfigId = view.getTreeConfigId();
        var store = view.getStore();

        view.setLoading(true);

        // We're in create mode
        if (!treeConfigId) {
            // We don't track any removed node in create mode, otherwise not
            // yet persisted records are attempted to be deleted via REST
            // TODO: I'm not sure if this solution is correct as soon as we've
            // implemented the edit mode. It might be a problem then to have
            // only one single store that will be reused in these two modes
            store.setTrackRemoved(false);
            me.requestAndSetDefaultRootNode();
        } else {
            store.setTrackRemoved(true);
            // TODO: Set ID via view.setTreeConfigId() if we're in application
            // edit mode otherwise we'll never reach this block
            MoMo.admin.model.LayerTreeNode.load(treeConfigId, {
                success: function(record) {
                    store.setRoot(record);
                    view.setLoading(false);
                }
            });
        }
    },

    /**
     *
     */
    syncTreeStore: function(cbFn, cbScope) {
        var me = this;
        var view = me.getView();
        var store = view.getStore();

        store.sync({
            success: function(batch) {
                var operations = batch.getOperations();
                var treeConfigId;

                // Iterate all operations and find the written root node record
                Ext.each(operations, function(operation) {
                    if (treeConfigId) {
                        return false;
                    }
                    Ext.each(operation.getRecords(), function(record) {
                        if (record.isRoot()) {
                            treeConfigId = record.get('id');
                            return false;
                        }
                    });
                });

                // TODO: reload store with id?
                view.setTreeConfigId(treeConfigId);

                cbFn.call(cbScope, [treeConfigId]);
            }
        });
    },

    /**
     * Removes any existing context menu.
     */
    removeExistingContextMenus: function() {
        var menus = Ext.ComponentQuery.query(
                'menu[name=layer-tree-context-menu]');

        Ext.each(menus, function(menu) {
            menu.destroy();
        });
    },

    /**
     *
     */
    onItemContextMenu: function(view, rec, item, index, evt) {
        var me = this;

        // Prevent the standard browser context menu
        evt.preventDefault();

        me.removeExistingContextMenus();

        var contextMenu = Ext.create(me.createItemContextMenuConf(rec));

        contextMenu.showAt(evt.pageX, evt.pageY);
    },

    /**
     *
     */
    onContainerContextMenu: function(view, evt) {
        var me = this;

        // Prevent the standard browser context menu
        evt.preventDefault();

        me.removeExistingContextMenus();

        var contextMenu = Ext.create(me.createContainerContextMenuConf());

        contextMenu.showAt(evt.pageX, evt.pageY);
    },

    /**
     *
     * @param {Ext.data.Model} record Clicked record
     * @return contextMenuConf
     */
    createItemContextMenuConf: function(record) {
        var me = this;
        var viewModel = me.getViewModel();
        var contextMenuConf;

        contextMenuConf = {
            xtype: 'menu',
            plain: true,
            name: 'layer-tree-context-menu',
            record: record,
            items: [{
                xtype: 'menuitem',
                bind: {
                    text: viewModel.get('addTreeFolderMenuText')
                },
                handler: me.addTreeRecord,
                hidden: record.get('leaf'),
                scope: me
            }, {
                xtype: 'menuitem',
                bind: {
                    text: record.get('leaf') ?
                            viewModel.get('deleteTreeLeafMenuText') :
                            viewModel.get('deleteTreeFolderMenuText')
                },
                handler: me.deleteTreeRecord,
                scope: me
            }, {
                xtype: 'menuitem',
                bind: {
                    text: record.get('leaf') ?
                            viewModel.get('renameTreeLeafMenuText') :
                            viewModel.get('renameTreeFolderMenuText')
                },
                handler: me.renameTreeRecord,
                scope: me
            }]
        };

        return contextMenuConf;
    },

    /**
     *
     */
    createContainerContextMenuConf: function() {
        var me = this;
        var viewModel = me.getViewModel();
        var contextMenuConf;

        contextMenuConf = {
            xtype: 'menu',
            plain: true,
            name: 'layer-tree-context-menu',
            items: [{
                xtype: 'menuitem',
                bind: {
                    text: viewModel.get('addTreeFolderTopLevelMenuText')
                },
                handler: me.addTreeRecord,
                scope: me
            }, {
                xtype: 'menuitem',
                bind: {
                    text: viewModel.get('deleteAllTreeFoldersMenuText')
                },
                handler: me.deleteAllTreeRecords,
                scope: me
            }]
        };

        return contextMenuConf;
    },

    /**
     *
     */
    addTreeRecord: function(item) {
        var me = this;
        var viewModel = me.getViewModel();
        var record = item.up('menu').record || me.getView().getRootNode();

        Ext.Msg.prompt(
            viewModel.get('addTreeFolderWindowTitle'),
            viewModel.get('addTreeFolderWindowMsg'),
            function(btn, text) {
                if (btn === 'ok' && !Ext.isEmpty(text)) {
                    record.appendChild({
                        '@class': me.self.LAYER_TREE_FOLDER_CLASS,
                        text: text,
                        leaf: false,
                        checked: true,
                        expandable: true
                    });
                }
            }
        );
    },

    /**
     *
     */
    deleteTreeRecord: function(item) {
        var me = this;
        var viewModel = me.getViewModel();
        var record = item.up('menu').record;

        Ext.Msg.confirm(
            record.get('leaf') ?
                    viewModel.get('deleteTreeLeafWindowTitle') :
                    viewModel.get('deleteTreeFolderWindowTitle'),
            record.get('leaf') ?
                    Ext.String.format(
                            viewModel.get('deleteTreeLeafWindowMsg'),
                            record.get('text')) :
                    Ext.String.format(
                            viewModel.get('deleteTreeFolderWindowMsg'),
                            record.get('text')),
            function (btn) {
                if (btn === 'yes') {
                    record.remove();
                }
            }
        );
    },

    /**
     *
     */
    renameTreeRecord: function(item) {
        var me = this;
        var viewModel = me.getViewModel();
        var record = item.up('menu').record;

        Ext.Msg.prompt(
            record.get('leaf') ?
                    viewModel.get('renameTreeLeafWindowTitle') :
                        viewModel.get('renameTreeFolderWindowTitle'),
            record.get('leaf') ?
                    Ext.String.format(
                            viewModel.get('renameTreeLeafWindowMsg'),
                            record.get('text')) :
                    Ext.String.format(
                            viewModel.get('renameTreeFolderWindowMsg'),
                            record.get('text')),
            function(btn, text) {
                if (btn === 'ok' && !Ext.isEmpty(text)) {
                    record.set('text', text);
                }
            }
        );
    },

    /**
     *
     */
    deleteAllTreeRecords: function() {
        var me = this;
        var viewModel = me.getViewModel();
        var rootNode = me.getView().getRootNode();

        Ext.Msg.confirm(
            viewModel.get('deleteAllTreeFoldersWindowText'),
            viewModel.get('deleteAllTreeFoldersWindowMsg'),
            function (btn) {
                if (btn === 'yes') {
                    rootNode.removeAll();
                }
            }
        );
    },

    /**
     *
     */
    requestAndSetDefaultRootNode: function() {
        var me = this;
        var view = me.getView();
        var defaultLayerName = view.getDefaultTreeLayerName();

        Ext.Ajax.request({
            method: 'GET',
            url: MoMo.admin.model.Layer.getProxy().getUrl() + '/filter',
            params: {
                name: defaultLayerName
            },
            success: me.onRequestDefaultLayerSuccess,
            failure: me.onRequestDefaultLayerFailure,
            scope: me
        });
    },

    /**
     *
     */
    onRequestDefaultLayerSuccess: function(response, conf) {
        var me = this;
        var view = me.getView();
        var defaultLayer;

        view.setLoading(false);

        if (response && response.responseText) {
            try {
                defaultLayer = Ext.decode(arguments[0].responseText)[0];

                if (!defaultLayer) {
                    Ext.Logger.warn(Ext.String.format('Could not find the ' +
                            'default layer named {0}. The default layer tree ' +
                            'may not work as expected.', conf.params.name));
                    return false;
                }
            } catch(err) {
                Ext.Logger.error('Error while reading defaultLayer response: ',
                        err);
                return false;
            }
        }

        var defaultLayerTreeNodeConf =
            me.getDefaultLayerTreeNodeConfig(defaultLayer);

        me.setDefaultLayerTreeNode(defaultLayerTreeNodeConf);
    },

    /**
     *
     */
    onRequestDefaultLayerFailure: function(response) {
        var errorMsg;

        if (response && response.responseText) {
            errorMsg = response.responseText;
        }

        Ext.Logger.error('Error while requesting defaultLayer response: ',
                errorMsg);
    },

    /**
     *
     */
    getDefaultLayerTreeNodeConfig: function(defaultLayer) {
        var me = this;
        var view = me.getView();
        var clazz = me.self;

        var defaultLayerTreeNodeConf = {
            '@class': clazz.LAYER_TREE_FOLDER_CLASS,
            index: 0,
            root: true,
            leaf: false,
            // The root node should always checked, otherwise it wont be
            // set as visible in the gis client context parser
            checked: true,
            expandable: true,
            expanded: true,
            children: [{
                '@class': clazz.LAYER_TREE_FOLDER_CLASS,
                text: view.getDefaultTreeFolderName(),
                index: 1,
                root: false,
                leaf: false,
                checked: true,
                expandable: true,
                expanded: true,
                children: [{
                    '@class': clazz.LAYER_TREE_LEAF_CLASS,
                    text: defaultLayer.name,
                    index: 0,
                    leaf: true,
                    checked: true,
                    layer: defaultLayer.id
                }]
            }]
        };

        return defaultLayerTreeNodeConf;
    },

    /**
     *
     */
    setDefaultLayerTreeNode: function(defaultLayerTreeNodeConf) {
        var me = this;
        var view = me.getView();
        var store = view.getStore();
        var layerTreeNode;

        layerTreeNode = Ext.create('MoMo.admin.model.LayerTreeNode',
                defaultLayerTreeNodeConf);

        store.setRoot(layerTreeNode);
    },

    /**
     *
     */
    onBeforeDrop: function(node, data, overModel, dropPosition, dropHandlers) {
        var me = this;
        var clazz = me.self;
        var dropRecords = [];

        Ext.each(data.records, function(record) {
            if (!(record instanceof MoMo.admin.model.LayerTreeNode)) {
                var treeRecord = Ext.create('MoMo.admin.model.LayerTreeNode', {
                    '@class': clazz.LAYER_TREE_LEAF_CLASS,
                    text: record.get('name'),
                    index: 0,
                    leaf: true,
                    checked: false,
                    layer: record.get('id')
                });

                dropRecords.push(treeRecord);
            } else {
                dropRecords.push(record);
            }
        });

        data.records = dropRecords;

        dropHandlers.processDrop();
    }

});
