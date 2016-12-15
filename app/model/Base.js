Ext.define('MoMo.admin.model.Base', {
    extend: 'Ext.data.Model',

    requires: [
        'Ext.data.proxy.Rest',

        'BasiGX.util.Url',
        'BasiGX.util.CSRF'
    ],

    fields: [{
        name: 'id',
        type: 'int',
        allowNull: true
    }],

    schema: {
        namespace: 'MoMo.admin.model'
    }

});
