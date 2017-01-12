Ext.define('MoMo.admin.store.Tools', {
    extend: 'Ext.data.Store',

    alias: 'store.tools',

    proxy: {
        type: 'rest',
        url: BasiGX.util.Url.getWebProjectBaseUrl() + 'rest/modules',
        headers: BasiGX.util.CSRF.getHeader()
    }

});
