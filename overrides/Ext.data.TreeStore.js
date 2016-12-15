Ext.define('MoMo.overrides.Ext.data.TreeStore', {
    override: 'Ext.data.TreeStore',
    requires: [
        'Ext.data.TreeStore'
    ],

    /**
     * If syncRootNode is set to true, we'll sync the root node as well.
     */
    syncRootNode: false,

    filterNew: function(item) {
        return (this.syncRootNode || !item.get('root')) &&
                Ext.data.TreeStore.superclass.filterNew.apply(this, arguments);
    }
});
