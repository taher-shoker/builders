import {
  ActivatedRouteSnapshot,
  BaseRouteReuseStrategy,
  DetachedRouteHandle,
  RouteReuseStrategy,
} from '@angular/router';
type CachedRoute = {
  [key: string | symbol]: any;
};
const ReuseComponent = 'reuseComponent';
export class AppRouteReuseStrategy implements RouteReuseStrategy {
  private cachedRoutes: CachedRoute = {};
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    const shouldDetach = !!route.data[ReuseComponent] && !!route.component;
    console.log(
      `AppRouteReuseStrategy#shouldDetach(${route.routeConfig?.path}) called. Return: ${shouldDetach}`
    );
    return shouldDetach;
  }
  store(
    route: ActivatedRouteSnapshot,
    handle: DetachedRouteHandle | null
  ): void {
    console.log(
      `AppRouteReuseStrategy#store(${route.routeConfig?.path}) called.`
    );
    if (route.routeConfig?.path && handle) {
      console.log(`Caching route: ${route.routeConfig?.path}`);
      this.cachedRoutes[route.routeConfig.path] = handle;
    }
  }
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const shouldAttach =
      !!route.routeConfig?.path && !!this.cachedRoutes[route.routeConfig.path];
    console.log(
      `AppRouteReuseStrategy#shouldAttach(${route.routeConfig?.path}) called. Return: ${shouldAttach}`
    );
    return shouldAttach;
  }
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    let cachedRoute = null;
    if (route.routeConfig?.path) {
      cachedRoute = this.cachedRoutes[route.routeConfig.path];
    }
    console.log(
      `AppRouteReuseStrategy#retrieve(${route.routeConfig?.path}) called. Return: ${cachedRoute}`
    );
    return cachedRoute;
  }
  shouldReuseRoute(
    future: ActivatedRouteSnapshot,
    curr: ActivatedRouteSnapshot
  ): boolean {
    const shouldReuseRoute = future.routeConfig === curr.routeConfig;
    console.log(
      `AppRouteReuseStrategy#shouldReuseRoute(future:${future.routeConfig?.path}, current: ${curr.routeConfig?.path}) called. Return: ${shouldReuseRoute}`
    );
    return shouldReuseRoute;
  }
}
