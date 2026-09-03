/**
 * Veyra Invest Application Global Configuration
 */
export const APK_CONFIG = {
  version: 'v1.0.0',
  sha256: '6037bd5befcf7b8456eb9084b7be2dc323ff266d5ce0510d49cf098b8d4ff14c',
  repoUrl: 'https://github.com/ravidaghazada/VeyraInvest',
  releaseTagUrl: 'https://github.com/ravidaghazada/VeyraInvest/releases/tag/v1.0.0',
  
  // Direct direct-download link to latest release asset
  githubReleaseUrl: 'https://github.com/ravidaghazada/VeyraInvest/releases/latest/download/Veyra.Invest.apk',
  
  // Tag-specific direct download link
  v1DownloadUrl: 'https://github.com/ravidaghazada/VeyraInvest/releases/download/v1.0.0/Veyra.Invest.apk',
  
  // Suggested file download name
  fileName: 'Veyra.Invest.apk',
};

// Active APK download URL: points directly to the verified GitHub Release v1.0.0
export const ACTIVE_APK_DOWNLOAD_URL = APK_CONFIG.githubReleaseUrl;

