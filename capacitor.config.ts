import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'ceramic',
  webDir: 'www',
  server: {
    androidScheme: 'https',
    cleartext: true,
    
  },
  android:{
    allowMixedContent: true,
    
  }
};

export default config;

// import { CapacitorConfig } from '@capacitor/cli';

// const config: CapacitorConfig = {
//   appId: 'io.ionic.starter',
//   appName: 'ceramic',
//   webDir: 'www',
//   server: {
//     androidScheme: 'https'
//   },
//   android:{
//     allowMixedContent: true
//   }
// };

// export default config;
