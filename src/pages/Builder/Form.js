import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import BasicForm from '@/components/Builder/BasicForm';

class FormPage extends PureComponent {
  render() {
    return (
      <BasicForm title={'test'} action={'admin/article/store'} fields={['xxx']} data={['xxx']} />
    );
  }
}

export default FormPage;
