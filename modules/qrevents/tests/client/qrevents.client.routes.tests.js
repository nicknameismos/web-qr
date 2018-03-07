(function () {
  'use strict';

  describe('Qrevents Route Tests', function () {
    // Initialize global variables
    var $scope,
      QreventsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _QreventsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      QreventsService = _QreventsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('qrevents');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/qrevents');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          QreventsController,
          mockQrevent;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('qrevents.view');
          $templateCache.put('modules/qrevents/client/views/view-qrevent.client.view.html', '');

          // create mock Qrevent
          mockQrevent = new QreventsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Qrevent Name'
          });

          // Initialize Controller
          QreventsController = $controller('QreventsController as vm', {
            $scope: $scope,
            qreventResolve: mockQrevent
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:qreventId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.qreventResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            qreventId: 1
          })).toEqual('/qrevents/1');
        }));

        it('should attach an Qrevent to the controller scope', function () {
          expect($scope.vm.qrevent._id).toBe(mockQrevent._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/qrevents/client/views/view-qrevent.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          QreventsController,
          mockQrevent;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('qrevents.create');
          $templateCache.put('modules/qrevents/client/views/form-qrevent.client.view.html', '');

          // create mock Qrevent
          mockQrevent = new QreventsService();

          // Initialize Controller
          QreventsController = $controller('QreventsController as vm', {
            $scope: $scope,
            qreventResolve: mockQrevent
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.qreventResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/qrevents/create');
        }));

        it('should attach an Qrevent to the controller scope', function () {
          expect($scope.vm.qrevent._id).toBe(mockQrevent._id);
          expect($scope.vm.qrevent._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/qrevents/client/views/form-qrevent.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          QreventsController,
          mockQrevent;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('qrevents.edit');
          $templateCache.put('modules/qrevents/client/views/form-qrevent.client.view.html', '');

          // create mock Qrevent
          mockQrevent = new QreventsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Qrevent Name'
          });

          // Initialize Controller
          QreventsController = $controller('QreventsController as vm', {
            $scope: $scope,
            qreventResolve: mockQrevent
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:qreventId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.qreventResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            qreventId: 1
          })).toEqual('/qrevents/1/edit');
        }));

        it('should attach an Qrevent to the controller scope', function () {
          expect($scope.vm.qrevent._id).toBe(mockQrevent._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/qrevents/client/views/form-qrevent.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
