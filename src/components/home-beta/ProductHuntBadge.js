import React from 'react'
import styled from '@emotion/styled'
// import { css } from '@emotion/core'
// import { lgMedia, mdMedia, smMedia } from '@/styles/snippets/responsive'

const StyledProductHuntEmbed = styled.div`
  padding: 0;
`

const BadgeTypeData = {
  topPost: {
    link: 'https://www.producthunt.com/posts/merico-build?utm_source=badge-top-post-badge&utm_medium=badge&utm_souce=badge-merico-build',
    // image: 'https://api.producthunt.com/widgets/embed-image/v1/top-post-badge.svg?post_id=277928&theme=light&period=daily',
    image: 'https://cdn.mericobuild.com/product-hunt/top-post-badge.svg',
    tooltip: 'Merico Build - Free analytics to level up your code & career | Product Hunt'
  },
  featured: {
    link: 'https://www.producthunt.com/posts/merico-build?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-merico-build',
    // image: 'https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=277928&theme=light',
    image: 'https://cdn.mericobuild.com/product-hunt/featured-badge.svg',
    tooltip: 'Merico Build - Free analytics to level up your code & career | Product Hunt'
  }
}

const ProductHuntBadgeLink = (props) => {
  const { href, children } = props
  return (
    <a
      href={href}
      target='_blank'
      rel='noreferrer'
    >
      {children}
    </a>
  )
}

const ProductHuntBadgeImage = (props) => {
  const { src, alt, style, width, height } = props
  return (
    <img
      src={src}
      alt={alt}
      style={style}
      width={width}
      height={height}
    />
  )
}

export default function ProductHuntBadge (props) {
  const { type } = props

  const getBadgeType = (type) => {
    return BadgeTypeData[type] ? BadgeTypeData[type] : null
  }

  const activeBadge = () => {
    return getBadgeType(type)
  }

  if (!['topPost', 'featured'].includes(type) || getBadgeType(type) === null) {
    return null
  }

  return (
    <StyledProductHuntEmbed>
      <div className='container'>
        <div className='row justify-content-center'>
          <ProductHuntBadgeLink
            href={activeBadge().link}
          >
            <ProductHuntBadgeImage
              src={activeBadge().image}
              alt={activeBadge().tooltip}
              style={{ width: '250px', height: '54px', transform: 'scale(0.7)' }}
              width='250'
              height='54'
            />
          </ProductHuntBadgeLink>
        </div>
      </div>
    </StyledProductHuntEmbed>
  )
}
