import { Component, AfterViewInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { GoogleMapsModule, GoogleMap } from '@angular/google-maps';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import { GoogleMapsLoaderService } from './google-maps-loader.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    GoogleMapsModule,
    SidebarModule,
    ButtonModule,
    InputTextModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  googleLoaded = false;

  pointA = 'Paris, France';
  pointB = 'Versailles, France';
  pointC = 'Lyon, France';

  center: google.maps.LatLngLiteral = { lat: 48.8566, lng: 2.3522 };
  zoom = 11;

  @ViewChild(GoogleMap, { static: false }) map!: GoogleMap;

  directionsRendererTransit!: google.maps.DirectionsRenderer;
  directionsRendererDriving!: google.maps.DirectionsRenderer;
  directionsService!: google.maps.DirectionsService;

  constructor(
    private googleMapsLoader: GoogleMapsLoaderService,
    private cdr: ChangeDetectorRef,
  ) {}

  async ngAfterViewInit(): Promise<void> {
    try {
      await this.googleMapsLoader.load();
      this.googleLoaded = true;
      this.cdr.detectChanges();
      this.directionsService = new google.maps.DirectionsService();
      this.directionsRendererTransit = new google.maps.DirectionsRenderer({
        suppressMarkers: false,
        polylineOptions: { strokeColor: '#FF0000' },
      });
      this.directionsRendererDriving = new google.maps.DirectionsRenderer({
        suppressMarkers: false,
        polylineOptions: { strokeColor: '#0000FF' },
      });
      if (this.map?.googleMap) {
        this.initializeRenderers();
        this.directionsRendererTransit.setMap(this.map.googleMap);
        this.directionsRendererDriving?.setMap(this.map.googleMap);
      }
    } catch (error) {
      console.error('Error loading Google Maps API', error);
    }
  }

  private initializeRenderers(): void {
    if (this.map?.googleMap) {
      this.directionsRendererTransit.setMap(this.map.googleMap);
      this.directionsRendererDriving.setMap(this.map.googleMap);
    }
  }

  /**
   * Calcule les itinéraires pour :
   * - Le trajet en transports en commun (A -> B).
   * - Le trajet en voiture (A -> C) avec un départ fixé pour simuler une arrivée à 9h.
   */
  calculateRoutes(): void {
    console.log('Calculating routes...');
    if (!this.pointA || (!this.pointB && !this.pointC)) {
      alert('Please enter a valid address for point A and at least point B or point C.');
      return;
    }
    if (!this.directionsService) {
      console.error('Directions service not initialized.');
      return;
    }

    // Itinéraire en transports en commun
    if (this.pointB) {
      const requestTransit: google.maps.DirectionsRequest = {
        origin: this.pointA,
        destination: this.pointB,
        travelMode: google.maps.TravelMode.TRANSIT
      };

      if (this.directionsService) {
        this.directionsService.route(
          requestTransit,
          (
            result: google.maps.DirectionsResult | null,
            status: google.maps.DirectionsStatus
          ) => {
            if (status === google.maps.DirectionsStatus.OK && result) {
              this.directionsRendererTransit.setDirections(result);
              this.cdr.detectChanges();
              console.log('Transit route success :', result);
            } else {
              console.error('Error calculating transit route : ' + status);
            }
          }
        );
      }
    }

    // Itinéraire en voiture
    if (this.pointC) {
      const departureTime: Date = this.getNextTuesdayDepartureTime();
      const requestDriving: google.maps.DirectionsRequest = {
        origin: this.pointA,
        destination: this.pointC,
        travelMode: google.maps.TravelMode.DRIVING,
        drivingOptions: {
          departureTime,
          trafficModel: google.maps.TrafficModel.BEST_GUESS
        }
      };

      this.directionsService.route(
        requestDriving,
        (
          result: google.maps.DirectionsResult | null,
          status: google.maps.DirectionsStatus
        ) => {
          if (status === google.maps.DirectionsStatus.OK && result) {
            this.directionsRendererDriving?.setDirections(result);
            this.cdr.detectChanges();
            console.log('Car route success :', result);
          } else {
            console.error('Error calculating car route : ' + status);
          }
        }
      );
    }
  }

  /**
   * Retourne la date du prochain mardi avec l'heure fixée à 8h00.
   */
  private getNextTuesdayDepartureTime(): Date {
    const now = new Date();
    const day = now.getDay(); // 0 (dimanche) à 6 (samedi)
    let daysUntilTuesday = (2 - day + 7) % 7;
    if (daysUntilTuesday === 0) {
      daysUntilTuesday = 7;
    }
    const nextTuesday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + daysUntilTuesday
    );
    nextTuesday.setHours(8, 0, 0, 0);
    return nextTuesday;
  }
}
