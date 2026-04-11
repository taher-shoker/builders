import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedUiModule } from '@stc-apps/shared-ui';
import {
  CustomThemeColors,
  CustomThemeConfigOverride,
  ThemeName,
  ThemeOption,
  ThemeService,
} from '../../core/services/theme.service';

@Component({
  selector: 'stc-apps-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedUiModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  private readonly themeService = inject(ThemeService);

  readonly themeOptions: ThemeOption[] = this.themeService.themeOptions;
  selectedTheme: ThemeName = this.themeService.getCurrentTheme();
  customColors: CustomThemeColors = this.themeService.getCustomThemeColors();
  logoPath: string =
    this.selectedTheme === 'custom'
      ? this.themeService.getAppLogoPath()
      : this.themeService.getCustomThemeConfig().appLogoPath;
  loginLogoPath: string =
    this.selectedTheme === 'custom'
      ? this.themeService.getLoginLogoPath()
      : this.themeService.getCustomThemeConfig().loginLogoPath;

  hasPendingThemeChanges = false;
  generatedThemeSnippet = '';
  showGeneratedThemePopup = false;
  copyStatusMessage = '';
  importSnippet = '';
  importStatusMessage = '';

  onThemeChanged(theme: ThemeName): void {
    this.selectedTheme = theme;
    this.themeService.setTheme(theme);
    this.showGeneratedThemePopup = false;
    this.hasPendingThemeChanges = false;
    this.copyStatusMessage = '';
    this.importStatusMessage = '';

    const customConfig = this.themeService.getCustomThemeConfig();
    this.customColors = { ...customConfig.colors };
    this.logoPath = customConfig.appLogoPath;
    this.loginLogoPath = customConfig.loginLogoPath;
  }

  onCustomColorChanged(): void {
    this.hasPendingThemeChanges = true;
    this.importStatusMessage = '';
  }

  onLogoPathChanged(path: string): void {
    this.logoPath = path;
    this.hasPendingThemeChanges = true;
    this.importStatusMessage = '';
  }

  onLoginLogoPathChanged(path: string): void {
    this.loginLogoPath = path;
    this.hasPendingThemeChanges = true;
    this.importStatusMessage = '';
  }

  submitTheme(): void {
    if (this.selectedTheme !== 'custom') {
      this.themeService.setTheme(this.selectedTheme);
      this.hasPendingThemeChanges = false;
      this.showGeneratedThemePopup = false;
      return;
    }

    this.themeService.setCustomThemeColors(this.customColors);
    this.themeService.setAppLogoPath(this.logoPath);
    this.themeService.setLoginLogoPath(this.loginLogoPath);
    this.themeService.setTheme('custom');

    const customConfig = this.themeService.getCustomThemeConfig();
    this.customColors = { ...customConfig.colors };
    this.logoPath = customConfig.appLogoPath;
    this.loginLogoPath = customConfig.loginLogoPath;

    this.generatedThemeSnippet = this.buildCustomThemeConfigSnippet();
    this.showGeneratedThemePopup = true;
    this.copyStatusMessage = '';
    this.hasPendingThemeChanges = false;
  }

  closeGeneratedThemePopup(): void {
    this.showGeneratedThemePopup = false;
  }

  copyGeneratedThemeSnippet(): void {
    if (!this.generatedThemeSnippet) {
      return;
    }

    if (!navigator?.clipboard?.writeText) {
      this.copyStatusMessage =
        'Clipboard API is not available in this browser context.';
      return;
    }

    navigator.clipboard
      .writeText(this.generatedThemeSnippet)
      .then(() => {
        this.copyStatusMessage = 'Copied to clipboard.';
      })
      .catch(() => {
        this.copyStatusMessage =
          'Unable to copy automatically. Please copy manually.';
      });
  }

  applyImportedSnippet(): void {
    const candidate = this.extractConfigText(this.importSnippet);
    if (!candidate) {
      this.importStatusMessage = 'Paste a custom theme object first.';
      return;
    }

    const normalized = this.normalizeObjectLiteral(candidate);

    try {
      const parsed = JSON.parse(normalized) as CustomThemeConfigOverride;
      const colors = parsed?.colors;

      if (!colors || typeof parsed.appLogoPath !== 'string' || typeof parsed.loginLogoPath !== 'string') {
        throw new Error('Invalid shape');
      }

      this.selectedTheme = 'custom';
      this.customColors = {
        primaryColor: colors.primaryColor,
        primaryHoverColor: colors.primaryHoverColor,
        sidebarBg: colors.sidebarBg,
        sidebarLinkHoverBg: colors.sidebarLinkHoverBg,
        pageBg: colors.pageBg,
      };
      this.logoPath = parsed.appLogoPath;
      this.loginLogoPath = parsed.loginLogoPath;
      this.themeService.setTheme('custom');
      this.hasPendingThemeChanges = true;
      this.importStatusMessage = 'Theme values imported. Click Submit Theme to apply/save.';
      this.showGeneratedThemePopup = false;
    } catch {
      this.importStatusMessage =
        'Could not parse input. Paste JSON or the generated custom object.';
    }
  }

  private buildCustomThemeConfigSnippet(): string {
    return `custom: {
  appLogoPath: '${this.escapeSingleQuotedString(this.logoPath)}',
  loginLogoPath: '${this.escapeSingleQuotedString(this.loginLogoPath)}',
  colors: {
    primaryColor: '${this.customColors.primaryColor}',
    primaryHoverColor: '${this.customColors.primaryHoverColor}',
    sidebarBg: '${this.customColors.sidebarBg}',
    sidebarLinkHoverBg: '${this.customColors.sidebarLinkHoverBg}',
    pageBg: '${this.customColors.pageBg}',
  },
},`;
  }

  private extractConfigText(value: string): string {
    const input = value.trim();
    if (!input) {
      return '';
    }

    if (input.startsWith('{') && input.endsWith('}')) {
      return input;
    }

    const marker = 'custom:';
    const markerIndex = input.indexOf(marker);
    if (markerIndex === -1) {
      return '';
    }

    const firstBraceIndex = input.indexOf('{', markerIndex);
    if (firstBraceIndex === -1) {
      return '';
    }

    let depth = 0;
    for (let i = firstBraceIndex; i < input.length; i += 1) {
      const char = input[i];
      if (char === '{') {
        depth += 1;
      } else if (char === '}') {
        depth -= 1;
        if (depth === 0) {
          return input.slice(firstBraceIndex, i + 1);
        }
      }
    }

    return '';
  }

  private normalizeObjectLiteral(objectLiteral: string): string {
    return objectLiteral
      .replace(/([\{\s,])([A-Za-z_][\w]*)\s*:/g, '$1"$2":')
      .replace(/'/g, '"')
      .replace(/,\s*([}\]])/g, '$1');
  }

  private escapeSingleQuotedString(value: string): string {
    return value.trim().replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  }
}
