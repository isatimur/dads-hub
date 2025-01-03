export const RobotsMetadata: React.FC<{ noindex?: boolean }> = ({ noindex }) => {
  return (
    <Head>
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <>
          <meta name="robots" content="index, follow" />
          <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
          <meta name="yandex" content="index, follow" />
        </>
      )}
    </Head>
  );
}; 