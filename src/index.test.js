import {
  Projector,
  Provider,
  Router,
  Shookt,
  Code6,
  Captcha,
  Barangay,
  GoogleMap,
  ImgUpload,
  Erratum,
  Mobile,
  Utils,
  intercept
} from '.';

describe('Components', () => {
  it('Projector', () => {
    expect(Projector).toBeTruthy();
  });
  it('Provider', () => {
    expect(Provider).toBeTruthy();
  });
  it('Router', () => {
    expect(Router).toBeTruthy();
  });
  it('Shookt', () => {
    expect(Shookt).toBeTruthy();
  });
  it('Code6', () => {
    expect(Code6).toBeTruthy();
  });
  it('Captcha', () => {
    expect(Captcha).toBeTruthy();
  });
  it('Barangay', () => {
    expect(Barangay).toBeTruthy();
  });
  it('GoogleMap', () => {
    expect(GoogleMap).toBeTruthy();
  });
  it('ImgUpload', () => {
    expect(ImgUpload).toBeTruthy();
  });
  it('Erratum', () => {
    expect(Erratum).toBeTruthy();
    expect(Erratum.internal).toBeTruthy();
    expect(Erratum.expired).toBeTruthy();
  });
  it('Mobile', () => {
    expect(Mobile).toBeTruthy();
  });
  it('Utils', () => {
    expect(Utils).toBeTruthy();
  });
  it('intercept', () => {
    expect(intercept).toBeTruthy();
  });
});
