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

    return shouldDetach;
  }
  store(
    route: ActivatedRouteSnapshot,
    handle: DetachedRouteHandle | null
  ): void {

    if (route.routeConfig?.path && handle) {
      this.cachedRoutes[route.routeConfig.path] = handle;
    }
  }
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const shouldAttach =
      !!route.routeConfig?.path && !!this.cachedRoutes[route.routeConfig.path];

    return shouldAttach;
  }
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    let cachedRoute = null;
    if (route.routeConfig?.path) {
      cachedRoute = this.cachedRoutes[route.routeConfig.path];
    }

    return cachedRoute;
  }
  shouldReuseRoute(
    future: ActivatedRouteSnapshot,
    curr: ActivatedRouteSnapshot
  ): boolean {
    const shouldReuseRoute = future.routeConfig === curr.routeConfig;

    return shouldReuseRoute;
  }
}
