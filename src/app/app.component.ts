import { Component, AfterViewInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { GoogleMapsModule, GoogleMap } from '@angular/google-maps';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { AccordionModule } from 'primeng/accordion';

import { GoogleMapsLoaderService } from './google-maps-loader.service';
import { Select } from 'primeng/select';
import { ScrollPanel } from 'primeng/scrollpanel';

interface RoutePoint {
  destination: string;
  mode: 'DRIVING' | 'TRANSIT';
  specifyTime: boolean;
  showConfig: boolean;
  arrivalTime?: Date;
  duration?: string;
  directionsRenderer?: google.maps.DirectionsRenderer;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    GoogleMapsModule,
    SidebarModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    CalendarModule,
    AccordionModule,
    Select,
    ScrollPanel,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  googleLoaded = false;
  pointA = 'Paris, France';
  routes: RoutePoint[] = [];

  center: google.maps.LatLngLiteral = { lat: 48.8566, lng: 2.3522 };
  zoom = 11;

  @ViewChild(GoogleMap, { static: false }) map!: GoogleMap;

  directionsService!: google.maps.DirectionsService;
  lastAddedRouteIndex: number = 0;

  travelModes: { label: string; value: 'DRIVING' | 'TRANSIT' }[] = [
    { label: 'Driving', value: 'DRIVING' },
    { label: 'Transit', value: 'TRANSIT' }
  ];


  constructor(
    private googleMapsLoader: GoogleMapsLoaderService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngAfterViewInit(): Promise<void> {
    try {
      await this.googleMapsLoader.load();
      this.googleLoaded = true;
      this.cdr.detectChanges();
      this.directionsService = new google.maps.DirectionsService();
    } catch (error) {
      alert('Error loading Google Maps API');
      console.error('Error loading Google Maps API', error);
    }
  }

  addRoute(): void {
    this.routes.push({
      destination: '',
      mode: this.travelModes[0].value, // Default to driving
      specifyTime: false,
      showConfig: true,
      directionsRenderer: new google.maps.DirectionsRenderer({
        suppressMarkers: false,
        polylineOptions: { strokeColor: this.getRandomColor() }
      })
    });
    this.lastAddedRouteIndex = this.routes.length - 1;
  }

  removeRoute(index: number): void {
    this.routes.splice(index, 1);
    this.lastAddedRouteIndex--;
    if (this.lastAddedRouteIndex < 0) {
      this.lastAddedRouteIndex = 0;
    }
    this.cdr.detectChanges();
  }

  calculateRoutes(): void {
    if (!this.pointA || this.routes.length === 0) {
      alert('Please enter a valid starting point and at least one route.');
      return;
    }
    if (!this.directionsService) {
      alert('Directions service not initialized.');
      console.error('Directions service not initialized.');
      return;
    }

    this.routes.forEach((route, index) => {
      if (!route.destination) {
        alert(`Please enter a destination for route ${index + 1}`);
        return;
      }

      const request: google.maps.DirectionsRequest = {
        origin: this.pointA,
        destination: route.destination,
        travelMode: google.maps.TravelMode[route.mode]
      };

      if (route.specifyTime) {
        if (route.mode === 'TRANSIT' && route.arrivalTime) {
          request.transitOptions = { arrivalTime: route.arrivalTime };
        } else if (route.mode === 'DRIVING' && route.arrivalTime) {
          request.drivingOptions = {
            departureTime: route.arrivalTime,
            trafficModel: google.maps.TrafficModel.BEST_GUESS
          };
        }
      }

      this.directionsService.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          if (route.directionsRenderer) {
            route.directionsRenderer.setDirections(result);
            route.directionsRenderer.setMap(this.map.googleMap!);
          }
          route.duration = result.routes[0]?.legs[0]?.duration?.text || 'N/A';
          this.cdr.detectChanges();
        } else {
          alert(`Error calculating route ${index + 1}: ${status}`);
          console.error(`Error calculating route ${index + 1}:`, status);
        }
      });
    });
  }

  hasCalculatedRoutes(): boolean {
    return this.routes.some(route => route.duration);
  }

  private getRandomColor(): string {
    const colors = ['#FF0000', '#0000FF', '#00FF00', '#FF00FF', '#00FFFF', '#FFA500'];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}
