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
                me.onModifyClick(rec);
                break;
            default:
                return;
        }
    }

});
