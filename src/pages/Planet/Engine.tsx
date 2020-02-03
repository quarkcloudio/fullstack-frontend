import React, { PureComponent } from 'react';
import FormPage from '@/components/PlanetUI/FormPage';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { stringify } from 'qs';

class Engine extends PureComponent {

  state = {
    api: this.props.location.query.api,
    component:this.props.location.query.component
  };
  
  componentDidMount() {

  }

  render() {
    return (
      <PageHeaderWrapper title={false}>
        <FormPage api={this.state.api} />
      </PageHeaderWrapper>
    );
  }
}

export default Engine;
