export interface WeatherResponse {
  LocalObservationDateTime: Date;
  EpochTime: number;
  WeatherText: string;
  WeatherIcon: number;
  HasPrecipitation: boolean;
  PrecipitationType: string|null;
  IsDayTime: boolean;
  Temperature: ApparentTemperature;
  RealFeelTemperature: ApparentTemperature;
  RealFeelTemperatureShade: ApparentTemperature;
  RelativeHumidity: number;
  IndoorRelativeHumidity: number;
  DewPoint: ApparentTemperature;
  Wind: Wind;
  WindGust: WindGust;
  UVIndex: number;
  UVIndexText: string;
  Visibility: ApparentTemperature;
  ObstructionsToVisibility: string;
  CloudCover: number;
  Ceiling: ApparentTemperature;
  Pressure: ApparentTemperature;
  PressureTendency: PressureTendency;
  Past24HourTemperatureDeparture: ApparentTemperature;
  ApparentTemperature: ApparentTemperature;
  WindChillTemperature: ApparentTemperature;
  WetBulbTemperature: ApparentTemperature;
  Precip1hr: ApparentTemperature;
  PrecipitationSummary: { [key: string]: ApparentTemperature };
  TemperatureSummary: TemperatureSummary;
  MobileLink: string;
  Link: string;
}

export interface ApparentTemperature {
  Metric: Imperial;
  Imperial: Imperial;
}

export interface Imperial {
  Value: number;
  Unit: string;
  UnitType: number;
  Phrase?: string;
}

export interface PressureTendency {
  LocalizedText: string;
  Code: string;
}

export interface TemperatureSummary {
  Past6HourRange: PastHourRange;
  Past12HourRange: PastHourRange;
  Past24HourRange: PastHourRange;
}

export interface PastHourRange {
  Minimum: ApparentTemperature;
  Maximum: ApparentTemperature;
}

export interface Wind {
  Direction: Direction;
  Speed: ApparentTemperature;
}

export interface Direction {
  Degrees: number;
  Localized: string;
  English: string;
}

export interface WindGust {
  Speed: ApparentTemperature;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
  public static toWeatherResponse(json: string): WeatherResponse[] {
    return cast(JSON.parse(json), a(r('WeatherResponse')));
  }

  public static WeatherResponseToJson(value: WeatherResponse[]): string {
    return JSON.stringify(uncast(value, a(r('WeatherResponse'))), null, 2);
  }
}

function invalidValue(typ: any, val: any, key: any = ''): never {
  if (key) {
    throw Error(`Invalid value for key "${key}". Expected type ${JSON.stringify(typ)} but got ${JSON.stringify(val)}`);
  }
  throw Error(`Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`);
}

function jsonToJSProps(typ: any): any {
  if (typ.jsonToJS === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => (map[p.json] = { key: p.js, typ: p.typ }));
    typ.jsonToJS = map;
  }
  return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
  if (typ.jsToJSON === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => (map[p.js] = { key: p.json, typ: p.typ }));
    typ.jsToJSON = map;
  }
  return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = ''): any {
  function transformPrimitive(typ: string, val: any): any {
    if (typeof typ === typeof val) return val;
    return invalidValue(typ, val, key);
  }

  function transformUnion(typs: any[], val: any): any {
    // val must validate against one typ in typs
    const l = typs.length;
    for (let i = 0; i < l; i++) {
      const typ = typs[i];
      try {
        return transform(val, typ, getProps);
      } catch (_) {}
    }
    return invalidValue(typs, val);
  }

  function transformEnum(cases: string[], val: any): any {
    if (cases.indexOf(val) !== -1) return val;
    return invalidValue(cases, val);
  }

  function transformArray(typ: any, val: any): any {
    // val must be an array with no invalid elements
    if (!Array.isArray(val)) return invalidValue('array', val);
    return val.map((el) => transform(el, typ, getProps));
  }

  function transformDate(val: any): any {
    if (val === null) {
      return null;
    }
    const d = new Date(val);
    if (isNaN(d.valueOf())) {
      return invalidValue('Date', val);
    }
    return d;
  }

  function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
    if (val === null || typeof val !== 'object' || Array.isArray(val)) {
      return invalidValue('object', val);
    }
    const result: any = {};
    Object.getOwnPropertyNames(props).forEach((key) => {
      const prop = props[key];
      const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
      result[prop.key] = transform(v, prop.typ, getProps, prop.key);
    });
    Object.getOwnPropertyNames(val).forEach((key) => {
      if (!Object.prototype.hasOwnProperty.call(props, key)) {
        result[key] = transform(val[key], additional, getProps, key);
      }
    });
    return result;
  }

  if (typ === 'any') return val;
  if (typ === null) {
    if (val === null) return val;
    return invalidValue(typ, val);
  }
  if (typ === false) return invalidValue(typ, val);
  while (typeof typ === 'object' && typ.ref !== undefined) {
    typ = typeMap[typ.ref];
  }
  if (Array.isArray(typ)) return transformEnum(typ, val);
  if (typeof typ === 'object') {
    return typ.hasOwnProperty('unionMembers')
      ? transformUnion(typ.unionMembers, val)
      : typ.hasOwnProperty('arrayItems')
      ? transformArray(typ.arrayItems, val)
      : typ.hasOwnProperty('props')
      ? transformObject(getProps(typ), typ.additional, val)
      : invalidValue(typ, val);
  }
  // Numbers can be parsed by Date but shouldn't be.
  if (typ === Date && typeof val !== 'number') return transformDate(val);
  return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
  return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
  return transform(val, typ, jsToJSONProps);
}

