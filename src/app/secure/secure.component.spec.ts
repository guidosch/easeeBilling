import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NO_ERRORS_SCHEMA, Directive } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { of } from 'rxjs';

import {
  SecureComponent,
  checkTimeForHighRate,
  sumCosts,
  getUsers,
  sortChargersByPPNumber
} from './secure.component';
import { AuthService } from '../auth.service';
import { EaseeApiService } from '../easee-api.service';
import { NotificationService } from '../NotificationSerivce';
import { Charger, PowerUsage, Permission } from '../Chargers';

// ─── Helpers ────────────────────────────────────────────────────────────────

function makeCharger(id: string, name: string, overrides: Partial<Charger> = {}): Charger {
  return {
    id,
    name,
    permissions: [],
    users: '',
    powerUsage: [],
    totalConsumption: 0,
    totalCostsInPeriod: 0,
    totalConsumptionKWhHighRate: 0,
    totalConsumptionKWhLowRate: 0,
    totalConsumptionEligibleForSolar: 0,
    ...overrides
  };
}

function makeUsage(from: string, totalEnergy: number, highRate = false, solarPower = false): PowerUsage {
  return { from, to: '', totalEnergy, highRate, solarPower };
}

// ─── Pure function tests ─────────────────────────────────────────────────────

describe('getUsers', () => {
  it('should join permission names with a comma', () => {
    const permissions: Permission[] = [
      { userId: 1, name: 'Alice', phoneNumber: '', email: '' },
      { userId: 2, name: 'Bob', phoneNumber: '', email: '' }
    ];
    expect(getUsers(permissions)).toBe('Alice, Bob');
  });

  it('should return an empty string for no permissions', () => {
    expect(getUsers([])).toBe('');
  });

  it('should return just the name when there is a single permission', () => {
    const permissions: Permission[] = [
      { userId: 1, name: 'Alice', phoneNumber: '', email: '' }
    ];
    expect(getUsers(permissions)).toBe('Alice');
  });
});

describe('sortChargersByPPNumber', () => {
  it('should sort chargers by their PP number in ascending order', () => {
    const chargers = [
      makeCharger('c', 'PP37'),
      makeCharger('a', 'PP01'),
      makeCharger('b', 'PP10')
    ];
    const sorted = chargers.sort(sortChargersByPPNumber);
    expect(sorted.map(c => c.name)).toEqual(['PP01', 'PP10', 'PP37']);
  });

  it('should return 0 for chargers with equal PP numbers', () => {
    const result = sortChargersByPPNumber(makeCharger('a', 'PP05'), makeCharger('b', 'PP05'));
    expect(result).toBe(0);
  });
});

describe('sumCosts', () => {
  const HIGH_RATE = 0.4122;
  const LOW_RATE = 0.1662;

  it('should calculate costs at high rate', () => {
    const charger = makeCharger('c1', 'PP01', {
      powerUsage: [makeUsage('t', 10, true, false)]
    });
    sumCosts(charger);
    expect(charger.totalConsumptionKWhHighRate).toBe(10);
    expect(charger.totalConsumptionKWhLowRate).toBe(0);
    expect(charger.totalCostsInPeriod).toBeCloseTo(10 * HIGH_RATE, 5);
    expect(charger.totalConsumptionEligibleForSolar).toBe(0);
  });

  it('should calculate costs at low rate', () => {
    const charger = makeCharger('c1', 'PP01', {
      powerUsage: [makeUsage('t', 8, false, false)]
    });
    sumCosts(charger);
    expect(charger.totalConsumptionKWhLowRate).toBe(8);
    expect(charger.totalConsumptionKWhHighRate).toBe(0);
    expect(charger.totalCostsInPeriod).toBeCloseTo(8 * LOW_RATE, 5);
  });

  it('should track solar-eligible consumption separately', () => {
    const charger = makeCharger('c1', 'PP01', {
      powerUsage: [
        makeUsage('t1', 5, false, true),
        makeUsage('t2', 3, false, false)
      ]
    });
    sumCosts(charger);
    expect(charger.totalConsumptionEligibleForSolar).toBe(5);
  });

  it('should ignore entries with zero energy', () => {
    const charger = makeCharger('c1', 'PP01', {
      powerUsage: [makeUsage('t', 0, true, true)]
    });
    sumCosts(charger);
    expect(charger.totalCostsInPeriod).toBe(0);
    expect(charger.totalConsumptionKWhHighRate).toBe(0);
    expect(charger.totalConsumptionEligibleForSolar).toBe(0);
  });

  it('should sum mixed high and low rate entries', () => {
    const charger = makeCharger('c1', 'PP01', {
      powerUsage: [
        makeUsage('t1', 10, true, false),
        makeUsage('t2', 5, false, false)
      ]
    });
    sumCosts(charger);
    expect(charger.totalConsumptionKWhHighRate).toBe(10);
    expect(charger.totalConsumptionKWhLowRate).toBe(5);
    expect(charger.totalCostsInPeriod).toBeCloseTo(10 * HIGH_RATE + 5 * LOW_RATE, 5);
  });
});

