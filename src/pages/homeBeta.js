import React, { useState, useRef, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useSelector } from 'react-redux'
import { useRouteMatch } from 'react-router-dom'

import Header from '@/components/home-beta/Header'
import Landing from '@/components/home-beta/Landing'
import Footer from '@/components/home-beta/Footer'
import CookieWarning from '@/components/CookieWarning'

import { MP, AppEvents } from '@/utils/mixpanel'

// FastFWD Imported App Template CSS
import '@/components/home-beta/css/app.css'
import '@/components/home-beta/css/localized.scss'

export default function Home () {
  const user = useSelector((state) => state.user)

  const isMountedRef = useRef(false)
  const heroTextRef = useRef(null)
  // (#876 Disable Homepage Header Animation)
  // const [toRotate, setToRotate] = useState([])
  // const [el, setEl] = useState(null)
  const [hasVisited, setHasVisited] = useState(false)
  const atHomepage = useRouteMatch('/')

  // let tickAnimation

  // let delta = 300
  // let isDeleting = false
  // let loopNum = 0
  // let period = 2000
  // let txt = ''

  // const typewriter = () => {
  //   if (el && toRotate && period) {
  //     const fullTxt = toRotate[loopNum % toRotate.length]
  //     period = parseInt(el.getAttribute('data-period'), 10)
  //     if (isDeleting) {
  //       txt = fullTxt.substring(0, txt.length - 1)
  //     } else {
  //       txt = fullTxt.substring(0, txt.length + 1)
  //     }

  //     if (heroTextRef.current) {
  //       heroTextRef.current.innerHTML = `<span class="wrap">${txt}</span>`
  //     }
  //     delta = 300 - Math.random() * 100
  //     if (isDeleting) { delta /= 2 }
  //     if (!isDeleting && txt === fullTxt) {
  //       delta = period
  //       isDeleting = true
  //     } else if (isDeleting && txt === '') {
  //       isDeleting = false
  //       loopNum++
  //       delta = 500
  //     }

  //     setTimeout(() => {
  //       typewriter()
  //     }, delta)
  //   }
  // }

  // const typeAnimation = () => {
  //   typewriter();
  // };

  useEffect(() => {
    isMountedRef.current = true

    if (atHomepage && isMountedRef.current && heroTextRef.current) {
      // (#876 Disable Homepage Header Animation)
      // setEl(heroTextRef.current)
      // setToRotate(JSON.parse(heroTextRef.current.getAttribute('data-rotate')))
      // eslint-disable-next-line react-hooks/exhaustive-deps
      // tickAnimation = window.requestAnimationFrame(typewriter)
      if (!hasVisited) {
        MP.track(AppEvents.VISIT_HOMEPAGE, {})
        setHasVisited(true)
      }
    }

    return () => {
      isMountedRef.current = false
      // clearInterval(tickInterval);
      // (#876 Disable Homepage Header Animation)
      // window.cancelAnimationFrame(tickAnimation)
    }
  }, [atHomepage, hasVisited])

  return (
    <>
      <div id='HomePageStyled'>
        <Helmet>
          <title>Merico Build - Beta</title>
          <meta charset='UTF-8' />
          <meta name='viewport' content='width=device-width, initial-scale=1.0' />
          <link rel='preconnect' href='https://cdn.mericobuild.com' />
          <link
          // eslint-disable-next-line max-len
            href='https://cdn.mericobuild.com/fonts-css/gfont-lato-and-space-grotesk-300-400-700.css'
            rel='stylesheet'
          />
          <link href='images/favicon.png' rel='shortcut icon' type='image/x-icon' />
        </Helmet>
        <Header heroTextRef={heroTextRef} user={user} />
        {/* <ProductHuntBadge type='topPost' /> */}
        <Landing user={user} />
        <Footer user={user} />
      </div>
      <CookieWarning />
    </>
  )
}
