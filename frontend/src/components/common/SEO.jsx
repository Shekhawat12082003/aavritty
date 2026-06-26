import { Helmet } from 'react-helmet-async';
import { APP_NAME } from '@/constants';

export default function SEO({ title, description, keywords }) {
  const pageTitle = title ? `${title} | ${APP_NAME}` : APP_NAME;
  return (
    <Helmet>
      <title>{pageTitle}</title>
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
    </Helmet>
  );
}
