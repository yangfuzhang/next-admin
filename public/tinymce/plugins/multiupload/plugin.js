(function() {
  'use strict';

  var global$4 = tinymce.util.Tools.resolve('tinymce.PluginManager');

  global$4.add('multiupload', function (editor) {
    var pluginName = '多图片上传';
    var multiupload_handler = editor.getParam('multiupload_handler');

    var uploadFiles = function () {
      // var dom = editor.dom;
      var file_input = document.createElement('input');
      file_input.setAttribute('type', 'file');
      file_input.setAttribute('name', 'images[]');
      file_input.setAttribute('accept', 'image/jpg,image/jpeg,image/png,image/gif,image/webp');
      file_input.setAttribute('multiple', 'multiple');

      file_input.addEventListener('change', function(e) {
        var files = e.target.files;
        
        if(multiupload_handler) {
          multiupload_handler(files).then((resFiles) => {
            editor.focus();
            
            for (let i = 0; i < resFiles.length; i++) {
              var file = resFiles[i];
              editor.insertContent(`<img src="${file.url}" alt="${file.name ?? ''}" style="max-width: 100%;">`);
            }
          }).catch((error) => {
            console.error(error);
          })
        } else {
          console.error('请配置multiupload_handler参数');
        }
      });

      file_input.click();
    };
  
    editor.ui.registry.addButton('multiupload', {
      icon: 'gallery',
      tooltip: pluginName,
      onAction: function() {
        uploadFiles();
      }
    });

    editor.ui.registry.addMenuItem('multiupload', {
      icon: 'gallery',
      text: '多张图片...',
      onAction: function() {
        uploadFiles();
      }
    });
  });
})()