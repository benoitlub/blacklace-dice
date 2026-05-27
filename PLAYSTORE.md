# Blacklace Dice — Empaqueter pour le Play Store

L'app est désormais une PWA installable. Pour la publier sur le Play Store,
le moyen le plus simple est de l'empaqueter en **TWA** (Trusted Web Activity)
avec PWABuilder, qui produit un fichier `.aab` (Android App Bundle) signé,
prêt pour le Play Store.

## 1. Prérequis avant publication

- [x] Manifest PWA valide (`/manifest.webmanifest`)
- [x] Service worker enregistré (`/sw.js`)
- [x] Icônes 192 et 512 + maskable
- [x] Meta theme-color
- [x] HTTPS (assuré par Replit Deployments)

## 2. Déployer la PWA en HTTPS

1. Dans Replit, lancer **Publish** sur l'artifact `blacklace-dice`
2. Noter l'URL de production : `https://<ton-app>.replit.app`
3. (Optionnel mais recommandé) brancher un domaine personnalisé

> ⚠️ Le Play Store demande un domaine stable. Si tu veux ton propre nom,
> configure le domaine custom dans les paramètres du Deployment avant.

## 3. Générer l'APK / AAB via PWABuilder

1. Va sur https://www.pwabuilder.com
2. Colle l'URL de ton app déployée
3. Clique **Start** → PWABuilder analyse ton manifest
4. Onglet **Package For Stores** → **Android**
5. Renseigne :
   - **Package ID** : `com.blacklace.dice` (ou ton domaine inversé)
   - **App name** : `Blacklace Dice`
   - **Launcher name** : `Blacklace`
   - **Theme color** : `#0a0a0f`
   - **Background color** : `#0a0a0f`
   - **Display mode** : `standalone`
   - **Orientation** : `portrait`
   - **Signing key** : laisse PWABuilder en générer une (TÉLÉCHARGE-LA, tu en
     auras besoin pour toutes les futures mises à jour)
6. Clique **Generate** → tu reçois un ZIP avec :
   - `app-release-bundle.aab` (à uploader sur le Play Store)
   - `app-release-signed.apk` (pour test direct sur appareil)
   - `assetlinks.json` (à héberger pour valider le TWA)
   - La clé de signature (`.keystore` ou `.jks`)

## 4. Activer Digital Asset Links (obligatoire TWA)

Le fichier `assetlinks.json` doit être servi à
`https://<ton-app>.replit.app/.well-known/assetlinks.json` (HTTPS, sans
redirection). Pose-le dans `public/.well-known/` et redéploie.

## 5. Publier sur le Play Console

1. Crée une fiche app dans https://play.google.com/console
2. Upload le `.aab`
3. Remplis :
   - Captures (au moins 2, format téléphone 1080x1920)
   - Icône haute-déf 512x512 → utilise `public/icons/icon-512.png`
   - Bannière 1024x500
   - Description courte + longue (FR/EN/ES déjà dans l'app)
   - Catégorie : **Lifestyle** ou **Casual game**
   - Politique de confidentialité (URL obligatoire)
4. Soumets la **Closed testing** d'abord, puis **Production**

## 6. Mises à jour futures

À chaque nouvelle version :
1. Bump le numéro de version dans `package.json`
2. Redéploie la PWA
3. Re-package via PWABuilder **avec la même clé de signature**
4. Upload le nouveau `.aab` dans le Play Console

## Alternatives à PWABuilder

- **Bubblewrap CLI** (plus de contrôle) : https://github.com/GoogleChromeLabs/bubblewrap
- **Capacitor** (vraie app native, accès aux APIs natives) :
  `npx @capacitor/cli init` puis `npx cap add android`
