export const environment = {
  production: true,
  apiUrl: 'http://localhost:9084/cem/reporting/apigateway/api/v2/admin',
  tpLogInUrl: 'http://localhost:9084/cem/reporting-api',

  systems: {
    ceo_system:
      'http://localhost:9084/cem/reporting/apigateway/api/auth/authenticatehub?hub_username=',
    tp_system: 'http://localhost:9001/cem/reporting/tp/',
    tp_admin_system:
      'http://localhost:9001/cem/reporting/tp/system-configurations',
    fraud_system: 'http://localhost:9001/cem/reporting/fraudworkspace/',
    di_system: 'http://localhost:9001/cem/reporting/dtworkspace/',
  },
  sso_url: 'https://www.google.com',
  languageFilesPath: '/cem/reporting/assets/i18n/',
};
