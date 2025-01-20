import React from 'react';
import { Text, Button, View } from 'react-native';
import { useTranslation } from 'react-i18next';

const ChangeLanguage = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>{t('greeting')}</Text>
      <Button title="English" onPress={() => changeLanguage('en')} />
      <Button title="Русский" onPress={() => changeLanguage('ru')} />
      <Button title="Türkmençe" onPress={() => changeLanguage('tm')} />
    </View>
  );
};

export default ChangeLanguage;
