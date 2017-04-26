Ext.define('MoMo.admin.model.Group', {

    extend: 'MoMo.admin.model.Base',
    requires: ['Momo.admin.data.identifier.Null'],
    clientIdProperty: 'clientId',
    identifier: 'null',
    proxy: {
        type: 'rest',
        url: BasiGX.util.Url.getWebProjectBaseUrl() + 'rest/momousergroups',
        headers: BasiGX.util.CSRF.getHeader()
    },

    fields: [{
        name: 'name',
        type: 'string'
    }, {
        name: 'owner',
        type: 'auto'
    }]

});
