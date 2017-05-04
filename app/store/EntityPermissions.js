Ext.define('MoMo.admin.store.EntityPermissions', {
    extend: 'Ext.data.Store',

    alias: 'store.entitypermissions',

    model: 'MoMo.admin.model.EntityPermissions',

    proxy: {
        type: 'rest',
        // url gets completed in controller
        url: BasiGX.util.Url.getWebProjectBaseUrl() + 'rest/entitypermission/',
        headers: BasiGX.util.CSRF.getHeader(),
        reader: {
            type: 'json',
            keepRawData: true,
            rootProperty: function(data) {
                if (data.success) {
                    return data.data.permissions;
                }
            }
        }
    }
});