describe('checkTimeForHighRate', () => {
  // This function uses Date.toLocaleTimeString() — we spy on it to get
  // deterministic results independent of system locale and timezone.

  afterEach(() => {
    (Date.prototype.toLocaleTimeString as jasmine.Spy)?.and?.callThrough?.();
  });

  function withLocalTime(timeString: string, usageFn: () => PowerUsage[]) {
    spyOn(Date.prototype, 'toLocaleTimeString').and.returnValue(timeString);
    return checkTimeForHighRate(usageFn());
  }

  it('09:00 — low rate, solar', () => {
    const result = withLocalTime('09:00:00', () => [makeUsage('any', 1)]);
    expect(result[0].highRate).toBe(false);
    expect(result[0].solarPower).toBe(true);
  });

  it('10:00 — low rate, solar', () => {
    const result = withLocalTime('10:00:00', () => [makeUsage('any', 1)]);
    expect(result[0].highRate).toBe(false);
    expect(result[0].solarPower).toBe(true);
  });

  it('11:00 — high rate (HT), solar', () => {
    const result = withLocalTime('11:00:00', () => [makeUsage('any', 1)]);
    expect(result[0].highRate).toBe(true);
    expect(result[0].solarPower).toBe(true);
  });

  it('12:00 — high rate (HT), solar', () => {
    const result = withLocalTime('12:00:00', () => [makeUsage('any', 1)]);
    expect(result[0].highRate).toBe(true);
    expect(result[0].solarPower).toBe(true);
  });

  it('13:00 — low rate, solar', () => {
    const result = withLocalTime('13:00:00', () => [makeUsage('any', 1)]);
    expect(result[0].highRate).toBe(false);
    expect(result[0].solarPower).toBe(true);
  });

  it('14:00 — low rate, solar', () => {
    const result = withLocalTime('14:00:00', () => [makeUsage('any', 1)]);
    expect(result[0].highRate).toBe(false);
    expect(result[0].solarPower).toBe(true);
  });

  it('15:00 — low rate, solar', () => {
    const result = withLocalTime('15:00:00', () => [makeUsage('any', 1)]);
    expect(result[0].highRate).toBe(false);
    expect(result[0].solarPower).toBe(true);
  });

  it('16:00 — low rate, no solar', () => {
    const result = withLocalTime('16:00:00', () => [makeUsage('any', 1)]);
    expect(result[0].highRate).toBe(false);
    expect(result[0].solarPower).toBe(false);
  });

  it('18:00 — high rate (HT), no solar', () => {
    const result = withLocalTime('18:00:00', () => [makeUsage('any', 1)]);
    expect(result[0].highRate).toBe(true);
    expect(result[0].solarPower).toBe(false);
  });

  it('19:00 — high rate (HT), no solar', () => {
    const result = withLocalTime('19:00:00', () => [makeUsage('any', 1)]);
    expect(result[0].highRate).toBe(true);
    expect(result[0].solarPower).toBe(false);
  });

  it('any other time — low rate, no solar (default)', () => {
    const result = withLocalTime('22:00:00', () => [makeUsage('any', 1)]);
    expect(result[0].highRate).toBe(false);
    expect(result[0].solarPower).toBe(false);
  });

  it('should process every entry in the array', () => {
    spyOn(Date.prototype, 'toLocaleTimeString').and.returnValues('11:00:00', '09:00:00');
    const usage = [makeUsage('t1', 1), makeUsage('t2', 1)];
    const result = checkTimeForHighRate(usage);
    expect(result[0].highRate).toBe(true);
    expect(result[1].highRate).toBe(false);
  });

  it('Sunday 11:00 — low rate, solar', () => {
    const result = withLocalTime('11:00:00', () => [makeUsage('2026-10-25T11:00:00', 1)]);
    expect(result[0].highRate).toBe(false);
    expect(result[0].solarPower).toBe(true);
  });

  it('Sunday 18:00 — low rate, no solar', () => {
    const result = withLocalTime('18:00:00', () => [makeUsage('2026-10-25T18:00:00', 1)]);
    expect(result[0].highRate).toBe(false);
    expect(result[0].solarPower).toBe(false);
  });

  it('Saturday 11:00 — high rate (HT), solar', () => {
    const result = withLocalTime('11:00:00', () => [makeUsage('2026-10-24T11:00:00', 1)]);
    expect(result[0].highRate).toBe(true);
    expect(result[0].solarPower).toBe(true);
  });
});

