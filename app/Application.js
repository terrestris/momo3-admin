/**
 * The main application class. An instance of this class is created by app.js
 * when it calls Ext.application(). This is the ideal place to handle
 * application launch and initialization details.
 */
Ext.define('MoMo.admin.Application', {
    extend: 'Ext.app.Application',

    name: 'MoMo.admin',

    stores: [
        'NavigationTree',
        'Application',
        'Layout',
        'ApplicationLayout',
        'AvailableModules',
        'Language',
        'MapProjection'
    ],

    launch: function () {
        var loadMask = document.getElementById("loadmask");
        if (loadMask) {
            loadMask.parentNode.removeChild(loadMask);
        }
    },

    onAppUpdate: function () {
        Ext.Msg.confirm(
            'Application Update',
            'This application has an update, reload?',
            function (choice) {
                if (choice === 'yes') {
                    window.location.reload();
                }
            }
        );
    }
});
