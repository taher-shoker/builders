export const environment = {
  production: false,
  apiUrl: 'http://localhost:9084/cem/reporting/apigateway/api/v2/admin',
  tpLogInUrl: '/cem/reporting-api',

  systems: {
    ceo_system:
      '/cem/reporting/apigateway/api/auth/authenticatehub?hub_username=',
    tp_system: '/pages/geo-eye',
    tp_admin_system: '/pages/geo-eye',
    fraud_system: '/',
    di_system: '/cem/reporting/dtworkspace/',
  },
  sso_url: 'http://localhost:7080/administration/saml/login',
  languageFilesPath: '/assets/i18n/',
};
