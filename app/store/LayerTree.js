Ext.define('MoMo.admin.store.LayerTree', {
    extend: 'Ext.data.TreeStore',

    storeId: 'momo-layertree',

    model: 'MoMo.admin.model.LayerTreeNode',

    autoLoad: false,

    /**
     * If syncRootNode is set to true, we'll sync the root node as well. Only
     * useful if the corresponding override in
     * admin/overrides/Ext.data.TreeStore.js is present.
     */
    syncRootNode: true,

    listeners: {
        write: function(store, operation) {
            if (operation.getRequest().getAction() === 'create') {
                var nextRec = store.getNewRecords()[0];

                // If we're in create mode, the real parentId is not
                // known in the client and we have to adjust it to the
                // id returned by the backend. As we persist top down, the
                // parentId should always be present here.
                if (nextRec) {
                    nextRec.set('parentId', nextRec.parentNode.get('id'));
                }
            }
        }
    }
});
