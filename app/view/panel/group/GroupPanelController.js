Ext.define('MoMo.admin.view.panel.GroupPanelController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.momo-grouppanel',

    /**
     *
     */
    reloadData: function() {
        var permissionGrid = this.getView().down('momo-grouppermissiongrid');
        permissionGrid.getController().loadData();
    },

    /**
     *
     */
    onSaveClick: function() {
        var me = this;
        var view = me.getView();
        var viewModel = view.getViewModel();
        var grid = view.down('momo-grouppermissiongrid');
        var modifiedRecs = grid.getStore().getModifiedRecords();
        var permissions = [];
//        // read out the permissions per group
        Ext.each(modifiedRecs, function(rec) {
            // only handle this rec if it has been changed and is not the
            // empty group
            if (rec.dirty && rec.get('groupid') !== -1) {
                var wantedRole;
                if (rec.data.subadminpermissionactive) {
                    wantedRole = 'ROLE_SUBADMIN';
                } else if (rec.data.editorpermissionactive) {
                    wantedRole = 'ROLE_EDITOR';
                } else if (rec.data.userpermissionactive) {
                    wantedRole = 'ROLE_USER';
                } else {
                    // user should have no more rights in the group
                    // anymore. this is a special case, where we need to handle
                    // or remove its group membership in the backend
                    wantedRole = 'REMOVE';
                }

                var userGroupRole = {
                    id: rec.get('id'),
                    user: rec.get('userid'),
                    group: rec.get('groupid'),
                    role: wantedRole
                };
                permissions.push(userGroupRole);
            }
        });

        view.setLoading(true);

        Ext.Ajax.request({
            url: BasiGX.util.Url.getWebProjectBaseUrl() +
                'momousergrouproles/update.action',
            method: "POST",
            jsonData: permissions,
            defaultHeaders: BasiGX.util.CSRF.getHeader(),
            scope: me,
            callback: function(self, success, response) {
                view.setLoading(false);
                if (success) {
                    var permissionGrid = view.down('momo-grouppermissiongrid');
                    // reload the grid to reset dirty marks and show the
                    // correct (current) group / role state
                    permissionGrid.getController().loadData();
                    try {
                        var res = Ext.decode(response.responseText);
                        if (res.success) {
                            // update the main viewmodels user data,
                            // reconfigures visibility of components
                            // due to roles
                            var mainView = Ext.ComponentQuery.query(
                                'momo-mainviewport')[0];
                            mainView.getController().getUserBySession();

                            Ext.Msg.alert(
                                viewModel.get('i18n.grouppanelActionSuccess'),
                                viewModel.get(
                                        'i18n.grouppanelUpdateSuccessText')
                            );
                        } else {
                            Ext.Msg.alert(
                                viewModel.get(
                                    'i18n.grouppanelActionFailure'),
                                viewModel.get(
                                    'i18n.grouppanelUpdateFailureText')
                            );
                        }
                    } catch (e) {
                        Ext.Msg.alert(
                            viewModel.get(
                                'i18n.grouppanelActionFailure'),
                            viewModel.get(
                                'i18n.grouppanelUpdateFailureText')
                        );
                    }
                } else {
                    Ext.Msg.alert(
                        viewModel.get(
                            'i18n.grouppanelActionFailure'),
                        viewModel.get(
                                'i18n.grouppanelUpdateFailureText')
                    );
                }
            }
        });
    }
});
