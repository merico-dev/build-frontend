import React from 'react'
import styled from '@emotion/styled'
import {
  Typography,
  Dialog,
  DialogContent,
  makeStyles,
  useTheme,
  useMediaQuery
} from '@material-ui/core'
import copy from 'clipboard-copy'
import { css } from '@emotion/core'

import { ReactComponent as Facebook } from '@/icons/facebook.svg'
import { ReactComponent as Twitter } from '@/icons/twitter.svg'
import { ReactComponent as Linkedin } from '@/icons/linkedin.svg'
import ModalClose from '@/components/ModalClose'

import { MP, BadgeEvents } from '@/utils/mixpanel'

import config from '@config/resolveConfig'

const StyledShareList = styled.div`
  display: flex;
  gap: 30px;
`

const StyledShareField = styled.div`
  padding: 10px 0;
  font-weight: var(--text-semibold);
  font-size: var(--text-sm);
`

const StyledShareInputText = styled.div`
  width: calc(100% - 50px);
  font-weight: normal;
  ${({ textarea }) => !textarea && css`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `}
`

const StyledShareInput = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 10px;
  border: 1px solid var(--color-primary-400);
  border-radius: var(--radius-xs);
  margin-top: 8px;
`

const StyledShareCopy = styled.button`
  color: var(--color-primary-400);
  cursor: pointer;
  border: 0;
  background: transparent;
  font-weight: var(--text-semilbold);
  &:focus {
    outline: 0;
  }
`

const StyledSocialIcon = styled.a`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 60px;
  text-align: center;
  text-decoration: none;
  color: var(--color-gray-500);
  font-size: var(--text-xs);
  gap: 10px;
`

const useStyles = makeStyles((theme) => ({
  title: {
    margin: '30px 0 20px'
  },
  dialogContent: {
    padding: '0 40px 25px',
    [theme.breakpoints.down('xs')]: {
      padding: '0 15px 15px',
    }
  }
}))

export default function ShareBadgeDialog (props) {
  const {
    open,
    handleClose,
    id,
    badgeImage,
    badgeTitle
  } = props

  const theme = useTheme()
  const isXsDown = useMediaQuery(theme.breakpoints.down('xs'))
  const classes = useStyles()
  const assertionLink = `${config.frontendUrl}/badges/assertion/${id}`
  const iconSize = 50 // isXsDown ? 30 : 50;

  const handleCopyText = (text) => {
    copy(text)
    MP.track(BadgeEvents.SHARE_BADGE, { 'Badge Title': badgeTitle, 'Badge Image': badgeImage, 'Share Link': text })
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
      maxWidth='sm'
      className={classes.dialog}
      fullWidth
    >
      <ModalClose
        onClick={handleClose}
      />
      <div>
        <Typography
          variant='h2'
          align='center'
          className={classes.title}
        >
          Share
        </Typography>
        <DialogContent className={classes.dialogContent}>
          <StyledShareList>
            <StyledSocialIcon
              target='_blank'
              href={`https://www.facebook.com/sharer/sharer.php?u=${assertionLink}`}
            >
              <Facebook
                width={iconSize}
                height={iconSize}
              />
              Facebook
            </StyledSocialIcon>
            <StyledSocialIcon
              href={`https://twitter.com/intent/tweet?text=Check%20out%20my%20new%20Merico%20Build%20badge%20${assertionLink}`}
              target='_blank'
            >
              <Twitter width={iconSize} height={iconSize} />
              Twitter
            </StyledSocialIcon>
            <StyledSocialIcon
              target='_blank'
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${assertionLink}`}
            >
              <Linkedin width={iconSize} height={iconSize} />
              Linkedin
            </StyledSocialIcon>
            {/* <StyledSocialIcon href="#certificate">
              <LinkedinCertificate width={iconSize} height={iconSize} />
              Linkedin Certificate
            </StyledSocialIcon> */}
          </StyledShareList>
          <StyledShareField>
            URL
            <StyledShareInput>
              <StyledShareInputText>{assertionLink}</StyledShareInputText>
              <StyledShareCopy
                type='text'
                onClick={() => handleCopyText(assertionLink)}
              >COPY
              </StyledShareCopy>
            </StyledShareInput>
          </StyledShareField>
          <StyledShareField>
            Embed
            <StyledShareInput>
              <StyledShareInputText textarea={!isXsDown}>
                {`<a href="${assertionLink}" alt="Badge for ${badgeTitle}"><img src="${badgeImage}"></a>`}
              </StyledShareInputText>
              <StyledShareCopy
                type='text'
                onClick={() => handleCopyText(`<a href="${assertionLink}"><img src="${badgeImage}" alt="Badge for ${badgeTitle}"></a>`)}
              >COPY
              </StyledShareCopy>
            </StyledShareInput>
          </StyledShareField>
          <StyledShareField>
            Markdown
            <StyledShareInput>
              <StyledShareInputText>
                [![Badge for {badgeTitle}]({badgeImage})]({assertionLink})
              </StyledShareInputText>
              <StyledShareCopy
                type='text'
                onClick={() => handleCopyText(`[![Badge for ${badgeTitle}](${badgeImage})](${assertionLink})`)}
              >COPY
              </StyledShareCopy>
            </StyledShareInput>
          </StyledShareField>
        </DialogContent>
      </div>
    </Dialog>
  )
}
