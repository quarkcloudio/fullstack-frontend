import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import BasicForm from '@/components/Builder/BasicForm';

class FormPage extends PureComponent {
  render() {
    return (
      <BasicForm title={'test'} action={'admin/demo/store'} fieldsAndDataUrl={'admin/demo/builderForm'} />
    );
  }
}

export default FormPage;
