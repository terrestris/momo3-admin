Ext.define('MoMo.admin.view.tree.LayerTree',{
    extend: 'Ext.tree.Panel',

    xtype: 'momo-layertree',

    requires: [
        'MoMo.admin.view.grid.LayerTreeController',
        'MoMo.admin.view.grid.LayerTreeModel',

        'MoMo.admin.store.LayerTree'
    ],

    controller: 'momo-layertree',

    viewModel: {
        type: 'momo-layertree'
    },

    store: 'momo-layertree',

    bind: {
        title: '{title}'
    },

    viewConfig: {
        plugins: {
            ptype: 'treeviewdragdrop',
            ddGroup: 'layertree-dd-group',
            allowContainerDrops: true,
            containerScroll: true
        }
    },

    config: {
        /**
         * The ID of the current layertree. Only useful if we're in edit mode.
         */
        treeConfigId: null,

        /**
         * The default treefolder name if we're in create mode.
         */
        defaultTreeFolderName: 'Hintergrundlayer',

        /**
         * The name (this is the name of the de.terrestris.momo.model.MomoLayer
         * entity) of the default layer if we're in create mode.
         */
        defaultTreeLayerName: 'OSM-WMS GRAY'
    },

    rootVisible: false,

    hideHeaders: true,

    selModel: {
        selType: 'rowmodel',
        mode: 'MULTI'
    },

    listeners: {
//        afterrender: 'loadStoreData',
        itemcontextmenu: 'onItemContextMenu',
        containercontextmenu: 'onContainerContextMenu',
        beforedrop: 'onBeforeDrop'
    }

});
