export const environment = {
  production: true,
  apiUrl: '/cem/reporting/apigateway/api/v2/admin',
  tpLogInUrl: '/cem/reporting/new/apigateway/reporting-api',
  systems: {
    ceo_system:
      '/cem/reporting/apigateway/api/auth/authenticatehub?hub_username=',
    tp_system: '/cem/reporting/tp/',
    tp_admin_system: '/cem/reporting/tp/system-configurations',
    fraud_system: '/cem/reporting/fraudworkspace/',
    di_system: '/cem/reporting/dtworkspace',
    di_milestones_system: '/cem/reporting/dtmilestones/',
    jira_system: '/cem/reporting/jiradashboard/',
    dynamic_rf_system: '/cem/reporting/dynamic-rf-workspace/',
    business_excellence_system: '/cem/reporting/business-excellence-workspace/',
    score_card_report_db: '/cem/reporting/score-card-report/',
    strategic_dashboard: '/cem/reporting/strategic_dashboard/',
    chat_bi: '/cem/reporting/chat_bi/',
    tu_brain:
      'https://stcgpt-ui.agreeableriver-7f2a419b.switzerlandnorth.azurecontainerapps.io/login',
  },
  sso_url: '/cem/reporting/apigateway/api/v2/admin/saml2/authenticate/stc',
  languageFilesPath: '/cem/reporting/assets/i18n/',
};
