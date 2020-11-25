const Scripts = () => {
  if (process.env.NODE_ENV === 'development') {
    return null;
  }

  return (
    <>
      <script
        async
        defer
        data-domain="bruttonetto.phiilu.com"
        src="https://p.phiilu.com/js/plausible.js"></script>
    </>
  );
};

export default Scripts;
