import { AfterViewInit, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { GoogleMap, GoogleMapsModule } from '@angular/google-maps';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { AccordionModule } from 'primeng/accordion';

import { GoogleMapsLoaderService } from './google-maps-loader.service';
import { Select } from 'primeng/select';
import { ScrollPanel } from 'primeng/scrollpanel';

import { RouteDetailsDialogComponent } from './route-details-dialog/route-details-dialog.component';
import { RoutePoint } from './interfaces/routePoint';
import { travelModes } from './interfaces/travelModes';

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
    RouteDetailsDialogComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  googleLoaded = false;
  pointA = 'Paris, France';
  routes: RoutePoint[] = [];

  selectedRoute?: RoutePoint;
  isDialogVisible = false;

  center: google.maps.LatLngLiteral = { lat: 48.8566, lng: 2.3522 };
  zoom = 11;

  @ViewChild(GoogleMap, { static: false }) map!: GoogleMap;

  directionsService!: google.maps.DirectionsService;
  lastAddedRouteIndex: number = 0;

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

      // Initialize directionsRenderer for preloaded routes (useful if you need to hardcode a default routes state)
      this.routes.forEach(route => {
        route.directionsRenderer = new google.maps.DirectionsRenderer({
          suppressMarkers: false,
          polylineOptions: { strokeColor: this.getRandomColor() }
        });
      });
    } catch (error) {
      alert('Error loading Google Maps API');
      console.error('Error loading Google Maps API', error);
    }
  }

  openRouteDetails(route: RoutePoint): void {
    if (this.selectedRoute !== route) {
      this.selectedRoute = { ...route };
    }
    this.isDialogVisible = true;
    // this.cdr.markForCheck();
    this.cdr.detectChanges();
  }


  addRoute(): void {
    this.routes.push({
      destination: '',
      mode: travelModes[0].value, // Default to driving
      specifyTime: false,
      directionsRenderer: new google.maps.DirectionsRenderer({
        suppressMarkers: false,
        polylineOptions: { strokeColor: this.getRandomColor() }
      }),
      steps: []
    });
    this.lastAddedRouteIndex = this.routes.length - 1;
  }

  removeRoute(index: number): void {
    if (this.routes[index].directionsRenderer) {
      this.routes[index].directionsRenderer.setMap(null);
    }
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

      if (route.specifyTime && route.arrivalTime) {
        if (route.mode === 'TRANSIT') {
          request.transitOptions = { arrivalTime: route.arrivalTime };
        } else if (route.mode === 'DRIVING') {
          request.drivingOptions = {
            departureTime: route.arrivalTime,
            trafficModel: google.maps.TrafficModel.PESSIMISTIC
          };
        }
      }

      this.directionsService.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          const leg = result.routes[0]?.legs[0];
          route.duration = leg?.duration?.text || 'N/A';
          if (route.directionsRenderer) {
            route.directionsRenderer.setDirections(result);
            route.directionsRenderer.setMap(this.map.googleMap!);
          }
          // Extract step details
          route.steps = leg?.steps.map((step) => {
            const transit = step.transit ? step.transit : undefined;
            return {
              instruction: step.instructions,
              duration: step.duration?.text || 'N/A',
              distance: step.distance?.text || 'N/A',
              travelMode: step.travel_mode as 'DRIVING' | 'TRANSIT',
              transitDetails: transit
                ? {
                  line: transit.line?.short_name || '',
                  departureStop: transit.departure_stop.name,
                  departureTime: transit.departure_time.text,
                  arrivalStop: transit.arrival_stop.name,
                  arrivalTime: transit.arrival_time.text
                }
                : undefined
            };
          }) || [];

          this.cdr.detectChanges();
        } else {
          alert(`Error calculating route ${index + 1}: ${status}`);
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

  protected readonly travelModes = travelModes;
}
