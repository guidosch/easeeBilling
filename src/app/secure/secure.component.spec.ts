import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecureComponent } from './secure.component';

describe('SecureComponent', () => {
  let component: SecureComponent;
  let fixture: ComponentFixture<SecureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecureComponent ],
      providers: [component, ]
    })
    .compileComponents();
    //TestBed.inject();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SecureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

class MochAuthService {

}
