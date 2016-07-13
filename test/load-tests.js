/*global document*/
// This file is taken from GeoExt3
(function(doc, global){
    var specPath = 'test/spec/',
        dependencies = [
            'basics.test.js',
            'Application.test.js',
            'view/grid/LayerList.test.js',
            'view/grid/ApplicationList.test.js',
            'view/grid/UserList.test.js'
        ],
        getScriptTag = global.TestUtil.getExternalScriptTag,
        dependencyCnt = dependencies.length,
        i = 0;

    for(; i < dependencyCnt; i++) {
        doc.write(getScriptTag(specPath + dependencies[i]));
    }
}(document, this));
