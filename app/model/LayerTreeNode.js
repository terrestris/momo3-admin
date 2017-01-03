Ext.define('MoMo.admin.model.LayerTreeNode', {
    extend: 'Ext.data.TreeModel',
    requires: [
        'Ext.data.proxy.Rest',

        'BasiGX.util.Url',
        'BasiGX.util.CSRF'
    ],

    proxy: {
        type: 'rest',
        url: BasiGX.util.Url.getWebProjectBaseUrl() + 'rest/layertree',
        headers: BasiGX.util.CSRF.getHeader(),
        reader: {
            type: 'json',
            transform: function(data) {
                // this fixes an issue that occured
                // when the drag'n'drop plugin was active, a folder was dropped
                // and the store was synced afterwards (only changing the index)
                if(data.leaf === false) {
                    return [data];
                }
                return data;
            }
        }
    },

    clientIdProperty: 'id',
    idProperty: 'clientId',

    fields: [{
        name: 'clientId',
        type: 'auto',
        persist: false
    }, {
        name: 'id',
        type: 'string',
        allowNull: true
    }, {
        name: '@class',
        type: 'string'
    }, {
        name: 'text',
        type: 'string'
    }, {
        name: 'root',
        type: 'boolean'
    }, {
        name: 'expanded',
        type: 'boolean'
    }, {
        name: 'checked',
        type: 'boolean'
    }, {
        name: 'index',
        type: 'int',
        defaultValue: -1,
        persist: true
    }]

});
