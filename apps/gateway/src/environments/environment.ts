export const environment = {
  production: false,
  apiUrl: 'http://localhost:9084/cem/reporting/apigateway/api/v2/admin',
  tpLogInUrl: 'http://localhost:9084/cem/reporting-api',

  systems: {
    ceo_system:
      'http://localhost:9084/cem/reporting/apigateway/api/auth/authenticatehub?hub_username=',
    tp_system: 'http://localhost:4200/pages/geo-eye',
    tp_admin_system: 'http://localhost:4200/system-configurations',
    fraud_system: 'http://localhost:51635/',
    di_system: 'https://www.google.com',
  },
  sso_url: 'https://www.google.com',
};
