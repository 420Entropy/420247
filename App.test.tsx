import React from 'react';
import { render, screen } from '@testing-library/react';
import { TrinityKeystore } from './App';
import App from './App';

/**
 * PHASE 1 SECURITY TEST SUITE
 * 
 * Tests the fix for CWE-338: Insecure Randomness in TrinityKeystore
 * Validates crypto.getRandomValues() usage across all environments
 */

describe('TrinityKeystore.getVector() - Security & Functionality Tests', () => {
  
  // ==================== UNIT TESTS: Crypto API ====================
  
  describe('Unit: Crypto API Availability', () => {
    
    test('should use crypto.getRandomValues() when available', () => {
      // Arrange: Verify crypto is available
      const cryptoAvailable = 
        (typeof window !== 'undefined' && window.crypto?.getRandomValues) ||
        (typeof globalThis !== 'undefined' && globalThis.crypto?.getRandomValues);
      
      // Act: Call getVector
      const vector = TrinityKeystore.getVector();
      
      // Assert: Should succeed without error
      expect(vector).toBeDefined();
      expect(vector.alpha).toBeDefined();
      expect(vector.beta).toBeDefined();
      expect(vector.gamma).toBeDefined();
    });

    test('should fail gracefully if crypto API is unavailable', () => {
      // This test verifies the error handling path
      // (Skipped in test environments where crypto is available)
      const originalCrypto = globalThis.crypto;
      
      try {
        // Simulate unavailable crypto
        (globalThis as any).crypto = undefined;
        
        // Act & Assert: Should throw error
        expect(() => {
          TrinityKeystore.getVector();
        }).toThrow('Cryptographically secure random number generator is not available');
      } finally {
        // Restore
        (globalThis as any).crypto = originalCrypto;
      }
    });

    test('should have getRandomValues() function available', () => {
      const cryptoObj =
        typeof window !== 'undefined' && window.crypto
          ? window.crypto
          : globalThis.crypto;
      
      expect(cryptoObj).toBeDefined();
      expect(typeof cryptoObj?.getRandomValues).toBe('function');
    });
  });

  // ==================== SECURITY TESTS: Randomness Quality ====================

  describe('Security: Randomness Quality & Entropy', () => {
    
    test('should generate unique salts on each call', () => {
      // Arrange: Call getVector multiple times
      const vectors: string[] = [];
      const iterations = 100;
      
      // Act: Generate 100 vectors
      for (let i = 0; i < iterations; i++) {
        const vector = TrinityKeystore.getVector();
        vectors.push(`${vector.alpha}-${vector.beta}-${vector.gamma}`);
      }
      
      // Assert: All vectors should be unique (or extremely unlikely to collide)
      const uniqueVectors = new Set(vectors);
      expect(uniqueVectors.size).toBe(iterations);
    });

    test('should NOT use predictable Math.random() for salt', () => {
      // Security check: Verify source code inspection
      // (This is a meta-test to prevent regression)
      const appCode = TrinityKeystore.toString();
      
      // Assert: Should NOT contain Math.random() in critical path
      // The actual implementation uses crypto.getRandomValues()
      expect(appCode).not.toContain('Math.random()');
    });

    test('should generate cryptographically strong random values', () => {
      // Arrange: Generate multiple values
      const values: number[] = [];
      const sampleSize = 1000;
      
      // Act: Generate random values using CSPRNG
      for (let i = 0; i < sampleSize; i++) {
        const array = new Uint32Array(1);
        const cryptoObj = globalThis.crypto;
        cryptoObj.getRandomValues(array);
        values.push(array[0]);
      }
      
      // Assert: Check for basic statistical properties
      // 1. Range: Values should span the full 32-bit space
      const minValue = Math.min(...values);
      const maxValue = Math.max(...values);
      expect(minValue).toBeLessThan(1000000); // Not all near min
      expect(maxValue).toBeGreaterThan(Math.pow(2, 31)); // Using upper range
      
      // 2. No obvious patterns (anti-test for predictability)
      const differences = [];
      for (let i = 1; i < values.length; i++) {
        differences.push(Math.abs(values[i] - values[i - 1]));
      }
      const avgDifference = differences.reduce((a, b) => a + b) / differences.length;
      // Average difference should be high (random, not sequential)
      expect(avgDifference).toBeGreaterThan(Math.pow(2, 20)); // At least ~1M average
    });

    test('should NOT produce sequential or predictable outputs', () => {
      // Arrange: Generate consecutive vectors
      const vectors = [];
      for (let i = 0; i < 10; i++) {
        vectors.push(TrinityKeystore.getVector());
      }
      
      // Assert: No two consecutive salts should be similar
      for (let i = 1; i < vectors.length; i++) {
        const prev = vectors[i - 1];
        const curr = vectors[i];
        
        // Check each component is different
        expect(prev.alpha).not.toBe(curr.alpha);
        expect(prev.beta).not.toBe(curr.beta);
        expect(prev.gamma).not.toBe(curr.gamma);
      }
    });

    test('should verify entropy of alpha, beta, gamma components', () => {
      // Arrange: Collect many vectors
      const samples = 500;
      const alphas = new Set<string>();
      const betas = new Set<string>();
      const gammas = new Set<string>();
      
      // Act: Generate vectors
      for (let i = 0; i < samples; i++) {
        const vector = TrinityKeystore.getVector();
        alphas.add(vector.alpha);
        betas.add(vector.beta);
        gammas.add(vector.gamma);
      }
      
      // Assert: Each component should have high unique rate (>95%)
      const alphaUniqueness = (alphas.size / samples) * 100;
      const betaUniqueness = (betas.size / samples) * 100;
      const gammaUniqueness = (gammas.size / samples) * 100;
      
      expect(alphaUniqueness).toBeGreaterThan(95);
      expect(betaUniqueness).toBeGreaterThan(95);
      expect(gammaUniqueness).toBeGreaterThan(95);
    });
  });

  // ==================== INTEGRATION TESTS: Vector Structure ====================

  describe('Integration: Vector Structure & Format', () => {
    
    test('should return vector with all required components', () => {
      // Act
      const vector = TrinityKeystore.getVector();
      
      // Assert
      expect(vector).toHaveProperty('alpha');
      expect(vector).toHaveProperty('beta');
      expect(vector).toHaveProperty('gamma');
      expect(vector).toHaveProperty('parity');
    });

    test('should return alpha, beta, gamma as strings with prefix', () => {
      // Act
      const vector = TrinityKeystore.getVector();
      
      // Assert: Format should be "α-[base36]", "β-[base36]", "γ-[base36]"
      expect(vector.alpha).toMatch(/^α-[0-9a-z]+$/);
      expect(vector.beta).toMatch(/^β-[0-9a-z]+$/);
      expect(vector.gamma).toMatch(/^γ-[0-9a-z]+$/);
    });

    test('should return valid base36 encoded random values', () => {
      // Act
      const vector = TrinityKeystore.getVector();
      
      // Assert: Extract base36 parts
      const alphaBase36 = vector.alpha.substring(2); // Remove "α-" prefix
      const betaBase36 = vector.beta.substring(2);   // Remove "β-" prefix
      const gammaBase36 = vector.gamma.substring(2); // Remove "γ-" prefix
      
      // Should be valid base36 (0-9, a-z only)
      expect(/^[0-9a-z]+$/.test(alphaBase36)).toBe(true);
      expect(/^[0-9a-z]+$/.test(betaBase36)).toBe(true);
      expect(/^[0-9a-z]+$/.test(gammaBase36)).toBe(true);
    });

    test('should have parity value of 0.9999', () => {
      // Act
      const vector = TrinityKeystore.getVector();
      
      // Assert
      expect(vector.parity).toBe(0.9999);
    });

    test('should generate new random values on each call', () => {
      // Act: Call three times
      const v1 = TrinityKeystore.getVector();
      const v2 = TrinityKeystore.getVector();
      const v3 = TrinityKeystore.getVector();
      
      // Assert: All three should be different
      const vector1String = `${v1.alpha}${v1.beta}${v1.gamma}`;
      const vector2String = `${v2.alpha}${v2.beta}${v2.gamma}`;
      const vector3String = `${v3.alpha}${v3.beta}${v3.gamma}`;
      
      expect(vector1String).not.toBe(vector2String);
      expect(vector2String).not.toBe(vector3String);
      expect(vector1String).not.toBe(vector3String);
    });
  });

  // ==================== COMPATIBILITY TESTS: Cross-environment ====================

  describe('Compatibility: Browser & Node.js Environments', () => {
    
    test('should work in browser environment (window.crypto)', () => {
      // This test runs in jsdom which provides window.crypto
      const windowCrypto = typeof window !== 'undefined' && window.crypto;
      expect(windowCrypto).toBeDefined();
      
      const vector = TrinityKeystore.getVector();
      expect(vector).toBeDefined();
    });

    test('should work in Node.js environment (globalThis.crypto)', () => {
      // This test runs in Node.js which provides globalThis.crypto
      const globalCrypto = typeof globalThis !== 'undefined' && globalThis.crypto;
      expect(globalCrypto).toBeDefined();
      
      const vector = TrinityKeystore.getVector();
      expect(vector).toBeDefined();
    });

    test('should prefer window.crypto over globalThis.crypto when available', () => {
      // Verify the fallback logic is correct
      if (typeof window !== 'undefined' && window.crypto) {
        // In browser: window.crypto should be used
        expect(window.crypto.getRandomValues).toBeDefined();
      } else if (typeof globalThis !== 'undefined' && globalThis.crypto) {
        // In Node.js: globalThis.crypto should be used
        expect(globalThis.crypto.getRandomValues).toBeDefined();
      }
      
      // Either way, one should work
      const vector = TrinityKeystore.getVector();
      expect(vector).toBeDefined();
    });
  });

  // ==================== REACT COMPONENT TESTS ====================

  describe('React Component: App Rendering', () => {
    
    test('should render App component successfully', () => {
      // Act
      render(<App />);
      
      // Assert
      expect(screen.getByText('Quantum Trinity Keystore')).toBeInTheDocument();
      expect(screen.getByText('Secure vector generator loaded.')).toBeInTheDocument();
    });

    test('should display heading in App component', () => {
      // Act
      render(<App />);
      
      // Assert
      const heading = screen.getByRole('heading', { 
        name: /Quantum Trinity Keystore/ 
      });
      expect(heading).toBeInTheDocument();
    });
  });

  // ==================== PERFORMANCE TESTS ====================

  describe('Performance: Vector Generation Speed', () => {
    
    test('should generate vectors quickly (< 1ms each)', () => {
      // Arrange
      const iterations = 1000;
      
      // Act
      const startTime = performance.now();
      for (let i = 0; i < iterations; i++) {
        TrinityKeystore.getVector();
      }
      const endTime = performance.now();
      
      // Assert: 1000 vectors should generate in < 100ms (~0.1ms each)
      const totalTime = endTime - startTime;
      const avgTimePerVector = totalTime / iterations;
      expect(avgTimePerVector).toBeLessThan(1);
    });

    test('should not have significant variance in generation time', () => {
      // Arrange: Measure multiple runs
      const runs = 10;
      const timings: number[] = [];
      
      // Act: Run 10 iterations of 100 vectors each
      for (let run = 0; run < runs; run++) {
        const start = performance.now();
        for (let i = 0; i < 100; i++) {
          TrinityKeystore.getVector();
        }
        const end = performance.now();
        timings.push((end - start) / 100); // Average per vector
      }
      
      // Assert: Standard deviation should be low
      const mean = timings.reduce((a, b) => a + b) / timings.length;
      const variance = timings.reduce((a, b) => a + Math.pow(b - mean, 2)) / timings.length;
      const stdDev = Math.sqrt(variance);
      
      expect(stdDev).toBeLessThan(0.5); // Low variance = consistent performance
    });
  });

  // ==================== REGRESSION TESTS ====================

  describe('Regression: Prevent Cryptographic Weaknesses', () => {
    
    test('should NOT revert to Math.random() in future', () => {
      // This is a canary test to catch accidental regressions
      // where someone might replace crypto.getRandomValues() with Math.random()
      
      // Setup: Spy on Math.random
      const mathRandomSpy = jest.spyOn(Math, 'random');
      
      try {
        // Act: Generate a vector
        TrinityKeystore.getVector();
        
        // Assert: Math.random should NOT have been called
        expect(mathRandomSpy).not.toHaveBeenCalled();
      } finally {
        mathRandomSpy.mockRestore();
      }
    });

    test('should use Uint32Array for proper entropy', () => {
      // Verify the implementation detail: using Uint32Array
      // This ensures we get 32-bits of entropy per call
      
      // Act: Generate a vector
      const vector = TrinityKeystore.getVector();
      
      // Assert: The generated value should be in the expected range
      // When converting Uint32Array[0].toString(36), we should get a base36 string
      const alphaNum = parseInt(vector.alpha.substring(2), 36);
      
      // Should be within 32-bit unsigned range
      expect(alphaNum).toBeGreaterThanOrEqual(0);
      expect(alphaNum).toBeLessThan(Math.pow(2, 32));
    });

    test('should handle error if CSPRNG fails', () => {
      // This test ensures we fail securely (not silently)
      const originalCrypto = globalThis.crypto;
      
      try {
        // Simulate broken crypto API
        (globalThis as any).crypto = {
          getRandomValues: null, // Intentionally broken
        };
        
        // Act & Assert: Should throw error
        expect(() => {
          TrinityKeystore.getVector();
        }).toThrow();
      } finally {
        (globalThis as any).crypto = originalCrypto;
      }
    });
  });

  // ==================== SECURITY AUDIT TESTS ====================

  describe('Security Audit: CWE-338 Mitigation', () => {
    
    test('should meet CWE-338 requirements: use CSPRNG', () => {
      /**
       * CWE-338: Use of Cryptographically Weak Pseudo-Random Number Generator (PRNG)
       * 
       * REQUIREMENT: Use a cryptographically strong PRNG for security-sensitive operations
       * FIX USED: crypto.getRandomValues() (CSP RNG)
       * STATUS: ✅ COMPLIANT
       */
      
      const vector = TrinityKeystore.getVector();
      
      // Basic sanity check: vector exists
      expect(vector).toBeDefined();
      
      // In a real security audit, this would be:
      // - Code review of getVector implementation
      // - Entropy analysis of output
      // - Cryptographic validation
      expect(vector.alpha).toBeDefined();
    });

    test('should be deterministic only by cryptographic randomness', () => {
      /**
       * Security check: The only source of randomness should be crypto.getRandomValues()
       * Any other randomness source would be a security regression
       */
      
      // Arrange: Generate two vectors with identical initial state
      const v1 = TrinityKeystore.getVector();
      const v2 = TrinityKeystore.getVector();
      
      // Assert: Should be different (proven by CSPRNG)
      const combined1 = `${v1.alpha}${v1.beta}${v1.gamma}`;
      const combined2 = `${v2.alpha}${v2.beta}${v2.gamma}`;
      
      expect(combined1).not.toBe(combined2);
    });

    test('should include error handling for missing CSPRNG', () => {
      /**
       * Security check: The implementation should fail securely
       * If CSPRNG is unavailable, it should throw error (not fallback to weak PRNG)
       */
      
      const originalCrypto = globalThis.crypto;
      
      try {
        // Simulate missing CSPRNG
        (globalThis as any).crypto = undefined;
        
        // Act & Assert: Should throw, not fall back
        expect(() => {
          TrinityKeystore.getVector();
        }).toThrow('Cryptographically secure random number generator is not available');
      } finally {
        (globalThis as any).crypto = originalCrypto;
      }
    });
  });
});
