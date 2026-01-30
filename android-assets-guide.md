# Android Splash Screen Assets

Place the following files in the `android/app/src/main/res/` folder after running `npx cap add android`:

## Required Files

### 1. Splash Screen (`drawable/splash.xml`)
```xml
<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:drawable="@color/splash_background"/>
    <item>
        <bitmap
            android:gravity="center"
            android:src="@drawable/splash_logo"/>
    </item>
</layer-list>
```

### 2. Colors (`values/colors.xml`)
Add these colors:
```xml
<color name="splash_background">#1a1a2e</color>
<color name="spinner_color">#4f7cff</color>
```

### 3. Splash Logo
Copy your logo from `public/lovable-uploads/fee96b45-bf5f-4bee-8f30-d9b112d26dd9.png` to:
- `drawable/splash_logo.png` (recommended size: 512x512)

## App Icons
Place your app icon in these folders:
- `mipmap-hdpi/ic_launcher.png` (72x72)
- `mipmap-mdpi/ic_launcher.png` (48x48)
- `mipmap-xhdpi/ic_launcher.png` (96x96)
- `mipmap-xxhdpi/ic_launcher.png` (144x144)
- `mipmap-xxxhdpi/ic_launcher.png` (192x192)

Use the logo from your project: `public/lovable-uploads/fee96b45-bf5f-4bee-8f30-d9b112d26dd9.png`

## Quick Icon Generation
You can use Android Asset Studio: https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html
