Ext.define('MoMo.admin.view.panel.ProfilePanelController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.momo-profilepanel',

    onDeleteClick: function() {
        var me = this;
        var view = this.getView();
        var viewModel = view.getViewModel();
        var userId = viewModel.get('user').id;

        Ext.Msg.show({
            title: viewModel.get('deleteUser'),
            message: viewModel.get('deleteUserText'),
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
                                            viewModel.get('actionSuccess'),
                                            viewModel.get(
                                                'deletionSuccessText'),
                                            function() {
                                                me.doLogout();
                                            }
                                        );
                                    } else {
                                        Ext.Msg.alert(
                                            viewModel.get('actionFailure'),
                                            viewModel.get('deletionFailureText')
                                        );
                                    }
                                } catch (e) {
                                    Ext.Msg.alert(
                                        viewModel.get('actionFailure'),
                                        viewModel.get('deletionFailureText')
                                    );
                                }
                            } else {
                                Ext.Msg.alert(
                                    viewModel.get('actionFailure'),
                                    viewModel.get('deletionFailureText')
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
        var values = view.getForm().getValues();
        var grid = view.down('momo-userpermissiongrid');
        var modifiedRecs = grid.getStore().getModifiedRecords();
        values.permissions = {};
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
                            Ext.Msg.alert(
                                viewModel.get('actionSuccess'),
                                viewModel.get('updateSuccessText')
                            );
                        } else {
                            Ext.Msg.alert(
                                viewModel.get('actionFailure'),
                                viewModel.get('updateFailureText')
                            );
                        }
                    } catch (e) {
                        Ext.Msg.alert(
                            viewModel.get('actionFailure'),
                            viewModel.get('updateFailureText')
                        );
                    }
                } else {
                    Ext.Msg.alert(
                        viewModel.get('actionFailure'),
                        viewModel.get('updateFailureText')
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
                url: 'image/upload.action?'
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
