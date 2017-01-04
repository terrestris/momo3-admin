Ext.define('MoMo.admin.model.Application', {
    extend: 'MoMo.admin.model.Base',

    proxy: {
        type: 'rest',
        url: BasiGX.util.Url.getWebProjectBaseUrl() + 'rest/momoapps',
        headers: BasiGX.util.CSRF.getHeader(),
        writer: {
            type: 'json',
            transform: function(data, request) {
                if(request.getAction() === "create"){
                    delete data.id;
                }
                return data;
            }
        }
    },

    idProperty: 'extId',

    fields: [{
        name: 'extId',
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
