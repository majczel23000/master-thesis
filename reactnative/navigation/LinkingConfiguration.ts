import * as Linking from 'expo-linking';

export default {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      Root: {
        screens: {
          Database: {
            screens: {
              DatabaseScreen: 'database'
            }
          },
          FileSystem: {
            screens: {
              FileSystemScreen: 'filesystem'
            }
          },
          Clients: {
            screens: {
              ClientsScreen: 'clients'
            }
          },
          Login: {
            screens: {
              LoginScreen: 'login'
            }
          },
          Carousel: {
            screens: {
              CarouselScreen: 'carousel'
            }
          },
          Dictionary: {
            screens: {
              DictionaryScreen: 'dictionary'
            }
          },
          DictionaryDetails: {
            screens: {
              DictionaryDetailsScreen: 'dictionarydetails'
            }
          },
          DictionaryAdd: {
            screens: {
              DictionaryAddScreen: 'dictionaryadd'
            }
          },
          Image: {
            screens: {
              ImageScreen: 'image'
            }
          },
          ImageDetails: {
            screens: {
              ImageDetailsScreen: 'imagedetails'
            }
          },
          ImageAdd: {
            screens: {
              ImageAddScreen: 'imageadd'
            }
          },
          Role: {
            screens: {
              RoleScreen: 'role'
            }
          },
          RoleDetails: {
            screens: {
              RoleDetailsScreen: 'roledetails'
            }
          },
          Setting: {
            screens: {
              SettingScreen: 'setting'
            }
          },
          SettingDetails: {
            screens: {
              SettingDetailsScreen: 'settingdetails'
            }
          },
          SettingAdd: {
            screens: {
              SettingAddScreen: 'settingadd'
            }
          },
          User: {
            screens: {
              UserScreen: 'user'
            }
          },
          UserDetails: {
            screens: {
              UserDetailsScreen: 'userdetails'
            }
          },
          UserAdd: {
            screens: {
              UserAddScreen: 'useradd'
            }
          },
          Profile: {
            screens: {
              Profile: 'profile'
            }
          },
          Menu: {
            screens: {
              MenuScreen: 'menu'
            }
          },
          MenuDetails: {
            screens: {
              MenuDetailsScreen: 'Menudetails'
            }
          },
          MenuAdd: {
            screens: {
              MenuAddScreen: 'Menuadd'
            }
          },
          Faq: {
            screens: {
              FaqScreen: 'faq'
            }
          },
          FaqDetails: {
            screens: {
              FaqDetailsScreen: 'Faqdetails'
            }
          },
          FaqAdd: {
            screens: {
              FaqAddScreen: 'Faqadd'
            }
          },
        },
      },
      NotFound: '*',
    },
  },
};
