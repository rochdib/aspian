import React, { FC } from 'react';
import { Result, Button } from 'antd';
import { withTranslation, WithTranslation } from 'react-i18next';

const NotFound: FC<WithTranslation> = ({t}) => {
  return (
    <Result
      status="404"
      title={t("result-pages.404.title")}
      subTitle={t("result-pages.404.subtitle")}
      extra={
        <Button type="primary" href="/admin">
          {t("result-pages.404.button")}
        </Button>
      }
    />
  );
};

export default withTranslation()(NotFound);
