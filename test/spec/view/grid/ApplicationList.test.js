describe('MoMo.admin.view.grid.ApplicationList', function() {
    var applicationList;
    var controller;
    var viewModel;
    var store;

    beforeEach(function() {
        applicationList = Ext.create('MoMo.admin.view.grid.ApplicationList');
        controller = applicationList.getController();
        viewModel = applicationList.getViewModel();
        store = applicationList.getStore();
    });

    afterEach(function() {
        applicationList.destroy();
    });

    describe('Basics', function() {
        it('is defined', function() {
            expect(MoMo.admin.view.grid.ApplicationList).to.not.be(undefined);
        });
        it('has a ViewController', function() {
            expect(controller).to.be.an(MoMo.admin.view.grid.ApplicationListController);
        });
        it('has a ViewModel', function() {
            expect(viewModel).to.be.an(MoMo.admin.view.grid.ApplicationListModel);
        });
        it('has a store of type "applications"', function() {
            expect(store).to.be.an(MoMo.admin.store.Applications);
        });
    });

    describe('View Controller', function() {
        it('has the default methods', function(){
            expect(controller.onFilterChange).to.not.be(undefined);
            expect(controller.handleCellClick).to.not.be(undefined);
            expect(controller.onCreateClick).to.not.be(undefined);
            expect(controller.onCopyClick).to.not.be(undefined);
            expect(controller.onDeleteClick).to.not.be(undefined);
        });
    });

    describe('View Model', function() {
        it('all binded values are defined', function(){
            Ext.iterate(applicationList.getBind(), function(k,v ){
                expect(viewModel.get(k)).to.not.be(undefined);
            })
        });
    });
});
