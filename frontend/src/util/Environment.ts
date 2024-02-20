export default class Environment {
  private constructor() {
    // Preventing instantiation of static util class
  }

  static getBackendUrl(): string {
    const url = process.env["REACT_APP_BACKEND_URL"];
    if (!url) {
      console.log("REACT_APP_BACKEND_URL not set. Defaulting to http://localhost:81");
      return "";
    }
    return url;
  }
}
