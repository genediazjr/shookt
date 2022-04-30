import Brgy from 'barangay';
import Utils from './Utils';

const Barangay = props => {
  ['values', 'onChange', 'form', 'fields'].forEach(key => {
    if (!props[key]) {
      throw new Error(`Missing ${key} property in Barangay`);
    }
  });

  let cacheRegion = localStorage.getItem('shkt-region') || '';
  let cacheProvince = localStorage.getItem('shkt-province') || '';
  try {
    if (cacheRegion && cacheProvince) {
      Utils.makeOptions(Brgy(cacheRegion));
      Utils.makeOptions(Brgy(cacheRegion, cacheProvince));
    }
  } catch (e) {
    cacheRegion = '';
    cacheProvince = '';
    localStorage.removeItem('shkt-region');
    localStorage.removeItem('shkt-province');
  }

  const { values, onChange, form, fields } = props;
  values.region = values.region || cacheRegion;
  values.province = values.province || cacheProvince;
  if (values.region) {
    values.provinces = Utils.makeOptions(Brgy(values.region));
    form.setFieldsValue({ [fields[0]]: values.region });
    if (values.province) {
      form.setFieldsValue({ [fields[1]]: values.province });
      values.towncities = Utils.makeOptions(Brgy(values.region, values.province));
      if (values.towncity) {
        form.setFieldsValue({ [fields[2]]: values.towncity });
        values.barangays = Utils.makeOptions(Brgy(values.region, values.province, values.towncity));
        if (values.barangay) {
          form.setFieldsValue({ [fields[3]]: values.barangay });
        }
      }
    }
  }

  return [
    {
      showSearch: true,
      options: Utils.makeOptions(Brgy()),
      placeholder: 'Select a region',
      onChange: val => {
        onChange({
          ...values,
          active: true,
          region: val,
          provinces: Utils.makeOptions(Brgy(val)),
          towncities: [],
          barangays: [],
          province: '',
          towncity: '',
          barangay: ''
        });
        form.setFieldsValue({ [fields[0]]: val });
        form.resetFields([fields[1], fields[2], fields[3]]);
        localStorage.removeItem('shkt-region');
        localStorage.removeItem('shkt-province');
      }
    },
    {
      showSearch: true,
      options: values.provinces,
      disabled: !values.region,
      placeholder: values.region
        ? 'Select a province'
        : 'Select a region first',
      onChange: val => {
        onChange({
          ...values,
          active: true,
          province: val,
          towncities: Utils.makeOptions(Brgy(values.region, val)),
          barangays: [],
          towncity: '',
          barangay: ''
        });
        form.setFieldsValue({ [fields[1]]: val });
        form.resetFields([fields[2], fields[3]]);
        localStorage.setItem('shkt-region', values.region);
        localStorage.setItem('shkt-province', val);
      }
    },
    {
      showSearch: true,
      options: values.towncities,
      disabled: !values.province,
      placeholder: values.province
        ? 'Select a town/city'
        : 'Select a province first',
      onChange: val => {
        onChange({
          ...values,
          active: true,
          towncity: val,
          barangays: Utils.makeOptions(Brgy(values.region, values.province, val)),
          barangay: ''
        });
        form.setFieldsValue({ [fields[2]]: val });
        form.resetFields([fields[3]]);
      }
    },
    {
      options: values.barangays,
      disabled: !values.towncity,
      placeholder: values.towncity
        ? 'Select a barangay'
        : 'Select a town/city first',
      showSearch: true,
      onChange: val => {
        onChange({
          ...values,
          active: true,
          barangay: val
        });
        form.setFieldsValue({ [fields[3]]: val });
      }
    }
  ];
};

export default Barangay;
