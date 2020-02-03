import React, { PureComponent } from 'react';
import FormPage from '@/components/PlanetUI/FormPage';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { stringify } from 'qs';

class Engine extends PureComponent {

  state = {
    url: 'admin/article/edit'+'?'+stringify(this.props.location.query),
  };

  render() {
    return (
      <PageHeaderWrapper title={false}>
        <FormPage url={this.state.url} />
      </PageHeaderWrapper>
    );
  }
}

export default Engine;
