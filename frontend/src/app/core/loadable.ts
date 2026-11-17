import { Resource } from '@angular/core';

/** Estado de un bloque de datos tal y como lo necesita la presentación. */
export type Loadable<T> =
  | { readonly status: 'loading' }
  | { readonly status: 'error'; readonly error: Error | undefined }
  | { readonly status: 'ready'; readonly value: T; readonly refreshing: boolean };

/** Traduce un `Resource` de Angular a `Loadable`. Llamar dentro de un `computed`. */
export function toLoadable<T>(resource: Resource<T | undefined>): Loadable<T> {
  if (resource.status() === 'error') {
    return { status: 'error', error: resource.error() };
  }
  if (resource.hasValue()) {
    return { status: 'ready', value: resource.value() as T, refreshing: resource.isLoading() };
  }
  return { status: 'loading' };
}
