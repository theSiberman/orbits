(function () {
  'use strict';

  describe('Orbits Route Tests', function () {
    // Initialize global variables
    var $scope,
      OrbitsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _OrbitsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      OrbitsService = _OrbitsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('orbits');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/orbits');
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
          OrbitsController,
          mockOrbit;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('orbits.view');
          $templateCache.put('modules/orbits/client/views/view-orbit.client.view.html', '');

          // create mock Orbit
          mockOrbit = new OrbitsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Orbit Name'
          });

          // Initialize Controller
          OrbitsController = $controller('OrbitsController as vm', {
            $scope: $scope,
            orbitResolve: mockOrbit
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:orbitId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.orbitResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            orbitId: 1
          })).toEqual('/orbits/1');
        }));

        it('should attach an Orbit to the controller scope', function () {
          expect($scope.vm.orbit._id).toBe(mockOrbit._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/orbits/client/views/view-orbit.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          OrbitsController,
          mockOrbit;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('orbits.create');
          $templateCache.put('modules/orbits/client/views/form-orbit.client.view.html', '');

          // create mock Orbit
          mockOrbit = new OrbitsService();

          // Initialize Controller
          OrbitsController = $controller('OrbitsController as vm', {
            $scope: $scope,
            orbitResolve: mockOrbit
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.orbitResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/orbits/create');
        }));

        it('should attach an Orbit to the controller scope', function () {
          expect($scope.vm.orbit._id).toBe(mockOrbit._id);
          expect($scope.vm.orbit._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/orbits/client/views/form-orbit.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          OrbitsController,
          mockOrbit;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('orbits.edit');
          $templateCache.put('modules/orbits/client/views/form-orbit.client.view.html', '');

          // create mock Orbit
          mockOrbit = new OrbitsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Orbit Name'
          });

          // Initialize Controller
          OrbitsController = $controller('OrbitsController as vm', {
            $scope: $scope,
            orbitResolve: mockOrbit
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:orbitId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.orbitResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            orbitId: 1
          })).toEqual('/orbits/1/edit');
        }));

        it('should attach an Orbit to the controller scope', function () {
          expect($scope.vm.orbit._id).toBe(mockOrbit._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/orbits/client/views/form-orbit.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
