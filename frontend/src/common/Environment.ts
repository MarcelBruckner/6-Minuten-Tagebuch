export default class Environment {
  private constructor() {
    // Preventing instantiation of static util class
  }

  static getBackendUrl(): string {
    const url = process.env.REACT_APP_BACKEND_URL;
    if (!url) {
      const defaultUrl = "http://192.168.178.94:4001";
      console.log(`BACKEND_URL not set. Defaulting to ${defaultUrl}`);
      return defaultUrl;
    }
    console.log(`BACKEND_URL: ${url}`);
    return url;
  }
}
