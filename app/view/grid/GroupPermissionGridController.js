Ext.define('MoMo.admin.view.grid.GroupPermissionGridController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.momo-grouppermissiongrid',
    requires: [
        'MoMo.admin.store.Groups',
        'MoMo.admin.store.Users',
        'MoMo.admin.store.Roles'
    ],


    /**
     * Method retrieves all available groups and additionally the currently
     * available role per group to display it in the grid
     */
    loadData: function() {
        var me = this;
        var view = this.getView();
        var store = view.getStore();

        var successCallBack = function(allUserGroups) {
            Ext.Ajax.request({
                url: BasiGX.util.Url.getWebProjectBaseUrl() +
                    'rest/usergrouproles',
                method: "GET",
                defaultHeaders: BasiGX.util.CSRF.getHeader(),
                scope: this,
                callback: function(req, success, response) {
                    if (success && response && response.responseText) {
                        try {
                            var json = Ext.decode(response.responseText);
                            var parsedData = me.setupGridData(json,
                                allUserGroups);
                            store.loadData(parsedData);
                            me.disableOrHideUnusableGroups();
                        } catch (e) {
                            Ext.log.warn('Error on getting usergrouproles');
                        }
                    } else {
                        Ext.log.warn('Error on getting usergrouproles');
                    }
                }
            });
        };
        me.getAllUserGroupsAndDetails(successCallBack);
    },

    /**
     *
     */
    disableOrHideUnusableGroups: function() {
        var me = this;
        me.hideEmptyRows();
        me.disableUnusableRows();
    },

    /**
     * requests all the necessary data about the users groups and roles
     */
    getAllUserGroupsAndDetails: function(successCallBack) {
        Ext.Ajax.request({
            url: BasiGX.util.Url.getWebProjectBaseUrl() +
                'rest/momousergroups',
            method: "GET",
            defaultHeaders: BasiGX.util.CSRF.getHeader(),
            scope: this,
            callback: function(req, success, response) {
                if (success && response && response.responseText) {
                    try {
                        var userGroups = Ext.decode(response.responseText);
                        successCallBack.call(this, userGroups);
                    } catch (e) {
                        Ext.log.warn('Error on getting momousergroups');
                    }
                } else {
                    Ext.log.warn('Error on getting momousergroups');
                }
            }
        });
    },

    /**
     * prepares the data to be shown in the permissiongridpanel
     */
    setupGridData: function(json, allUserGroups) {
        var data = [];
        Ext.each(json, function(userGroupRoles) {
            // skip the users that have no group assigned. They can be added
            // to groups manually by a different functionality
            if (!userGroupRoles.group) {
                return;
            }
            var groupData = {};
            groupData.id = userGroupRoles.id;
            groupData.groupid = userGroupRoles.group.id;
            groupData.groupname = userGroupRoles.group.name;

            if (userGroupRoles.user) {
                groupData.userid = userGroupRoles.user.id;
                groupData.username = userGroupRoles.user.firstName + ' ' +
                    userGroupRoles.user.lastName;
            }

            var hasSuperadminRole =
                userGroupRoles.role.name === 'ROLE_ADMIN';
            var hasSubadminRole =
                userGroupRoles.role.name === 'ROLE_SUBADMIN';
            var hasEditorRole =
                userGroupRoles.role.name === 'ROLE_EDITOR';
            var hasUserRole =
                userGroupRoles.role.name === 'ROLE_USER';

            if (hasSuperadminRole) {
                hasSubadminRole = true;
                hasEditorRole = true;
                hasUserRole = true;
            } else if (hasSubadminRole) {
                hasEditorRole = true;
                hasUserRole = true;
            } else if (hasEditorRole) {
                hasUserRole = true;
            }
            groupData.subadminpermissionactive = hasSubadminRole;
            groupData.editorpermissionactive = hasEditorRole;
            groupData.userpermissionactive = hasUserRole;

            data.push(groupData);
        });

        // add possibly missing groups
        Ext.each(allUserGroups, function(group) {

            var matchFound = false;
            Ext.each(json, function(userGroupRoles) {
                if (userGroupRoles.group &&
                   (userGroupRoles.group.id === group.id)) {
                    matchFound = true;
                }
            });
            if (!matchFound) {
                var groupData = {};
                groupData.groupid = group.id;
                groupData.groupname = group.name;

                data.push(groupData);
            }
        });
        return data;
    },

    /**
     * Method hides the empty rows in the grid which exist due to the fact
     * that we want to show every exisiting group, even if it has no member
     * and for this we created an record which has no user attached before
     */
    hideEmptyRows: function() {
        var me = this;
        var view = me.getView();
        var tableView = view.getView();
        var store = view.getStore();
        store.each(function(rec) {
            if (!rec.get('userid')) {
                var row = tableView.getRow(rec);
                if (row) {
                    row.style.display = "none";
                }
            }
        });
    },

    /**
     * Method disables rows that cannot be edited by current user due to missing
     * permissions
     */
    disableUnusableRows: function() {
        var me = this;
        var view = me.getView();
        var viewModel = view.getViewModel();
        var tableView = view.getView();
        var store = view.getStore();

        var user = viewModel.get('user');
        if (!user) {
            return;
        }
        var allowedGroups = [];
        var isSuperAdmin = false;
        Ext.each(user.get('groupRoles'), function(role) {
            if (role.indexOf('ROLE_SUBADMIN') > -1) {
                var groupId = role.split('ROLE_SUBADMIN_GROUP_')[1];
                if (groupId) {
                    allowedGroups.push(parseInt(groupId, 10));
                }
            }
            if (role.indexOf('ROLE_ADMIN') > -1) {
                isSuperAdmin = true;
            }
        });
        store.each(function(rec) {
            if (!Ext.Array.contains(allowedGroups, rec.get('groupid')) &&
                    !isSuperAdmin) {
                var row = tableView.getRow(rec);
                if (row) {
                    var el = Ext.fly(row);
                    // mask the user row
                    el.mask();
                    // also disable the group header row
                    el.up().mask();
                }
            }
        });
    },

    /**
     * automatically set the role hierarchy downwards
     */
    handleSelectionChange: function(gridview, td, idx, record){
        var subadmin = record.getData().subadminpermissionactive;
        var editor = record.getData().editorpermissionactive;
        if (subadmin) {
            record.set('editorpermissionactive', true);
            record.set('userpermissionactive', true);
        } else if (editor) {
            record.set('userpermissionactive', true);
        }
    }

});
