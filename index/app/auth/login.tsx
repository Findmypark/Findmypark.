import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput } from '@/components/TextInput';
import { Button } from '@/components/Button';
import { colors } from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Car } from 'lucide-react-native';
import { DemoBanner } from '@/components/DemoBanner';

export default function LoginScreen() {
  const router = useRouter();
  const { login, register, isLoading, error, isAuthenticated } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Check if user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, router]);
  
  // Update error message when store error changes
  useEffect(() => {
    if (error) {
      setErrorMessage(error);
    }
  }, [error]);
  
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const handleLogin = async () => {
    // Clear previous errors
    setErrorMessage('');
    
    // Validate inputs
    if (!email || !password) {
      setErrorMessage('Please enter both email and password');
      return;
    }
    
    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }
    
    try {
      console.log('Attempting login with:', email, password);
      const success = await login(email, password);
      
      if (!success && !error) {
        setErrorMessage('Login failed. Please check your credentials and try again.');
      }
    } catch (err) {
      setErrorMessage('An unexpected error occurred. Please try again.');
      console.error('Login error:', err);
    }
  };
  
  const handleSignUp = async () => {
    // Clear previous errors
    setErrorMessage('');
    
    // Validate inputs
    if (!name || !email || !password) {
      setErrorMessage('Please fill in all required fields');
      return;
    }
    
    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }
    
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long');
      return;
    }
    
    try {
      const success = await register({
        name,
        email,
        phone,
        password,
      });
      
      if (!success && !error) {
        setErrorMessage('Registration failed. Please try again.');
      }
    } catch (err) {
      setErrorMessage('An unexpected error occurred. Please try again.');
      console.error('Registration error:', err);
    }
  };
  
  const handleDemoLogin = async () => {
    setEmail('demo@parkeasy.com');
    setPassword('password123');
    
    try {
      console.log('Attempting demo login with: demo@parkeasy.com, password123');
      const success = await login('demo@parkeasy.com', 'password123');
      
      if (!success) {
        if (error) {
          setErrorMessage(error);
        } else {
          setErrorMessage('Demo login failed. Please try again.');
        }
      }
    } catch (err) {
      setErrorMessage('An unexpected error occurred. Please try again.');
      console.error('Demo login error:', err);
    }
  };
  
  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setErrorMessage('');
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <DemoBanner />
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Car size={40} color={colors.white} />
            </View>
            <Text style={styles.logoText}>FindMyPark</Text>
            <Text style={styles.tagline}>Find and book parking spots with ease</Text>
          </View>
          
          <View style={styles.formContainer}>
            <Text style={styles.title}>
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </Text>
            <Text style={styles.subtitle}>
              {isSignUp ? 'Sign up to get started' : 'Sign in to your account'}
            </Text>
            
            {errorMessage ? (
              <View style={styles.errorContainer}>
                <AlertCircle size={20} color={colors.error} />
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : null}
            
            {isSignUp && (
              <TextInput
                label="Full Name"
                value={name}
                onChangeText={setName}
                placeholder="Enter your full name"
                autoCapitalize="words"
              />
            )}
            
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={<Mail size={20} color={colors.textLight} />}
            />
            
            {isSignUp && (
              <TextInput
                label="Phone Number (Optional)"
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
              />
            )}
            
            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder={isSignUp ? "Create a password" : "Enter your password"}
              secureTextEntry={!showPassword}
              leftIcon={<Lock size={20} color={colors.textLight} />}
              rightIcon={
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <EyeOff size={20} color={colors.textLight} />
                  ) : (
                    <Eye size={20} color={colors.textLight} />
                  )}
                </TouchableOpacity>
              }
            />
            
            {!isSignUp && (
              <TouchableOpacity style={styles.forgotPasswordContainer}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            )}
            
            <Button
              title={isSignUp ? "Sign Up" : "Sign In"}
              onPress={isSignUp ? handleSignUp : handleLogin}
              loading={isLoading}
              fullWidth
            />
            
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.divider} />
            </View>
            
            <Button
              title="Use Demo Account"
              onPress={handleDemoLogin}
              variant="outline"
              fullWidth
            />
            
            <View style={styles.demoCredentialsContainer}>
              <Text style={styles.demoCredentialsTitle}>Demo Credentials:</Text>
              <Text style={styles.demoCredentialsText}>Email: demo@parkeasy.com</Text>
              <Text style={styles.demoCredentialsText}>Password: password123</Text>
            </View>
            
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>
                {isSignUp ? "Already have an account? " : "Don't have an account? "}
              </Text>
              <TouchableOpacity onPress={toggleAuthMode}>
                <Text style={styles.signupLink}>
                  {isSignUp ? "Sign In" : "Sign Up"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  logoContainer: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: colors.primary,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 12,
  },
  logoText: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: colors.white,
    opacity: 0.9,
  },
  formContainer: {
    flex: 1,
    padding: 24,
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 24,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.error + '15',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: colors.error,
    marginLeft: 8,
    flex: 1,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: colors.primary,
    fontSize: 14,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.gray[300],
  },
  dividerText: {
    color: colors.textLight,
    paddingHorizontal: 16,
    fontSize: 14,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  signupText: {
    color: colors.textLight,
    fontSize: 14,
  },
  signupLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  demoCredentialsContainer: {
    backgroundColor: colors.primaryLight + '20',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  demoCredentialsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  demoCredentialsText: {
    fontSize: 14,
    color: colors.textLight,
  },
});