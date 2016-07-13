describe('MoMo.admin.view.grid.ApplicationList', function() {
    var ApplicationList;

    beforeEach(function() {
        ApplicationList = Ext.create('MoMo.admin.view.grid.ApplicationList');
    });

    afterEach(function() {
        ApplicationList.destroy();
    });

    describe('Basics', function() {
        it('is defined', function() {
            expect(MoMo.admin.view.grid.ApplicationList).to.not.be(undefined);
        });
        it('has a ViewController', function() {
            expect(ApplicationList.getController()).to.be.an(MoMo.admin.view.grid.ApplicationListController);
        });
        it('has a ViewModel', function() {
            expect(ApplicationList.getViewModel()).to.be.an(MoMo.admin.view.grid.ApplicationListModel);
        });
        it('has a store of type "applications"', function() {
            expect(ApplicationList.getStore()).to.be.an(MoMo.admin.store.Applications);
        });
    });
});
