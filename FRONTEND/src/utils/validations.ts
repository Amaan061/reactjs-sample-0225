// Email validation - comprehensive pattern for email validation
export const validateEmail = (email: string): boolean => {
  const pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return pattern.test(email);
};

// Password strength calculation (returns 0-4 where 4 is strongest)
export const calculatePasswordStrength = (password: string): number => {
  if (!password) return 0;
  
  let strength = 0;
  
  // Length check
  if (password.length >= 8) strength += 1;
  
  // Contains lowercase
  if (/[a-z]/.test(password)) strength += 1;
  
  // Contains uppercase
  if (/[A-Z]/.test(password)) strength += 1;
  
  // Contains number
  if (/[0-9]/.test(password)) strength += 1;
  
  // Contains special character
  if (/[^a-zA-Z0-9]/.test(password)) strength += 1;
  
  return Math.min(4, strength);
};

// Password requirements check
export const passwordMeetsRequirements = (password: string): boolean => {
  return (
    password.length >= 8 &&
    /[a-z]/.test(password) && // Has lowercase
    /[A-Z]/.test(password) && // Has uppercase
    /[0-9]/.test(password) && // Has number
    /[^a-zA-Z0-9]/.test(password) // Has special char
  );
};

// Username validation
export const validateUsername = (username: string): boolean => {
  // Usernames should be 3-20 characters and only contain letters, numbers, and underscores
  return /^[a-zA-Z0-9_]{3,20}$/.test(username);
};

// Get strength label based on strength score
export const getPasswordStrengthLabel = (strength: number): string => {
  switch (strength) {
    case 0:
      return 'Very Weak';
    case 1:
      return 'Weak';
    case 2:
      return 'Medium';
    case 3:
      return 'Strong';
    case 4:
      return 'Very Strong';
    default:
      return 'Very Weak';
  }
};

// Get strength color based on strength score
export const getPasswordStrengthColor = (strength: number): string => {
  switch (strength) {
    case 0:
      return 'var(--color-error)';
    case 1:
      return 'var(--color-error)';
    case 2:
      return 'var(--color-warning)';
    case 3:
      return 'var(--color-success)';
    case 4:
      return 'var(--color-success-dark)';
    default:
      return 'var(--color-error)';
  }
};
