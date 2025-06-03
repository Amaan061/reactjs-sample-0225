import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import styles from './AuthForm.module.css';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';
import { 
  validateEmail, 
  calculatePasswordStrength, 
  getPasswordStrengthLabel, 
  getPasswordStrengthColor, 
  validateUsername
} from '../../utils/validations';

type AuthMode = 'login' | 'signup';

interface AuthFormProps {
  initialMode?: AuthMode;
}

interface FormData {
  username: string;
  email: string;
  password: string;
  rememberMe: boolean;
  agreeToTerms: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({ initialMode = 'login' }) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [usernameAvailability, setUsernameAvailability] = useState<'available' | 'unavailable' | 'checking' | null>(null);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      rememberMe: false,
      agreeToTerms: false,
    },
    mode: 'onChange',
  });

  const watchPassword = watch('password');
  const watchUsername = watch('username');

  // Calculate password strength when password changes
  useEffect(() => {
    if (watchPassword) {
      setPasswordStrength(calculatePasswordStrength(watchPassword));
    } else {
      setPasswordStrength(0);
    }
  }, [watchPassword]);

  // Check username availability
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (mode === 'signup' && watchUsername && watchUsername.length >= 3) {
      setUsernameAvailability('checking');
      timer = setTimeout(async () => {
        try {
          const isAvailable = await authService.checkUsernameAvailability(watchUsername);
          setUsernameAvailability(isAvailable ? 'available' : 'unavailable');
        } catch (error) {
          console.error('Error checking username availability', error);
          setUsernameAvailability(null);
        }
      }, 500);
    } else {
      setUsernameAvailability(null);
    }

    return () => clearTimeout(timer);
  }, [watchUsername, mode]);

  const toggleMode = () => {
    setMode(prevMode => prevMode === 'login' ? 'signup' : 'login');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prevShow => !prevShow);
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        await login(data.email, data.password, data.rememberMe);
        navigate('/dashboard'); // Navigate to dashboard after successful login
      } else {
        await register(data.username, data.email, data.password);
        navigate('/dashboard'); // Navigate to dashboard after successful registration
      }
    } catch (error) {
      console.error(`${mode === 'login' ? 'Login' : 'Signup'} failed:`, error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.authPageContainer}>
      <div className={styles.authContainer}>
        <div className={styles.authHeader}>
          <h1 className={styles.authTitle}>
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </h1>
          <p className={styles.authDescription}>
            {mode === 'login' 
              ? 'Sign in to access your task board'
              : 'Create a new account to get started'}
          </p>
        </div>

        <form 
          onSubmit={handleSubmit(onSubmit)}
          className={`${styles.formTransition} ${styles.formEntered}`}
          aria-label={mode === 'login' ? 'Login Form' : 'Signup Form'}
        >
        {mode === 'signup' && (
          <div className={styles.formGroup}>
            <div className={styles.inputContainer}>
              <Controller
                name="username"
                control={control}
                rules={{
                  required: 'Username is required',
                  validate: {
                    validFormat: (value) => validateUsername(value) || 'Username must be 3-20 characters and only contain letters, numbers, and underscores',
                    available: () => usernameAvailability !== 'unavailable' || 'Username is already taken'
                  },
                  minLength: {
                    value: 3,
                    message: 'Username must be at least 3 characters'
                  },
                  maxLength: {
                    value: 20,
                    message: 'Username must be less than 20 characters'
                  }
                }}
                render={({ field }) => (
                  <>
                    <input
                      {...field}
                      id="username"
                      type="text"
                      placeholder=" "
                      className={`${styles.inputField} ${errors.username ? styles.hasError : ''}`}
                      aria-invalid={errors.username ? 'true' : 'false'}
                      aria-describedby="username-error"
                    />
                    <label htmlFor="username" className={styles.inputLabel}>Username</label>
                    {usernameAvailability && (
                      <div className={`${styles.availabilityIndicator} ${styles[usernameAvailability]}`}>
                        <span className={styles.availabilityDot}></span>
                        <span>
                          {usernameAvailability === 'checking' 
                            ? 'Checking...' 
                            : usernameAvailability === 'available' 
                              ? 'Available' 
                              : 'Unavailable'}
                        </span>
                      </div>
                    )}
                  </>
                )}
              />
            </div>
            <div className={styles.charCount}>
              {watchUsername ? watchUsername.length : 0}/20
            </div>
            {errors.username && (
              <span id="username-error" className={styles.errorMessage}>
                {errors.username.message}
              </span>
            )}
          </div>
        )}

        <div className={styles.formGroup}>
          <div className={styles.inputContainer}>
            <Controller
              name="email"
              control={control}
              rules={{
                required: 'Email is required',
                validate: {
                  validFormat: (value) => validateEmail(value) || 'Please enter a valid email address'
                }
              }}
              render={({ field }) => (
                <>
                  <input
                    {...field}
                    id="email"
                    type="email"
                    placeholder=" "
                    className={`${styles.inputField} ${errors.email ? styles.hasError : ''}`}
                    aria-invalid={errors.email ? 'true' : 'false'}
                    aria-describedby="email-error"
                  />
                  <label htmlFor="email" className={styles.inputLabel}>Email</label>
                </>
              )}
            />
          </div>
          {errors.email && (
            <span id="email-error" className={styles.errorMessage}>
              {errors.email.message}
            </span>
          )}
        </div>

        <div className={styles.formGroup}>
          <div className={`${styles.inputContainer} ${styles.passwordContainer}`}>
            <Controller
              name="password"
              control={control}
              rules={{
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters'
                },
                validate: {
                  hasRequirements: (value) => {
                    // Only validate complexity for signup
                    if (mode === 'signup') {
                      return calculatePasswordStrength(value) >= 3 || 
                        'Password must include uppercase, lowercase, number, and special character';
                    }
                    return true;
                  }
                }
              }}
              render={({ field }) => (
                <>
                  <input
                    {...field}
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder=" "
                    className={`${styles.inputField} ${errors.password ? styles.hasError : ''}`}
                    aria-invalid={errors.password ? 'true' : 'false'}
                    aria-describedby="password-error password-strength"
                  />
                  <label htmlFor="password" className={styles.inputLabel}>Password</label>
                  <button
                    type="button"
                    className={styles.togglePassword}
                    onClick={togglePasswordVisibility}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    tabIndex={0}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </>
              )}
            />
          </div>
          {errors.password && (
            <span id="password-error" className={styles.errorMessage}>
              {errors.password.message}
            </span>
          )}

          {mode === 'signup' && watchPassword && (
            <div id="password-strength">
              <div className={styles.strengthMeter}>
                <div 
                  className={styles.strengthIndicator} 
                  style={{
                    width: `${(passwordStrength / 4) * 100}%`,
                    backgroundColor: getPasswordStrengthColor(passwordStrength)
                  }}
                />
              </div>
              <div className={styles.strengthLabel}>
                <span>Strength:</span>
                <span 
                  className={styles.strengthText} 
                  style={{ color: getPasswordStrengthColor(passwordStrength) }}
                >
                  {getPasswordStrengthLabel(passwordStrength)}
                </span>
              </div>
              <div className={styles.strengthRequirements}>
                Password must contain at least 8 characters, including uppercase, 
                lowercase, number, and special character.
              </div>
            </div>
          )}
        </div>

        {mode === 'login' && (
          <div className={styles.formFooter}>
            <div className={styles.checkboxContainer}>
              <Controller
                name="rememberMe"
                control={control}
                render={({ field: { onChange, value, ref } }) => (
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      className={styles.checkboxInput}
                      onChange={onChange}
                      checked={value}
                      ref={ref}
                      aria-label="Remember me"
                    />
                    <span className={styles.checkmark}></span>
                    Remember me
                  </label>
                )}
              />
            </div>
            <button
              type="button"
              className={styles.forgotPassword}
              aria-label="Forgot password"
              onClick={() => alert('Forgot password functionality would be implemented here')}
            >
              Forgot password?
            </button>
          </div>
        )}

        {mode === 'signup' && (
          <div className={`${styles.checkboxContainer} ${errors.agreeToTerms ? styles.checkboxError : ''}`}>
            <Controller
              name="agreeToTerms"
              control={control}
              rules={{
                required: 'You must agree to the terms and conditions'
              }}
              render={({ field: { onChange, value, ref } }) => (
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    className={styles.checkboxInput}
                    onChange={onChange}
                    checked={value}
                    ref={ref}
                    aria-invalid={errors.agreeToTerms ? 'true' : 'false'}
                    aria-describedby="terms-error"
                  />
                  <span className={styles.checkmark}></span>
                  I agree to the <button type="button" className={styles.checkboxLink} onClick={() => alert('Terms and conditions would be displayed here')}>Terms and Conditions</button>
                </label>
              )}
            />
          </div>
        )}

        {mode === 'signup' && errors.agreeToTerms && (
          <span id="terms-error" className={styles.errorMessage}>
            {errors.agreeToTerms.message}
          </span>
        )}

        <button 
          type="submit" 
          className={styles.button}
          disabled={isSubmitting}
          aria-busy={isSubmitting ? 'true' : 'false'}
        >
          {isSubmitting && <span className={styles.buttonSpinner} aria-hidden="true"></span>}
          {mode === 'login' ? 'Sign In' : 'Create Account'}
        </button>
      </form>

      <div className={styles.toggleMode}>
        <span>{mode === 'login' ? "Don't have an account?" : 'Already have an account?'}</span>
        <button 
          type="button" 
          className={styles.toggleModeLink}
          onClick={toggleMode}
          aria-label={mode === 'login' ? 'Switch to signup' : 'Switch to login'}
        >
          {mode === 'login' ? 'Sign Up' : 'Sign In'}
        </button>
      </div>
    </div>
  </div>
  );
};

export default AuthForm;
