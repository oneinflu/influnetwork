export interface BunnyConfig {
  apiKey: string;
  storageZoneName: string;
  storagePassword: string;
  hostname: string;
  baseUrl: string;
}

const bunnyConfig: BunnyConfig = {
  apiKey: process.env.BUNNY_API_KEY || '',
  storageZoneName: process.env.BUNNY_STORAGE_ZONE_NAME || '',
  storagePassword: process.env.BUNNY_STORAGE_PASSWORD || '',
  hostname: process.env.BUNNY_HOSTNAME || '',
  baseUrl: `https://${process.env.BUNNY_HOSTNAME || 'your-hostname'}.b-cdn.net`,
};

export default bunnyConfig;