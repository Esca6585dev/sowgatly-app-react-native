import React from 'react';
import { Box, Flex, HStack, Image, Stack, Text, VStack } from 'native-base';
import { Button, Heading } from '../../components/ui';
import { RouteNames } from '../../constants';
import { useTranslation } from 'react-i18next';

function IntroSliderScreen({ navigation }) {
  const { t } = useTranslation();
  return (
   
      <VStack flex="1">
        <Box flex="0.5">
          <Stack justifyContent="center" bg="brand.200" h="100%" borderTopRadius="24" px={10}>
            <VStack space={6}>
              <Box>
                <Heading fontSize={24} textAlign="center">
                  {t("screens.intro.text.introText")}
                </Heading>
              </Box>
              <Box w="100%" alignItems="center">
                <HStack w="100%" space={3} alignItems="center">
                  <Button
                    flex={0.5}
                    variant="secondary"
                    onPress={() => navigation.navigate({ name: RouteNames.LOGIN })}
                  >
                    <Text>{t("screens.intro.text.login")}</Text>
                  </Button>
                  <Button
                    flex={0.5}
                    onPress={() => navigation.navigate({ name: RouteNames.REGISTER })}
                  >
                    {t("screens.intro.text.signup")}
                  </Button>
                </HStack>
              </Box>
            </VStack>
          </Stack>
        </Box>
      </VStack>
  );
}

export default IntroSliderScreen;