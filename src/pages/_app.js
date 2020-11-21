import Layout from '@components/Layout';
import '../styles/index.css';

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
      <script
        async
        defer
        data-domain="bruttonetto.phiilu.com"
        src="https://p.phiilu.com/js/plausible.js"></script>
    </Layout>
  );
}

export default MyApp;
