var valuesSlider = document.getElementById('slider-round');
var valuesForSlider = [];
for (let index = 1959; index <= 2023; index++) {
    valuesForSlider.push(index)
}

var format = {
    to: function(value) {
        return valuesForSlider[Math.round(value)];
    },
    from: function (value) {
        return valuesForSlider.indexOf(Number(value));
    }
};

noUiSlider.create(valuesSlider, {
    start: [1959, 2023],
    range: {
        'min': [1959],
        '25%': [1975],
        '50%': [1991],
        '75%': [2007],
        'max': [2023]
    },
    step: 1,
    tooltips: true,
    pips: {
        mode: 'range',
        density: 3
    }
});