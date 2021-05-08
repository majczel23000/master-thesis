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
          Image: {
            screens: {
              ImageScreen: 'image'
            }
          },
          Role: {
            screens: {
              RoleScreen: 'role'
            }
          },
          Setting: {
            screens: {
              SettingScreen: 'setting'
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
              ProfileScreen: 'profile'
            }
          }
        },
      },
      NotFound: '*',
    },
  },
};
