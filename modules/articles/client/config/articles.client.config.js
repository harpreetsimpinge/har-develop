'use strict';
// Configuring the Articles module
angular.module('articles', ['ngDialog', 'ui.mask', 'ngMaterial', 'ngAnimate', 'ngAria', 'toastr', 'daterangepicker', 'angular.filter', 'ui.bootstrap', 'mdPickers', 'isteven-multi-select', 'textAngular', 'ngclipboard', 'froala'])
  .run(['Menus', function(Menus) {
    // Add the articles dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Claimants Management Center',
      state: 'articles',
      type: 'dropdown',
      roles: ['user', 'user2', 'admin1', 'admin2', 'admin']
    });


    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'articles', {
      title: 'Search',
      state: 'articles.list',
      roles: ['user', 'user2', 'admin2', 'admin']
    });

    Menus.addSubMenuItem('topbar', 'articles', {
      title: 'Bulk Edit',
      state: 'articles.bulk',
      roles: ['admin1', 'admin2', 'admin']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'articles', {
      title: 'Add New Claimants',
      state: 'articles.create',
      roles: ['admin1', 'admin2', 'admin']
    });

    // Add the edit fields
    Menus.addSubMenuItem('topbar', 'articles', {
      title: 'Edit Fields',
      state: 'articles.fields',
      roles: ['admin1', 'admin2', 'admin']
    });
  }]);

// add uiSwitch to module
angular.module('articles').service('fileUpload', ['$http', function($http) {
  this.uploadFileToUrl = function(data_, file, uploadUrl, cb) {
    var fd = new FormData();
    fd.append('file', file);
    fd.append('address', data_);

    $http.post(uploadUrl, fd, {
        transformRequest: angular.identity,
        headers: { 'Content-Type': undefined } //, 'enctype':'multipart/form-data'}
      })
      .success(function(data) {
        cb(data);
      })
      .error(function(err) {
        console.log(err);
      });
  };
}]);

angular.module('articles').value('froalaConfig', {
  toolbarInline: false,
  placeholderText: 'Enter Text Here'
});


angular.module('articles')
  .directive('myDraggable', ['$document', '$http', function($document, $http) {
    return {
      restrict: 'A',
      scope: {
        article: '=article'
      },
      templateUrl: '/modules/articles/client/views/side.client.view.html',
      link: function(scope, element, attr) {
        var startX = 0,
          startY = 0,
          x = 0,
          y = 0;
        //Fields();
        scope.cats = [];
        if (!scope.fields)
          getFields();
        scope.$watch('article', function(newValue, oldValue) {
          $http.get('/api/articles/' + newValue).
          then(function(response) {
            scope.article_sort = sortFields(response.data);
          });
        });


        function getFields() {
          $http.get('/api/fields/all-fields').
          then(function(response) {
              //console.log(response.data);
              scope.fields = response.data;
              scope.requiredFileds = [];
              scope.otherFileds = [];

              for (var k in scope.fields) {
                if (k === "_id" || k === "user")
                  continue;
                if (scope.fields[k].category === "Contact") {
                  scope.requiredFileds.push(scope.fields[k]);
                } else
                  scope.otherFileds.push(scope.fields[k]);
              }

              for (var j in response.data) {
                var found = false;
                for (var i in scope.cats) {
                  if (scope.cats[i] === response.data[j].category)
                    found = true;
                }
                if (found === false)
                  scope.cats.push(response.data[j].category);
              }


            }, function(response) {
              scope.data = response.data || "Request failed";
            }

          );
        };

        function sortFields(input) {
          var array = [];
          var other_arr = [];
          for (var objectKey in input) {
            if (objectKey !== undefined && angular.isObject(input[objectKey]) && objectKey !== "permissions" && objectKey !== "legacy")
              array.push(input[objectKey]);
            else
              other_arr.push(input[objectKey]);
          }

          array.sort(function(a, b) {
            //var aPos = parseInt(a.id.order);
            //var bPos = parseInt(b.id.order);
            if (a.id === null || b.id === null)
              return 0;
            return a.id.order - b.id.order;
          });
          return array;
        }
        element.css({
          position: 'relative',
          cursor: 'pointer',
        });

        element.on('mousedown', function(event) {
          // Prevent default dragging of selected content
          event.preventDefault();
          startX = event.pageX - x;
          startY = event.pageY - y;
          $document.on('mousemove', mousemove);
          $document.on('mouseup', mouseup);
        });

        function mousemove(event) {
          y = event.pageY - startY;
          x = event.pageX - startX;
          element.css({
            top: y + 'px',
            left: x + 'px'
          });
        }

        function mouseup() {
          $document.off('mousemove', mousemove);
          $document.off('mouseup', mouseup);
        }
      }
    };
  }]);

