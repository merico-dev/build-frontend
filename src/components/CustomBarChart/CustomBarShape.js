import React from 'react'

function getBarShape (x, y, width, height, radius) {
  const [tl, tr, bl, br] = radius
  const d = `M${x},${y + tl}
    a${tl},${tl} 0 0 1 ${tl},${-tl}
    h${width - tl - tr}
    a${tr},${tr} 0 0 1 ${tr},${tr}
    v${height - tr - br}
    a${br},${br} 0 0 1 ${-br},${br}
    h${bl + (br - width)}
    a${bl},${bl} 0 0 1 ${-bl},${-bl}
    z`
  return ({ fill, fillOpacity, stroke }) => (
    <path d={d} fill={fill} fillOpacity={fillOpacity} stroke={stroke} />
  )
}

export default function CustomBarShape (props) {
  const {
    x,
    y,
    width,
    height,
    change
  } = props

  const Bar = getBarShape(x, y, width, height, [0, 0, 0, 0])
  return (
    <g>
      <Bar
        fillOpacity={1}
        fill={
          change < 1 ? 'var(--color-gray-300)' : 'var(--color-primary-400)'
        }
      />
    </g>
  )
}
