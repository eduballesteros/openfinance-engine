import { EnvironmentProviders, Provider, inject, makeEnvironmentProviders } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { CLOCK } from '../core/clock';
import { FinanceApi } from './finance-api';
import { HttpFinanceApi } from './http/http-finance-api';
import { SampleFinanceApi, scenarioFromUrl } from './sample/sample-finance-api';

/**
 * Punto único para pasar de datos de ejemplo a datos reales.
 * Cambia a `'api'` cuando el backend exponga los endpoints de `HttpFinanceApi`.
 */
export const DATA_SOURCE: 'sample' | 'api' = 'sample';

export function provideFinanceApi(source: 'sample' | 'api' = DATA_SOURCE): EnvironmentProviders {
  const provider: Provider =
    source === 'api'
      ? { provide: FinanceApi, useClass: HttpFinanceApi }
      : {
          provide: FinanceApi,
          useFactory: () =>
            new SampleFinanceApi(inject(CLOCK), scenarioFromUrl(inject(DOCUMENT).location?.search ?? '')),
        };
  return makeEnvironmentProviders([provider]);
}
