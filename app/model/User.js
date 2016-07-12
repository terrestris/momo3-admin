Ext.define('MoMo.admin.model.User', {

    extend: 'MoMo.admin.model.Base',

    proxy: {
        type: 'rest',
        url: BasiGX.util.Url.getWebProjectBaseUrl() + 'rest/users',
        headers: BasiGX.util.CSRF.getHeader()
    },

    fields: [{
        name: 'accountName',
        type: 'string'
    }, {
        name: 'active',
        type: 'boolean'
    }, {
        name: 'birthday',
        type: 'date'
    }, {
        name: 'email',
        type: 'string'
    }, {
        name: 'password',
        type: 'string'
    }, {
        name: 'firstName',
        type: 'string'
    }, {
        name: 'fullName',
        type: 'string',
        calculate: function(data){
            return data.firstName + ' ' + data.lastName;
        },
        depends: [ 'firstName', 'lastName' ],
        persist: false
    }, {
        name: 'language',
        type: 'string'
    }, {
        name: 'lastName',
        type: 'string'
    }, {
        name: 'profileLogoKey',
        type: 'string'
    }, {
        name: 'profileLogoSrc',
        type: 'string',
        calculate: function(data){
            var key = data.profileLogoKey;
            if(key){
                return BasiGX.util.Url.getWebProjectBaseUrl() +
                    "image/getThumbnail.action?id=" + key;
            }
            return "resources/images/MapMavin_Logo_green_white.svg";
        },
        depends: ['profileLogoKey'],
        persist: false
    }, {
        name: 'roles',
        type: 'auto'
    }, {
        name: 'mainRole',
        type: 'auto',
        mapping: function(data) {
            if(data.roles && data.roles[0]){
                return data.roles[0].name;
            } else {
                return null;
            }
        }
    }]
});

