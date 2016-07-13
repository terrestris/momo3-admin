describe('MoMo.admin.view.grid.LayerList', function() {
    var LayerList;

    beforeEach(function() {
        LayerList = Ext.create('MoMo.admin.view.grid.LayerList');
    });

    afterEach(function() {
        LayerList.destroy();
    });

    describe('Basics', function() {
        it('is defined', function() {
            expect(MoMo.admin.view.grid.LayerList).to.not.be(undefined);
        });
        it('has a ViewController', function() {
            expect(LayerList.getController()).to.be.an(MoMo.admin.view.grid.LayerListController);
        });
        it('has a ViewModel', function() {
            expect(LayerList.getViewModel()).to.be.an(MoMo.admin.view.grid.LayerListModel);
        });
        it('has a store of type "layers"', function() {
            expect(LayerList.getStore()).to.be.an(MoMo.admin.store.Layers);
        });
    });
});
