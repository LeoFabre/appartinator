# 🏢🏢🏢 APPARTINATOR 🏢🏢🏢

### Ever struggled to find the perfect apartment because of geographical constraints?  

You want to live near your workplace, but you don't know where to start looking?  

Your kids go to school in a specific area, but you want to live in a neighborhood with a park?  

Your loved one doesn't drive, but you want to live close enough to your workplace to avoid long commutes?  

You have a hard time simulating all the possible routes from every new place you want to search for an apartment?

### **Appartinator** is here to help you!

## What is Appartinator? 

Appartinator is a web application that helps you calculate many routes at once, from a single starting point to multiple destinations.  
For example, you can enter the address of the train station of the city where you're looking for an apartment, 
and then enter the addresses of your workplace, your kids' school, and whatever other places you want to be close to.
You can configure transportation modes (walking, biking, driving, public transport) and optionally set an arrival time to take into account traffic conditions.  

_~~If you only know your constraints but not where to look for an apartment, you can click the "Find it for me!" button, and Appartinator will show you the best area(s) to live in, based on your destinations.~~ - maybe in the future !_ 🚀

----

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.1.4.

## Installation

To install the project, run:

```bash
npm install
```

Then, you need to create a file named `environment.ts` in the `src/environments/` directory.
There is a dummy file named `environment.dummy.ts` that you can use as a template.
You will need to replace the dummy API key with your own Google Maps API key.


## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
