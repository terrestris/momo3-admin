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
            view: 'search.Results',
            leaf: true,
            iconCls: 'x-fa fa-search',
            routeId: 'search'
        }, {
            text: 'Users',
            view: 'pages.Users',
            leaf: true,
            iconCls: 'x-fa fa-users',
            routeId: 'faq'
        }]
    },
    fields: [{
        name: 'text'
    }]
});
