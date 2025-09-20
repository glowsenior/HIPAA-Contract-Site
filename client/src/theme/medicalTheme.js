// Medical-themed Ant Design configuration
export const medicalTheme = {
  token: {
    // Primary colors - Medical blue and green
    colorPrimary: '#1890ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#1890ff',
    
    // Medical color palette
    colorMedical: '#00a86b', // Medical green
    colorMedicalLight: '#e6f7ff',
    colorMedicalDark: '#0050b3',
    colorStethoscope: '#722ed1', // Purple for medical equipment
    colorHeart: '#ff4d4f', // Red for medical urgency
    
    // Background colors
    colorBgContainer: '#ffffff',
    colorBgElevated: '#fafafa',
    colorBgLayout: '#f5f5f5',
    colorBgMask: 'rgba(0, 0, 0, 0.45)',
    
    // Text colors
    colorText: '#262626',
    colorTextSecondary: '#8c8c8c',
    colorTextTertiary: '#bfbfbf',
    colorTextQuaternary: '#d9d9d9',
    
    // Border colors
    colorBorder: '#d9d9d9',
    colorBorderSecondary: '#f0f0f0',
    
    // Font settings
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: 14,
    fontSizeHeading1: 38,
    fontSizeHeading2: 30,
    fontSizeHeading3: 24,
    fontSizeHeading4: 20,
    fontSizeHeading5: 16,
    
    // Border radius
    borderRadius: 6,
    borderRadiusLG: 8,
    borderRadiusSM: 4,
    
    // Spacing
    padding: 16,
    paddingLG: 24,
    paddingSM: 12,
    paddingXS: 8,
    
    // Shadows
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    boxShadowSecondary: '0 1px 2px rgba(0, 0, 0, 0.03)',
    
    // Animation
    motionDurationFast: '0.1s',
    motionDurationMid: '0.2s',
    motionDurationSlow: '0.3s',
  },
  components: {
    // Button customization
    Button: {
      borderRadius: 6,
      fontWeight: 500,
      boxShadow: '0 2px 0 rgba(0, 0, 0, 0.02)',
    },
    
    // Card customization
    Card: {
      borderRadius: 8,
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
      headerBg: '#fafafa',
    },
    
    // Layout customization
    Layout: {
      headerBg: '#ffffff',
      bodyBg: '#f5f5f5',
      siderBg: '#ffffff',
    },
    
    // Menu customization
    Menu: {
      itemBg: 'transparent',
      itemSelectedBg: '#e6f7ff',
      itemHoverBg: '#f5f5f5',
    },
    
    // Form customization
    Form: {
      labelColor: '#262626',
      labelFontSize: 14,
      itemMarginBottom: 24,
    },
    
    // Input customization
    Input: {
      borderRadius: 6,
      paddingInline: 12,
      paddingBlock: 8,
    },
    
    // Table customization
    Table: {
      headerBg: '#fafafa',
      rowHoverBg: '#f5f5f5',
      borderColor: '#f0f0f0',
    },
    
    // Modal customization
    Modal: {
      borderRadius: 8,
      headerBg: '#fafafa',
    },
    
    // Upload customization
    Upload: {
      borderRadius: 6,
      colorBorder: '#d9d9d9',
      colorBorderHover: '#40a9ff',
    },
    
    // Progress customization
    Progress: {
      borderRadius: 4,
    },
    
    // Badge customization
    Badge: {
      colorError: '#ff4d4f',
      colorSuccess: '#52c41a',
      colorWarning: '#faad14',
    },
  },
  algorithm: 'default', // or 'dark' for dark theme
};

// Medical-specific color tokens
export const medicalColors = {
  primary: '#1890ff',
  success: '#52c41a',
  warning: '#faad14',
  error: '#ff4d4f',
  info: '#1890ff',
  
  // Medical theme colors
  medical: '#00a86b',
  medicalLight: '#e6f7ff',
  medicalDark: '#0050b3',
  stethoscope: '#722ed1',
  heart: '#ff4d4f',
  
  // Status colors
  draft: '#8c8c8c',
  pending: '#faad14',
  approved: '#52c41a',
  inProgress: '#1890ff',
  completed: '#52c41a',
  cancelled: '#ff4d4f',
  
  // Background colors
  bgPrimary: '#ffffff',
  bgSecondary: '#fafafa',
  bgTertiary: '#f5f5f5',
  
  // Text colors
  textPrimary: '#262626',
  textSecondary: '#8c8c8c',
  textTertiary: '#bfbfbf',
  
  // Border colors
  borderPrimary: '#d9d9d9',
  borderSecondary: '#f0f0f0',
};
