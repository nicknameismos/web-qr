(function () {
  'use strict';

  describe('Qrevents Controller Tests', function () {
    // Initialize global variables
    var QreventsController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      QreventsService,
      mockQrevent;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _QreventsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      QreventsService = _QreventsService_;

      // create mock Qrevent
      mockQrevent = new QreventsService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Qrevent Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Qrevents controller.
      QreventsController = $controller('QreventsController as vm', {
        $scope: $scope,
        qreventResolve: {}
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleQreventPostData;

      beforeEach(function () {
        // Create a sample Qrevent object
        sampleQreventPostData = new QreventsService({
          name: 'Qrevent Name'
        });

        $scope.vm.qrevent = sampleQreventPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (QreventsService) {
        // Set POST response
        $httpBackend.expectPOST('api/qrevents', sampleQreventPostData).respond(mockQrevent);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the Qrevent was created
        expect($state.go).toHaveBeenCalledWith('qrevents.view', {
          qreventId: mockQrevent._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/qrevents', sampleQreventPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock Qrevent in $scope
        $scope.vm.qrevent = mockQrevent;
      });

      it('should update a valid Qrevent', inject(function (QreventsService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/qrevents\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('qrevents.view', {
          qreventId: mockQrevent._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (QreventsService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/qrevents\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        // Setup Qrevents
        $scope.vm.qrevent = mockQrevent;
      });

      it('should delete the Qrevent and redirect to Qrevents', function () {
        // Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/qrevents\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('qrevents.list');
      });

      it('should should not delete the Qrevent and not redirect', function () {
        // Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
}());
