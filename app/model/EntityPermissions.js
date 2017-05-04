Ext.define('MoMo.admin.model.EntityPermissions', {
    extend: 'MoMo.admin.model.Base',


    idProperty: 'extId',

    fields: [{
        name: 'extId',
        type: 'auto',
        persist: false
    }, {
        name: 'permissions',
        type: 'auto'
    }, {
        name: 'targetEntity',
        type: 'auto'
    }, {
        name: 'PERMISSION_READ',
        type: 'boolean',
        mapping: function (record) {
            var permissions = record.permissions;
            if (!permissions) {
                return false;
            }
            if (permissions.permissions.indexOf("READ") > -1 ||
                permissions.permissions.indexOf("ADMIN") > -1) {
                return true;
            }
            return false;
        }
    }, {
        name: 'PERMISSION_UPDATE',
        type: 'boolean',
        mapping: function(record) {
            var permissions = record.permissions;
            if (!permissions) {
                return false;
            }
            if (permissions.permissions.indexOf("UPDATE") > -1 ||
                permissions.permissions.indexOf("ADMIN") > -1) {
                return true;
            }
            return false;
        }
    }, {
        name: 'PERMISSION_DELETE',
        type: 'boolean',
        mapping: function(record) {
            var permissions = record.permissions;
            if (!permissions) {
                return false;
            }
            if (permissions.permissions.indexOf("DELETE") > -1 ||
                permissions.permissions.indexOf("ADMIN") > -1) {
                return true;
            }
            return false;
        }
    }]

});
