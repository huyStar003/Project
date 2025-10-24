import { useWindowDimensions } from 'react-native';

// Hook chính để sử dụng responsive
export const useResponsive = () => {
  const { width, height } = useWindowDimensions();
  
  // Định nghĩa breakpoints
  const breakpoints = {
    small: 375,
    medium: 768,
    large: 1024,
  };

  // Xác định loại thiết bị
  const isSmallDevice = width < breakpoints.small;
  const isMediumDevice = width >= breakpoints.small && width < breakpoints.medium;
  const isTablet = width >= breakpoints.medium && width < breakpoints.large;
  const isDesktop = width >= breakpoints.large;

  // Functions để tính toán giá trị responsive
  const wp = (percentage) => {
    return (width * percentage) / 100;
  };

  const hp = (percentage) => {
    return (height * percentage) / 100;
  };

  // Hàm trả về giá trị dựa trên kích thước màn hình
  const responsiveSize = (small, medium, tablet, desktop = tablet) => {
    if (isDesktop) return desktop;
    if (isTablet) return tablet;
    if (isMediumDevice) return medium;
    return small;
  };

  // Padding và margin responsive
  const spacing = {
    xs: responsiveSize(4, 6, 8),
    sm: responsiveSize(8, 10, 12),
    md: responsiveSize(12, 16, 20),
    lg: responsiveSize(16, 20, 24, 32),
    xl: responsiveSize(20, 24, 32, 40),
    xxl: responsiveSize(24, 32, 40, 48),
  };

  // Font sizes responsive
  const fontSize = {
    xs: responsiveSize(10, 11, 12),
    sm: responsiveSize(12, 13, 14),
    base: responsiveSize(14, 15, 16),
    md: responsiveSize(15, 16, 17),
    lg: responsiveSize(16, 18, 20),
    xl: responsiveSize(18, 20, 24),
    xxl: responsiveSize(20, 24, 28),
    xxxl: responsiveSize(24, 28, 34),
    huge: responsiveSize(28, 34, 40),
  };

  // Icon sizes responsive
  const iconSize = {
    xs: responsiveSize(12, 14, 16),
    sm: responsiveSize(16, 18, 20),
    md: responsiveSize(20, 22, 24),
    lg: responsiveSize(24, 26, 28),
    xl: responsiveSize(28, 32, 36),
    xxl: responsiveSize(32, 40, 48),
  };

  // Button heights responsive
  const buttonHeight = {
    sm: responsiveSize(40, 44, 48),
    md: responsiveSize(50, 56, 60),
    lg: responsiveSize(56, 60, 68),
  };

  // Border radius responsive
  const borderRadius = {
    sm: responsiveSize(8, 10, 12),
    md: responsiveSize(12, 14, 16),
    lg: responsiveSize(16, 20, 24),
    xl: responsiveSize(20, 24, 28),
    round: responsiveSize(999, 999, 999),
  };

  // Container padding responsive
  const containerPadding = {
    horizontal: isTablet ? wp(15) : (isSmallDevice ? 16 : 24),
    vertical: isSmallDevice ? 24 : 40,
  };

  // Image/Logo sizes
  const logoSize = {
    small: responsiveSize(60, 75, 90, 105),
    medium: responsiveSize(80, 100, 120, 140),
    large: responsiveSize(90, 120, 140, 160),
  };

  // Card/Container max width (cho tablet/desktop)
  const maxWidth = {
    form: isTablet ? 500 : width - (containerPadding.horizontal * 2),
    card: isTablet ? 600 : width - (containerPadding.horizontal * 2),
    content: isDesktop ? 1200 : width,
  };

  return {
    width,
    height,
    isSmallDevice,
    isMediumDevice,
    isTablet,
    isDesktop,
    wp,
    hp,
    responsiveSize,
    spacing,
    fontSize,
    iconSize,
    buttonHeight,
    borderRadius,
    containerPadding,
    logoSize,
    maxWidth,
  };
};

// Helper function để tạo styles responsive nhanh
export const createResponsiveStyle = (baseStyle, responsiveOverrides) => {
  const { isSmallDevice, isMediumDevice, isTablet, isDesktop } = useResponsive();
  
  let style = { ...baseStyle };
  
  if (isSmallDevice && responsiveOverrides.small) {
    style = { ...style, ...responsiveOverrides.small };
  } else if (isMediumDevice && responsiveOverrides.medium) {
    style = { ...style, ...responsiveOverrides.medium };
  } else if (isTablet && responsiveOverrides.tablet) {
    style = { ...style, ...responsiveOverrides.tablet };
  } else if (isDesktop && responsiveOverrides.desktop) {
    style = { ...style, ...responsiveOverrides.desktop };
  }
  
  return style;
};

// Export constants nếu cần sử dụng ở nơi khác
export const BREAKPOINTS = {
  SMALL: 375,
  MEDIUM: 768,
  LARGE: 1024,
};

export const DEVICE_TYPES = {
  SMALL: 'small',
  MEDIUM: 'medium',
  TABLET: 'tablet',
  DESKTOP: 'desktop',
};