import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Loader } from '@googlemaps/js-api-loader';

declare global {
  interface Window {
    initMap: () => void;
  }
}

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsLoaderService {
  private loaded = false;
  private loader: Loader;

  constructor() {
    this.loader = new Loader({
      apiKey: environment.googleMapsApiKey,
      version: 'weekly',
    });
  }

  load(): Promise<typeof google> {
    if (this.loaded) {
      return Promise.resolve(google);
    }

    return this.loader.load().then(() => {
      this.loaded = true;
      return google;
    });
  }
}
