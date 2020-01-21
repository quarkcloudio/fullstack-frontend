import React from 'react';
import logo from '../assets/logo.svg';
import styles from './LoginLayout.less';
import DocumentTitle from 'react-document-title';

const BasicLayout: React.FC = props => {
  return (
    <DocumentTitle
      title={'管理员登录'}
    >
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.top}>
          <div className={styles.header}>
              <img alt="logo" className={styles.logo} src={logo} />
              <span className={styles.title}>FullStack</span>
          </div>
          <div className={styles.desc}><p>在信息丰富的世界里，唯一稀缺的资源就是人类的注意力。</p></div>
        </div>
        {props.children}
      </div>
    </div>
    </DocumentTitle>
  );
};

export default BasicLayout;