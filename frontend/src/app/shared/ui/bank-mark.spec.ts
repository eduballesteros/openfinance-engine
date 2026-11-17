import { TestBed } from '@angular/core/testing';
import { BankMarkComponent } from './bank-mark';

describe('BankMarkComponent', () => {
  function setup(name: string, logoUrl: string | null = null) {
    const fixture = TestBed.createComponent(BankMarkComponent);
    fixture.componentRef.setInput('name', name);
    fixture.componentRef.setInput('logoUrl', logoUrl);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const fail = () => {
      element.querySelector('img')?.dispatchEvent(new Event('error'));
      fixture.detectChanges();
    };
    return { fixture, element, fail };
  }

  it('muestra la imagen local de cada banco conocido aunque el proveedor no facilite logo', () => {
    for (const [name, file] of [[' BBVA ', 'bbva.png'], ['ING', 'ing.svg'], ['Openbank', 'openbank.svg'], ['Revolut', 'revolut.svg'], ['CaixaBank', 'caixabank.svg'], ['caixa', 'caixabank.svg']]) {
      const { element } = setup(name);
      expect(element.querySelector('img')?.getAttribute('src')).toBe('banks/' + file);
      expect(element.querySelector('img')?.alt).toBe('');
    }
  });

  it('prefiere el proveedor, recurre a la copia local y termina en monograma si fallan', () => {
    const { element, fail } = setup('BBVA', 'https://example.com/bank.png');
    expect(element.querySelector('img')?.getAttribute('src')).toBe('https://example.com/bank.png');
    fail();
    expect(element.querySelector('img')?.getAttribute('src')).toBe('banks/bbva.png');
    fail();
    expect(element.querySelector('img')).toBeNull();
    expect(element.textContent?.trim()).toBe('BBVA');
  });

  it('recupera la imagen al cambiar de banco o recibir una URL nueva después de un fallo', () => {
    const { fixture, element, fail } = setup('BBVA');
    fail();
    fixture.componentRef.setInput('name', 'ING');
    fixture.detectChanges();
    expect(element.querySelector('img')?.getAttribute('src')).toBe('banks/ing.svg');
    fail();
    fixture.componentRef.setInput('logoUrl', 'https://example.com/new-logo.png');
    fixture.detectChanges();
    expect(element.querySelector('img')?.getAttribute('src')).toBe('https://example.com/new-logo.png');
  });

  it('mantiene un monograma estable para entidades desconocidas sin imagen', () => {
    const { element } = setup('Banco de prueba');
    expect(element.querySelector('img')).toBeNull();
    expect(element.textContent?.trim()).toBe('BDP');
  });
});
