export type DeviceType = 'mobile' | 'tablet' | 'desktop' | 'unknown'

export interface OSInfo {
  name: string
  version: string
  family: string
}

export interface BrowserInfo {
  name: string
  version: string
  engine: string
}

export interface DeviceInfo {
  deviceType: DeviceType
  deviceName: string
  deviceModel: string
  platform: string
  os: OSInfo
  browser: BrowserInfo
  userAgent: string
  screenWidth: number
  screenHeight: number
  isTouchDevice: boolean
  timestamp: string
}

/**
 * Detects the device type based on user agent and screen characteristics
 * @returns DeviceType - 'mobile', 'tablet', 'desktop', or 'unknown'
 */
export const getDeviceType = (): DeviceType => {
  if (typeof window === 'undefined') return 'unknown'

  const userAgent = navigator.userAgent.toLowerCase()
  const screenWidth = window.screen.width
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0

  // Check for mobile devices
  const mobileKeywords = [
    'android', 'webos', 'iphone', 'ipad', 'ipod', 'blackberry', 
    'windows phone', 'mobile', 'opera mini', 'iemobile'
  ]
  const isMobileUA = mobileKeywords.some(keyword => userAgent.includes(keyword))

  // Check for tablet-specific patterns
  const isTablet = (
    userAgent.includes('ipad') ||
    (userAgent.includes('android') && !userAgent.includes('mobile')) ||
    (userAgent.includes('tablet')) ||
    (screenWidth >= 768 && screenWidth <= 1024 && isTouchDevice)
  )

  // Check for mobile based on screen size and touch
  const isMobileScreen = screenWidth < 768 && isTouchDevice

  // Determine device type
  if (isTablet) {
    return 'tablet'
  } else if (isMobileUA || isMobileScreen) {
    return 'mobile'
  } else {
    return 'desktop'
  }
}

/**
 * Extracts operating system information from user agent
 * @returns OSInfo object with OS details
 */
export const getOSInfo = (): OSInfo => {
  if (typeof window === 'undefined') {
    return { name: 'Unknown', version: 'Unknown', family: 'Unknown' }
  }

  const userAgent = navigator.userAgent
  const platform = navigator.platform

  // Windows detection
  if (userAgent.includes('Windows NT')) {
    const match = userAgent.match(/Windows NT ([\d\.]+)/)
    const version = match ? match[1] : 'Unknown'
    const versionMap: { [key: string]: string } = {
      '10.0': 'Windows 10/11',
      '6.3': 'Windows 8.1',
      '6.2': 'Windows 8',
      '6.1': 'Windows 7',
      '6.0': 'Windows Vista'
    }
    return {
      name: versionMap[version] || `Windows NT ${version}`,
      version,
      family: 'Windows'
    }
  }

  // macOS detection
  if (userAgent.includes('Mac OS X') || userAgent.includes('macOS')) {
    const match = userAgent.match(/Mac OS X ([\d_]+)/) || userAgent.match(/macOS ([\d\.]+)/)
    const version = match ? match[1].replace(/_/g, '.') : 'Unknown'
    return {
      name: `macOS ${version}`,
      version,
      family: 'macOS'
    }
  }

  // iOS detection
  if (userAgent.includes('iPhone') || userAgent.includes('iPad') || userAgent.includes('iPod')) {
    const match = userAgent.match(/OS ([\d_]+)/)
    const version = match ? match[1].replace(/_/g, '.') : 'Unknown'
    const device = userAgent.includes('iPad') ? 'iPadOS' : 'iOS'
    return {
      name: `${device} ${version}`,
      version,
      family: 'iOS'
    }
  }

  // Android detection
  if (userAgent.includes('Android')) {
    const match = userAgent.match(/Android ([\d\.]+)/)
    const version = match ? match[1] : 'Unknown'
    return {
      name: `Android ${version}`,
      version,
      family: 'Android'
    }
  }

  // Linux detection
  if (userAgent.includes('Linux') || platform.includes('Linux')) {
    return {
      name: 'Linux',
      version: 'Unknown',
      family: 'Linux'
    }
  }

  return { name: 'Unknown', version: 'Unknown', family: 'Unknown' }
}

/**
 * Extracts browser information from user agent
 * @returns BrowserInfo object with browser details
 */
