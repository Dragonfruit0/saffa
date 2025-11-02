# To learn more about how to use Nix to configure your environment
# see: https://firebase.google.com/docs/studio/customize-workspace
{pkgs}: {
  # Which nixpkgs channel to use.
  channel = "stable-24.11"; # or "unstable"
  # Use https://search.nixos.org/packages to find packages
  packages = [
    pkgs.nodejs_20
    pkgs.zulu
  ];
  # Sets environment variables in the workspace
  env = {
    NEXT_PUBLIC_FIREBASE_API_KEY = "AIzaSyBcejntjX5dnQ6amYqgmnLIOdDNiajeXVU";
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = "safamarwa-76e5d.firebaseapp.com";
    NEXT_PUBLIC_FIREBASE_PROJECT_ID = "safamarwa-76e5d";
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = "safamarwa-76e5d.firebasestorage.app";
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = "490750722857";
    NEXT_PUBLIC_FIREBASE_APP_ID = "1:490750722857:web:8704d03d4e79f4534aad38";
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID = "G-7H50TQYKZS";
  };
  # This adds a file watcher to startup the firebase emulators. The emulators will only start if
}