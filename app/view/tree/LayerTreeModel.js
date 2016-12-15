Ext.define('MoMo.admin.view.grid.LayerTreeModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.momo-layertree',

    data: {
        title: 'Layertree',
        addTreeFolderMenuText: 'Add folder (inside selected)',
        addTreeFolderTopLevelMenuText: 'Add folder (top level)',
        deleteTreeLeafMenuText: 'Delete leaf',
        deleteTreeFolderMenuText: 'Delete folder',
        deleteAllTreeFoldersMenuText: 'Delete tree contents completely',
        renameTreeLeafMenuText: 'Rename leaf',
        renameTreeFolderMenuText: 'Rename folder',
        addTreeFolderWindowTitle: 'Add folder',
        addTreeFolderWindowMsg:' Enter a name for the new folder',
        deleteTreeLeafWindowTitle: 'Delete leaf',
        deleteTreeFolderWindowTitle: 'Delete folder',
        deleteTreeLeafWindowMsg: 'Do you really want to delete leaf {0}?',
        deleteTreeFolderWindowMsg: 'Do you really want to delete folder {0}?',
        deleteAllTreeFoldersWindowText: 'Delete tree contents completely',
        deleteAllTreeFoldersWindowMsg: 'Do you really want to delete the ' +
                'tree contents completely?',
        renameTreeLeafWindowTitle: 'Rename leaf',
        renameTreeFolderWindowTitle: 'Rename folder',
        renameTreeLeafWindowMsg: 'Enter a new name for the leaf {0}',
        renameTreeFolderWindowMsg: 'Enter a new name for the folder {0}'
    }
});