export const getBrowserInfo = (): BrowserInfo => {
  if (typeof window === 'undefined') {
    return { name: 'Unknown', version: 'Unknown', engine: 'Unknown' }
  }

  const userAgent = navigator.userAgent

  // Chrome detection
  if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
    const match = userAgent.match(/Chrome\/([\d\.]+)/)
    const version = match ? match[1] : 'Unknown'
    return {
      name: 'Chrome',
      version,
      engine: 'Blink'
    }
  }

  // Edge detection
  if (userAgent.includes('Edg')) {
    const match = userAgent.match(/Edg\/([\d\.]+)/)
    const version = match ? match[1] : 'Unknown'
    return {
      name: 'Edge',
      version,
      engine: 'Blink'
    }
  }

  // Firefox detection
  if (userAgent.includes('Firefox')) {
    const match = userAgent.match(/Firefox\/([\d\.]+)/)
    const version = match ? match[1] : 'Unknown'
    return {
      name: 'Firefox',
      version,
      engine: 'Gecko'
    }
  }

  // Safari detection
  if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    const match = userAgent.match(/Version\/([\d\.]+)/)
    const version = match ? match[1] : 'Unknown'
    return {
      name: 'Safari',
      version,
      engine: 'WebKit'
    }
  }

  // Opera detection
  if (userAgent.includes('Opera') || userAgent.includes('OPR')) {
    const match = userAgent.match(/(?:Opera|OPR)\/([\d\.]+)/)
    const version = match ? match[1] : 'Unknown'
    return {
      name: 'Opera',
      version,
      engine: 'Blink'
    }
  }

  return { name: 'Unknown', version: 'Unknown', engine: 'Unknown' }
}

/**
 * Extracts device name and model from user agent
 * @returns Object with device name and model
 */
export const getDeviceNameAndModel = (): { name: string; model: string } => {
  if (typeof window === 'undefined') {
    return { name: 'Unknown', model: 'Unknown' }
  }

  const userAgent = navigator.userAgent

  // iPhone detection
  if (userAgent.includes('iPhone')) {
    const match = userAgent.match(/iPhone OS ([\d_]+)/)
    const version = match ? match[1].replace(/_/g, '.') : ''
    return {
      name: 'iPhone',
      model: `iPhone (iOS ${version})`
    }
  }

  // iPad detection
  if (userAgent.includes('iPad')) {
    const match = userAgent.match(/OS ([\d_]+)/)
    const version = match ? match[1].replace(/_/g, '.') : ''
    return {
      name: 'iPad',
      model: `iPad (iPadOS ${version})`
    }
  }

  // Android device detection
  if (userAgent.includes('Android')) {
    // Try to extract device model
    const modelMatch = userAgent.match(/;\s*([^;)]+)\s*\)\s*AppleWebKit/) ||
                      userAgent.match(/;\s*([^;)]+)\s*Build/) ||
                      userAgent.match(/Android[^;]*;\s*([^;)]+)/)
    
    const model = modelMatch ? modelMatch[1].trim() : 'Android Device'
    
    return {
      name: 'Android Device',
      model: model
    }
  }

  // Windows detection
  if (userAgent.includes('Windows')) {
    return {
      name: 'Windows PC',
      model: 'Desktop/Laptop'
    }
  }

  // macOS detection
  if (userAgent.includes('Mac')) {
    const isIntel = userAgent.includes('Intel')
    return {
      name: 'Mac',
      model: isIntel ? 'Intel Mac' : 'Mac'
    }
  }

  // Linux detection
  if (userAgent.includes('Linux')) {
    return {
      name: 'Linux PC',
      model: 'Desktop/Laptop'
    }
  }

  return { name: 'Unknown Device', model: 'Unknown' }
}

/**
 * Gets comprehensive device information for authentication and analytics
 * @returns DeviceInfo object with device details
 */
export const getDeviceInfo = (): DeviceInfo => {
  const deviceNameModel = getDeviceNameAndModel()
  const osInfo = getOSInfo()
  const browserInfo = getBrowserInfo()

  return {
    deviceType: getDeviceType(),
    deviceName: deviceNameModel.name,
    deviceModel: deviceNameModel.model,
    platform: 'web',
    os: osInfo,
    browser: browserInfo,
    userAgent: typeof window !== 'undefined' ? navigator.userAgent : '',
    screenWidth: typeof window !== 'undefined' ? window.screen.width : 0,
    screenHeight: typeof window !== 'undefined' ? window.screen.height : 0,
    isTouchDevice: typeof window !== 'undefined' ? ('ontouchstart' in window || navigator.maxTouchPoints > 0) : false,
    timestamp: new Date().toISOString()
  }
}

/**
 * Checks if the current device is mobile
 * @returns boolean
 */
export const isMobileDevice = (): boolean => {
  return getDeviceType() === 'mobile'
}

/**
 * Checks if the current device is tablet
 * @returns boolean
 */
export const isTabletDevice = (): boolean => {
  return getDeviceType() === 'tablet'
}

/**
 * Checks if the current device is desktop
 * @returns boolean
 */
export const isDesktopDevice = (): boolean => {
  return getDeviceType() === 'desktop'
}

/**
 * Checks if the current device has touch capability
 * @returns boolean
 */
export const isTouchDevice = (): boolean => {
  if (typeof window === 'undefined') return false
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}
