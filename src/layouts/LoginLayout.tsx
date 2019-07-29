import SelectLang from '@/components/SelectLang';
import { ConnectProps, ConnectState } from '@/models/connect';
import { connect } from 'dva';
import React from 'react';
import DocumentTitle from 'react-document-title';
import { formatMessage } from 'umi-plugin-react/locale';
import Link from 'umi/link';
import logo from '../assets/logo.svg';
import styles from './LoginLayout.less';
import { MenuDataItem, getPageTitle, getMenuData, DefaultFooter } from '@ant-design/pro-layout';

export interface UserLayoutProps extends ConnectProps {
  breadcrumbNameMap: { [path: string]: MenuDataItem };
}

const LoginLayout: React.SFC<UserLayoutProps> = props => {
  const {
    route = {
      routes: [],
    },
  } = props;
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  const { breadcrumb } = getMenuData(routes, props);

  const links = [{
    key: 'FullStack',
    title: 'FullStack',
    href: 'http://fullstack.qasl.cn',
    blankTarget: true
  }, {
    key: 'Document',
    title: '帮助文档',
    href: 'https://www.kancloud.cn/tangtanglove/fullstack',
    blankTarget: true
  }, {
    key: 'Github',
    title: '问题反馈',
    href: 'https://github.com/tangtanglove/fullstack-backend/issues',
    blankTarget: true
  }];
  
  const copyright = '2019 qasl.cn';

  return (
    <DocumentTitle
      title={getPageTitle({
        pathname: location.pathname,
        breadcrumb,
        formatMessage,
        ...props,
      })}
    >
      <div className={styles.container}>
        <div className={styles.lang}>
          <SelectLang />
        </div>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src={logo} />
                <span className={styles.title}>FullStack</span>
              </Link>
            </div>
            <div className={styles.desc}><p>在信息丰富的世界里，唯一稀缺的资源就是人类的注意力。</p></div>
          </div>
          {children}
        </div>
        <DefaultFooter links={links} copyright={copyright} />
      </div>
    </DocumentTitle>
  );
};

export default connect(({ settings }: ConnectState) => ({
  ...settings,
}))(LoginLayout);
