import { createMuiTheme } from '@material-ui/core'

const style = {
  elevation: '0px 2px 8px rgba(0, 0, 0, 0.15)',
  typography: {
    fontWeightBold: 600
  },
  borderRadius: {
    xs: '2px',
    sm: '4px',
    md: '6px',
    button: '25px'
  },
  primary: {
    100: '#FCE1DA',
    200: '#F8C3B5',
    300: '#F4A590',
    400: '#F0876A',
    500: '#ED6A45',
    600: '#E8471C'
  },
  secondary: {
    100: '#DEDFE3',
    200: '#C8C9D0',
    300: '#B2B4BD',
    400: '#717484',
    main: '#4B4D58',
    500: '#4B4D58',
    600: '#28292f'
  },
  textSecondary: '#717484'
}

/**
 * Creates 24 "instances" of the same elevation since
 * we only have one
 */
const shadows = []
for (let i = 0; i <= 24; i++) {
  shadows.push(style.elevation)
}

const theme = createMuiTheme({
  props: {
    MuiDialog: {
      PaperProps: {
        square: true
      }
    },
    MuiButtonBase: {
      disableRipple: true,
    },
    MuiCheckbox: {
      disableRipple: true,
    },
    MuiRadio: {
      disableRipple: true,
    },
    MuiListItem: {
      disableRipple: true,
    }
  },
  shadows: [
    'none',
    ...shadows
  ],
  typography: {
    fontFamily: "'Source Sans Pro', sans-serif",
    fontWeightBold: style.typography.fontWeightBold,
    body2: {
      fontSize: '0.875rem',
    },
    body1: {
      fontSize: '1.125rem'
    },
    h1: {
      fontSize: '2.25rem',
      fontWeight: style.typography.fontWeightBold,
      color: 'var(--color-gray-500)',
      marginBottom: '20px'
    },
    h2: {
      fontSize: '1.875rem',
      fontWeight: style.typography.fontWeightBold,
      margin: '80px 0 20px 0',
      color: 'var(--color-gray-500)'
    },
    h3: {
      fontSize: 'var(--text-xl)',
      fontWeight: style.typography.fontWeightBold,
      color: 'var(--color-gray-400)'
    },
    h4: {
      fontSize: '1.25rem',
      color: 'var(--color-gray-400)',
      fontWeight: style.typography.fontWeightBold
    },
  },
  overrides: {
    MuiButton: {
      root: {
        borderRadius: style.borderRadius.button,
        fontSize: '1.125rem',
        lineHeight: 1,
        padding: '10px 18px',
        textTransform: 'none',
        fontWeight: style.typography.fontWeightBold,
        minWidth: '100px',
        '&$disabled': {
          color: '#fff'
        }
      },
      containedPrimary: {
        '&:hover': {
          backgroundColor: style.primary[500],
          boxShadow: '0px 2px 7px rgba(0, 0, 0, 0.41)'
        },
        '&$disabled': {
          color: '#fff'
        }
      },
      sizeLarge: {
        minWidth: '280px'
      },
      containedSizeLarge: {
        borderRadius: style.borderRadius.button,
        padding: '10px 18px',
        fontSize: '1.25rem',
        lineHeight: 1,
      },
      outlinedSizeLarge: {
        borderRadius: style.borderRadius.button,
        padding: '10px 18px',
        fontSize: '1.25rem',
        lineHeight: 1
      },
      containedSizeSmall: {
        borderRadius: style.borderRadius.button,
        padding: '10px 18px',
        fontSize: '0.9375rem',
        lineHeight: 1,
        minWidth: '84px'
      },
      outlined: {
        borderWidth: style.borderRadius.xs,
        padding: '8px 16px',
        minWidth: '100px',
        boxShadow: 'var(--elevation-1)'
      },
      outlinedPrimary: {
        borderWidth: style.borderRadius.xs,
        borderColor: '#ED6A45',
        '&:hover': {
          borderWidth: style.borderRadius.xs,
          backgroundColor: 'transparent',
          boxShadow: '0px 2px 7px rgba(0, 0, 0, 0.41)'
        },
        '&.Mui-disabled': {
          borderWidth: '2px',
          borderColor: 'var(--color-gray-300)',
          color: 'var(--color-gray-300)'
        }
      }
    },
    MuiIconButton: {
      root: {
        '&:hover': {
          backgroundColor: 'transparent'
        }
      },
      colorPrimary: {
        '&:hover': {
          backgroundColor: 'transparent'
        }
      }
    },
    MuiFormLabel: {
      root: {
        color: 'inherit',
        fontSize: '1.125rem',
        '&$focused': {
          color: style.secondary[500]
        },
        '&$disabled': {
          color: 'var(--color-gray-400)'
        },
      },
      filled: {
        color: 'inherit'
      },
      asterisk: {
        color: '#EA532A'
      }
    },
    MuiFormHelperText: {
      root: {
        color: style.secondary[400],
        fontSize: '0.75rem'
      }
    },
    MuiInput: {
      underline: {
        '&:hover': {
          '&:not(.Mui-disabled)': {
            '&::before': {
              borderBottomWidth: '2px',
              borderColor: style.secondary[500]
            },
          }
        },
        '&::after': {
          borderBottomWidth: '2px',
          borderColor: 'inherit'
        },
        '&::before': {
          borderBottomWidth: '2px',
          borderColor: style.secondary[400]
        },
        '&$focused': {
          '&::after': {
            color: style.secondary[500]
          }
        },
        '&$disabled': {
          '&::before': {
            borderBottomStyle: 'solid',
            borderBottomColor: 'var(--color-gray-300)'
          }
        }
      },
      root: {
        fontSize: '1.125rem',
        '&:after': {
          borderBottomWidth: '2px'
        },
        '&$focused': {
          color: style.secondary[400]
        }
      }
    },
    MuiInputBase: {
      input: {
        color: '#494b58',
        '&$disabled': {
          color: style.secondary[400]
        }
      },
    },
    MuiFormControl: {
      root: {
        color: style.secondary[400],
        '&:hover': {
          color: style.secondary[500]
        }
      }
    },
    MuiTextField: {
      root: {
        color: style.secondary[400],
        '&:hover': {
          color: style.secondary[500]
        }
      }
    },
    MuiOutlinedInput: {
      root: {
        borderRadius: 0
      },
      input: {
        padding: '7px 14px',
        paddingLeft: '10px'
      },
      notchedOutline: {
        borderWidth: '2px',
        borderColor: 'inherit',
        color: style.secondary[400],
      }
    },
    MuiCheckbox: {
      colorPrimary: {
        color: style.primary[500],
        '&$checked': {
          '&:hover': {
            backgroundColor: 'transparent'
          }
        }
      },
    },
    MuiRadio: {
      colorPrimary: {
        color: style.primary[500],
        '&$checked': {
          '&:hover': {
            backgroundColor: 'transparent'
          }
        }
      },
    },
    MuiTabs: {
      root: {
        minHeight: '35px',
        color: style.secondary[400],
        fontWeight: 600
      }
    },
    MuiTab: {
      root: {
        minHeight: '35px',
        fontSize: '1.3125rem',
        lineHeight: 1,
        textTransform: 'none',
        fontWeight: 'inherit'
      },
      textColorInherit: {
        opacity: 1
      }
    },
    MuiCardContent: {
      root: {
        padding: '20px'
      }
    },
    MuiDialog: {

    },
    MuiDialogActions: {
      root: {
        justifyContent: 'center',
        paddingBottom: '50px',
        flexWrap: 'wrap'
      }
    },
    MuiDialogTitle: {
      root: {
        paddingTop: '49px'
      }
    },
    MuiPopover: {
      paper: {
        pointerEvents: 'auto'
      }
    },
    MuiTableContainer: {
      root: {
        borderRadius: '4px',
        border: '1px solid var(--color-gray-300)'
      }
    },
    MuiTableHead: {
      root: {
        position: 'relative',
      }
    },
    MuiTableRow: {
      root: {
        color: style.secondary[400]
      }
    },
    MuiTableCell: {
      body: {
        border: 0,
        fontSize: '0.875rem',
        color: 'inherit'
      },
      stickyHeader: {
        backgroundColor: '#fff'
      },
      head: {
        fontSize: '1.125rem',
        fontWeight: 'bold',
        color: style.secondary[400],
        border: 'none',
        padding: '8px 16px',
        position: 'relative',
        '&::before, &::after': {
          content: '""',
          top: 0,
          width: '1px',
          height: '100%',
          display: 'block',
          background: '#fff',
          position: 'absolute'
        },
        '&::before': {
          left: 0,
        },
        '&::after': {
          right: 0
        }
      }
    },
    MuiTablePagination: {
      caption: {
        color: 'var(--color-gray-500)'
      }
    }
  },
  palette: {
    primary: style.primary,
    secondary: style.secondary,
    text: {
      secondary: style.textSecondary
    }
  }
}, {
  MuiPaper: {
    square: true
  }
})

export default theme