function a(typ: any) {
  return { arrayItems: typ };
}

function u(...typs: any[]) {
  return { unionMembers: typs };
}

function o(props: any[], additional: any) {
  return { props, additional };
}

function m(additional: any) {
  return { props: [], additional };
}

function r(name: string) {
  return { ref: name };
}

const typeMap: any = {
  WeatherResponse: o(
    [
      { json: 'LocalObservationDateTime', js: 'LocalObservationDateTime', typ: Date },
      { json: 'EpochTime', js: 'EpochTime', typ: 0 },
      { json: 'WeatherText', js: 'WeatherText', typ: '' },
      { json: 'WeatherIcon', js: 'WeatherIcon', typ: 0 },
      { json: 'HasPrecipitation', js: 'HasPrecipitation', typ: true },
      { json: 'PrecipitationType', js: 'PrecipitationType', typ: null },
      { json: 'IsDayTime', js: 'IsDayTime', typ: true },
      { json: 'Temperature', js: 'Temperature', typ: r('ApparentTemperature') },
      { json: 'RealFeelTemperature', js: 'RealFeelTemperature', typ: r('ApparentTemperature') },
      { json: 'RealFeelTemperatureShade', js: 'RealFeelTemperatureShade', typ: r('ApparentTemperature') },
      { json: 'RelativeHumidity', js: 'RelativeHumidity', typ: 0 },
      { json: 'IndoorRelativeHumidity', js: 'IndoorRelativeHumidity', typ: 0 },
      { json: 'DewPoint', js: 'DewPoint', typ: r('ApparentTemperature') },
      { json: 'Wind', js: 'Wind', typ: r('Wind') },
      { json: 'WindGust', js: 'WindGust', typ: r('WindGust') },
      { json: 'UVIndex', js: 'UVIndex', typ: 0 },
      { json: 'UVIndexText', js: 'UVIndexText', typ: '' },
      { json: 'Visibility', js: 'Visibility', typ: r('ApparentTemperature') },
      { json: 'ObstructionsToVisibility', js: 'ObstructionsToVisibility', typ: '' },
      { json: 'CloudCover', js: 'CloudCover', typ: 0 },
      { json: 'Ceiling', js: 'Ceiling', typ: r('ApparentTemperature') },
      { json: 'Pressure', js: 'Pressure', typ: r('ApparentTemperature') },
      { json: 'PressureTendency', js: 'PressureTendency', typ: r('PressureTendency') },
      { json: 'Past24HourTemperatureDeparture', js: 'Past24HourTemperatureDeparture', typ: r('ApparentTemperature') },
      { json: 'ApparentTemperature', js: 'ApparentTemperature', typ: r('ApparentTemperature') },
      { json: 'WindChillTemperature', js: 'WindChillTemperature', typ: r('ApparentTemperature') },
      { json: 'WetBulbTemperature', js: 'WetBulbTemperature', typ: r('ApparentTemperature') },
      { json: 'Precip1hr', js: 'Precip1hr', typ: r('ApparentTemperature') },
      { json: 'PrecipitationSummary', js: 'PrecipitationSummary', typ: m(r('ApparentTemperature')) },
      { json: 'TemperatureSummary', js: 'TemperatureSummary', typ: r('TemperatureSummary') },
      { json: 'MobileLink', js: 'MobileLink', typ: '' },
      { json: 'Link', js: 'Link', typ: '' }
    ],
    false
  ),
  ApparentTemperature: o(
    [
      { json: 'Metric', js: 'Metric', typ: r('Imperial') },
      { json: 'Imperial', js: 'Imperial', typ: r('Imperial') }
    ],
    false
  ),
  Imperial: o(
    [
      { json: 'Value', js: 'Value', typ: 3.14 },
      { json: 'Unit', js: 'Unit', typ: '' },
      { json: 'UnitType', js: 'UnitType', typ: 0 },
      { json: 'Phrase', js: 'Phrase', typ: u(undefined, '') }
    ],
    false
  ),
  PressureTendency: o(
    [
      { json: 'LocalizedText', js: 'LocalizedText', typ: '' },
      { json: 'Code', js: 'Code', typ: '' }
    ],
    false
  ),
  TemperatureSummary: o(
    [
      { json: 'Past6HourRange', js: 'Past6HourRange', typ: r('PastHourRange') },
      { json: 'Past12HourRange', js: 'Past12HourRange', typ: r('PastHourRange') },
      { json: 'Past24HourRange', js: 'Past24HourRange', typ: r('PastHourRange') }
    ],
    false
  ),
  PastHourRange: o(
    [
      { json: 'Minimum', js: 'Minimum', typ: r('ApparentTemperature') },
      { json: 'Maximum', js: 'Maximum', typ: r('ApparentTemperature') }
    ],
    false
  ),
  Wind: o(
    [
      { json: 'Direction', js: 'Direction', typ: r('Direction') },
      { json: 'Speed', js: 'Speed', typ: r('ApparentTemperature') }
    ],
    false
  ),
  Direction: o(
    [
      { json: 'Degrees', js: 'Degrees', typ: 0 },
      { json: 'Localized', js: 'Localized', typ: '' },
      { json: 'English', js: 'English', typ: '' }
    ],
    false
  ),
  WindGust: o([{ json: 'Speed', js: 'Speed', typ: r('ApparentTemperature') }], false)
};
