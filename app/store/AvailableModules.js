Ext.define('MoMo.admin.store.AvailableModules', {
    extend: 'Ext.data.TreeStore',

    root: {
        expanded: true,
        children: [{
            text: 'Panels',
            children: [{
                text: 'Map',
                leaf: true,
                description: 'This is a Map Panel',
                type: 'panel'
            }, {
                text: 'Overview Map',
                leaf: true,
                type: 'panel'
            }, {
                text: 'Legend Panel',
                leaf: true,
                type: 'panel'
            }, {
                text: 'Layer Tree Panel',
                leaf: true,
                type: 'panel'
            }]
        }, {
            text: 'Grids',
            children: [{
                text: 'Grid Panel',
                leaf: true,
                type: 'panel'
            }, {
                text: 'Feature Info Panel',
                leaf: true,
                type: 'panel'
            }]
        }, {
            text: 'Buttons',
            children: [{
                text: 'Map Interactions',
                children: [{
                    text: 'Zoom In',
                    leaf: true,
                    type: 'button'
                }, {
                    text: 'Zoom Out',
                    leaf: true,
                    type: 'button'
                }, {
                    text: 'Zoom To Max Extent',
                    leaf: true,
                    type: 'button'
                }]
            }, {
                text: 'Print Map',
                leaf: true,
                type: 'button'
            }, {
                text: 'Measure Distance',
                leaf: true,
                type: 'button'
            }, {
                text: 'Measure Area',
                leaf: true,
                type: 'button'
            }]
        }]
    }

});