// ─── Component tests ──────────────────────────────────────────────────────────

describe('SecureComponent', () => {
  let component: SecureComponent;
  let fixture: ComponentFixture<SecureComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let easeeApi: jasmine.SpyObj<EaseeApiService>;
  let router: jasmine.SpyObj<Router>;
  let notificationService: jasmine.SpyObj<NotificationService>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['secured', 'logout']);
    const easeeApiSpy = jasmine.createSpyObj('EaseeApiService', ['getProducts', 'getChargerConsumption']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const notificationSpy = jasmine.createSpyObj('NotificationService', ['showError']);

    authSpy.secured.and.returnValue(of({ firstName: 'Test', lastName: 'User' }));
    easeeApiSpy.getProducts.and.returnValue(of([{ circuits: [{ chargers: [] }] }]));
    routerSpy.navigate.and.returnValue(Promise.resolve(true));

    await TestBed.configureTestingModule({
      declarations: [SecureComponent],
      imports: [ReactiveFormsModule, MatTooltipModule],
      providers: [
        UntypedFormBuilder,
        { provide: AuthService, useValue: authSpy },
        { provide: EaseeApiService, useValue: easeeApiSpy },
        { provide: Router, useValue: routerSpy },
        { provide: NotificationService, useValue: notificationSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(SecureComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    easeeApi = TestBed.inject(EaseeApiService) as jasmine.SpyObj<EaseeApiService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    notificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load the current user name from AuthService', () => {
      expect(component.currentUser).toBe('Test User');
    });

    it('should generate 16 month chips', () => {
      expect(component.chips.length).toBe(16);
    });

    it('should initialise the form with two date controls', () => {
      expect(component.timePeriodForm.contains('from')).toBe(true);
      expect(component.timePeriodForm.contains('to')).toBe(true);
    });
  });

  describe('isSiteAdmin', () => {
    it('should return true when userRole is 2', () => {
      component.userRole = 2;
      expect(component.isSiteAdmin()).toBeTruthy();
    });

    it('should return false for any other userRole', () => {
      component.userRole = 1;
      expect(component.isSiteAdmin()).toBeFalsy();
      component.userRole = 0;
      expect(component.isSiteAdmin()).toBeFalsy();
    });
  });

  describe('rate helpers', () => {
    it('getHighRate should return 41 (0.4122 * 100 rounded)', () => {
      expect(component.getHighRate()).toBe(41);
    });

    it('getLowRate should return 17 (0.1662 * 100 rounded)', () => {
      expect(component.getLowRate()).toBe(17);
    });
  });

  describe('total aggregation', () => {
    beforeEach(() => {
      component.chargers = [
        makeCharger('c1', 'PP01', {
          totalConsumptionKWhHighRate: 10,
          totalConsumptionKWhLowRate: 5,
          totalConsumptionEligibleForSolar: 8,
          totalCostsInPeriod: 5.0
        }),
        makeCharger('c2', 'PP02', {
          totalConsumptionKWhHighRate: 20,
          totalConsumptionKWhLowRate: 3,
          totalConsumptionEligibleForSolar: 2,
          totalCostsInPeriod: 10.0
        })
      ];
    });

    it('getTotalConsumptionHighRate should sum high-rate kWh across all chargers', () => {
      expect(component.getTotalConsumptionHighRate()).toBe(30);
    });

    it('getTotalConsumptionLowRate should sum low-rate kWh across all chargers', () => {
      expect(component.getTotalConsumptionLowRate()).toBe(8);
    });

    it('getTotalConsumptionEligibleForSolar should sum solar kWh across all chargers', () => {
      expect(component.getTotalConsumptionEligibleForSolar()).toBe(10);
    });

    it('getTotalCostInPeriod should sum costs across all chargers', () => {
      expect(component.getTotalCostInPeriod()).toBeCloseTo(15.0, 5);
    });

    it('all totals should be 0 when no charger data is loaded', () => {
      component.chargers = [];
      expect(component.getTotalConsumptionHighRate()).toBe(0);
      expect(component.getTotalConsumptionLowRate()).toBe(0);
      expect(component.getTotalConsumptionEligibleForSolar()).toBe(0);
      expect(component.getTotalCostInPeriod()).toBe(0);
    });
  });

  describe('handleData', () => {
    it('should show a notification when all chargers have zero costs', () => {
      component.handleData([makeCharger('c1', 'PP01', { totalCostsInPeriod: 0 })]);
      expect(notificationService.showError).toHaveBeenCalled();
    });

    it('should filter out chargers with zero cost and add those with cost', () => {
      component.chargers = [];
      component.handleData([
        makeCharger('c1', 'PP01', { totalCostsInPeriod: 5.0 }),
        makeCharger('c2', 'PP02', { totalCostsInPeriod: 0 })
      ]);
      expect(component.chargers.length).toBe(1);
      expect(component.chargers[0].id).toBe('c1');
    });

    it('should sort the resulting charger list by PP number', () => {
      component.chargers = [];
      component.handleData([
        makeCharger('c3', 'PP10', { totalCostsInPeriod: 1 }),
        makeCharger('c1', 'PP01', { totalCostsInPeriod: 1 }),
        makeCharger('c2', 'PP05', { totalCostsInPeriod: 1 })
      ]);
      expect(component.chargers.map(c => c.name)).toEqual(['PP01', 'PP05', 'PP10']);
    });

    it('should set isLoadingResults to false after processing', () => {
      component.isLoadingResults = true;
      component.handleData([makeCharger('c1', 'PP01', { totalCostsInPeriod: 5 })]);
      expect(component.isLoadingResults).toBe(false);
    });

    it('should accumulate costs when the same charger is loaded multiple times', () => {
      component.chargers = [makeCharger('c1', 'PP01', { totalCostsInPeriod: 5, totalConsumption: 10 })];
      component.handleData([makeCharger('c1', 'PP01', { totalCostsInPeriod: 3, totalConsumption: 6 })]);
      expect(component.chargers[0].totalCostsInPeriod).toBeCloseTo(8, 5);
      expect(component.chargers[0].totalConsumption).toBeCloseTo(16, 5);
    });
  });

  describe('reset', () => {
    it('should clear the chargers list and regenerate chips', () => {
      component.chargers = [makeCharger('c1', 'PP01')];
      component.chips = [];
      component.reset();
      expect(component.chargers.length).toBe(0);
      expect(component.chips.length).toBe(16);
    });
  });

  describe('logout', () => {
    it('should call authService.logout and navigate to /login', () => {
      component.logout();
      expect(authService.logout).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });
});
