Ext.define('MoMo.admin.view.grid.UserPermissionGridController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.momo-userpermissiongrid',

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
        var view = this.getView();
        var viewModel = view.getViewModel();
        var user = viewModel.get('user');
        var userId = user.id;
        var data = [];
        Ext.each(allUserGroups, function(group) {
            var groupData = {};
            groupData.groupid = group.id;
            groupData.groupname = group.name;

            // find matching group
            var matchingGroup;
            Ext.each(json, function(userGroupRole) {
                if (userGroupRole.group &&
                    group.id === userGroupRole.group.id) {

                    // we can have multiple matching groups, e.g. if a user
                    // has role_subadmin in a group, he will get 2 results
                    // also containing other users in that group.
                    // thats why we have to check if the current entry is meant
                    // for the current user by checking against the userid
                    if (userGroupRole.user.id === userId) {
                        matchingGroup = userGroupRole;
                    }
                }
            });

            if (!matchingGroup) {
                // user seems to currently have no right in this group
                groupData.subadminpermissionactive = false;
                groupData.editorpermissionactive = false;
                groupData.userpermissionactive = false;
            } else {
                // user already has some kind of rights in the current group
                var hasSuperadminRole =
                    matchingGroup.role.name === 'ROLE_ADMIN';
                var hasSubadminRole =
                    matchingGroup.role.name === 'ROLE_SUBADMIN';
                var hasEditorRole =
                    matchingGroup.role.name === 'ROLE_EDITOR';
                var hasUserRole =
                    matchingGroup.role.name === 'ROLE_USER';

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
            }
            data.push(groupData);
        });
        return data;
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