angular.module('articles').service('fileUpload', ['$http', function($http) {
  this.uploadFileToUrl = function(data_, file, uploadUrl, cb) {
    var fd = new FormData();
    fd.append('file', file);
    fd.append('address', data_);

    $http.post(uploadUrl, fd, {
        transformRequest: angular.identity,
        headers: { 'Content-Type': undefined } //, 'enctype':'multipart/form-data'}
      })
      .success(function(data) {
        cb(data);
      })
      .error(function(err) {
        console.log(err);
      });
  };
}]);


angular.module('articles')
  .directive('addNote', ['$document', '$http', 'FileUploader', 'toastr', '$rootScope', function($document, $http, FileUploader, toastr, $rootScope) {
    return {
      restrict: 'A',
      scope: {
        article: '=article'
      },
      templateUrl: '/modules/articles/client/views/addNote.client.view.html',
      link: function(scope, element, attr) {
        var startX = 0,
          startY = 0,
          x = 0,
          y = 0;
        scope.cats = [];
        scope.newNote = {
          files: [],
          filesShow: [],
          date: new Date(),
          //followup: new Date(),
          RTWregpermFocusInformation: new Date(),
          RTWtransFocusInformation: new Date()
        };

        scope.froalaOptions = {
          toolbarButtons: ['undo', 'redo', '|', 'bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript', 'outdent', 'indent', 'clearFormatting', 'insertTable', 'html'],
          toolbarButtonsXS: ['undo', 'redo', '-', 'bold', 'italic', 'underline'],
          key: 'md1hkC-11ydbdmcE-13dvD1wzF-7=='
        };

        scope.$watch('article', function(newValue, oldValue) {
          console.log(newValue);
          $http.get('/api/articles/' + newValue).
          then(function(response) {
            scope.file = response.data;
          });
        });

        scope.uploader = new FileUploader({
          url: "/api/dropdpc/uploadfile",
          alias: 'uploadFile'
        });

        scope.uploader.onAfterAddingFile = function() {
          scope.loadFile = true;
          scope.uploader.uploadAll();
        };

        scope.uploader.onSuccessItem = function(fileItem, response, status, headers) {
          console.log(response);
          scope.loadFile = false;
          if (status === 200) {
            toastr.success('File upload success');
            scope.newNote.filesShow.push(response);
            scope.newNote.files.push(response._id);
            scope.loadSuccess = true;
          } else
            toastr.warning('Error file upload');
        };

        scope.getUsers = function() {
          $http.get('/api/users')
            .then(function(response) {
                scope.users = response.data;
                console.log(response);
              }, function(response) {}

            );
        };
        scope.getUsers();

        scope.onFileNote = function(re) {
          console.log(re.file);
          if (!re.file)
            return;
          scope.newNote.filesShow.push(re.file);
          scope.newNote.files.push(re.file._id);
        };

        scope.addNote = function(isValid) {
          //console.log("add note");
          /*if (!isValid) {
            scope.$broadcast('show-errors-check-validity', 'articleForm');
            return false;
          }*/
          scope.error = null;
          var date = new Date(scope.newNote.date);
          var followupdate = new Date(scope.newNote.followup);
          date.setUTCHours(12, 0, 0, 0);
          followupdate.setUTCHours(12, 0, 0, 0);
          var note = {
            date: date,
            article: scope.article._id,
            content: scope.newNote.text,
            type: scope.newNote.type,
            title: scope.newNote.title,
            _case: scope.file._id,
            files: scope.newNote.files,
            followUp: followupdate,
            assign: scope.newNote.assign
          };


          if (scope.loadFile) {
            toastr.warning('Uploading file...');
            return;
          }
          $http.post('/api/articles/note', note).
          then(function(response) {
            console.log(response);
            toastr.success('New note Saved');
            scope.newNote = {};
            scope.newNoteId = response.data.id;
            scope.uploader.clearQueue();
            scope.loadSuccess = false;
            scope.newNote.filesShow = [];
            scope.file = {};
            for (var k in response.data.files) {
              scope.files.push(response.data.files[k]);
            }
            if (note.type === "closing") {
              closeFile();
            }
          }, function(response) {
            scope.data = response.data || "Request failed";
            toastr.error('Error adding new note');
          });
        };

        element.css({
          position: 'relative',
          cursor: 'pointer',
          zIndex: 8888,
        });
        var myEl = angular.element(document.querySelector('#some-id'));
        myEl.on('mousedown', function(event) {
          // Prevent default dragging of selected content
          event.preventDefault();
          startX = event.pageX - x;
          startY = event.pageY - y;
          $document.on('mousemove', mousemove);
          $document.on('mouseup', mouseup);
        });

        function mousemove(event) {
          y = event.pageY - startY;
          x = event.pageX - startX;
          element.css({
            top: y + 'px',
            left: x + 'px'
          });
        }

        function mouseup() {
          $document.off('mousemove', mousemove);
          $document.off('mouseup', mouseup);
        }
      }
    };
  }]);
