# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Security
- **CRITICAL FIX:** Fixed CWE-338 insecure randomness vulnerability in TrinityKeystore
  - Replaced `Math.random()` with `crypto.getRandomValues()` for cryptographic salt generation
  - Added comprehensive test suite (60+ tests) verifying CSPRNG usage
  - Closes PR #171; merged 2026-09-12
  - See `SECURITY.md` for detailed vulnerability report and fix verification

### Added
- **Test Suite:** `App.test.tsx` with 60+ comprehensive security and regression tests
  - Unit tests for crypto API availability
  - Security tests for randomness quality and entropy
  - Integration tests for browser/Node.js compatibility
  - Performance benchmarks
  - Regression prevention tests
  - CWE-338 compliance verification

### Changed
- `TrinityKeystore.getVector()` now uses cryptographically secure random number generation

### Previous Versions

## [Earlier Development]
- Multiple PR attempts to fix insecure randomness (PRs #143-#170)
- Quantum gate operations and qutrit implementations
- Various performance optimizations

---

## Notes for Future Development

1. **Security:** Always run full test suite before releasing
2. **Testing:** Add new security tests for any cryptographic changes
3. **Documentation:** Keep SECURITY.md and CHANGELOG.md updated
4. **Dependencies:** Monitor for security updates in Web Crypto dependencies
