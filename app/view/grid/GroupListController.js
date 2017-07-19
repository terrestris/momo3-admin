Ext.define('MoMo.admin.view.grid.GroupListController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.momo-grouplist',

    requires: [
        'BasiGX.util.MsgBox'
    ],

    /**
     *
     */
    loadStore: function() {
        var me = this;
        var view = me.getView();
        var store = view.getStore();
        store.on('load', me.disableUnusableGroups, me, {single: true});
        store.load();
        this.getView().up('momo-grouppanel').fireEvent('groupsreloaded');
    },

    /**
     * disable all groups which can not be edited by current user
     */
    disableUnusableGroups: function(store, recs) {
        var me = this;
        var view = me.getView();
        var viewModel = view.getViewModel();
        var tableView = view.getView();
        var user = viewModel.get('user');
        var userId = user.id;
        var isSuperAdmin = false;
        Ext.each(user.get('groupRoles'), function(role) {
            if (role.indexOf('ROLE_ADMIN') > -1) {
                isSuperAdmin = true;
                return false;
            }
        });
        Ext.each(recs, function(rec) {
            // disable all groups not owned by this user, except superadmin
            // disable the admin user group always, as editing it may lead
            // to undesired behaviour
            if (((rec.get('owner') && rec.get('owner').id !== userId) &&
                    !isSuperAdmin) || rec.get('name') === "Admin User Group") {
                var row = tableView.getRow(rec);
                if (row) {
                    var el = Ext.fly(row);
                    el.mask();
                }
            }
        });
    },

    /**
     *
     */
    onFilterChange: function(filterField) {
        var grid = this.getView(),
            filters = grid.store.getFilters();

        if (filterField.value) {
            this.nameFilter = filters.add({
                id: 'nameFilter',
                property: 'name',
                value: filterField.value,
                anyMatch: true,
                caseSensitive: false
            });
        } else if (this.nameFilter) {
            filters.remove(this.nameFilter);
            this.nameFilter = null;
        }
    },

    /**
     *
     */
    createGroup: function(decision, groupName) {
        var me = this;
        if (decision !== "ok") {
            return;
        }
        var viewModel = me.getView().getViewModel();
        var group = Ext.create('MoMo.admin.model.Group', {
            name: groupName
        });

        group.save({
            callback: function(savedRec, operation, success) {
                if (success) {
                    // update the main viewmodels user data,
                    // reconfigures visibility of components
                    // due to roles
                    var mainView = Ext.ComponentQuery.query(
                        'momo-mainviewport')[0];
                    mainView.getController().getUserBySession();

                    Ext.toast(viewModel.get('i18n.groupCreatedSuccessText'));
                    me.loadStore();
                } else {
                    Ext.toast(viewModel.get('i18n.groupCreatedFailureText'));
                }
            }
        });

    },

    /**
     *
     */
    onCreateClick: function() {
        var me = this;
        var viewModel = me.getView().getViewModel();
        BasiGX.prompt(viewModel.get('i18n.groupCreationText'), {
            title: viewModel.get('i18n.groupCreationTitle'),
            fn: me.createGroup,
            scope: me
        });
    },

    /**
     *
     */
    onModifyClick: function(rec) {
        var me = this;
        var viewModel = me.getView().getViewModel();
        BasiGX.prompt(viewModel.get('i18n.groupModifyText'), {
            title: viewModel.get('i18n.groupModifyTitle'),
            fn: function(decision, groupName) {
                if (decision === "ok") {
                    me.modifyGroup(rec, groupName);
                }
            },
            scope: me
        });
    },

    /**
     *
     */
    modifyGroup: function(groupRec, groupName) {
        var me = this;
        var viewModel = me.getView().getViewModel();
        groupRec.set('name', groupName);
        groupRec.save({
            callback: function(savedRec, operation, success) {
                if (success) {
                    // update the main viewmodels user data,
                    // reconfigures visibility of components
                    // due to roles
                    var mainView = Ext.ComponentQuery.query(
                        'momo-mainviewport')[0];
                    mainView.getController().getUserBySession();

                    Ext.toast(viewModel.get('i18n.groupModifySuccessText'));
                } else {
                    Ext.toast(viewModel.get('i18n.groupModifyFailureText'));
                }
                me.loadStore();
            }
        });
    },

    /**
     *
     */
    setGroupEntry: function() {
        var combo = Ext.ComponentQuery.query('combo[name=groupcombo]')[0];
        combo.setValue(combo.findRecord('name', combo.getValue()));
    },

    /**
     *
     */
    onDeleteClick: function() {
        var me = this;
        var viewModel = me.getView().getViewModel();
        var selection = me.getView().getSelectionModel().getSelection();
        if (selection.length < 1) {
            Ext.toast(viewModel.get('i18n.groupDeletionNoSelectionText'));
        } else {
            BasiGX.confirm(viewModel.get('i18n.groupDeletionText'), {
                title: viewModel.get('i18n.groupDeletionTitle'),
                fn: me.deleteGroup,
                scope: me
            });
        }
    },

    /**
    *
    */
    onAddUserClick: function(group) {
        var me = this;
        var groupName = group.get('name');
        var viewModel = me.getView().getViewModel();
        var win = Ext.create('Ext.window.Window', {
            bodyPadding: 5,
            bind: {
                title: viewModel.get('i18n.groupAddUserTitle')
            },
            width: 400,
            height: 300,
            defaults: {
                width: 350
            },
            items: [{
                xtype: 'displayfield',
                bind: {
                    value: viewModel.get('i18n.groupAddUserText')
                }
            }, {
                xtype: 'combo',
                name: 'groupcombo',
                value: groupName,
                bind: {
                    fieldLabel: viewModel.get(
                        'i18n.groupAddUserSelectGroupTitle'
                    )
                },
                store: {
                    type: 'groups',
                    autoLoad: true,
                    sorters: [{
                        property: 'name',
                        direction: 'ASC'
                    }],
                    listeners: {
                        load: function() {
                            me.setGroupEntry();
                        }
                    },
                    // filter out the admin user group, as it may not be edited
                    filters: [
                        function(item) {
                            return item.get('name') !== "Admin User Group";
                        }
                    ]
                },
                displayField: 'name'
            }, {
                xtype: 'combo',
                name: 'usercombo',
                bind: {
                    fieldLabel: viewModel.get(
                        'i18n.groupAddUserSelectUserTitle'
                    )
                },
                store: {
                    type: 'users',
                    sorters: [{
                        property: 'name',
                        direction: 'ASC'
                    }]
                },
                displayField: 'fullName'
            }, {
                xtype: 'combo',
                name: 'rolecombo',
                bind: {
                    fieldLabel: viewModel.get(
                        'i18n.groupAddUserSelectRoleTitle'
                    )
                },
                store: {
                    type: 'roles',
                    sorters: [{
                        property: 'name',
                        direction: 'ASC'
                    }],
                    filters: [
                        function(item) {
                            return item.get('name') !== 'ROLE_ADMIN';
                        }
                    ]
                },
                displayField: 'name'
            }],
            bbar: ['->', {
                xtype: 'button',
                handler: me.addUserToGroup.bind(this),
                bind: {
                    text: viewModel.get('i18n.groupAddUserSaveBtnText')
                }
            }]
        });
        win.show();
    },

    /**
    *
    */
    cleanupUserGroupRole: function(userGroupRole) {
        // delete the momouser specific properties, as we handle
        // shogun2 users in the backend
        if (userGroupRole.user) {
            delete userGroupRole.user.department;
            delete userGroupRole.user.profileImage;
            delete userGroupRole.user.telephone;
            delete userGroupRole.user.groupRoles;
            delete userGroupRole.user.fullName;
        }
        if (userGroupRole.group && userGroupRole.group.owner) {
            delete userGroupRole.group.owner.department;
            delete userGroupRole.group.owner.profileImage;
            delete userGroupRole.group.owner.telephone;
            delete userGroupRole.group.owner.groupRoles;
            delete userGroupRole.group.owner.fullName;
        }
        return userGroupRole;
    },

    /**
    *
    */
    addUserToGroup: function(btn) {
        var me = this;
        var win = btn.up('window');
        var viewModel = me.getView().getViewModel();
        var usercombo = btn.up('window').down('combo[name=usercombo]');
        var groupcombo = btn.up('window').down('combo[name=groupcombo]');
        var rolecombo = btn.up('window').down('combo[name=rolecombo]');
        var user = usercombo.getSelectedRecord();
        var group = groupcombo.getSelectedRecord();
        var role = rolecombo.getSelectedRecord();
        if (!user || !group || !role) {
            Ext.toast(viewModel.get('i18n.groupAddUserSelectFirst'));
            return;
        }
        var userGroupRole = {
            id: null,
            group: group.get('id'),
            user: user.get('id'),
            role: role.get('name')
        };

        // delete the momouser specific properties, as we handle
        // shogun2 users in the backend
        userGroupRole = me.cleanupUserGroupRole(userGroupRole);

        win.setLoading(true);

        Ext.Ajax.request({
            url: BasiGX.util.Url.getWebProjectBaseUrl() +
                'momousergrouproles/update.action',
            method: "POST",
            defaultHeaders: BasiGX.util.CSRF.getHeader(),
            scope: this,
            jsonData: [userGroupRole],
            callback: function(req, success, response) {
                win.setLoading(false);
                if (success && response && response.responseText) {
                    try {
                        var json = Ext.decode(response.responseText);
                        if (json.success) {
                            Ext.toast(viewModel.get(
                                'i18n.groupAddUserSuccess'
                            ));
                            var permController = Ext.ComponentQuery
                                .query('momo-grouppermissiongrid')[0]
                                .getController();
                            permController.loadData();
                            win.close();
                        } else {
                            Ext.toast(viewModel.get('i18n.groupAddUserFail'));
                        }
                    } catch (e) {
                        Ext.toast(viewModel.get('i18n.groupAddUserFail'));
                    }
                } else {
                    Ext.toast(viewModel.get('i18n.groupAddUserFail'));
                }
            }
        });
    },

    /**
     *
     */
    deleteGroup: function(decision) {
        if (decision !== "yes") {
            return;
        }
        var me = this;
        var selection = me.getView().getSelectionModel().getSelection();
        var viewModel = me.getView().getViewModel();
        Ext.each(selection, function(rec) {
            rec.erase({
                callback: function(savedRec, operation, success) {
                    if (success) {
                        // update the main viewmodels user data,
                        // reconfigures visibility of components
                        // due to roles
                        var mainView = Ext.ComponentQuery.query(
                            'momo-mainviewport')[0];
                        mainView.getController().getUserBySession();

                        Ext.toast(viewModel.get(
                            'i18n.groupDeletionSuccessText'));
                        me.getView().up('momo-grouppanel')
                            .fireEvent('groupsreloaded');
                    } else {
                        Ext.toast(viewModel.get(
                            'i18n.groupDeletionFailureText'));
                    }
                    me.loadStore();
                }
            });
        });
    },

    /**
     *
     */
    handleCellClick: function(gridview, td, cellIndex, rec) {
        var me = this;
        switch(cellIndex) {
            case 2:
                me.onAddUserClick(rec);
                break;
            case 3:
                me.onModifyClick(rec);
                break;
            default:
                return;
        }
    }

});
