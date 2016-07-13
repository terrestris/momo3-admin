Ext.define('MoMo.admin.model.Extent', {
    extend: 'MoMo.admin.model.Base',

    proxy: {
        type: 'rest',
        url: BasiGX.util.Url.getWebProjectBaseUrl() + 'rest/extents',
        headers: BasiGX.util.CSRF.getHeader()
    },

    fields: [{
        name: 'lowerLeft',
        type: 'auto'
    }, {
        name: 'upperRight',
        type: 'auto'
    }]
});
