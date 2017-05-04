Ext.define('MoMo.admin.view.grid.EntityPermissionsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.momo-entitypermissions',
    requires: [],

    /**
     *
     */
    loadStore: function() {
        var view = this.getView();
        var store = view.getStore();

        var entity = view.getEntity();
        var targetEntity = view.getTargetEntity();
        var entityId = view.getViewModel().get('entityId');

        if (!entityId) {
            // entity may not be saved yet, cleanup and return
            store.removeAll();
            view.setDisabled(true);
            return;
        } else {
            view.setDisabled(false);
        }

        // url example e.g. rest/entitypermission/MomoLayer/44/MomoUser
        store.getProxy().url = BasiGX.util.Url.getWebProjectBaseUrl() +
            'rest/entitypermission/' + entity + "/" +
            entityId + "/" + targetEntity;
        store.load();
    },

    /**
     *
     */
    updatePermissions: function() {
        var me = this;
        var view = this.getView();
        var store = view.getStore();

        var entity = view.getEntity();
        var targetEntity = view.getTargetEntity();
        var entityId = view.getViewModel().get('entityId');

        if (!entityId) {
            return;
        }

        var modifiedRecs = store.getModifiedRecords();
        var dirtyRecs = [];
        Ext.each(modifiedRecs, function(rec) {
            // only handle this rec if it has been changed
            if (rec.dirty) {
                dirtyRecs.push(rec);
            }
        });
        var successCount = 0;
        var recCount = dirtyRecs.length;
        if (recCount === 0) {
            // inform createoreditlayer controller that we are done here
            me.fireEvent('permissionsunmodified');
        }
        Ext.each(dirtyRecs, function(rec) {
            var finalPermissions = [];
            if (rec.get('PERMISSION_DELETE')) {
                finalPermissions.push('DELETE');
            }
            if (rec.get('PERMISSION_UPDATE')) {
                finalPermissions.push('UPDATE');
            }
            if (rec.get('PERMISSION_READ')) {
                finalPermissions.push('READ');
            }
            var originalData = rec.store.getProxy().getReader().rawData;
            var permissionObj = {};
            permissionObj.targetEntity = originalData.data.targetEntity;
            permissionObj.permissions = [
                {
                    permissions: {
                        permissions: finalPermissions
                    },
                    targetEntity: rec.get('targetEntity')
                }
            ];
            var url = BasiGX.util.Url.getWebProjectBaseUrl() +
                'rest/entitypermission/' + entity + "/" +
                entityId + "/" + targetEntity;

            Ext.Ajax.request({
                url: url,
                method: 'POST',
                defaultHeaders: BasiGX.util.CSRF.getHeader(),
                jsonData: permissionObj,
                success: function() {
                    successCount++;
                    if (successCount === recCount) {
                        // inform createoreditlayer
                        // controller that we are done here
                        me.fireEvent('permissionsupdated');
                    }

                },
                failure: function() {
                    Ext.toast(me.getView().getViewModel().get('i18n')
                        .permissionsUpdatesFailureText);
                }
            });
        }, me);

    }

});
