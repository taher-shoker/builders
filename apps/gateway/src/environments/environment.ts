export const environment = {
  production: true,
  apiUrl: 'http://localhost:9084/cem/reporting/apigateway/api/v2/admin',
  tpLogInUrl: 'http://localhost:9084/cem/reporting-api',
  systems: {
    _ceo_system: 'http://localhost:4200/',
    ceo_system:
      'http://localhost:9084/cem/reporting/apigateway/api/auth/authenticatehub?hub_username=',
    tp_system: '/cem/reporting/tp/',
    tp_admin_system: '/cem/reporting/tp/system-configurations',
    fraud_system: '/cem/reporting/fraudworkspace/',
    di_system: '/cem/reporting/dtworkspace/',
    di_milestones_system: '/cem/reporting/dtmilestones/',
    jira_system: '/cem/reporting/jiradashboard/',
    dynamic_rf_system: '/cem/reporting/dynamic-rf-workspace/',
    business_excellence_system: '/cem/reporting/business-excellence-workspace/',
  },
  sso_url: 'http://localhost:7080/administration/saml/login',
  languageFilesPath: '/assets/i18n/',
};
