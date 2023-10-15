export const environment = {
  production: true,
  apiUrl: '/cem/reporting/apigateway/api/v2/admin',
  tpLogInUrl: '/cem/reporting-api',
  systems: {
    ceo_system:
      '/cem/reporting/apigateway/api/auth/authenticatehub?hub_username=',
    tp_system: '/cem/reporting/tp/',
    tp_admin_system: '/cem/reporting/tp/system-configurations',
    fraud_system: '/cem/reporting/fraudworkspace/',
    di_system: '/cem/reporting/dtworkspace/',
  },
  sso_url: '/cem/reporting-api/saml/saml/login',
  languageFilesPath: '/cem/reporting/assets/i18n/',
};
