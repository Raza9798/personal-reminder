import React from 'react';
import { Breadcrumb, Layout, theme } from 'antd';
import ContentList from './components/ContentList';
const { Header, Content, Footer } = Layout;

const App: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ height: '100vh' }} >
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div className="demo-logo" />
        <h1 style={{ color: 'white' }}> {process.env.REACT_APP_NAME}</h1>
      </Header>
      <Content style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'start', overflow: 'auto', }}>
        <div style={{ width: '50%', padding: '0 48px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
          </Breadcrumb>
          <div
            style={{
              background: colorBgContainer,
              padding: 24,
              borderRadius: borderRadiusLG,
            }}
          >
            <ContentList />
          </div>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        {process.env.REACT_APP_NAME} ©{new Date().getFullYear()} Created by RAZA9798
      </Footer>
    </Layout>
  );
};

export default App;
