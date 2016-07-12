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
            view: 'pages.Users',
            leaf: true,
            iconCls: 'x-fa fa-users',
            routeId: 'users'
        }]
    },
    fields: [{
        name: 'text'
    }]
});
