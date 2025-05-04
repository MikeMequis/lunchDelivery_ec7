import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import StudentsScreen from './screens/Students/StudentsScreen';
import StudentFormScreen from './screens/Students/StudentFormScreen';
import AuthorizationsScreen from './screens/Authorization/AuthorizationsScreen';
import AuthorizationFormScreen from './screens/Authorization/AuthorizationFormScreen';
import DeliveriesScreen from './screens/Delivery/DeliveriesScreen';
import DeliverySummaryScreen from './screens/Delivery/DeliverySummaryScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function StudentsStack() {
  return (
    <Stack.Navigator initialRouteName="StudentsScreen">
      <Stack.Screen name="StudentsScreen" component={StudentsScreen} options={{ title: 'Alunos' }} />
      <Stack.Screen name="StudentFormScreen" component={StudentFormScreen} options={{ title: 'Cadastro de Aluno' }} />
    </Stack.Navigator>
  );
}

function AuthorizationsStack() {
  return (
    <Stack.Navigator initialRouteName="AuthorizationsScreen">
      <Stack.Screen name="AuthorizationsScreen" component={AuthorizationsScreen} options={{ title: 'Autorizações' }} />
      <Stack.Screen name="AuthorizationFormScreen" component={AuthorizationFormScreen} options={{ title: 'Nova Autorização' }} />
    </Stack.Navigator>
  );
}

function DeliveriesStack() {
  return (
    <Stack.Navigator initialRouteName="DeliveriesScreen">
      <Stack.Screen name="DeliveriesScreen" component={DeliveriesScreen} options={{ title: 'Entregas' }} />
      <Stack.Screen name="DeliverySummaryScreen" component={DeliverySummaryScreen} options={{ title: 'Resumo por Data' }} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Alunos') {
              iconName = focused ? 'person' : 'person-outline';
            } else if (route.name === 'Autorizações') {
              iconName = focused ? 'clipboard' : 'clipboard-outline';
            } else if (route.name === 'Entregas') {
              iconName = focused ? 'fast-food' : 'fast-food-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen 
          name="Alunos" 
          component={StudentsStack} 
          options={{ headerShown: false }} 
        />
        <Tab.Screen 
          name="Autorizações" 
          component={AuthorizationsStack} 
          options={{ headerShown: false }} 
        />
        <Tab.Screen 
          name="Entregas" 
          component={DeliveriesStack} 
          options={{ headerShown: false }} 
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
