export const environment = {
  production: true,
  apiUrl: 'http://localhost:9084/cem/reporting/apigateway/api/v2/admin',
  tpLogInUrl: 'http://localhost:9084/cem/reporting-api',
  systems: {
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
    score_card_report_db: '/cem/reporting/score-card-report/',
    strategic_dashboard: '/cem/reporting/strategic_dashboard/',
    chat_bi: '/cem/reporting/chat_bi/',
    nokia_chat: '/cem/reporting/nokia_chat/',
    grc_dashboard: '/cem/reporting/grc_dashboard/',

    tu_brain:
      'https://stcgpt-ui.agreeableriver-7f2a419b.switzerlandnorth.azurecontainerapps.io/login',
  },
  sso_url: 'http://localhost:9084/cem/reporting-api/saml/saml/login',
  languageFilesPath: '/cem/reporting/assets/i18n/',
};
