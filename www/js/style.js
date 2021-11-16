    $(function() {
        $('.upload-fife-btn').addClass('dragging').removeClass('dragging');
    });

    $('.upload-fife-btn').on('dragover', function() {
    $('.upload-fife-btn').addClass('dragging')
    }).on('upload-fife-btn', function() {
    $('.upload-fife-btn').removeClass('dragging')
    }).on('drop', function(e) {
        $('.upload-fife-btn').removeClass('dragging hasImage');

        if (e.originalEvent) {
            var file = e.originalEvent.dataTransfer.files[0];
            console.log(file);

            var reader = new FileReader();

            //attach event handlers here...

            reader.readAsDataURL(file);
            reader.onload = function(e) {
            console.log(reader.result);
            $('.ImageUpload').attr('src',reader.result ).addClass('hasImage');

            }
        }
    })
    $('.upload-fife-btn').on('click', function(e) {
        console.log('clicked')
        $('#mediaFile').click();
    });
    window.addEventListener("dragover", function(e) {
        e = e || event;
        e.preventDefault();
    }, false);
    window.addEventListener("drop", function(e) {
        e = e || event;
        e.preventDefault();
    }, false);

    $('.mediaFile').change(function(e) {
        var input = e.target;
        if (input.files && input.files[0]) {
            var file = input.files[0];

            var reader = new FileReader();

            reader.readAsDataURL(file);
            reader.onload = function(e) {
                $('.ImageUpload').attr('src',reader.result ).addClass('hasImage');
            }
        }
    })
