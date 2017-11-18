(function () {
    'use strict';

    var clientWidth = $('body').width()

    if (clientWidth > 768) {
        var musicConf = JSON.parse(musicModule.musicConfig)
        var lrcConfig = musicModule.lrcConfig
        musicConf.element = document.getElementById('cube-player')

        $(document).ready(function () {
            var music = new APlayer(musicConf)

            var lrcControl = $('a.lrc-control')
            var lrcContent = $('div.aplayer-lrc')

            lrcControl.on('click', function () {
                if (lrcControl.text() === lrcConfig.open) {
                    lrcContent.css('display', 'block')
                    lrcControl.text(lrcConfig.close)
                } else {
                    lrcContent.css('display', 'none')
                    lrcControl.text(lrcConfig.open)
                }
            })
        })
    }

})()
