import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  themeConfig,
  ThemeColors,
  ThemeName,
} from '../../../environments/theme.config';

export interface ThemeOption {
  label: string;
  value: ThemeName;
}

export interface CustomThemeColors extends ThemeColors {}

export interface CustomThemeConfigOverride {
  appLogoPath: string;
  loginLogoPath: string;
  colors: CustomThemeColors;
}

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly storageKey = 'aquila-selected-theme';
  private readonly customThemeStorageKey = 'aquila-custom-theme-config-override';
  private readonly fallbackTheme: ThemeName = themeConfig.defaultTheme;
  private readonly defaultCustomConfig: CustomThemeConfigOverride = {
    appLogoPath: themeConfig.themes.custom.appLogoPath,
    loginLogoPath: themeConfig.themes.custom.loginLogoPath,
    colors: { ...themeConfig.themes.custom.colors },
  };

  private readonly appLogoPath$$ = new BehaviorSubject<string>(
    this.resolveAppLogoPath(this.getSavedTheme())
  );
  private readonly loginLogoPath$$ = new BehaviorSubject<string>(
    this.resolveLoginLogoPath(this.getSavedTheme())
  );

  readonly appLogoPath$ = this.appLogoPath$$.asObservable();
  readonly loginLogoPath$ = this.loginLogoPath$$.asObservable();

  readonly themeOptions: ThemeOption[] = [
    { label: 'Default', value: 'default' },
    { label: 'Violet', value: 'violet' },
    { label: 'Custom', value: 'custom' },
  ];

  initializeTheme(): void {
    const savedTheme = this.getSavedTheme();
    this.applyTheme(savedTheme);
    this.applyThemeColors(savedTheme);
    this.appLogoPath$$.next(this.resolveAppLogoPath(savedTheme));
    this.loginLogoPath$$.next(this.resolveLoginLogoPath(savedTheme));
  }

  setTheme(theme: ThemeName): void {
    this.applyTheme(theme);
    localStorage.setItem(this.storageKey, theme);
    this.applyThemeColors(theme);
    this.appLogoPath$$.next(this.resolveAppLogoPath(theme));
    this.loginLogoPath$$.next(this.resolveLoginLogoPath(theme));
  }

  getCurrentTheme(): ThemeName {
    return this.getSavedTheme();
  }

  getCustomThemeColors(): CustomThemeColors {
    return this.getResolvedCustomThemeConfig().colors;
  }

  setCustomThemeColors(colors: CustomThemeColors): void {
    const customConfig = this.getResolvedCustomThemeConfig();
    customConfig.colors = {
      primaryColor: this.sanitizeHexColor(
        colors.primaryColor,
        this.defaultCustomConfig.colors.primaryColor
      ),
      primaryHoverColor: this.sanitizeHexColor(
        colors.primaryHoverColor,
        this.defaultCustomConfig.colors.primaryHoverColor
      ),
      sidebarBg: this.sanitizeHexColor(
        colors.sidebarBg,
        this.defaultCustomConfig.colors.sidebarBg
      ),
      sidebarLinkHoverBg: this.sanitizeHexColor(
        colors.sidebarLinkHoverBg,
        this.defaultCustomConfig.colors.sidebarLinkHoverBg
      ),
      pageBg: this.sanitizeHexColor(colors.pageBg, this.defaultCustomConfig.colors.pageBg),
    };

    localStorage.setItem(this.customThemeStorageKey, JSON.stringify(customConfig));

    if (this.getCurrentTheme() === 'custom') {
      this.applyThemeColors('custom');
    }
  }

  getAppLogoPath(): string {
    return this.resolveAppLogoPath(this.getSavedTheme());
  }

  setAppLogoPath(path: string): void {
    const customConfig = this.getResolvedCustomThemeConfig();
    customConfig.appLogoPath = path.trim() || this.defaultCustomConfig.appLogoPath;
    localStorage.setItem(this.customThemeStorageKey, JSON.stringify(customConfig));

    if (this.getCurrentTheme() === 'custom') {
      this.appLogoPath$$.next(customConfig.appLogoPath);
    }
  }

  getLoginLogoPath(): string {
    return this.resolveLoginLogoPath(this.getSavedTheme());
  }

  getCustomThemeConfig(): CustomThemeConfigOverride {
    return this.getResolvedCustomThemeConfig();
  }

  setLoginLogoPath(path: string): void {
    const customConfig = this.getResolvedCustomThemeConfig();
    customConfig.loginLogoPath = path.trim() || this.defaultCustomConfig.loginLogoPath;
    localStorage.setItem(this.customThemeStorageKey, JSON.stringify(customConfig));

    if (this.getCurrentTheme() === 'custom') {
      this.loginLogoPath$$.next(customConfig.loginLogoPath);
    }
  }

  private getSavedTheme(): ThemeName {
    const storedTheme = localStorage.getItem(this.storageKey);
    return this.isThemeName(storedTheme) ? storedTheme : this.fallbackTheme;
  }

  private isThemeName(value: string | null): value is ThemeName {
    return value === 'default' || value === 'violet' || value === 'custom';
  }

  private applyTheme(theme: ThemeName): void {
    document.documentElement.setAttribute('data-theme', theme);
  }

  private applyThemeColors(theme: ThemeName): void {
    const colors =
      theme === 'custom'
        ? this.getCustomThemeColors()
        : themeConfig.themes[theme].colors;

    this.applyCssVariables(colors);
  }

  private applyCssVariables(colors: CustomThemeColors): void {
    const root = document.documentElement;
    root.style.setProperty('--stc-color', colors.primaryColor);
    root.style.setProperty('--stc-color-hover', colors.primaryHoverColor);
    root.style.setProperty('--theme-sidebar-bg', colors.sidebarBg);
    root.style.setProperty('--theme-sidebar-link-hover-bg', colors.sidebarLinkHoverBg);
    root.style.setProperty('--theme-page-bg', colors.pageBg);
  }

  private resolveAppLogoPath(theme: ThemeName): string {
    if (theme === 'custom') {
      return this.getResolvedCustomThemeConfig().appLogoPath;
    }
    return themeConfig.themes[theme].appLogoPath;
  }

  private resolveLoginLogoPath(theme: ThemeName): string {
    if (theme === 'custom') {
      return this.getResolvedCustomThemeConfig().loginLogoPath;
    }
    return themeConfig.themes[theme].loginLogoPath;
  }

  private getCustomThemeConfigOverride(): Partial<CustomThemeConfigOverride> | null {
    const raw = localStorage.getItem(this.customThemeStorageKey);
    if (!raw) {
      return null;
    }

    try {
      const parsed = JSON.parse(raw) as Partial<CustomThemeConfigOverride>;
      return parsed && typeof parsed === 'object' ? parsed : null;
    } catch {
      return null;
    }
  }

  private getResolvedCustomThemeConfig(): CustomThemeConfigOverride {
    const override = this.getCustomThemeConfigOverride();
    const overrideColors = override?.colors;

    return {
      appLogoPath:
        (typeof override?.appLogoPath === 'string' && override.appLogoPath.trim()) ||
        this.defaultCustomConfig.appLogoPath,
      loginLogoPath:
        (typeof override?.loginLogoPath === 'string' &&
          override.loginLogoPath.trim()) ||
        this.defaultCustomConfig.loginLogoPath,
      colors: {
        primaryColor: this.sanitizeHexColor(
          overrideColors?.primaryColor,
          this.defaultCustomConfig.colors.primaryColor
        ),
        primaryHoverColor: this.sanitizeHexColor(
          overrideColors?.primaryHoverColor,
          this.defaultCustomConfig.colors.primaryHoverColor
        ),
        sidebarBg: this.sanitizeHexColor(
          overrideColors?.sidebarBg,
          this.defaultCustomConfig.colors.sidebarBg
        ),
        sidebarLinkHoverBg: this.sanitizeHexColor(
          overrideColors?.sidebarLinkHoverBg,
          this.defaultCustomConfig.colors.sidebarLinkHoverBg
        ),
        pageBg: this.sanitizeHexColor(
          overrideColors?.pageBg,
          this.defaultCustomConfig.colors.pageBg
        ),
      },
    };
  }

  private sanitizeHexColor(value: string | undefined, fallback: string): string {
    const candidate = value?.trim() ?? '';
    return /^#([0-9a-fA-F]{3,8})$/.test(candidate) ? candidate : fallback;
  }
}
