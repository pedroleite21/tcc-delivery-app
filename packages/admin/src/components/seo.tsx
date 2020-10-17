import * as React from 'react';
import { Helmet } from 'react-helmet';
import { useStaticQuery, graphql } from 'gatsby';

type MetaProps = JSX.IntrinsicElements['meta'];

type SEOProps = {
  description?: string;
  lang?: string;
  meta?: MetaProps[];
  title: string;
}

type SEOQueryProps = {
  site: {
    siteMetadata: {
      title: string;
    }
  }
}

function SEO({ description = '', lang = 'en', meta = [], title }: SEOProps) {
  const { site } = useStaticQuery<SEOQueryProps>(
    graphql`
      query {
        site {
          siteMetadata {
            title
          }
        }
      }
    `
  );

  return (
    <Helmet
      htmlAttributes={{ lang }}
      title={title}
      titleTemplate={`%s | ${site.siteMetadata.title}`}
      meta={[
        {
          name: `description`,
          content: description,
        },
        {
          property: `og:title`,
          content: title,
        },
        {
          property: `og:description`,
          content: description,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        ...meta,
      ]}
    />
  );
}

export default SEO;
