/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(tabs)` | `/(tabs)/` | `/(tabs)/discover` | `/(tabs)/profile` | `/(tabs)/trips` | `/_sitemap` | `/create-trip` | `/discover` | `/profile` | `/sign-in` | `/sign-up` | `/trips`;
      DynamicRoutes: `/trip/${Router.SingleRoutePart<T>}`;
      DynamicRouteTemplate: `/trip/[id]`;
    }
  }
}
