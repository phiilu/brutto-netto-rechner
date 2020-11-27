import { Provider } from 'reakit';
import Layout from '@components/Layout';
import Scripts from '@components/Scripts';
import '../styles/index.css';

function MyApp({ Component, pageProps }) {
  return (
    <Provider>
      <Layout>
        <Component {...pageProps} />
        <Scripts />
      </Layout>
    </Provider>
  );
}

export default MyApp;
