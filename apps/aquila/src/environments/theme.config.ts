export type ThemeName = 'default' | 'violet' | 'custom';

export interface ThemeColors {
  primaryColor: string;
  primaryHoverColor: string;
  sidebarBg: string;
  sidebarLinkHoverBg: string;
  pageBg: string;
}

export interface ThemeDefinition {
  appLogoPath: string;
  loginLogoPath: string;
  colors: ThemeColors;
}

export interface ThemeConfig {
  defaultTheme: ThemeName;
  themes: Record<ThemeName, ThemeDefinition>;
}

export const themeConfig: ThemeConfig = {
  defaultTheme: 'default',
  themes: {
    default: {
      appLogoPath: 'assets/images/mobily-white.svg',
      loginLogoPath: 'assets/images/mobily-white.svg',
      colors: {
        primaryColor: '#2d9ad6',
        primaryHoverColor: '#2276a3',
        sidebarBg: '#124f75',
        sidebarLinkHoverBg: '#ffffff2e',
        pageBg: '#f9fafb',
      },
    },
    violet: {
      appLogoPath: 'assets/images/mobily-white.svg',
      loginLogoPath: 'assets/images/mobily-white.svg',
      colors: {
        primaryColor: '#4f008c',
        primaryHoverColor: '#3c016a',
        sidebarBg: '#4f008c',
        sidebarLinkHoverBg: '#ffffff3d',
        pageBg: '#fff7f3',
      },
    },
    custom: {
      appLogoPath: 'assets/images/mobily-white.svg',
      loginLogoPath: 'assets/images/mobily-white.svg',
      colors: {
        primaryColor: '#2d9ad6',
        primaryHoverColor: '#247cae',
        sidebarBg: '#124f75',
        sidebarLinkHoverBg: '#ffffff2e',
        pageBg: '#f9fafb',
      },
    },
  },
};
