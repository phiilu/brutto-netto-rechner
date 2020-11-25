import Layout from '@components/Layout';
import Scripts from '@components/Scripts';
import '../styles/index.css';

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
      <Scripts />
    </Layout>
  );
}

export default MyApp;
