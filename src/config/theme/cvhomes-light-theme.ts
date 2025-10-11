import { createTheme } from "@mui/material/styles";

// Extend MUI types for custom variants
declare module '@mui/material/Paper' {
  interface PaperPropsVariantOverrides {
    loginCard: true;
    infoPanel: true;
    authForm: true;
  }
}

declare module '@mui/material/Box' {
  interface BoxPropsVariantOverrides {
    loginContainer: true;
    logoBox: true;
  }
}

declare module '@mui/material/TextField' {
  interface TextFieldPropsVariantOverrides {
    auth: true;
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    auth: true;
  }
}

declare module '@mui/material/Card' {
  interface CardPropsVariantOverrides {
    dashboard: true;
  }
}

declare module '@mui/material/Link' {
  interface LinkPropsVariantOverrides {
    footerLink: true;
  }
}

/**
 * CVHomes Light Theme
 * Tema completo con todas las personalizaciones de MUI
 */
export const cvhomesLightTheme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    }
  },
  shape: {
    borderRadius: 4
  },
  palette: {
    mode: 'light',
    primary: {
      50: '#E4ECF4',
      100: '#BCD0E3',
      200: '#8FB1D0',
      300: '#6392BD',
      600: '#1C5B98',
      700: '#18518E',
      800: '#134784',
      light: '#417AAE',
      main: '#2063A0',
      dark: '#0B3573',
      A100: '#A5C5FF',
      A200: '#72A4FF',
      A400: '#3F83FF',
      A700: '#2572FF',
      contrastText: '#ffffff'
    },
    secondary: {
      50: '#E0F7FA',
      100: '#B3EBF2',
      200: '#80DEEA',
      300: '#4DD0E1',
      600: '#00B6CF',
      700: '#00ADC9',
      800: '#00A5C3',
      light: '#26C6DA',
      main: '#00BCD4',
      dark: '#0097B9',
      A100: '#E2F9FF',
      A200: '#AFEEFF',
      A400: '#7CE3FF',
      A700: '#63DDFF',
      contrastText: '#ffffff'
    },
    error: {
      50: '#F9E8E8',
      100: '#F1C7C7',
      200: '#E8A1A1',
      300: '#DF7B7B',
      600: '#CC3D3D',
      700: '#C63434',
      800: '#C02C2C',
      light: '#D85F5F',
      main: '#D14343',
      dark: '#B51E1E',
      A100: '#FFECEC',
      A200: '#FFB9B9',
      A400: '#FF8686',
      A700: '#FF6D6D',
      contrastText: '#ffffff'
    },
    warning: {
      50: '#FFF0E0',
      100: '#FEDAB3',
      200: '#FDC280',
      300: '#FCAA4D',
      600: '#FA7D00',
      700: '#FA7200',
      800: '#F96800',
      light: '#FC9726',
      main: '#FB8500',
      dark: '#F85500',
      A100: '#FFFFFF',
      A200: '#FFF1EB',
      A400: '#FFCCB8',
      A700: '#FFBA9F',
      contrastText: '#ffffff'
    },
    info: {
      50: '#E6F3F8',
      100: '#C0E2EE',
      200: '#96CFE2',
      300: '#6CBCD6',
      600: '#2897BF',
      700: '#228DB8',
      800: '#1C83B0',
      light: '#4DADCE',
      main: '#2D9FC5',
      dark: '#1172A3',
      A100: '#D4EFFF',
      A200: '#A1DCFF',
      A400: '#6ECAFF',
      A700: '#54C1FF',
      contrastText: '#ffffff'
    },
    success: {
      50: '#F2F9E7',
      100: '#DDEFC4',
      200: '#C7E49D',
      300: '#B1D975',
      600: '#87C334',
      700: '#7CBC2C',
      800: '#72B525',
      light: '#A0D158',
      main: '#8FC93A',
      dark: '#60A918',
      A100: '#EDFFDE',
      A200: '#D2FFAB',
      A400: '#B6FF78',
      A700: '#A9FF5E',
      contrastText: '#ffffff'
    },
    grey: {
      50: '#FBFBFB',
      100: '#F5F5F6',
      200: '#EAEBEC',
      300: '#DCDEE0',
      400: '#CED1D4',
      500: '#C4C7CA',
      600: '#B9BDC1',
      700: '#B2B7BB',
      800: '#AAAEB3',
      900: '#A2A6AB',
      A100: '#FFFFFF',
      A200: '#FFFFFF',
      A400: '#D4EAFF',
      A700: '#BBDDFF'
    },
    text: {
      primary: '#101840de',
      secondary: '#10184099',
      disabled: '#10184061'
    },
    action: {
      active: '#1018408a',
      hover: '#1018400a',
      selected: '#10184014',
      disabled: '#10184042',
      disabledBackground: '#1018401f',
      focus: '#1018401f',
      hoverOpacity: 0.04,
      selectedOpacity: 0.08,
      disabledOpacity: 0.38,
      focusOpacity: 0.12,
      activatedOpacity: 0.12
    },
    background: {
      default: '#f5f5f5',
      paper: '#fff'
    },
    divider: '#0000001f',
    // Chip colors personalizados
    chipPrimary: {
      main: '#C4E1F5',
      dark: '#A2CDEE',
      light: '#E2F0FA',
      contrastText: '#5A5E73'
    },
    chipSecondary: {
      main: '#C4F6FD',
      dark: '#A8F1FB',
      light: '#E0FBFE',
      contrastText: '#545E73'
    },
    chipInfo: {
      main: '#C0E8FC',
      dark: '#9CD8FA',
      light: '#E0F4FE',
      contrastText: '#5A5E73'
    },
    chipWarning: {
      main: '#FCE4C0',
      dark: '#FAD19C',
      light: '#F3F2F0',
      contrastText: '#5A5E73'
    },
    chipError: {
      main: '#FCD4D4',
      dark: '#F4B9B9',
      light: '#FEEAEA',
      contrastText: '#5A5E73'
    },
    chipSuccess: {
      main: '#DDF8C3',
      dark: '#C8F3A2',
      light: '#EFFCE2',
      contrastText: '#5A5E73'
    },
    chipDefault: {
      main: '#E4E5E7',
      dark: '#D1D3D7',
      light: '#F2F2F3',
      contrastText: '#5A5E73'
    }
  } as any,
  typography: {
    fontSize: 13,
    fontFamily: 'Roboto, "Helvetica", "Arial", sans-serif',
    htmlFontSize: 16,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: {
      fontFamily: 'Roboto',
      fontSize: 40,
      fontWeight: 300,
      letterSpacing: -1.5,
      lineHeight: '48px'
    },
    h2: {
      fontFamily: 'Roboto',
      fontSize: 32,
      fontWeight: 400,
      lineHeight: '40px',
      letterSpacing: -0.5
    },
    h3: {
      fontFamily: 'Roboto',
      fontSize: 28,
      fontWeight: 500,
      lineHeight: '32px',
      letterSpacing: 0
    },
    h4: {
      fontFamily: 'Roboto',
      fontSize: 22,
      fontWeight: 600,
      lineHeight: '26px',
      letterSpacing: '0.25px'
    },
    h5: {
      fontFamily: 'Roboto',
      fontSize: 18,
      fontWeight: 600,
      letterSpacing: 0,
      lineHeight: '22px'
    },
    h6: {
      fontFamily: 'Roboto',
      fontSize: 16,
      fontWeight: 600,
      lineHeight: '20px',
      letterSpacing: '0.15px',
      '@media(max-width: 885px)': {
        fontSize: 17
      }
    },
    body1: {
      fontFamily: 'Roboto',
      fontSize: 14,
      fontWeight: 400,
      lineHeight: '20px',
      letterSpacing: '0.15px',
      '@media(max-width: 885px)': {
        fontSize: 15
      }
    },
    body2: {
      fontFamily: 'Roboto',
      fontSize: 13,
      fontWeight: 400,
      lineHeight: '16px',
      letterSpacing: '0.17px',
      '@media(max-width: 885px)': {
        fontSize: 14
      }
    },
    subtitle1: {
      fontFamily: 'Roboto',
      fontSize: 14,
      fontWeight: 500,
      lineHeight: '16px',
      letterSpacing: '0.15px',
      '@media(max-width: 885px)': {
        fontSize: 15
      }
    },
    subtitle2: {
      fontFamily: 'Roboto',
      fontSize: 13,
      fontWeight: 500,
      lineHeight: '16px',
      letterSpacing: '0.1px',
      '@media(max-width: 885px)': {
        fontSize: 14
      }
    },
    caption: {
      fontFamily: 'Roboto',
      fontSize: 11,
      fontWeight: 400,
      lineHeight: '14px',
      letterSpacing: '0.4px',
      '@media(max-width: 885px)': {
        fontSize: 12
      }
    },
    overline: {
      fontFamily: 'Roboto',
      fontSize: 11,
      fontWeight: 400,
      lineHeight: '24px',
      letterSpacing: '1px',
      '@media(max-width: 885px)': {
        fontSize: 12
      },
      textTransform: 'uppercase'
    },
    button: {
      fontFamily: 'Roboto, "Helvetica", "Arial", sans-serif',
      fontWeight: 500,
      fontSize: '0.8125rem',
      lineHeight: 1.75,
      letterSpacing: '0.02857em',
      textTransform: 'uppercase'
    }
  },
  shadows: [
    'none',
    '0px 1px 3px rgba(24, 39, 75, 0.12), 0px 1px 1px -1px rgba(24, 39, 75, 0.14), 0px 2px 1px -2px rgba(24, 39, 75, 0.2)',
    '0px 1px 5px rgba(24, 39, 75, 0.12), 0px 2px 2px rgba(24, 39, 75, 0.14), 0px 3px 1px -2px rgba(24, 39, 75, 0.2)',
    '0px 1px 8px rgba(24, 39, 75, 0.12), 0px 3px 4px rgba(24, 39, 75, 0.14), 0px 3px 3px -2px rgba(24, 39, 75, 0.2)',
    '0px 2px 4px -1px rgba(24, 39, 75, 0.2), 0px 4px 5px rgba(24, 39, 75, 0.14), 0px 1px 10px rgba(24, 39, 75, 0.12)',
    '0px 3px 5px -1px rgba(24, 39, 75, 0.2), 0px 5px 8px rgba(24, 39, 75, 0.14), 0px 1px 14px rgba(24, 39, 75, 0.12)',
    '0px 3px 5px -1px rgba(24, 39, 75, 0.2), 0px 6px 10px rgba(24, 39, 75, 0.14), 0px 1px 18px rgba(24, 39, 75, 0.12)',
    '0px 4px 5px -2px rgba(24, 39, 75, 0.2), 0px 7px 10px 1px rgba(24, 39, 75, 0.14), 0px 2px 16px 1px rgba(24, 39, 75, 0.12)',
    '0px 5px 5px -3px rgba(24, 39, 75, 0.2), 0px 8px 10px 1px rgba(24, 39, 75, 0.14), 0px 3px 14px 2px rgba(24, 39, 75, 0.12)',
    '0px 5px 6px -3px rgba(24, 39, 75, 0.2), 0px 9px 12px 1px rgba(24, 39, 75, 0.14), 0px 3px 16px 2px rgba(24, 39, 75, 0.12)',
    '0px 6px 6px -3px rgba(24, 39, 75, 0.2), 0px 10px 14px 1px rgba(24, 39, 75, 0.14), 0px 4px 18px 3px rgba(24, 39, 75, 0.12)',
    '0px 6px 7px -4px rgba(24, 39, 75, 0.2), 0px 11px 15px 1px rgba(24, 39, 75, 0.14), 0px 4px 20px 3px rgba(24, 39, 75, 0.12)',
    '0px 7px 8px -4px rgba(24, 39, 75, 0.2), 0px 12px 17px 2px rgba(24, 39, 75, 0.14), 0px 5px 22px 4px rgba(24, 39, 75, 0.12)',
    '0px 7px 8px -4px rgba(24, 39, 75, 0.2), 0px 13px 19px 2px rgba(24, 39, 75, 0.14), 0px 5px 24px 4px rgba(24, 39, 75, 0.12)',
    '0px 7px 9px -4px rgba(24, 39, 75, 0.2), 0px 14px 21px 2px rgba(24, 39, 75, 0.14), 0px 5px 26px 4px rgba(24, 39, 75, 0.12)',
    '0px 8px 9px -5px rgba(24, 39, 75, 0.2), 0px 15px 22px 2px rgba(24, 39, 75, 0.14), 0px 6px 28px 5px rgba(24, 39, 75, 0.12)',
    '0px 8px 10px -5px rgba(24, 39, 75, 0.2), 0px 16px 24px 2px rgba(24, 39, 75, 0.14), 0px 6px 30px 5px rgba(24, 39, 75, 0.12)',
    '0px 8px 11px -5px rgba(24, 39, 75, 0.2), 0px 17px 26px 2px rgba(24, 39, 75, 0.14), 0px 6px 32px 5px rgba(24, 39, 75, 0.12)',
    '0px 9px 11px -5px rgba(24, 39, 75, 0.2), 0px 18px 28px 2px rgba(24, 39, 75, 0.14), 0px 7px 34px 6px rgba(24, 39, 75, 0.12)',
    '0px 9px 12px -6px rgba(24, 39, 75, 0.2), 0px 19px 29px 2px rgba(24, 39, 75, 0.14), 0px 7px 36px 6px rgba(24, 39, 75, 0.12)',
    '0px 10px 13px -6px rgba(24, 39, 75, 0.2), 0px 20px 31px 3px rgba(24, 39, 75, 0.14), 0px 8px 38px 7px rgba(24, 39, 75, 0.12)',
    '0px 10px 13px -6px rgba(24, 39, 75, 0.2), 0px 21px 33px 3px rgba(24, 39, 75, 0.14), 0px 8px 40px 7px rgba(24, 39, 75, 0.12)',
    '0px 10px 14px -6px rgba(24, 39, 75, 0.2), 0px 22px 35px 3px rgba(24, 39, 75, 0.14), 0px 8px 42px 7px rgba(24, 39, 75, 0.12)',
    '0px 11px 14px -7px rgba(24, 39, 75, 0.2), 0px 23px 36px 3px rgba(24, 39, 75, 0.14), 0px 9px 44px 8px rgba(24, 39, 75, 0.12)',
    '0px 11px 15px -7px rgba(24, 39, 75, 0.2), 0px 24px 38px 3px rgba(24, 39, 75, 0.14), 0px 9px 46px 8px rgba(24, 39, 75, 0.12)'
  ],
  mixins: {
    toolbar: {
      minHeight: 48,
      '@media (max-width:959.95px)': {
        minHeight: 52
      }
    }
  },
  transitions: {
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)'
    },
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195
    }
  },
  zIndex: {
    mobileStepper: 1000,
    fab: 1050,
    speedDial: 1050,
    appBar: 1100,
    drawer: 1200,
    modal: 1300,
    snackbar: 1400,
    tooltip: 1500
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '.login-container': {
          height: '100vh',
          width: '100vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'fixed',
          top: 0,
          left: 0,
          overflow: 'auto',
          background: `linear-gradient(135deg,
            rgba(32, 99, 160, 0.03) 0%,
            rgba(0, 188, 212, 0.02) 50%,
            rgba(11, 53, 115, 0.04) 100%)`,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `
              radial-gradient(circle at 20% 80%, rgba(32, 99, 160, 0.05) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(0, 188, 212, 0.05) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(65, 122, 174, 0.03) 0%, transparent 50%)
            `,
            pointerEvents: 'none',
          },
        },
        '.logo-box': {
          width: 80,
          height: 80,
          borderRadius: 16,
          background: `linear-gradient(135deg, #2063A0 0%, #0B3573 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto',
          marginBottom: 32,
          position: 'relative',
          boxShadow: `
            0 10px 40px rgba(32, 99, 160, 0.3),
            inset 0 -2px 10px rgba(0, 0, 0, 0.2)
          `,
          animation: 'float 6s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': {
              transform: 'translateY(0px)',
            },
            '50%': {
              transform: 'translateY(-10px)',
            },
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: 'inherit',
            background: `linear-gradient(135deg,
              transparent 0%,
              rgba(255, 255, 255, 0.2) 50%,
              transparent 100%)`,
            opacity: 0.6,
          },
          '& .logo-icon-left': {
            position: 'absolute',
            left: -8,
            transform: 'rotate(-15deg)',
            zIndex: 2,
            color: 'white',
            fontSize: 36,
          },
          '& .logo-icon-right': {
            position: 'absolute',
            right: -8,
            transform: 'rotate(15deg)',
            zIndex: 1,
            color: 'white',
            fontSize: 36,
          },
          '@media (max-width: 600px)': {
            width: 64,
            height: 64,
            '& .logo-icon-left, & .logo-icon-right': {
              fontSize: 28,
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        outlined: {
          paddingBlock: '13px'
        },
        iconStandard: {
          '&.MuiSelect-iconStandard.MuiSvgIcon-root': {
            top: 'calc(50% - .4em)'
          }
        },
        iconFilled: {
          '&.MuiSelect-iconFilled.MuiSvgIcon-root': {
            top: 'calc(50% - .15em)'
          }
        },
        iconOutlined: {
          '&.MuiSelect-iconOutlined.MuiSvgIcon-root': {
            top: 'calc(50% - .35em)'
          }
        },
        icon: {
          width: 16,
          height: 16
        },
        root: {
          fontSize: 13,
          fontStyle: 'normal',
          fontWeight: 400,
          letterSpacing: '0.15px',
          lineHeight: '19px'
        }
      }
    },
    MuiSpeedDialIcon: {
      styleOverrides: {
        icon: {
          height: 24,
          width: 24
        }
      }
    },
    MuiSpeedDialAction: {
      styleOverrides: {
        fab: {
          height: 40,
          width: 40
        }
      }
    },
    MuiSpeedDial: {
      styleOverrides: {
        fab: {
          height: 56,
          width: 56
        }
      }
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          '.MuiButtonBase-root.MuiAccordionSummary-root': {
            minHeight: 44,
            height: 44
          }
        }
      }
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: 40
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        labelIcon: {
          paddingBlock: 10
        },
        root: {
          textTransform: 'none',
          minHeight: 40
        }
      }
    },
    // MuiDataGrid: Requires @mui/x-data-grid to be installed
    // Uncomment when @mui/x-data-grid is added to dependencies
    /* MuiDataGrid: {
      defaultProps: {
        density: 'compact'
      },
      styleOverrides: {
        columnHeader: {
          variants: [
            {
              props: { density: 'compact' },
              style: {
                '--height': '24px',
                minHeight: '24px !important',
                maxHeight: '24px !important'
              }
            },
            {
              props: { density: 'standard' },
              style: {
                '--height': '36px',
                minHeight: '36px !important',
                maxHeight: '36px !important'
              }
            },
            {
              props: { density: 'comfortable' },
              style: {
                '--height': '52px',
                minHeight: '52px !important',
                maxHeight: '52px !important'
              }
            }
          ]
        },
        columnSeparator: {
          variants: [
            {
              props: { density: 'compact' },
              style: {
                '--height': '24px',
                minHeight: '24px !important',
                maxHeight: '24px !important'
              }
            },
            {
              props: { density: 'standard' },
              style: {
                '--height': '36px',
                minHeight: '36px !important',
                maxHeight: '36px !important'
              }
            },
            {
              props: { density: 'comfortable' },
              style: {
                '--height': '52px',
                minHeight: '52px !important',
                maxHeight: '52px !important'
              }
            }
          ]
        },
        iconButtonContainer: {
          fontSize: 16
        },
        columnHeaderDraggableContainer: {
          variants: [
            {
              props: { density: 'compact' },
              style: {
                '--height': '24px',
                minHeight: '24px !important',
                maxHeight: '24px !important'
              }
            },
            {
              props: { density: 'standard' },
              style: {
                '--height': '36px',
                minHeight: '36px !important',
                maxHeight: '36px !important'
              }
            },
            {
              props: { density: 'comfortable' },
              style: {
                '--height': '52px',
                minHeight: '52px !important',
                maxHeight: '52px !important'
              }
            }
          ]
        },
        columnHeaderTitle: {
          fontFamily: 'Roboto',
          fontWeight: 500,
          fontSize: 13,
          lineHeight: 1.5,
          letterSpacing: 0.17
        },
        row: {
          variants: [
            {
              props: { density: 'compact' },
              style: {
                '--height': '22px',
                minHeight: '22px !important',
                maxHeight: '22px !important'
              }
            },
            {
              props: { density: 'standard' },
              style: {
                '--height': '28px',
                minHeight: '28px !important',
                maxHeight: '28px !important'
              }
            },
            {
              props: { density: 'comfortable' },
              style: {
                '--height': '48px',
                minHeight: '48px !important',
                maxHeight: '48px !important'
              }
            }
          ]
        },
        cell: {
          fontFamily: 'Roboto',
          fontWeight: 300,
          fontSize: 12,
          lineHeight: 1.5,
          letterSpacing: 0.17,
          display: 'flex',
          alignItems: 'center',
          variants: [
            {
              props: { density: 'compact' },
              style: {
                '--height': '22px',
                minHeight: '22px !important',
                maxHeight: '22px !important'
              }
            },
            {
              props: { density: 'standard' },
              style: {
                '--height': '28px',
                minHeight: '28px !important',
                maxHeight: '28px !important'
              }
            },
            {
              props: { density: 'comfortable' },
              style: {
                '--height': '48px',
                minHeight: '48px !important',
                maxHeight: '48px !important'
              }
            }
          ],
          '.MuiButtonBase-root': {
            lineHeight: 0,
            textTransform: 'capitalize'
          },
          '.MuiDataGrid-cell': {
            '&:focus': {
              outline: 'transparent',
              borderWidth: 0
            }
          }
        },
        menuIconButton: {
          svg: {
            fontSize: '16px'
          }
        },
        menu: {
          svg: {
            fontSize: '16px !important'
          },
          '.MuiMenuItem-root': {
            minHeight: '28px',
            height: '28px'
          }
        },
        pinnedRows: {
          borderTop: '1px solid rgba(228, 236, 244, 1)'
        },
        root: {
          '.MuiInputBase-root': {
            fontFamily: 'Roboto',
            fontWeight: 300,
            fontSize: 12,
            letterSpacing: 0.17,
            borderRadius: '0px'
          },
          '.Mui-focused, .MuiOutlinedInput-notchedOutline': {
            borderWidth: '0px !important'
          },
          '&.MuiDataGrid-root--densityCompact': {
            '.MuiSvgIcon-root': {
              fontSize: 16
            },
            '.MuiDataGrid-cellCheckbox': {
              '.MuiButtonBase-root': {
                padding: 4
              }
            }
          }
        }
      }
    }, */
    MuiRating: {
      defaultProps: {
        size: 'small'
      },
      styleOverrides: {
        sizeSmall: {
          fontSize: 18
        },
        sizeMedium: {
          fontSize: 24
        },
        sizeLarge: {
          fontSize: 30
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        root: {
          boxShadow: '0px 3px 1px -2px rgba(24, 39, 75, 0.20), 0px 2px 2px 0px rgba(24, 39, 75, 0.14), 0px 1px 5px 0px rgba(24, 39, 75, 0.12)'
        }
      }
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#424242'
        }
      }
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent'
        }
      }
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          padding: '8px 16px !important'
        }
      }
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '8px 16px !important'
        }
      }
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '12px 16px !important'
        }
      }
    },
    MuiCheckbox: {
      defaultProps: {
        size: 'small'
      },
      variants: [
        {
          props: { size: 'large' },
          style: {
            padding: 9,
            '& .MuiSvgIcon-fontSizeLarge': {
              height: 24,
              width: 24,
              fontSize: 24
            }
          }
        },
        {
          props: { size: 'small' },
          style: {
            padding: 3
          }
        },
        {
          props: { size: 'medium' },
          style: {
            padding: 4
          }
        }
      ]
    },
    MuiToggleButton: {
      styleOverrides: {
        sizeSmall: {
          height: 32
        },
        sizeMedium: {
          height: 38
        },
        sizeLarge: {
          height: 48
        }
      }
    },
    MuiChip: {
      defaultProps: {
        size: 'small',
        variant: 'filled',
        color: 'default'
      },
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
        icon: {
          opacity: '70%'
        },
        deleteIconSmall: {
          height: 16,
          width: 16
        },
        deleteIconMedium: {
          height: 20,
          width: 20
        },
        sizeSmall: {
          height: 24,
          fontSize: '0.8125rem',
          '.MuiChip-icon': {
            fontSize: '1rem',
          }
        },
        sizeMedium: {
          height: 32,
          fontSize: '0.875rem',
          '.MuiChip-icon': {
            fontSize: '1.25rem',
          }
        },
        avatarSmall: {
          height: 18,
          width: 18
        },
        avatarMedium: {
          height: 24,
          width: 24
        }
      }
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          display: 'flex',
          alignContent: 'center'
        }
      }
    },
    MuiAlert: {
      variants: [
        {
          props: { variant: 'filled' },
          style: {
            color: '#fff'
          }
        },
        {
          props: { variant: 'outlined' },
          style: {
            padding: '7px 12px 7px 12px'
          }
        }
      ],
      styleOverrides: {
        root: {
          padding: '8px 12px 8px 12px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          minWidth: '296px'
        }
      }
    },
    MuiAlertTitle: {
      defaultProps: {
        variant: 'subtitle2'
      },
      styleOverrides: {
        root: {
          marginBottom: 0,
          marginTop: 2.5
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: 'Roboto',
          textTransform: 'unset',
          fontWeightLight: 300,
          fontSize: '13px',
          lineHeight: 'normal'
        },
        startIcon: {
          marginLeft: 2
        },
        endIcon: {
          marginRight: 2
        },
        sizeSmall: {
          height: 26,
          '.MuiSvgIcon-fontSizeSmall': {
            height: 16,
            width: 16
          },
          '.MuiSvgIcon-fontSizeMedium': {
            height: 18,
            width: 18
          },
          '.MuiSvgIcon-fontSizeLarge': {
            height: 20,
            width: 20
          }
        },
        sizeMedium: {
          height: 32,
          '.MuiSvgIcon-fontSizeSmall': {
            height: 16,
            width: 16
          },
          '.MuiSvgIcon-fontSizeMedium': {
            height: 18,
            width: 18
          },
          '.MuiSvgIcon-fontSizeLarge': {
            height: 20,
            width: 20
          }
        },
        sizeLarge: {
          height: 38,
          '.MuiSvgIcon-fontSizeSmall': {
            height: 16,
            width: 16
          },
          '&.MuiSvgIcon-fontSizeMedium': {
            height: 18,
            width: 18
          }
        }
      },
      variants: [
        {
          props: { variant: 'auth' as any },
          style: ({theme}: any) => ({
            padding: theme.spacing(1.5),
            position: 'relative',
            overflow: 'hidden',
            transition: theme.transitions.create([
              'transform',
              'box-shadow',
              'background-color'
            ], {
              duration: theme.transitions.duration.short,
            }),
            '&:not(:disabled):hover': {
              transform: 'translateY(-2px)',
              boxShadow: `0 8px 20px rgba(32, 99, 160, 0.3)`,
            },
            '&:not(:disabled):active': {
              transform: 'translateY(0)',
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: 0,
              height: 0,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.3)',
              transform: 'translate(-50%, -50%)',
              transition: 'width 0.6s, height 0.6s',
            },
            '&:not(:disabled):hover::before': {
              width: '300%',
              height: '300%',
            },
          })
        }
      ]
    },
    MuiButtonGroup: {
      defaultProps: {
        size: 'small'
      }
    },
    MuiFab: {
      defaultProps: {
        size: 'small'
      },
      styleOverrides: {
        circular: {
          boxShadow: '0px 1px 18px 0px rgba(24, 39, 75, 0.12), 0px 6px 10px 0px rgba(24, 39, 75, 0.14), 0px 3px 5px -1px rgba(24, 39, 75, 0.20)',
          sizeSmall: {
            height: 36,
            width: 36,
            svg: {
              height: 20,
              width: 20
            }
          },
          sizeMedium: {
            height: 48,
            width: 48,
            svg: {
              height: 22,
              width: 22
            }
          },
          sizeLarge: {
            height: 56,
            width: 56,
            svg: {
              height: 24,
              width: 24
            }
          }
        },
        extended: {
          gap: 1,
          boxShadow: ' 0px 1px 18px 0px rgba(24, 39, 75, 0.12), 0px 6px 10px 0px rgba(24, 39, 75, 0.14), 0px 3px 5px -1px rgba(24, 39, 75, 0.20)',
          sizeSmall: {
            height: 32,
            svg: {
              height: 20,
              width: 20,
              marginRight: 4
            }
          },
          sizeMedium: {
            height: 38,
            svg: {
              height: 22,
              width: 22,
              marginRight: 4
            }
          },
          sizeLarge: {
            height: 48,
            svg: {
              height: 24,
              width: 24,
              marginRight: 4
            }
          }
        },
        root: {
          textTransform: 'capitalize'
        }
      }
    },
    MuiFormControl: {
      defaultProps: {
        size: 'small',
        margin: 'none'
      },
      styleOverrides: {
        root: {
          borderRadius: '4px !important'
        }
      }
    },
    MuiFormHelperText: {
      defaultProps: {
        margin: 'dense'
      }
    },
    MuiSvgIcon: {
      styleOverrides: {
        fontSizeLarge: {
          width: 35,
          height: 35,
          fontSize: 35
        },
        fontSizeMedium: {
          width: 20,
          height: 20,
          fontSize: 20
        },
        fontSizeSmall: {
          width: 16,
          height: 16,
          fontSize: 16
        }
      }
    },
    MuiIconButton: {
      styleOverrides: {
        sizeSmall: {
          padding: 3
        },
        sizeMedium: {
          padding: 8
        },
        sizeLarge: {
          padding: 12
        }
      }
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          height: 48
        },
        sizeSmall: {
          height: 38
        }
      }
    },
    MuiInputBase: {
      defaultProps: {
        margin: 'none'
      },
      styleOverrides: {
        root: {
          '&.MuiInput-underline': {
            marginTop: 9
          },
          '.MuiOutlinedInput-input.MuiInputBase-inputSizeSmall': {
            paddingBlock: 6.51
          },
          '.MuiOutlinedInput-input': {
            paddingBlock: 14
          },
          '.MuiFilledInput-input': {
            paddingTop: 22,
            paddingBottom: 8
          }
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderColor: 'rgba(16, 24, 64, 0.23)'
        }
      }
    },
    MuiAutocomplete: {
      defaultProps: {
        size: 'small'
      },
      styleOverrides: {
        root: {
          '&.MuiAutocomplete-root .MuiOutlinedInput-root': {
            padding: '6px 14px 6px 10px'
          },
          '& .MuiAutocomplete-endAdornment': {
            top: 'calc(50% - 12px)',
            transform: 'none'
          },
          '&.MuiAutocomplete-root .MuiOutlinedInput-root.MuiInputBase-sizeSmall': {
            paddingBlock: 3.5,
            paddingRight: 14,
            '.MuiIconButton-sizeSmall .MuiAutocomplete-popupIndicator': {
              padding: 5
            }
          }
        }
      }
    },
    MuiInputLabel: {
      defaultProps: {
        margin: 'dense'
      },
      styleOverrides: {
        root: {
          display: 'flex',
          gap: '.2rem',
          flexDirection: 'row-reverse',
          fontSize: 13,
          fontStyle: 'normal',
          fontWeight: 400,
          letterSpacing: '0.15px'
        },
        filled: {
          '&.MuiInputLabel-filled.MuiInputLabel-sizeSmall:not(.MuiInputLabel-shrink)': {
            transform: 'translate(12px,15px) scale(1)'
          },
          '&.MuiInputLabel-filled.MuiInputLabel-sizeMedium:not(.MuiInputLabel-shrink)': {
            transform: 'translate(12px,19px) scale(1)'
          }
        },
        standard: {
          '&.MuiInputLabel-standard.MuiInputLabel-sizeSmall:not(.MuiInputLabel-shrink)': {
            transform: 'translate(0, 14px) scale(1)'
          },
          '&.MuiInputLabel-standard.MuiInputLabel-sizeMedium:not(.MuiInputLabel-shrink)': {
            transform: 'translate(0, 16px) scale(1)'
          }
        },
        outlined: {
          '&.MuiInputLabel-outlined.MuiInputLabel-sizeSmall ': {
            transform: 'translate(14px,8px) scale(1)'
          },
          '&.MuiInputLabel-outlined ': {
            transform: 'translate(14px, 14px) scale(1)',
            '&.MuiInputLabel-shrink': {
              transform: 'translate(14px, -7px) scale(0.75)'
            }
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          overflow: 'initial',
          boxShadow: '0px 2px 1px -2px rgba(24, 39, 75, 0.20), 0px 1px 1px -1px rgba(24, 39, 75, 0.14), 0px 1px 3px 0px rgba(24, 39, 75, 0.12)'
        }
      },
      variants: [
        {
          props: { variant: 'dashboard' as any },
          style: ({theme}: any) => ({
            height: '100%',
            position: 'relative',
            transition: theme.transitions.create(['transform', 'box-shadow']),
            '&:hover': {
              transform: 'translateY(-4px)',
            },
          })
        }
      ]
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          padding: '8px 16px !important'
        }
      }
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '8px 16px !important'
        }
      }
    },
    MuiCardActions: {
      styleOverrides: {
        root: {
          padding: '8px 16px !important'
        }
      }
    },
    MuiRadio: {
      defaultProps: {
        size: 'small'
      },
      variants: [
        {
          props: { size: 'small' },
          style: {
            padding: 3
          }
        },
        {
          props: { size: 'medium' },
          style: {
            padding: 4
          }
        },
        {
          props: { size: 'medium' },
          style: {
            padding: 9,
            '& .MuiSvgIcon-fontSizeLarge': {
              width: 24,
              height: 24,
              fontSize: 24
            }
          }
        }
      ]
    },
    MuiSwitch: {
      defaultProps: {
        size: 'small'
      },
      variants: [
        {
          props: { size: 'small' },
          style: {
            height: 22,
            '.MuiSwitch-switchBase': {
              padding: 3
            }
          }
        }
      ]
    },
    MuiTextField: {
      defaultProps: {
        size: 'small',
        margin: 'none'
      },
      variants: [
        {
          props: { variant: 'standard' },
          style: {
            '.MuiInputBase-input.MuiInputBase-inputSizeSmall': {
              padding: 1.5
            }
          }
        },
        {
          props: { variant: 'auth' as any },
          style: ({theme}: any) => ({
            '& .MuiOutlinedInput-root': {
              transition: theme.transitions.create([
                'border-color',
                'box-shadow',
                'background-color'
              ]),
              '&:hover': {
                backgroundColor: 'rgba(32, 99, 160, 0.02)',
              },
              '&.Mui-focused': {
                backgroundColor: 'rgba(32, 99, 160, 0.03)',
                boxShadow: `0 0 0 2px rgba(32, 99, 160, 0.1)`,
              },
              '&.Mui-error': {
                animation: 'pulse 1s ease-in-out',
                '@keyframes pulse': {
                  '0%': {
                    boxShadow: `0 0 0 0 rgba(209, 67, 67, 0.4)`,
                  },
                  '70%': {
                    boxShadow: `0 0 0 4px rgba(209, 67, 67, 0)`,
                  },
                  '100%': {
                    boxShadow: `0 0 0 0 rgba(209, 67, 67, 0)`,
                  },
                },
              },
            },
            '& input:-webkit-autofill': {
              WebkitBoxShadow: `0 0 0 100px ${theme.palette.background.paper} inset !important`,
              WebkitTextFillColor: `${theme.palette.text.primary} !important`,
              transition: 'background-color 5000s ease-in-out 0s',
            },
            '& input:-webkit-autofill:hover': {
              WebkitBoxShadow: `0 0 0 100px rgba(32, 99, 160, 0.02) inset !important`,
            },
            '& input:-webkit-autofill:focus': {
              WebkitBoxShadow: `0 0 0 100px rgba(32, 99, 160, 0.03) inset !important`,
            },
          })
        }
      ]
    },
    MuiList: {
      defaultProps: {
        dense: false
      },
      styleOverrides: {
        padding: {
          '.MuiListItem-padding': {
            paddingBlock: 1
          }
        },
        dense: {
          '.MuiListItem-dense': {
            padding: '0.25px 0px 0.25px 16px'
          }
        }
      }
    },
    MuiListItemButton: {
      styleOverrides: {
        dense: {
          padding: '4px 16px 4px 16px '
        },
        root: {
          padding: '8.21px 16px',
          '.MuiListItemText-multiline': {
            marginBlock: '4px'
          }
        }
      }
    },
    MuiMenuItem: {
      styleOverrides: {
        dense: {
          height: 30,
          minHeight: 30,
          '.MuiListItemText-root > .MuiTypography-root': {
            lineHeight: '14.3px',
            letterSpacing: 0.15
          }
        },
        root: {
          padding: '7px 16px 7px 16px',
          '.MuiMenuList-root': {
            height: 34,
            minHeight: 34
          },
          '.MuiListItemText-root > .MuiTypography-root': {
            lineHeight: '20px',
            letterSpacing: 0.17
          },
          '.MuiListItemIcon-root': {
            minWidth: 32
          }
        }
      }
    },
    MuiTableBody: {
      styleOverrides: {
        root: {
          '.MuiTableCell-body.MuiTableCell-sizeMedium': {
            padding: '16px !important'
          }
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: '#2063A0',
          color: '#ffffff',
          fontWeight: 600,
          borderRight: '1px solid rgba(255, 255, 255, 0.3)'
        },
        sizeMedium: {
          padding: 13
        }
      }
    },
    MuiTable: {
      defaultProps: {
        size: 'small'
      },
      styleOverrides: {
        root: {
          minWidth: 630
        }
      }
    },
    // Custom variants for authentication pages
    MuiPaper: {
      variants: [
        {
          props: { variant: 'loginCard' },
          style: ({theme}: any) => ({
            padding: theme.spacing(5),
            borderRadius: theme.spacing(2.5),
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: `0 20px 60px rgba(32, 99, 160, 0.08), 0 0 1px rgba(32, 99, 160, 0.12)`,
            background: theme.palette.background.paper,
            backdropFilter: 'blur(10px)',
            transition: theme.transitions.create(['box-shadow', 'transform'], {
              duration: theme.transitions.duration.standard,
            }),
            '&:hover': {
              boxShadow: `0 24px 70px rgba(32, 99, 160, 0.10), 0 0 1px rgba(32, 99, 160, 0.15)`,
            },
            [theme.breakpoints.down('sm')]: {
              padding: theme.spacing(3),
              borderRadius: 0,
              boxShadow: 'none',
              border: 'none',
            },
          })
        },
        {
          props: { variant: 'infoPanel' },
          style: ({theme}: any) => ({
            marginTop: theme.spacing(3),
            padding: theme.spacing(2),
            backgroundColor: 'rgba(45, 159, 197, 0.08)',
            borderLeft: `4px solid ${theme.palette.info.main}`,
            borderRadius: theme.spacing(1),
          })
        },
        {
          props: { variant: 'authForm' },
          style: ({theme}: any) => ({
            padding: theme.spacing(4),
            [theme.breakpoints.down('sm')]: {
              padding: theme.spacing(3),
            },
            backgroundColor: theme.palette.background.paper,
            borderRadius: theme.spacing(2),
          })
        }
      ]
    },
    // MuiBox: Box component does not support variants in theme
    // Use sx prop directly or styled components instead
    /* MuiBox: {
      variants: [
        {
          props: { variant: 'loginContainer' as any },
          style: () => ({
            height: '100vh',
            width: '100vw',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'fixed',
            top: 0,
            left: 0,
            overflow: 'auto',
            background: `linear-gradient(135deg,
              rgba(32, 99, 160, 0.03) 0%,
              rgba(0, 188, 212, 0.02) 50%,
              rgba(11, 53, 115, 0.04) 100%)`,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `
                radial-gradient(circle at 20% 80%, rgba(32, 99, 160, 0.05) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(0, 188, 212, 0.05) 0%, transparent 50%),
                radial-gradient(circle at 40% 40%, rgba(65, 122, 174, 0.03) 0%, transparent 50%)
              `,
              pointerEvents: 'none',
            },
          })
        },
        {
          props: { variant: 'logoBox' as any },
          style: ({theme}: any) => ({
            width: 80,
            height: 80,
            borderRadius: theme.spacing(2),
            background: `linear-gradient(135deg,
              ${theme.palette.primary.main} 0%,
              ${theme.palette.primary.dark} 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            marginBottom: theme.spacing(4),
            position: 'relative',
            boxShadow: `
              0 10px 40px rgba(32, 99, 160, 0.3),
              inset 0 -2px 10px rgba(0, 0, 0, 0.2)
            `,
            animation: 'float 6s ease-in-out infinite',
            '@keyframes float': {
              '0%, 100%': {
                transform: 'translateY(0px)',
              },
              '50%': {
                transform: 'translateY(-10px)',
              },
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: 'inherit',
              background: `linear-gradient(135deg,
                transparent 0%,
                rgba(255, 255, 255, 0.2) 50%,
                transparent 100%)`,
              opacity: 0.6,
            },
            '& .logo-icon-left': {
              position: 'absolute',
              left: -8,
              transform: 'rotate(-15deg)',
              zIndex: 2,
              color: 'white',
              fontSize: theme.breakpoints.down('sm') ? 28 : 36,
            },
            '& .logo-icon-right': {
              position: 'absolute',
              right: -8,
              transform: 'rotate(15deg)',
              zIndex: 1,
              color: 'white',
              fontSize: theme.breakpoints.down('sm') ? 28 : 36,
            },
            [theme.breakpoints.down('sm')]: {
              width: 64,
              height: 64,
            },
          })
        }
      ]
    }, */
    MuiLink: {
      variants: [
        {
          props: { variant: 'footerLink' as any },
          style: {
            fontSize: 'inherit',
            verticalAlign: 'baseline',
          }
        }
      ]
    }
  }
});
