Ext.define('MoMo.admin.store.NavigationTree', {
    extend: 'Ext.data.TreeStore',

    storeId: 'NavigationTree',

    root: {
        expanded: true,
        children: [{
            text: 'Applications',
            view: 'grid.ApplicationList',
            iconCls: 'right-icon x-fa fa-desktop',
            routeId: 'applications',
            leaf: true
        }, {
            text: 'Layers',
            view: 'grid.LayerList',
            leaf: true,
            iconCls: 'x-fa fa-list',
            routeId: 'layers'
        }, {
            text: 'Users',
            view: 'grid.UserList',
            leaf: true,
            iconCls: 'x-fa fa-users',
            routeId: 'users'
        }, {
            text: 'Profile',
            view: 'panel.ProfilePanel',
            leaf: true,
            iconCls: 'x-fa fa-user',
            routeId: 'profile'
        }]
    },
    fields: [{
        name: 'text'
    }]
});
