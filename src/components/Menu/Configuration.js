import React from 'react'
import { ReactComponent as OverviewIcon } from '@/icons/menu/overview.svg'
import { ReactComponent as ContributorsIcon } from '@/icons/menu/contributors.svg'
import { ReactComponent as RepositoriesIcon } from '@/icons/menu/repositories.svg'
import { ReactComponent as ProgressIcon } from '@/icons/menu/progress.svg'
import { ReactComponent as BadgesIcon } from '@/icons/menu/badges.svg'
import { ReactComponent as ConfigIcon } from '@/icons/menu/config.svg'

const NextGenerationPrivateMenu = [
  {
    name: 'overview',
    label: 'Overview',
    to: '/dashboard/overview',
    exactMatch: true,
    activeClass: null,
    isActive: false,
    icon: <OverviewIcon />,
    disabled: false,
    badgeContent: null,
    children: [],
  },
  {
    name: 'projects',
    label: 'Maintenance',
    to: null,
    exactMatch: false,
    activeClass: null,
    isActive: false,
    icon: null,
    disabled: false,
    badgeContent: null,
    children: [
      {
        name: 'contributors',
        label: 'Contributors',
        to: '/dashboard/ranking',
        exactMatch: true,
        activeClass: null,
        isActive: false,
        icon: <ContributorsIcon />,
        disabled: false,
        badgeContent: null,
        children: []
      },
      {
        name: 'repositories',
        label: 'Repositories',
        to: '/projects/repositories',
        exactMatch: false,
        activeClass: null,
        isActive: false,
        icon: <RepositoriesIcon />,
        disabled: false,
        badgeContent: null,
        children: []
      }
    ]
  },
  {
    name: 'contribution',
    label: 'Contributing',
    to: null,
    exactMatch: false,
    activeClass: null,
    isActive: false,
    icon: null,
    disabled: false,
    badgeContent: null,
    children: [
      {
        name: 'progress',
        label: 'Progress',
        to: '/my-contributions/progress',
        exactMatch: false,
        activeClass: null,
        isActive: false,
        icon: <ProgressIcon />,
        disabled: false,
        badgeContent: null,
        children: []
      },
      {
        name: 'badges',
        label: 'Badges',
        to: '/badges',
        exactMatch: false,
        activeClass: null,
        isActive: false,
        icon: <BadgesIcon />,
        disabled: false,
        badgeContent: null,
        children: []
      }
    ]
  },
  {
    name: 'config',
    label: 'Repository Config',
    to: '/repositories',
    exactMatch: true,
    activeClass: null,
    isActive: false,
    icon: <ConfigIcon />,
    disabled: true,
    badgeContent: null,
    children: [],
  },
]

const NextGenerationPublicMenu = [
  {
    name: 'team',
    label: 'About',
    to: '/team',
    exactMatch: true,
    activeClass: null,
    isActive: false,
    disabled: false,
    badgeContent: null,
    children: [],
  },
  {
    name: 'contact',
    label: 'Contact',
    to: '/contact',
    exactMatch: true,
    activeClass: null,
    isActive: false,
    disabled: false,
    badgeContent: null,
    children: [],
  },
  {
    name: 'documentation',
    label: 'Help',
    to: '/help',
    exactMatch: true,
    activeClass: null,
    isActive: false,
    disabled: false,
    badgeContent: null,
    children: [],
  },
  {
    name: 'github',
    label: 'Github',
    href: 'https://github.com/merico-dev/community/discussions',
    exactMatch: true,
    activeClass: null,
    isActive: false,
    disabled: false,
    badgeContent: null,
    children: [],
  },
]

export {
  NextGenerationPrivateMenu,
  NextGenerationPublicMenu
}
