/* global APP */
;(function (window, $, _OnBoardingCanvas, _OnBoardingSvg) {
  function init () {
    var cont = $('#onboarding-view')
    var nextCnt = cont.find('.board_footer .next')
    var nextBtn = cont.find('.board_footer .next a')
    var sections = ['', '#/onboarding/two', '#/onboarding/three', '#/onboarding/four', '#/onboarding/five', '#/map']
    var delays = [0, 1500, 4000, 2000, 2000, 1500]
    var timer
    var dotsContainer = cont.find('.dots')
    var circ = $('#onboarding-view .svg svg')
    var circR = circ.find('circle')

    var onCanvas = new _OnBoardingCanvas()
    var onSvg = new _OnBoardingSvg()

    cont.find('p').css({opacity: 0})
    nextCnt.css({opacity: 0})
    circ.css({scale: 0})

    function setNextBtnIn (sec) {
      dotsContainer.find('div').removeClass('active')
      dotsContainer.find('div:nth-child(' + sec + ')').addClass('active')
      nextBtn.attr('href', sections[sec])
      nextCnt.css({opacity: 0, scale: 0}).transition({opacity: 1, scale: 1, delay: delays[sec]}, 1000, 'easeInOutQuart')
    }
    function setNextBtnOut (sec) {
      nextCnt.transition({opacity: 0, scale: 0}, 500, 'easeInOutQuart')
    }

    var obj = {
      enter: function (option) {
        console.log('onboardingState :: enter')

        onCanvas.init()

        cont.css({opacity: 1}).show()
      },

      leave: function (option) {
        console.log('onboardingState :: leave')

        cont.transition({opacity: 0,
          complete: function () {
            onCanvas.stop()
            cont.hide()
          }}, 750, 'easeInOutQuint')
      },

      one: {
        enter: function (option) {
          cont.find('.one p')
            .css({opacity: 0, y: 30})
            .transition({delay: 1000, opacity: 1, y: 0}, 1500, 'easeInOutQuart')

          onCanvas.one()

          circ.css({scale: 0})
            .transition({delay: 1000, scale: 1}, 1000)

          setNextBtnIn(1)
        },
        leave: function (option) {
          cont.find('.one p').transition({opacity: 0, y: -30}, 1500, 'easeInOutQuart')
          setNextBtnOut()
        }
      },

      two: {
        enter: function (option) {
          cont.find('.two p')
            .css({y: 30})
            .transition({delay: 1000, opacity: 1, y: 0}, 1500, 'easeInOutQuart')
            .transition({delay: 250, opacity: 0, y: -30}, 1500, 'easeInOutQuart')

          onSvg.enter()

          circ.transition({delay: 1000, scale: 0.6}, 1500, 'easeInOutQuart')
            .transition({delay: 250, scale: 0}, 1500, 'easeInOutQuart')

          setNextBtnIn(2)
        },
        leave: function (option) {
          cont.find('.two p').transition({opacity: 0, y: -30}, 1500, 'easeInOutQuart')
          setNextBtnOut()
        }
      },

      three: {
        enter: function (option) {
          cont.find('.three p:first-child').css({y: -30}).transition({delay: 250, opacity: 1, y: 0}, 3000, 'easeInOutQuart')
          cont.find('.three p:last-child').css({y: 30}).transition({delay: 500, opacity: 1, y: 0}, 3000, 'easeInOutQuart')

          setTimeout(function () {
            cont.find('.three p:nth-child(2)').css({opacity: 1})
            var num = cont.find('.three p:nth-child(2)')
            var lim = APP.dataset.prjs.length
            var cnt = 0
            timer = setInterval(function () {
              num.text(cnt)
              cnt += 9
              if (cnt >= lim) {
                clearTimeout(timer)
                num.text(lim)
              }
            })
          }, 1000)

          onCanvas.three()
          onSvg.exit()

          circR.css({fill: '#f28244'})
          circ.transition({delay: 750, scale: 0.8}, 1500, 'easeInOutQuart')

          setNextBtnIn(3)
        },
        leave: function (option) {
          cont.find('.three p:first-child').transition({opacity: 0, y: -50}, 500, 'easeInOutQuart')
          cont.find('.three p:last-child').transition({opacity: 0, y: 50}, 500, 'easeInOutQuart')
          cont.find('.three p:nth-child(2)').transition({opacity: 0}, 500, 'easeInOutQuart')
          clearTimeout(timer)
          setNextBtnOut()
        }
      },

      four: {
        enter: function (option) {
          cont.find('.four p:first-child').css({y: -30}).transition({opacity: 1, y: 0}, 3000, 'easeInOutQuart')
          cont.find('.four p:last-child').css({y: 30}).transition({delay: 500, opacity: 1, y: 0}, 3000, 'easeInOutQuart')

          onCanvas.four()

          setTimeout(function () {
            cont.find('.four p:nth-child(2)').css({opacity: 1})

            var num = cont.find('.four p:nth-child(2)')
            var lim = APP.dataset.orgs.length
            var cnt = 0
            timer = setInterval(function () {
              num.text(cnt)
              cnt += 10
              if (cnt >= lim) {
                clearTimeout(timer)
                num.text(lim)
              }
            })
          }, 1000)

          circR.css({fill: '#b164a5'})
          circ.transition({delay: 750, scale: 0.8}, 1500, 'easeInOutQuart')

          setNextBtnIn(4)
        },
        leave: function (option) {
          cont.find('.four p:first-child').transition({opacity: 0, y: -50}, 500, 'easeInOutQuart')
          cont.find('.four p:last-child').transition({opacity: 0, y: 50}, 500, 'easeInOutQuart')
          cont.find('.four p:nth-child(2)').transition({opacity: 0}, 500, 'easeInOutQuart')
          setNextBtnOut()
          clearTimeout(timer)
        }
      },

      five: {
        enter: function (option) {
          cont.find('.five p').css({opacity: 0, y: 30}).transition({opacity: 1, y: 0}, 3000, 'easeInOutQuint')
          onCanvas.five()

          circR.css({fill: '#f6f6f6'})
          circ.transition({delay: 750, scale: 1}, 1500, 'easeInOutQuart')

          setNextBtnIn(5)
        },
        leave: function (option) {
          cont.find('.five p').transition({opacity: 0}, 750, 'easeInOutQuint')
          setNextBtnOut()
        }
      }

    }

    return obj
  }

  window.onboardingState = init
})(window, window.jQuery, window.OnBoardingCanvas, window.OnBoardingSvg)
