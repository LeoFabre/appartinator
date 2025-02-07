import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

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

  load(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (this.loaded) {
        resolve();
        return;
      }

      window.initMap = () => {
        this.loaded = true;
        resolve();
      };

      const script: HTMLScriptElement = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}&callback=initMap`;
      script.async = true;
      script.defer = true;
      script.onerror = () => {
        reject(new Error('Erreur lors du chargement du script Google Maps.'));
      };

      document.head.appendChild(script);
    });
  }
}
