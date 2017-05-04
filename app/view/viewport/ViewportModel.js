Ext.define('MoMo.admin.view.viewport.ViewportModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.momo-mainviewport',

    data: {
        currentView: null,
        user: null,
        i18n: {
            logoutTitle: 'Log out',
            logoutMessage: 'Are you sure you want to log out?'
        }
    },
    formulas: {
        profileImage: function() {
            var profileImage;
            if (this.get('user') && this.get('user').getData()) {
                profileImage = this.get('user').getData().profileImage;
            }
            if (!profileImage) {
                profileImage = 'resources/images/emptyUserAvatar.png';
            }
            return profileImage;
        },
        allowCreateOrEditWebmaps: function() {
            var availableRoles = [];
            if (this.get('user') && this.get('user').getData()) {
                availableRoles = this.get('user').getData().groupRoles;
            }
            var isAllowed = false;
            Ext.each(availableRoles, function(role) {
                if (role.indexOf('ROLE_ADMIN') > -1 ||
                    role.indexOf('ROLE_SUBADMIN') > -1) {
                    isAllowed = true;
                }
            });
            return isAllowed;
        }
    }
});
