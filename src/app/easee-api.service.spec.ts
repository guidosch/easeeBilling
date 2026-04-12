import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EaseeApiService } from './easee-api.service';
import { NotificationService } from './NotificationSerivce';
import { PowerUsage, Permission } from './Chargers';

describe('EaseeApiService', () => {
  let service: EaseeApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    const notificationSpy = jasmine.createSpyObj('NotificationService', ['showError']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        EaseeApiService,
        { provide: NotificationService, useValue: notificationSpy }
      ]
    });
    service = TestBed.inject(EaseeApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getChargerConsumption', () => {
    it('should GET the hourly consumption endpoint with the correct URL', () => {
      const from = '2025-01-01T00:00:00Z';
      const to = '2025-01-31T23:59:59Z';
      const mockData: PowerUsage[] = [
        { from, to, totalEnergy: 5.0, highRate: false, solarPower: false }
      ];

      service.getChargerConsumption('EHC123', from, to).subscribe(data => {
        expect(data).toEqual(mockData);
      });

      const expectedUrl = `https://api.easee.cloud/api/chargers/EHC123/usage/hourly/${from}/${to}`;
      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockData);
    });

    it('should substitute all three placeholders in the URL', () => {
      service.getChargerConsumption('MY_ID', 'FROM_VAL', 'TO_VAL').subscribe();

      const req = httpMock.expectOne(
        'https://api.easee.cloud/api/chargers/MY_ID/usage/hourly/FROM_VAL/TO_VAL'
      );
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });
  });

  describe('getChargerPermissions', () => {
    it('should GET the permissions endpoint for the given charger ID', () => {
      const mockPermissions: Permission[] = [
        { userId: 1, name: 'Alice', phoneNumber: '+41 79 000 00 00', email: 'alice@test.com' }
      ];

      service.getChargerPermissions('EHC123').subscribe(data => {
        expect(data).toEqual(mockPermissions);
      });

      const req = httpMock.expectOne('https://api.easee.cloud/api/chargers/EHC123/permission');
      expect(req.request.method).toBe('GET');
      req.flush(mockPermissions);
    });

    it('should substitute the {id} placeholder in the permissions URL', () => {
      service.getChargerPermissions('ANOTHER_ID').subscribe();

      const req = httpMock.expectOne(
        'https://api.easee.cloud/api/chargers/ANOTHER_ID/permission'
      );
      req.flush([]);
    });
  });

  describe('getProducts', () => {
    it('should GET the products endpoint', () => {
      const mockProducts = [{ circuits: [{ chargers: [] }] }];

      service.getProducts().subscribe(data => {
        expect(data).toEqual(mockProducts as any);
      });

      const req = httpMock.expectOne('https://api.easee.cloud/api/accounts/products');
      expect(req.request.method).toBe('GET');
      req.flush(mockProducts);
    });
  });
});
