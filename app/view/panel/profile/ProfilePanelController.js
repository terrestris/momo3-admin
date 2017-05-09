Ext.define('MoMo.admin.view.panel.ProfilePanelController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.momo-profilepanel',

    onDeleteClick: function() {
        var me = this;
        var view = this.getView();
        var viewModel = view.getViewModel();
        var userId = viewModel.get('user').id;

        Ext.Msg.show({
            title: viewModel.get('i18n.profilepanelDeleteUser'),
            message: viewModel.get('i18n.profilepanelDeleteUserText'),
            buttons: Ext.Msg.YESNO,
            icon: Ext.Msg.QUESTION,
            fn: function(btn) {
                if (btn === 'yes') {
                    view.setLoading(true);
                    Ext.Ajax.request({
                        url: BasiGX.util.Url.getWebProjectBaseUrl() +
                            'momousers/delete.action?id=' + userId,
                        method: "POST",
                        defaultHeaders: BasiGX.util.CSRF.getHeader(),
                        scope: this,
                        callback: function(self, success, response) {
                            view.setLoading(false);
                            if (success) {
                                try {
                                    var res = Ext.decode(response.responseText);
                                    if (res.success) {
                                        Ext.Msg.alert(
                                            viewModel.get(
                                                'i18n.profilepanelAction' +
                                                'Success'),
                                            viewModel.get(
                                                'i18n.profilepanelDeletion' +
                                                'SuccessText'),
                                            function() {
                                                me.doLogout();
                                            }
                                        );
                                    } else {
                                        Ext.Msg.alert(
                                            viewModel.get(
                                                'i18n.profilepanelAction' +
                                                'Failure'),
                                            viewModel.get(
                                                'i18n.profilepanelDeletion' +
                                                'FailureText')
                                        );
                                    }
                                } catch (e) {
                                    Ext.Msg.alert(
                                        viewModel.get(
                                            'i18n.profilepanelActionFailure'),
                                        viewModel.get(
                                            'i18n.profilepanelDeletion' +
                                            'FailureText')
                                    );
                                }
                            } else {
                                Ext.Msg.alert(
                                    viewModel.get(
                                        'i18n.profilepanelActionFailure'),
                                    viewModel.get(
                                        'i18n.profilepanelDeletionFailureText')
                                );
                            }
                        }
                    });
                }
            }
        });
    },

    /**
     *
     */
    doLogout: function() {
        Ext.Ajax.request({
            url: BasiGX.util.Url.getWebProjectBaseUrl() + 'logout',
            method: "POST",
            headers: BasiGX.util.CSRF.getHeader(),
            callback: function() {
                location.href = BasiGX.util.Url
                    .getWebProjectBaseUrl() + "login/";
            }
        });
    },

    /**
     *
     */
    onSaveClick: function() {
        var me = this;
        var view = me.getView();
        var viewModel = view.getViewModel();
        var userId = viewModel.get('user').id;
        var values = view.getForm().getValues();
        var grid = view.down('momo-userpermissiongrid');
        var modifiedRecs = grid.getStore().getModifiedRecords();
        values.permissions = {};
        values.userId = userId;
        // read out the permissions per group
        Ext.each(modifiedRecs, function(rec) {
            // only handle this rec if it has been changed
            if (rec.dirty) {
                var wantedRole;
                if (rec.data.subadminpermissionactive) {
                    wantedRole = 'ROLE_SUBADMIN';
                } else if (rec.data.editorpermissionactive) {
                    wantedRole = 'ROLE_EDITOR';
                } else if (rec.data.userpermissionactive) {
                    wantedRole = 'ROLE_USER';
                } else {
                    // user decided to do not have any rights in the group
                    // anymore. this is a special case, where we need to handle
                    // or remove its group membership in the backend
                    wantedRole = 'REMOVE';
                }
                values.permissions[rec.data.groupid] = wantedRole;
            }
        });
        values.profileImage = me.getView().down('image[name=avatar]').getSrc();

        view.setLoading(true);

        Ext.Ajax.request({
            url: BasiGX.util.Url.getWebProjectBaseUrl() +
                'momousers/update.action',
            method: "POST",
            jsonData: values,
            defaultHeaders: BasiGX.util.CSRF.getHeader(),
            scope: me,
            callback: function(self, success, response) {
                view.setLoading(false);
                if (success) {
                    var permissionGrid = view.down('momo-userpermissiongrid');
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
                                viewModel.get('i18n.profilepanelActionSuccess'),
                                viewModel.get(
                                        'i18n.profilepanelUpdateSuccessText')
                            );
                        } else {
                            Ext.Msg.alert(
                                viewModel.get(
                                    'i18n.profilepanelActionFailure'),
                                viewModel.get(
                                    'i18n.profilepanelUpdateFailureText')
                            );
                        }
                    } catch (e) {
                        Ext.Msg.alert(
                            viewModel.get(
                                'i18n.profilepanelActionFailure'),
                            viewModel.get(
                                'i18n.profilepanelUpdateFailureText')
                        );
                    }
                } else {
                    Ext.Msg.alert(
                        viewModel.get(
                            'i18n.profilepanelActionFailure'),
                        viewModel.get(
                                'i18n.profilepanelUpdateFailureText')
                    );
                }
            }
        });
    },

    showGraphicPool: function() {
        var me = this;
        var backendUrls = {
            pictureList: {
                url: 'rest/images',
                method: 'GET'
            },
            pictureSrc: {
                url: 'momoimage/getThumbnail.action?id='
            },
            pictureUpload: {
                url: 'momoimage/upload.action?'
            },
            graphicDelete: {
                url: 'rest/images/',
                method: 'DELETE'
            }
        };

        var okClickCallbackFn = function(pictureRec) {
            var pictureUrl = BasiGX.util.Url.getWebProjectBaseUrl() +
            backendUrls.pictureSrc.url +
                pictureRec.get('id');
            me.getView().down('image[name=avatar]').setSrc(pictureUrl);
        };

        var deleteClickCallbackFn = function() {
        };

        var graphicPool = Ext.create('BasiGX.view.panel.GraphicPool', {
            backendUrls: backendUrls,
            okClickCallbackFn: okClickCallbackFn,
            deleteClickCallbackFn: deleteClickCallbackFn,
            useCsrfToken: true
        });

        var graphicPoolWin = Ext.create('Ext.window.Window', {
            title: me.getViewModel().get('graphicPoolWindowTitle'),
            constrained: true,
            items: [graphicPool]
        });
        graphicPoolWin.show();
    }

});
