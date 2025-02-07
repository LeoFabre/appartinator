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
import { travelModesLabels$, initializeTravelModes } from './interfaces/travelModesLabels';
import { Observable } from 'rxjs';

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
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  googleLoaded = false;
  travelModesLoaded: boolean = false;
  travelModesLabels$: Observable<{ label: string; value: google.maps.TravelMode }[]> = travelModesLabels$;


  pointA = 'Poissy gare';
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
    private cdr: ChangeDetectorRef,
  ) {
  }

  async ngOnInit(): Promise<void> {
    await initializeTravelModes(this.googleMapsLoader);
    console.log('Google Maps API and travel modes loaded');
    this.travelModesLoaded = true;
    this.cdr.detectChanges();
  }

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

  openRouteDetails(route: RoutePoint): void {
    this.selectedRoute = { ...route };
    this.isDialogVisible = true;
    this.cdr.detectChanges();
  }


  addRoute(): void {
    this.routes.push({
      destination: '',
      mode: google.maps.TravelMode.DRIVING,
      specifyTime: false,
      directionsRenderer: new google.maps.DirectionsRenderer({
        suppressMarkers: false,
        polylineOptions: { strokeColor: this.getRandomColor() },
      }),
      steps: [],
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
        travelMode: google.maps.TravelMode[route.mode],
      };

      if (route.specifyTime && route.arrivalTime) {
        if (route.mode === 'TRANSIT') {
          request.transitOptions = { arrivalTime: route.arrivalTime };
        } else if (route.mode === 'DRIVING') {
          request.drivingOptions = {
            departureTime: route.arrivalTime,
            trafficModel: google.maps.TrafficModel.PESSIMISTIC,
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
            return {
              instruction: step.instructions || 'No instruction available',
              duration: step.duration?.text || 'N/A',
              distance: step.distance?.text || 'N/A',
              travelMode: step.travel_mode,
              transitDetails: step.travel_mode === google.maps.TravelMode.TRANSIT && step.transit
                ? {
                  line: step.transit.line?.short_name || 'Unknown Line',
                  departureStop: step.transit.departure_stop?.name || 'Unknown Stop',
                  departureTime: step.transit.departure_time?.text || 'N/A',
                  arrivalStop: step.transit.arrival_stop?.name || 'Unknown Stop',
                  arrivalTime: step.transit.arrival_time?.text || 'N/A',
                }
                : undefined,
            };
          }) || [];
          console.log(`Steps for ${route.destination}:`, route.steps);
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

}
