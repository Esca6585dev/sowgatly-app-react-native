# sowgatly.app — mobile app

React Native (Expo SDK 57) client for **Sowgatly**, a gift and flower marketplace
for Turkmenistan. It talks to the Laravel backend in
[Esca6585dev/sowgatly](https://github.com/Esca6585dev/sowgatly) over its REST API
and runs on Android, iOS and the web.

## Features

- Phone number + one-time code login and registration
- Product catalog with categories, search, filters and a city/region picker
- Product details, ratings and reviews
- Cart, delivery addresses, checkout and order history with cancellation
- Favorites
- Shop page, and an order management screen for shop owners
- In-app notifications
- Profile editing and three UI languages: Turkmen (default), Russian, English

## Requirements

| Tool | Version |
|------|---------|
| Node.js | 20 or newer (22 tested) |
| npm | 10+ |
| Expo Go app (SDK 57), or Android Studio / Xcode | for running on a device or emulator |
| EAS CLI (`npm i -g eas-cli`) | only for store / APK builds |

A running backend is required. Follow the quick start in the
[backend README](https://github.com/Esca6585dev/sowgatly#quick-start) first.

## Quick start

```bash
git clone https://github.com/Esca6585dev/sowgatly-app-react-native.git
cd sowgatly-app-react-native
npm install

npm start            # Expo dev server; press a / i / w for Android, iOS or web
npm run web          # web only, http://localhost:19006
npm run android      # native Android build (needs Android SDK)
npm run ios          # native iOS build (needs Xcode, macOS only)
npm run doctor       # expo-doctor: checks dependency versions and config
```

The `android/` and `ios/` folders are not committed. Expo generates them on demand
(`npx expo prebuild`, also run automatically by `expo run:*` and EAS), so there is
nothing native to maintain by hand. All native configuration lives in `app.json`.

## Building an APK / release

Builds are done with [EAS Build](https://docs.expo.dev/build/introduction/);
profiles are in `eas.json`. The first run asks you to log in and links the
project to your Expo account.

```bash
npm run build:android:preview       # installable .apk for testers
npm run build:android:production    # .aab for Google Play, versionCode auto-increments
```

| Profile | Output | `EXPO_PUBLIC_API_URL` |
|---------|--------|-----------------------|
| `development` | apk, dev client | `http://10.0.2.2:8000` |
| `preview` | apk, internal distribution | `https://sowgatly.app` |
| `production` | app-bundle | `https://sowgatly.app` |

Change the URL in `eas.json` if the backend moves. Release signing keys are
generated and stored by EAS; never commit a keystore.

## Pointing the app at your backend

The API base URL is read from `EXPO_PUBLIC_API_URL`
(see `src/config/api.js`). When it is not set the app falls back to:

| Platform | Default |
|----------|---------|
| Android emulator | `http://10.0.2.2:8000` (alias for the host machine) |
| iOS simulator, web | `http://localhost:8000` |

`localhost` does not work from a physical phone. Use your computer's LAN address
instead, for example:

```bash
EXPO_PUBLIC_API_URL=http://192.168.1.20:8000 npm start
```

or put the same line in a `.env.local` file (ignored by git). Use the production
URL for release builds.

When running on the web, the backend must allow the Expo origin. Set
`SANCTUM_STATEFUL_DOMAINS=localhost:19006` in the backend `.env`
(it is already the default in `.env.example`).

### Testing login without SMS

Set `OTP_DEBUG_CODE=0000` in the backend `.env`. Every login code then equals
`0000` and no SMS is sent.

## Project layout

```
App.js                    Providers (i18n, auth, favorites, region) + navigator
src/config/api.js         API_URL, token storage, apiRequest() helper
src/context/              AuthContext, FavoritesContext, RegionContext
src/navigation/           AppNavigator: auth stack, main stack and bottom tabs
src/screens/              One file per screen (Home, Login, OTP, Cart, Orders, ...)
src/components/           Reusable UI pieces (ProductCard, Header, Stars, ...)
src/locales/              tm.json, ru.json, en.json translations
src/i18n.js               i18next setup (default language: tm)
src/theme/index.js        Colors, spacing and typography tokens
assets/                   Icons, logo and splash images
eas.json                  EAS Build profiles (development, preview, production)
web-preview/index.html    Static HTML mock-up of the UI, not part of the app
```

## How auth works

1. The user enters a phone number. The app calls `POST /api/otp/generate`.
2. The user enters the 4-digit code. `POST /api/login` returns a bearer token,
   which is stored in AsyncStorage under `sowgatly_access_token`.
3. `apiRequest()` adds the token to every request. On a `401` response the
   `AuthContext` clears the session and returns the user to the login screen.

## Adding a translation

Add the key to all three files in `src/locales/` and use it with
`const { t } = useTranslation()` → `t('your.key')`. Missing keys fall back to Turkmen.

## Notes for contributors

- `node_modules/` is not committed. Run `npm install` after cloning or pulling.
- Icons come from `@expo/vector-icons` (import `@expo/vector-icons/Ionicons`), which
  is bundled with Expo. Do not add `react-native-vector-icons`.
- When upgrading Expo, run `npx expo install --fix` and `npm run doctor` so native
  module versions stay in sync with the SDK.
- `main` is the only long-lived branch; feature branches are merged into it.
