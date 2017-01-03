Ext.define('MoMo.admin.model.Application', {
    extend: 'MoMo.admin.model.Base',

    proxy: {
        type: 'rest',
        url: BasiGX.util.Url.getWebProjectBaseUrl() + 'rest/momoapps',
        headers: BasiGX.util.CSRF.getHeader()
    },

    idProperty: 'clientId',
    clientIdProperty: 'id',

    fields: [{
        name: 'clientId',
        type: 'auto',
        persist: false
    }, {
        name: 'name',
        type: 'string'
    }, {
        name: 'description',
        type: 'string'
    }, {
        name: 'active',
        type: 'boolean'
    }, {
        name: 'open',
        type: 'boolean'
    }, {
        name: 'language',
        type: 'string'
    }, {
        name: 'layerTree',
        type: 'auto'
    }, {
        name: 'url',
        type: 'string',
        calculate: function (data) {
            return BasiGX.util.Url.getWebProjectBaseUrl() +
                'client/?id=' + data.id;
        }
    }]

});
