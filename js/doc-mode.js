function pickColour() {
    $('#colorPicker').change(function () {
        var cp = $('#colorPicker').val();
        $('.colourBox').css('background-color', cp);
        $('.colourBox').html('');
        $('.colourBox').append(cp);
    });

}